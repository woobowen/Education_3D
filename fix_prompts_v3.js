
const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
let content = fs.readFileSync(filePath, 'utf8');

function escapeSection(str, startMarker, endMarker) {
    const startIndex = str.indexOf(startMarker);
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
    
    // Find closing backtick by searching backwards from limit
    const closeQuoteIndex = str.lastIndexOf('`', limitIndex);
    
    if (closeQuoteIndex <= openQuoteIndex) {
         console.log(`Closing backtick not found (or before start) for ${startMarker}`);
         return str;
    }
    
    console.log(`Escaping range: ${openQuoteIndex} to ${closeQuoteIndex} for ${startMarker}`);
    
    const before = str.substring(0, openQuoteIndex + 1);
    const middle = str.substring(openQuoteIndex + 1, closeQuoteIndex);
    const after = str.substring(closeQuoteIndex);
    
    // Escape backticks in middle
    // We must NOT double escape if already escaped.
    // Replace ` with \` BUT not if it is already \`
    // Regex: /(?<!\\)`/g  (Negative lookbehind not supported in all JS versions?)
    // Node.js usually supports it.
    
    // Or just simple replace and then fix double escapes later?
    // Let's use a function.
    
    const escapedMiddle = middle.replace(/`/g, (match, offset) => {
        // Check if preceded by backslash
        if (offset > 0 && middle[offset - 1] === '\\') {
            return match; // Already escaped
        }
        return '\\`';
    });
    
    return before + escapedMiddle + after;
}

// 1. profileContext
content = escapeSection(content, 'profileContext = `', '// 3. Expert Overlay Logic');

// 2. buildSystemPrompt return
content = escapeSection(content, 'return `# Role:', 'export function buildUserPrompt');

// 3. buildUserPrompt return
// Use a unique substring inside the function to be safe against encoding
content = escapeSection(content, 'const container = document.getElementById', null);
// Wait, `const container...` is inside the template string of buildUserPrompt?
// Yes, inside the HTML template.
// But we need the start marker to be the `return` statement.
// If I use `return ` inside `buildUserPrompt`.
// I can find `buildUserPrompt` function definition first.
const userPromptDef = 'export function buildUserPrompt';
const defIndex = content.indexOf(userPromptDef);
if (defIndex !== -1) {
    // Find the return statement after definition
    const returnIndex = content.indexOf('return `', defIndex);
    if (returnIndex !== -1) {
        // We manually handle this case to pass correct start index context
        // But escapeSection takes a string marker.
        // Let's just pass a unique string that includes the return.
        // "return `请" might fail.
        // "return `\n请" ?
        // The file has `return ` followed by backtick.
        // Let's assume there is only one `return ` followed by backtick in that function.
        // And it starts with `请`.
        // Let's use the `let userContext` variable which is just before return.
        // But `escapeSection` searches for marker from start of file.
        // So `let userContext` might be ambiguous?
        // No, `let userContext` appears in buildUserPrompt.
        // Also `if (userProfile)` appears.
        
        // Let's use 'return `请' but careful about encoding.
        // If I use regex?
        // let's use the code I wrote before that worked for profileContext but adapt it.
        
        // Actually, just substring replacement using the offsets I found manually is best.
        // But I want a reusable function.
        
        // Let's try to find "return `" starting from `defIndex`.
        // Then pass a unique substring starting at that index?
        
        // I will just use `escapeSection` with `return ` starting search from `defIndex`.
        // I'll modify `escapeSection` to take an optional `fromIndex`.
    }
}

// Redefine escapeSection to support fromIndex
function escapeSectionAdvanced(str, startSearchFrom, startMarker, endMarker) {
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
    
    console.log(`Escaping range: ${openQuoteIndex} to ${closeQuoteIndex}`);

    const before = str.substring(0, openQuoteIndex + 1);
    const middle = str.substring(openQuoteIndex + 1, closeQuoteIndex);
    const after = str.substring(closeQuoteIndex);
    
    const escapedMiddle = middle.replace(/`/g, (match, offset) => {
        if (offset > 0 && middle[offset - 1] === '\\') return match;
        return '\\`';
    });
    
    return before + escapedMiddle + after;
}

// Apply
content = escapeSectionAdvanced(content, 0, 'profileContext = `', '// 3. Expert Overlay Logic');
content = escapeSectionAdvanced(content, 0, 'return `# Role:', 'export function buildUserPrompt');

const defIdx = content.indexOf('export function buildUserPrompt');
if (defIdx !== -1) {
    // Search for `return ` after definition
    // Note: the `return` string might have been moved if content length changed?
    // No, `content` is updated. `defIdx` is on the NEW content?
    // `defIdx` computed on NEW content.
    
    // But `return ` is short.
    // The prompt starts with `请`.
    // Let's use `return ` and verify it is the one.
    // It is the first `return ` after `buildUserPrompt` start.
    content = escapeSectionAdvanced(content, defIdx, 'return `', null);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed prompts v3.");
