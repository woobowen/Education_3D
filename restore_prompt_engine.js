const fs = require('fs');
const filePath = 'D:\\Education_3D\\backend\\src\\services\\promptEngine.ts';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes("import type { UserProfile }")) {
    const imports = `import type { UserProfile } from '../../../shared/types';
import { getLanguageProfile } from '../config/languageProfiles';

`;
    content = imports + content;
}

const sysFuncStart = "export function buildSystemPrompt(): string {";
const sysFuncNew = `export function buildSystemPrompt(userProfile?: UserProfile): string {
  let profileContext = '';
  
  if (userProfile) {
    const profile = getLanguageProfile(userProfile.programmingLanguage);
    let dynamicRules = [];
    if (profile.memoryModel === 'manual') dynamicRules.push("- **Memory Visualization**: Display Hex Memory Addresses under elements.");
    if (profile.pointerVisual === 'arrow') dynamicRules.push("- **Relationships**: Use THREE.ArrowHelper to visualize relationships.");
    else if (profile.pointerVisual === 'line') dynamicRules.push("- **Relationships**: Use thin lines to represent object references.");
    if (profile.concurrencyVisual) dynamicRules.push("- **Concurrency**: Visualize concurrent execution paths if applicable (e.g., Goroutines).");
    if (userProfile.difficulty === 'advanced') dynamicRules.push("- **Engineering View**: Add \\`new THREE.GridHelper(20, 20)\\\` and \\`new THREE.AxesHelper(5)\\\` to the scene for spatial reference.");

    const languageSpecificInstruction = \\`4. **Language & Visual Protocol (Auto-Adapted)**:
   \\${dynamicRules.join('\n   ')}
   - **Syntax Compliance**: Code must strictly follow \\${userProfile.programmingLanguage} syntax.
   - **Idioms**: Use idiomatic \\${userProfile.programmingLanguage} patterns (e.g., \\${profile.collectionMeta} collections).\\`;

    profileContext = \\`
## 👤 用户画像适配
- **用户年龄**: \\${userProfile.age} 岁
- **学习目标**: \\${userProfile.learningGoal}
- **难度等级**: \\${userProfile.difficulty}
- **编程语言**: \\${userProfile.programmingLanguage}

### 适配指令
1. **语言**: 界面说明文字使用中文（便于理解），但**核心代码展示必须使用 \\${userProfile.programmingLanguage}**。
2. **复杂度**: 针对 \\${userProfile.difficulty} 难度调整概念深度。\\${userProfile.difficulty === 'beginner' ? '隐藏非必要细节，多用比喻。' : '展示底层逻辑和数据结构细节。'}
3. **视觉风格**: \\${userProfile.age < 14 ? '使用鲜艳、活泼的配色，增加趣味性元素。' : '保持专业、现代、极简的风格。'}
\\${languageSpecificInstruction}

### 🛠️ Debug HUD (Mandatory)
In the generated HTML, you **MUST** inject a fixed position overlay div in the top-left corner to show the active profile.
Format:
\\\\`\\\\`\\\\`html
<div style="position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #00ff00; padding: 10px; font-family: monospace; z-index: 9999; border-radius: 5px; font-size: 12px; pointer-events: none;">
  <strong>Active Profile:</strong><br>
  Language: \\${userProfile.programmingLanguage}<br>
  Strategy: \\${profile.memoryModel} / \\${profile.pointerVisual}<br>
  Difficulty: \\${userProfile.difficulty}
</div>
\\\\`\\\\`\\\\`
\\`;
  }
  
  let expertBlock = '';
  if (userProfile?.difficulty === 'advanced') {
    expertBlock = \\\\`
**Step 3: 专家模式增强 (Universal Expert Overlay)**
1. **Memory Overhead**: Display a dynamic text label showing Auxiliary Space complexity (e.g., "Aux Space: O(n)").
2. **Operation Counters**: Show distinct 'Read' vs 'Write' operation counts in the HUD (top-right corner).\\\\`;
  }
`;

if (content.includes(sysFuncStart)) {
    content = content.replace(sysFuncStart, sysFuncNew);
}

const targetString = "你是一位专注于**教学效果**的可视化专家。";
if (content.includes(targetString) && !content.includes(targetString + "${profileContext}")) {
    content = content.replace(targetString, targetString + "${profileContext}");
}

const userFuncStartRegex = /export function buildUserPrompt\(concept: string\): string \{/;
const userFuncNew = `export function buildUserPrompt(concept: string, userProfile?: UserProfile): string {
  let userContext = '';
  if (userProfile) {
    userContext = \\\\`\n## 用户背景\n请特别注意：用户是一位 \\${userProfile.age} 岁的 \\${userProfile.gender === 'male' ? '男性' : userProfile.gender === 'female' ? '女性' : ''}学习者，目标是 "\\${userProfile.learningGoal}".\n\\\`;
  }
`;

if (userFuncStartRegex.test(content)) {
    content = content.replace(userFuncStartRegex, userFuncNew);
}

if (content.includes("${concept}") && !content.includes("${userContext}")) {
    content = content.replace("${concept}", "${concept}\n${userContext}");
}

const cssOld = "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);";
const cssNew = "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; /* 紫色渐变 */";
content = content.replace(cssOld, cssNew);

const cleanupOld = `// 1. 清空之前的对象（释放内存）
            dataElements.forEach(obj => {`;
const cleanupNew = `// 1. 清空之前的对象（释放内存）
            // 🛡️ 强制清理所有旧标签 DOM 元素
            const oldLabels = document.querySelectorAll('.label');
            oldLabels.forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
            
            dataElements.forEach(obj => {`;
if (content.includes(cleanupOld)) {
    content = content.replace(cleanupOld, cleanupNew);
} else {
    content = content.replace(/\/\/\s*1\.\s*清空之前的对象（释放内存）\s*dataElements\.forEach\(obj\s*=>\s*{/g, cleanupNew);
}

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

content = escapeSection(content, 'profileContext = `', 'let expertBlock');
content = escapeSection(content, 'return `# Role:', 'export function buildUserPrompt');

const defIdx = content.indexOf('export function buildUserPrompt');
if (defIdx !== -1) {
    content = escapeSection(content, 'return `', null, defIdx);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fully restored.");
