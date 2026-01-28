
const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
let content = fs.readFileSync(filePath, 'utf8');

// We want to replace literal \\ followed by ` with \ followed by `
// Regex for literal backslash is \\\\
// Regex for literal backtick is `
// So /\\`/g matches \` sequence? No.
// /\\`/ matches \\ then `.

// If the file contains \\` then `\`` (two chars).
// We want to change it to \` then `\`` (two chars? No, \ escapes the backtick, so visually \`).
// Wait.
// \` `\`` are two characters. Backslash and Backtick.
// \\\` `\`` are three characters. Backslash, Backslash, Backtick.

// If `tsc` sees \\\` `\`` . It sees Literal Backslash, Literal Backtick.
// And since it's inside a template string, Literal Backtick terminates the string.
// So we want \` `\`` (Backslash, Backtick).
// This is two characters.
// But \ escapes `\``. So it is ONE token (escaped backtick).

// So we want to replace \\\` `\`` (3 chars) with \` `\`` (2 chars).

content = content.replace(/\\`/g, '\\`');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed double escapes.");
