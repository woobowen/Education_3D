// Gemini API 调用服务
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// 从父目录加载 .env 文件
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

interface GeminiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const config: GeminiConfig = {
  baseUrl: process.env.GEMINI_BASE_URL || 'https://vip.dmxapi.com/v1',
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-3-pro-preview',
  temperature: 0.7,
  maxTokens: 2000
};

// 验证 API Key
if (!config.apiKey) {
  console.warn('⚠️ 警告：未设置 GEMINI_API_KEY 环境变量');
}

// 创建 OpenAI 客户端（Gemini 兼容接口）
const client = new OpenAI({
  baseURL: config.baseUrl,
  apiKey: config.apiKey,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onProgress: (chunk: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
}

/**
 * 调用 Gemini API 进行对话（流式）
 */
export async function chatWithGemini(
  messages: ChatMessage[],
  callbacks: StreamCallbacks
): Promise<void> {
  let fullContent = '';
  
  try {
    const stream = await client.chat.completions.create({
      model: config.model,
      messages: messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        callbacks.onProgress(content);
      }
    }

    callbacks.onComplete(fullContent);
  } catch (error) {
    console.error('Gemini API Error:', error);
    callbacks.onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

/**
 * 非流式调用
 */
export async function chatWithGeminiSync(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: config.model,
      messages: messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: false,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

/**
 * 构建系统提示词
 */
export function buildSystemPrompt(): string {
  return `你是 EduVibe 3D 的智能助手，专门帮助用户理解计算机科学和编程概念。

你的职责：
1. 回答用户关于算法、数据结构、编程概念的问题
2. 用简单易懂的语言解释复杂的技术概念
3. 提供学习建议和最佳实践
4. 帮助用户理解 3D 可视化演示中的内容

回答要求：
- 使用简体中文
- 语言简洁明了，适合学生理解
- 可以使用类比和例子来解释
- 如果涉及代码，使用简单的伪代码或注释
- 保持友好和鼓励的语气

当前平台功能：
- 用户可以输入任何算法或数据结构概念
- AI 会生成 3D 交互式教学可视化
- 支持自动演示、参数控制、步骤说明
- 自然语言控制台可以控制演示过程`;
}
