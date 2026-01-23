// 安全驗證器 - 驗證生成的 HTML 代碼安全性

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 驗證生成的 HTML 代碼
 */
export function validateGeneratedCode(html: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!html || html.trim().length === 0) {
    result.isValid = false;
    result.errors.push('HTML 代碼為空');
    return result;
  }

  // 危險模式列表
  const forbiddenPatterns = [
    { pattern: /localStorage/gi, message: '禁止使用 localStorage' },
    { pattern: /sessionStorage/gi, message: '禁止使用 sessionStorage' },
    { pattern: /document\.cookie/gi, message: '禁止訪問 cookie' },
    { pattern: /window\.parent/gi, message: '禁止訪問父窗口' },
    { pattern: /window\.top/gi, message: '禁止訪問頂層窗口' },
    { pattern: /eval\s*\(/gi, message: '禁止使用 eval' },
    { pattern: /new\s+Function/gi, message: '禁止使用 Function 構造器' },
    { pattern: /innerHTML\s*=/gi, message: '警告：使用 innerHTML 可能存在 XSS 風險', isWarning: true },
  ];

  // 檢查危險模式
  for (const { pattern, message, isWarning } of forbiddenPatterns) {
    if (pattern.test(html)) {
      if (isWarning) {
        result.warnings.push(message);
      } else {
        result.isValid = false;
        result.errors.push(message);
      }
    }
  }

  // 白名單檢查：允許本地庫文件和指定的 CDN
  const allowedSources = [
    'localhost:3000/libs',  // 本地 Three.js 庫
    'http://localhost:3000/libs',  // 本地 Three.js 庫
    'cdn.jsdelivr.net',
    'unpkg.com',
    'cdnjs.cloudflare.com',
  ];

  // 檢查外部腳本
  const scriptSrcMatches = html.matchAll(/<script[^>]*src=["']([^"']+)["']/gi);
  for (const match of scriptSrcMatches) {
    const src = match[1];
    const isAllowed = allowedSources.some(source => src.includes(source));
    
    if (!isAllowed) {
      result.warnings.push(`檢測到外部腳本: ${src} - 請確保來源可信`);
    }
  }

  // 檢查是否包含基本的 HTML 結構
  if (!/<html/i.test(html) || !/<body/i.test(html)) {
    result.warnings.push('HTML 結構不完整，可能缺少 <html> 或 <body> 標籤');
  }

  // 檢查是否包含 Three.js
  if (!/three\.module\.js|three\.min\.js/i.test(html)) {
    result.warnings.push('未檢測到 Three.js 引用');
  }

  return result;
}

/**
 * 嘗試自動修復常見問題
 */
export function autoFixCode(html: string): string {
  let fixed = html;

  // 移除危險的 API 調用
  fixed = fixed.replace(/localStorage\./g, '// localStorage.');
  fixed = fixed.replace(/sessionStorage\./g, '// sessionStorage.');
  fixed = fixed.replace(/document\.cookie/g, '// document.cookie');
  fixed = fixed.replace(/window\.parent/g, '// window.parent');
  fixed = fixed.replace(/window\.top/g, '// window.top');

  return fixed;
}
