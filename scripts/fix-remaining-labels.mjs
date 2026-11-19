/**
 * Adds aria-label to remaining Form.Select/Control without one,
 * deriving label from value={...} binding.
 * Usage: node scripts/fix-remaining-labels.mjs
 */
import fs from "fs";
import path from "path";

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

// Derive a label from the value binding
function labelFromValue(tag) {
  // value={filters.status_cicilan} -> "Filter status cicilan"
  let m = tag.match(/value\s*=\s*\{\s*filters\.(\w+)\s*\}/);
  if (m) {
    const words = m[1].replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase();
    return `Filter ${words}`;
  }
  // value={pageSize} -> "Jumlah baris per halaman"
  m = tag.match(/value\s*=\s*\{\s*pageSize\s*\}/);
  if (m) return "Jumlah baris per halaman";
  // value={sortBy} etc generic
  m = tag.match(/value\s*=\s*\{\s*(\w+)\s*\}/);
  if (m) {
    const words = m[1].replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase();
    return `Filter ${words}`;
  }
  return null;
}

const files = process.argv.slice(2);
let totalFixed = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  const re = /<Form\.(Control|Select|Checkbox)(?![.\w])/g;
  let m;
  const edits = [];
  while ((m = re.exec(content))) {
    const tagStart = m.index;
    const tagEnd = findTagEnd(content, tagStart);
    if (tagEnd < 0) continue;
    const tag = content.slice(tagStart, tagEnd + 1);
    if (/aria-label|aria-labelledby/.test(tag)) continue;

    const label = labelFromValue(tag);
    if (!label) continue;

    const insertAt = tagStart + m[0].length;
    const esc = label.replace(/"/g, "&quot;");
    edits.push({ insertAt, attr: ` aria-label="${esc}"` });
  }

  edits.sort((a, b) => b.insertAt - a.insertAt);
  for (const e of edits) {
    content = content.slice(0, e.insertAt) + e.attr + content.slice(e.insertAt);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf-8");
    totalFixed += edits.length;
    console.log(`✓ ${path.basename(filePath)} (+${edits.length})`);
  } else {
    console.log(`- ${path.basename(filePath)} (no change)`);
  }
}

console.log(`\nTotal: ${totalFixed} labels added.`);