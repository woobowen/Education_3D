// 代碼提取器 - 從 AI 響應中提取 HTML 代碼和結構化信息

export interface ExtractedContent {
  aestheticAnalysis: string | null;
  educationalRationale: string | null;
  htmlCode: string | null;
  interactionGuide: string | null;
}

/**
 * 從 AI 生成的內容中提取各個部分
 */
export function extractContent(fullResponse: string): ExtractedContent {
  const result: ExtractedContent = {
    aestheticAnalysis: null,
    educationalRationale: null,
    htmlCode: null,
    interactionGuide: null,
  };

  // 提取 HTML 代碼（在 ```html 和 ``` 之間）
  const htmlMatch = fullResponse.match(/```html\s*\n([\s\S]*?)```/);
  
  if (htmlMatch) {
    result.htmlCode = htmlMatch[1].trim();
  }

  // 提取美學分析（在 ### 美學分析 和下一個 ### 之間）
  const aestheticMatch = fullResponse.match(/###\s*美學分析\s*\n([\s\S]*?)(?=###|$)/);
  if (aestheticMatch) {
    result.aestheticAnalysis = aestheticMatch[1].trim();
  }

  // 提取教育設計理念
  const rationaleMatch = fullResponse.match(/###\s*教育設計理念\s*\n([\s\S]*?)(?=###|$)/);
  if (rationaleMatch) {
    result.educationalRationale = rationaleMatch[1].trim();
  }

  // 提取互動指南
  const guideMatch = fullResponse.match(/###\s*互動指南\s*\n([\s\S]*?)(?=###|$)/);
  if (guideMatch) {
    result.interactionGuide = guideMatch[1].trim();
  }

  return result;
}

/**
 * 從美學分析中提取 JSON
 */
export function extractAestheticJSON(aestheticText: string): any {
  try {
    const jsonMatch = aestheticText.match(/```json\s*\n([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return null;
  } catch (error) {
    console.error('Failed to parse aesthetic JSON:', error);
    return null;
  }
}

/**
 * 從互動指南中提取互動列表
 */
export function extractInteractionList(guideText: string): string[] {
  const interactions: string[] = [];
  
  // 匹配項目符號列表
  const listItems = guideText.match(/[-*•]\s*(.+?)(?=\n[-*•]|\n\n|$)/gs);
  if (listItems) {
    interactions.push(...listItems.map(item => item.replace(/^[-*•]\s*/, '').trim()));
  }

  // 匹配數字列表
  const numberedItems = guideText.match(/\d+\.\s*(.+?)(?=\n\d+\.|\n\n|$)/gs);
  if (numberedItems) {
    interactions.push(...numberedItems.map(item => item.replace(/^\d+\.\s*/, '').trim()));
  }

  return interactions.filter(item => item.length > 0);
}
