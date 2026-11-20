const fs = require('fs');
const path = 'src/components/ui/ImportFailureTable.jsx';
let content = fs.readFileSync(path, 'utf8');

// The regex has [:\-] which is an unnecessary escape
// We need to replace it with [-:] (dash at start of char class)
content = content.replace(/[:\\\-]?/g, '[-:]?');
content = content.replace(/\[\[:\\\-\]\]/g, '[-:]');

fs.writeFileSync(path, content);
console.log('Fixed ImportFailureTable.jsx');

// Also fix SimpananConfigPage.jsx
const path2 = 'src/pages/konfigurasi/SimpananConfigPage.jsx';
let content2 = fs.readFileSync(path2, 'utf8');

// Find the pattern with 'i' being undefined
// The issue is that 'i' is used outside of the find callback scope
// We need to store the find result first
content2 = content2.replace(
  /existingItems\.find\(i => i\.bill_type_id === billTypeId\) \? i\.type_name : "Tidak diketahui"/g,
  `(existingItems.find(item => item.bill_type_id === billTypeId) || {}).type_name || 'Tidak diketahui'`
);
content2 = content2.replace(
  /existingItems\.find\(i => i\.bill_type_id === billTypeId\) \? i\.type_code : ""/g,
  `(existingItems.find(item => item.bill_type_id === billTypeId) || {}).type_code || ''`
);

fs.writeFileSync(path2, content2);
console.log('Fixed SimpananConfigPage.jsx');
