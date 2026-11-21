// WCAG 2.1/2.2 Contrast Ratio Calculator
// https://www.w3.org/TR/WCAG20-TECHS/G18.html

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  if (hex.length === 8) hex = hex.slice(0,6); // strip alpha
  if (hex.length !== 6) return null;
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  return {r, g, b};
}

function luminance({r, g, b}) {
  const [rs, gs, bs] = [r/255, g/255, b/255].map(c =>
    c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
  );
  return 0.2126*rs + 0.7152*gs + 0.0722*bs;
}

function contrastRatio(c1, c2) {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Common backgrounds in the app
const backgrounds = {
  'white': '#ffffff',
  'light-gray': '#f8f9fa',
  'lighter-gray': '#f1f5f9',
  'header-dark': '#02113d',
  'card-bg': '#ffffff',
  'danger-bg': '#fee2e2',
  'warning-bg': '#fef3c7',
  'info-bg': '#eff6ff',
  'success-bg': '#f8fff9',
};

// Critical text colors found in the codebase
const textColors = {
  'body-dark': '#334155',
  'body': '#475569',
  'body-alt': '#1e293b',
  'dark': '#212529',
  'muted-blue': '#64748b',
  'bootstrap-muted': '#6c757d',
  'border': '#94a3b8',
  'secondary': '#adb5bd',
  'gray-light': '#a8a8a8',
  'light-gray': '#c1c1c1',
  'sidebar-text': '#94a3b8',
  'primary': '#0d6efd',
  'primary-alt': '#3b82f6',
  'blue': '#2563eb',
  'success': '#198754',
  'success-alt': '#10b981',
  'green': '#48bb78',
  'warning': '#f59e0b',
  'warning2': '#fbbf24',
  'danger': '#dc3545',
  'danger-alt': '#ef4444',
  'error-red': '#dc2626',
  'brand-teal': '#00d9a6',
  'purple': '#8b5cf6',
  'indigo': '#a5b4fc',
  'white': '#ffffff',
};

// Bootstrap badge colors
const badgeColors = {
  'badge-danger-text': '#721c24',
  'badge-warning-text': '#664d03',
  'badge-info-text': '#055160',
  'badge-success-text': '#0f5132',
  'badge-primary-text': '#051e3e',
};

console.log("=== WCAG 2.2 AA Contrast Audit ===\n");
console.log("Normal text: ≥ 4.5:1  |  Large text (≥18px bold / ≥24px): ≥ 3:1\n");

const FAIL_CRITICAL = [];
const FAIL_WARNING = [];
const PASS = [];

for (const [bgName, bgHex] of Object.entries(backgrounds)) {
  const bgRgb = hexToRgb(bgHex);
  if (!bgRgb) continue;

  for (const [colorName, colorHex] of Object.entries({...textColors, ...badgeColors})) {
    const fgRgb = hexToRgb(colorHex);
    if (!fgRgb) continue;

    const ratio = contrastRatio(fgRgb, bgRgb);
    const passAA = ratio >= 4.5;
    const passAALarge = ratio >= 3.0;

    if (!passAA) {
      if (!passAALarge) {
        FAIL_CRITICAL.push({ fg: colorName, bg: bgName, ratio: ratio.toFixed(2) });
      } else {
        FAIL_WARNING.push({ fg: colorName, bg: bgName, ratio: ratio.toFixed(2), note: "OK untuk large text saja" });
      }
    } else {
      // Only record if ratio is in a range worth noting
    }
  }
}

console.log(`🔴 GAGAL Kritis (normal & large): ${FAIL_CRITICAL.length} kombinasi`);
for (const f of FAIL_CRITICAL) {
  console.log(`   ${f.fg} on ${f.bg} → ${f.ratio}:1`);
}

console.log(`\n🟡 GAGAL normal (tapi OK large): ${FAIL_WARNING.length} kombinasi`);
for (const f of FAIL_WARNING) {
  console.log(`   ${f.fg} on ${f.bg} → ${f.ratio}:1 ${f.note}`);
}

console.log(`\n✅ LULUS: Sisanya (ratio ≥ 4.5:1)`);

// Check specific known failing cases
console.log("\n=== Verifikasi Spesifik (kasus yang diketahui) ===");
const cases = [
  { fg: '#64748b', bg: '#ffffff', label: 'text-muted on white' },
  { fg: '#94a3b8', bg: '#ffffff', label: 'border/slate-400 on white' },
  { fg: '#adb5bd', bg: '#ffffff', label: 'secondary on white' },
  { fg: '#a8a8a8', bg: '#ffffff', label: 'gray-light on white' },
  { fg: '#6c757d', bg: '#ffffff', label: 'bootstrap-muted on white' },
  { fg: '#f59e0b', bg: '#ffffff', label: 'warning/amber-500 on white' },
  { fg: '#fbbf24', bg: '#ffffff', label: 'amber-400 on white' },
  { fg: '#ef4444', bg: '#ffffff', label: 'red-500 on white' },
  { fg: '#3b82f6', bg: '#ffffff', label: 'blue-500 on white' },
  { fg: '#0d6efd', bg: '#ffffff', label: 'bootstrap-primary on white' },
  { fg: '#00d9a6', bg: '#ffffff', label: 'brand-teal on white' },
  { fg: '#00d9a6', bg: '#ffffff', label: 'brand-teal header text on white' },
  { fg: '#ffffff', bg: '#02113d', label: 'white on header-dark' },
  { fg: '#ffffff', bg: '#0d6efd', label: 'white on primary btn' },
  { fg: '#ffffff', bg: '#dc3545', label: 'white on danger badge' },
  { fg: '#ffffff', bg: '#f59e0b', label: 'white on warning badge' },
  { fg: '#721c24', bg: '#fee2e2', label: 'danger badge text on bg' },
  { fg: '#664d03', bg: '#fef3c7', label: 'warning badge text on bg' },
  { fg: '#055160', bg: '#eff6ff', label: 'info badge text on bg' },
  { fg: '#0f5132', bg: '#f8fff9', label: 'success badge text on bg' },
];

for (const c of cases) {
  const fg = hexToRgb(c.fg);
  const bg = hexToRgb(c.bg);
  const ratio = contrastRatio(fg, bg);
  const status = ratio >= 4.5 ? '✅ AA' : (ratio >= 3.0 ? '⚠️ AA-Large' : '❌ FAIL');
  console.log(`   ${status}  ${c.label}: ${ratio.toFixed(2)}:1`);
}
