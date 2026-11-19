/**
 * Adds aria-label to Form.Control/Select/Checkbox that lack one,
 * deriving the label from the placeholder prop (filters) or a generic fallback.
 * Usage: node scripts/fix-form-labels.mjs
 */
import fs from "fs";
import path from "path";
import { globSync } from "glob";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");
const jsxFiles = globSync("**/*.jsx", { cwd: srcDir, absolute: true });

function findTagEnd(src, start) {
  let i = start + 1;
  let depth = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);
    else if (ch === ">" && depth === 0) return i;
    i++;
  }
  return -1;
}

// Build an aria-label string from a placeholder expression.
// placeholder can be: "literal", {'literal'}, {expr}, or absent.
function labelFromPlaceholder(tag) {
  // string literal: placeholder="X"
  let m = tag.match(/placeholder\s*=\s*"([^"]*)"/);
  if (m) {
    const cleaned = m[1].replace(/\.{2,}$/, "").trim();
    return cleaned ? `Filter ${cleaned}` : "Filter input";
  }
  // expression: placeholder={'X'} or placeholder={"X"}
  m = tag.match(/placeholder\s*=\s*\{\s*['"]([^'"]*)['"]\s*\}/);
  if (m) {
    const cleaned = m[1].replace(/\.{2,}$/, "").trim();
    return cleaned ? `Filter ${cleaned}` : "Filter input";
  }
  // dynamic expression: placeholder={expr}
  m = tag.match(/placeholder\s*=\s*\{([^}]+)\}/);
  if (m) {
    return `Filter ${m[1].trim()}`; // reuse expression as label
  }
  return null; // no placeholder
}

let filesChanged = 0;
let totalFixed = 0;

for (const filePath of jsxFiles) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  const re = /<Form\.(Control|Select|Checkbox)\b/g;
  let m;
  const edits = [];
  while ((m = re.exec(content))) {
    const tagStart = m.index;
    const tagEnd = findTagEnd(content, tagStart);
    if (tagEnd < 0) continue;
    let tag = content.slice(tagStart, tagEnd + 1);

    if (/aria-label|aria-labelledby/.test(tag)) continue; // already has

    const label = labelFromPlaceholder(tag);
    if (!label) continue; // no placeholder -> needs manual; skip

    // Insert aria-label right after the tag name
    const insertAt = tagStart + m[0].length;
    // Escape quotes in label for JSX string
    const esc = label.replace(/"/g, "&quot;");
    const attr = ` aria-label="${esc}"`;
    edits.push({ insertAt, attr, tag });
  }

  // Apply edits from end to start to preserve indices
  edits.sort((a, b) => b.insertAt - a.insertAt);
  for (const e of edits) {
    content = content.slice(0, e.insertAt) + e.attr + content.slice(e.insertAt);
  }

  if (content !== original) {
    filesChanged++;
    totalFixed += edits.length;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ ${path.relative(projectRoot, filePath)} (+${edits.length})`);
  }
}

console.log(`\nDone! Added aria-label to ${totalFixed} form inputs in ${filesChanged} files.`);