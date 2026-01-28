
const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Line 44 content:', lines[43]);
console.log('Line 60 content:', lines[59]);
console.log('Hex 60:', Buffer.from(lines[59]).toString('hex'));
