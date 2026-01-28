
const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
let content = fs.readFileSync(filePath, 'utf8');

function escapeSection(str, startMarker, endMarker, startSearchFrom = 0) {
    const startIndex = str.indexOf(startMarker, startSearchFrom);
    if (startIndex === -1) {
        console.log(`Start marker not found: ${startMarker}`);
        return str;
    }
    
    const openQuoteIndex = str.indexOf('`', startIndex);
    if (openQuoteIndex === -1) {
         console.log(`No opening backtick found for ${startMarker}`);
         return str;
    }
    
    let limitIndex = str.length;
    if (endMarker) {
        const nextIndex = str.indexOf(endMarker, openQuoteIndex);
        if (nextIndex !== -1) limitIndex = nextIndex;
    }
    
    const closeQuoteIndex = str.lastIndexOf('`', limitIndex);
    
    if (closeQuoteIndex <= openQuoteIndex) {
         console.log(`Closing backtick error for ${startMarker}`);
         return str;
    }
    
    console.log(`Escaping range: ${openQuoteIndex} to ${closeQuoteIndex} for ${startMarker}`);

    const before = str.substring(0, openQuoteIndex + 1);
    const middle = str.substring(openQuoteIndex + 1, closeQuoteIndex);
    const after = str.substring(closeQuoteIndex);
    
    const escapedMiddle = middle.replace(/`/g, (match, offset) => {
        if (offset > 0 && middle[offset - 1] === '\\') return match;
        return '\\`';
    });
    
    return before + escapedMiddle + after;
}

// 1. profileContext
content = escapeSection(content, 'profileContext = `', '// 3. Expert Overlay Logic');

// 2. buildSystemPrompt return
content = escapeSection(content, 'return `# Role:', 'export function buildUserPrompt');

// 3. buildUserPrompt return
const defMarker = 'export function buildUserPrompt';
const defIndex = content.indexOf(defMarker);
if (defIndex !== -1) {
    content = escapeSection(content, 'return `', null, defIndex);
} else {
    console.log("Could not find buildUserPrompt definition");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed prompts v4.");
