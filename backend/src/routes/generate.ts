// 生成 API 路由
import express, { Request, Response } from 'express';
import { buildSystemPrompt, buildUserPrompt } from '../services/promptEngine.js';
import { generateVisualization } from '../services/minimax.js';
import { extractContent, extractAestheticJSON, extractInteractionList } from '../utils/codeExtractor.js';
import { validateGeneratedCode, autoFixCode } from '../utils/validator.js';

const router = express.Router();

interface GenerateRequest {
  concept: string;
  userProfile?: any; // Using any to avoid import issues if type definition path is tricky, but preferably use shared type
}

/**
 * POST /api/generate
 * 生成 3D 可视化（SSE 流式响应）
 */
router.post('/generate', async (req: Request, res: Response) => {
  const { concept } = req.body as GenerateRequest;
  let { userProfile } = req.body as GenerateRequest;

  if (!concept || concept.trim().length === 0) {
    res.status(400).json({ error: '请提供知识点' });
    return;
  }

  // 🛡️ 鲁棒性增强: User Profile 校验与回退
  // 如果 userProfile 存在，确保 programmingLanguage 有效
  if (userProfile) {
    const validLanguages = ['C', 'C++', 'Python', 'Java', 'Go'];
    
    // 如果 language 字段为空或不在支持列表中，回退到 Python
    if (!userProfile.programmingLanguage || !validLanguages.includes(userProfile.programmingLanguage)) {
      console.warn(`Invalid or missing programming language: '${userProfile.programmingLanguage}'. Fallback to 'Python'.`);
      userProfile = {
        ...userProfile,
        programmingLanguage: 'Python'
      };
    }
  } else {
    // 如果没有 userProfile，创建一个默认的（可选，视业务需求而定）
    // 这里我们保持 undefined，让 promptEngine 处理默认情况，或者可以注入默认 profile
    // userProfile = { programmingLanguage: 'Python', ... }; 
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (type: string, data: any) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    sendEvent('progress', { message: '正在构建提示词...' });

    const systemPrompt = buildSystemPrompt(userProfile);
    const userPrompt = buildUserPrompt(concept, userProfile);

    sendEvent('progress', { message: '正在调用 AI 生成器...' });

    let accumulatedContent = '';

    await generateVisualization(systemPrompt, userPrompt, {
      onProgress: (chunk: string) => {
        accumulatedContent += chunk;
        // 每收到 100 个字符发送一次进度更新
        if (accumulatedContent.length % 100 < chunk.length) {
          sendEvent('progress', { message: `生成中... (${accumulatedContent.length} 字符)` });
        }
      },
      
      onComplete: (fullContent: string) => {
        sendEvent('progress', { message: '正在提取和验证代码...' });

        // 提取内容
        const extracted = extractContent(fullContent);

        if (!extracted.htmlCode) {
          sendEvent('error', { message: '无法从 AI 响应中提取 HTML 代码' });
          res.end();
          return;
        }

        // 验证代码
        const validation = validateGeneratedCode(extracted.htmlCode);

        if (!validation.isValid) {
          sendEvent('progress', { message: '尝试自动修复安全问题...' });
          extracted.htmlCode = autoFixCode(extracted.htmlCode);
          
          // 重新验证
          const revalidation = validateGeneratedCode(extracted.htmlCode);
          if (!revalidation.isValid) {
            sendEvent('error', { 
              message: '生成的代码存在安全问题',
              errors: revalidation.errors 
            });
            res.end();
            return;
          }
        }

        // 发送警告（如果有）
        if (validation.warnings.length > 0) {
          sendEvent('progress', { 
            message: '代码验证通过（有警告）',
            warnings: validation.warnings 
          });
        }

        // 解析美学分析
        const aestheticAnalysis = extracted.aestheticAnalysis 
          ? extractAestheticJSON(extracted.aestheticAnalysis)
          : null;

        // 解析交互指南
        const interactionGuide = extracted.interactionGuide
          ? extractInteractionList(extracted.interactionGuide)
          : [];

        // 发送完成事件
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
      message: error instanceof Error ? error.message : '生成过程发生错误' 
    });
    res.end();
  }
});

export default router;
