// MiniMax API 調用服務
import OpenAI from 'openai';
import dotenv from 'dotenv';

// 加載環境變量
dotenv.config();

interface MiniMaxConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

const config: MiniMaxConfig = {
  baseUrl: process.env.MINIMAX_BASE_URL || 'https://vip.dmxapi.com/v1',
  apiKey: process.env.MINIMAX_API_KEY || '',
  model: process.env.MINIMAX_MODEL || 'gpt-4o',  // MiniMax M2.1 通過 OpenAI 兼容接口調用
  temperature: 0.7,
  maxTokens: 8192
};

// 驗證 API Key 是否已設置
if (!config.apiKey) {
  console.error('❌ 錯誤：未設置 MINIMAX_API_KEY 環境變量');
  console.error('請創建 .env 文件並設置 MINIMAX_API_KEY=your-api-key');
  process.exit(1);
}

// 創建 OpenAI 客戶端（使用 MiniMax 的兼容接口）
const client = new OpenAI({
  baseURL: config.baseUrl,
  apiKey: config.apiKey,
});

export interface StreamCallbacks {
  onProgress: (chunk: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
}

/**
 * 調用 MiniMax API 進行流式生成
 */
export async function generateVisualization(
  systemPrompt: string,
  userPrompt: string,
  callbacks: StreamCallbacks
): Promise<void> {
  let fullContent = '';
  
  try {
    const stream = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
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
    console.error('MiniMax API Error:', error);
    callbacks.onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

/**
 * 非流式調用（用於測試）
 */
export async function generateVisualizationSync(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: false,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('MiniMax API Error:', error);
    throw error;
  }
}
