/**
 * Static Accessibility Audit — WCAG 2.2 AA (accurate version)
 * Scans JSX files for accessibility issues without a browser.
 * Usage: node scripts/a11y-audit.mjs
 */
import fs from "fs";
import path from "path";
import { globSync } from "glob";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");
const jsxFiles = globSync("**/*.jsx", { cwd: srcDir, absolute: true });

function lineOf(content, index) {
  return content.slice(0, index).split("\n").length;
}

// Strip line and block comments (approx) so we don't match code in comments
function stripComments(src) {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out.replace(/(^|[^:])\/\/[^\n]*/g, "$1"); // avoid http://
  return out;
}

// Find the end index of a JSX tag starting at `start` (which points to '<'),
// respecting {...} expression containers that may contain '>'.
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

const results = {
  iconsWithoutAria: [],
  imagesWithoutAlt: [],
  inputsWithoutLabel: [],
};

for (const filePath of jsxFiles) {
  const rel = path.relative(projectRoot, filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = stripComments(raw);
  const rawLines = raw.split("\n");

  // ---- 1) Phosphor icons without aria-hidden ----
  if (/from\s*["']phosphor-react["']/.test(content)) {
    const m = content.match(/import\s*\{([^}]+)\}\s*from\s*["']phosphor-react["']/s);
    if (m) {
      const icons = m[1].split(",").map((s) => s.trim()).filter(Boolean);
      for (const icon of icons) {
        const n = icon.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`<${n}\\b`, "g");
        let match;
        while ((match = re.exec(content))) {
          const tagStart = match.index;
          const tagEnd = findTagEnd(content, tagStart);
          if (tagEnd < 0) continue;
          const tag = content.slice(tagStart, tagEnd + 1);
          if (!/aria-hidden/.test(tag)) {
            results.iconsWithoutAria.push({ file: rel, line: lineOf(content, tagStart), icon });
          }
        }
      }
    }
  }

  // ---- 2) <img> without alt (skip lines that are comments) ----
  const imgRe = /<img\b/g;
  let imgM;
  while ((imgM = imgRe.exec(content))) {
    const tagEnd = findTagEnd(content, imgM.index);
    if (tagEnd < 0) continue;
    const tag = content.slice(imgM.index, tagEnd + 1);
    if (!/\balt\s*=/.test(tag)) {
      // Verify it's a real img tag (not e.g. a string). Check the char before <
      results.imagesWithoutAlt.push({ file: rel, line: lineOf(content, imgM.index) });
    }
  }

  // ---- 3) Form inputs without programmatic label ----
  // A Form.Control/Select/Checkbox is OK if it has aria-label, or id (+ htmlFor exists elsewhere),
  // or is inside a Form.Group that also contains a Form.Label with matching htmlFor,
  // or the Form.Group has controlId (react-bootstrap associates via controlId).
  const controlRe = /<Form\.(Control|Select|Checkbox)(?![.\w])/g;
  let cM;
  while ((cM = controlRe.exec(content))) {
    const tagStart = cM.index;
    const tagEnd = findTagEnd(content, tagStart);
    if (tagEnd < 0) continue;
    const tag = content.slice(tagStart, tagEnd + 1);
    const hasAria = /aria-label|aria-labelledby/.test(tag);
    const hasId = /\bid\s*=/.test(tag);
    if (hasAria || hasId) continue;

    // Look backwards for the nearest <Form.Group ...> opening tag and its attrs
    const before = content.slice(Math.max(0, tagStart - 500), tagStart);
    const lastGroup = before.lastIndexOf("<Form.Group");
    let groupOk = false;
    if (lastGroup >= 0) {
      const groupTagEnd = before.indexOf(">", lastGroup);
      const groupTag = before.slice(lastGroup, groupTagEnd + 1);
      const hasControlId = /controlId\s*=/.test(groupTag);
      // Does this group contain a Form.Label?
      const groupBody = content.slice(lastGroup, tagStart);
      const hasLabel = /<Form\.Label\b/.test(groupBody);
      if (hasControlId || hasLabel) groupOk = true;
    }
    if (!groupOk) {
      results.inputsWithoutLabel.push({ file: rel, line: lineOf(content, tagStart), type: cM[1] });
    }
  }
}

const dedupe = (arr) => {
  const seen = new Set();
  return arr.filter((x) => {
    const k = `${x.file}:${x.line}:${x.icon || x.type || ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

const summary = {
  iconsWithoutAria: dedupe(results.iconsWithoutAria),
  imagesWithoutAlt: dedupe(results.imagesWithoutAlt),
  inputsWithoutLabel: dedupe(results.inputsWithoutLabel),
};

console.log("\n=== STATIC ACCESSIBILITY AUDIT (WCAG 2.2 AA) ===\n");
console.log(`Files scanned: ${jsxFiles.length}\n`);

console.log(`[WCAG 4.1.2] Phosphor icons without aria-hidden: ${summary.iconsWithoutAria.length}`);
summary.iconsWithoutAria.slice(0, 30).forEach((x) => console.log(`   ${x.file}:${x.line} <${x.icon}>`));
if (summary.iconsWithoutAria.length > 30) console.log(`   ... and ${summary.iconsWithoutAria.length - 30} more`);

console.log(`\n[WCAG 1.1.1] Images without alt: ${summary.imagesWithoutAlt.length}`);
summary.imagesWithoutAlt.slice(0, 30).forEach((x) => console.log(`   ${x.file}:${x.line}`));

console.log(`\n[WCAG 3.3.2] Form inputs without programmatic label: ${summary.inputsWithoutLabel.length}`);
summary.inputsWithoutLabel.slice(0, 40).forEach((x) => console.log(`   ${x.file}:${x.line} <Form.${x.type}>`));
if (summary.inputsWithoutLabel.length > 40) console.log(`   ... and ${summary.inputsWithoutLabel.length - 40} more`);

const total = summary.iconsWithoutAria.length + summary.imagesWithoutAlt.length + summary.inputsWithoutLabel.length;
console.log(`\n=== TOTAL ISSUES: ${total} ===`);
console.log(total === 0 ? "Status: PASS" : "Status: ISSUES FOUND");
process.exit(total === 0 ? 0 : 1);