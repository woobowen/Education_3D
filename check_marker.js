
const fs = require('fs');
const content = fs.readFileSync('D:\\Education_3D\\backend\\src\\services\\promptEngine.ts', 'utf8');
const idx = content.indexOf('return `# Role:');
console.log('Index of marker:', idx);

