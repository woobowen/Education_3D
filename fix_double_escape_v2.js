
const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
let content = fs.readFileSync(filePath, 'utf8');

if (content.includes('\\`')) {
    console.log("Found double escaped backticks!");
    // We want to replace literal \\ + ` with literal \ + `
    // \\ string is written as \\\\ in JS code?
    // In split string: '\\`' -> matches literal \`
    // In join string: '\`' -> matches literal \`
    
    content = content.split('\\`').join('\`');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Replaced using split/join.");
} else {
    console.log("Did not find double escaped backticks.");
}
