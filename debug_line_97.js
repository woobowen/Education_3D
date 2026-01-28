const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Line 97 content:', lines[96]);
console.log('Hex 97:', Buffer.from(lines[96]).toString('hex'));
