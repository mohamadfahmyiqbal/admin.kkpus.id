/**
 * Script to add aria-hidden="true" to Phosphor icons that don't have it.
 * Handles JSX expression containers including nested {{...}} and ternary > operators.
 * Usage: node scripts/fix-icon-aria.mjs
 */
import fs from "fs";
import path from "path";
import { globSync } from "glob";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

const jsxFiles = globSync("**/*.jsx", { cwd: srcDir, absolute: true });

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Attrs pattern: matches brace expressions (with one level of nested braces) OR any char except >, {, }
const ATTRS = String.raw`(?:\{(?:[^{}]|\{[^{}]*\})*\}|[^>{}])*`;

let totalFilesChanged = 0;
let totalIconsFixed = 0;

for (const filePath of jsxFiles) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  if (!/from\s*["']phosphor-react["']/.test(content)) continue;

  const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*["']phosphor-react["']/s);
  if (!importMatch) continue;

  const iconNames = importMatch[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const iconName of iconNames) {
    const n = escapeRegex(iconName);

    // Pass 1: self-closing `<Icon ... />` (no aria-hidden)
    const selfClose = new RegExp(`<${n}(${ATTRS})/>`, "g");
    content = content.replace(selfClose, (full, attrs) => {
      if (/aria-hidden/.test(full)) return full;
      const trimmed = attrs.replace(/\s+$/, "");
      return `<${n}${trimmed} aria-hidden="true" />`;
    });

    // Pass 2: open tag with children `<Icon ...>` (no aria-hidden, not self-closing)
    const openTag = new RegExp(`<${n}(${ATTRS})>`, "g");
    content = content.replace(openTag, (full, attrs) => {
      if (/aria-hidden/.test(full)) return full;
      if (attrs.trimEnd().endsWith("/")) return full; // self-closing remnant
      const trimmed = attrs.replace(/\s+$/, "");
      return `<${n}${trimmed} aria-hidden="true">`;
    });
  }

  if (content !== original) {
    const before = (original.match(/aria-hidden/g) || []).length;
    const after = (content.match(/aria-hidden/g) || []).length;
    totalIconsFixed += (after - before);
    totalFilesChanged++;
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ ${path.relative(projectRoot, filePath)} (+${after - before})`);
  }
}

console.log(`\nDone! Added aria-hidden to ${totalIconsFixed} icons in ${totalFilesChanged} files.`);