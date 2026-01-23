// 生成 API 路由
import express, { Request, Response } from 'express';
import { buildSystemPrompt, buildUserPrompt } from '../services/promptEngine.js';
import { generateVisualization } from '../services/minimax.js';
import { extractContent, extractAestheticJSON, extractInteractionList } from '../utils/codeExtractor.js';
import { validateGeneratedCode, autoFixCode } from '../utils/validator.js';

const router = express.Router();

interface GenerateRequest {
  concept: string;
}

/**
 * POST /api/generate
 * 生成 3D 可視化（SSE 流式響應）
 */
router.post('/generate', async (req: Request, res: Response) => {
  const { concept } = req.body as GenerateRequest;

  if (!concept || concept.trim().length === 0) {
    res.status(400).json({ error: '請提供知識點' });
    return;
  }

  // 設置 SSE 響應頭
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (type: string, data: any) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    sendEvent('progress', { message: '正在構建提示詞...' });

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(concept);

    sendEvent('progress', { message: '正在呼叫 AI 生成器...' });

    let accumulatedContent = '';

    await generateVisualization(systemPrompt, userPrompt, {
      onProgress: (chunk: string) => {
        accumulatedContent += chunk;
        // 每收到 100 個字符發送一次進度更新
        if (accumulatedContent.length % 100 < chunk.length) {
          sendEvent('progress', { message: `生成中... (${accumulatedContent.length} 字符)` });
        }
      },
      
      onComplete: (fullContent: string) => {
        sendEvent('progress', { message: '正在提取和驗證代碼...' });

        // 提取內容
        const extracted = extractContent(fullContent);

        if (!extracted.htmlCode) {
          sendEvent('error', { message: '無法從 AI 響應中提取 HTML 代碼' });
          res.end();
          return;
        }

        // 驗證代碼
        const validation = validateGeneratedCode(extracted.htmlCode);

        if (!validation.isValid) {
          sendEvent('progress', { message: '嘗試自動修復安全問題...' });
          extracted.htmlCode = autoFixCode(extracted.htmlCode);
          
          // 重新驗證
          const revalidation = validateGeneratedCode(extracted.htmlCode);
          if (!revalidation.isValid) {
            sendEvent('error', { 
              message: '生成的代碼存在安全問題',
              errors: revalidation.errors 
            });
            res.end();
            return;
          }
        }

        // 發送警告（如果有）
        if (validation.warnings.length > 0) {
          sendEvent('progress', { 
            message: '代碼驗證通過（有警告）',
            warnings: validation.warnings 
          });
        }

        // 解析美學分析
        const aestheticAnalysis = extracted.aestheticAnalysis 
          ? extractAestheticJSON(extracted.aestheticAnalysis)
          : null;

        // 解析互動指南
        const interactionGuide = extracted.interactionGuide
          ? extractInteractionList(extracted.interactionGuide)
          : [];

        // 發送完成事件
        sendEvent('complete', {
          htmlContent: extracted.htmlCode,
          aestheticAnalysis,
          educationalRationale: extracted.educationalRationale,
          interactionGuide,
        });

        res.end();
      },
      
      onError: (error: Error) => {
        sendEvent('error', { message: error.message });
        res.end();
      }
    });

  } catch (error) {
    console.error('Generation error:', error);
    sendEvent('error', { 
      message: error instanceof Error ? error.message : '生成過程發生錯誤' 
    });
    res.end();
  }
});

export default router;
