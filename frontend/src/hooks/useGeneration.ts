// SSE 连接管理 Hook
import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

export function useGeneration() {
  const {
    setIsGenerating,
    setProgressMessage,
    setGeneratedHtml,
    setAestheticAnalysis,
    setEducationalRationale,
    setInteractionGuide,
    setError,
    reset,
  } = useAppStore();

  const generate = useCallback(async (concept: string) => {
    // 重置状态
    reset();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concept }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法获取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case 'progress':
                  setProgressMessage(data.message);
                  break;

                case 'complete':
                  setGeneratedHtml(data.htmlContent);
                  setAestheticAnalysis(data.aestheticAnalysis);
                  setEducationalRationale(data.educationalRationale);
                  setInteractionGuide(data.interactionGuide || []);
                  setProgressMessage('生成完成！');
                  setIsGenerating(false);
                  break;

                case 'error':
                  setError(data.message);
                  setIsGenerating(false);
                  break;
              }
            } catch (e) {
              console.error('解析 SSE 数据错误:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('🚨 生成错误:', error);
      
      // 详细的错误信息
      let errorMessage = '生成失败：';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += '网络连接失败。请检查：\n' +
                         '1. 后端服务是否正在运行（端口 3000）\n' +
                         '2. 网络连接是否正常\n' +
                         '3. 防火墙是否阻止了连接';
        } else if (error.message.includes('500')) {
          errorMessage += '服务器内部错误。可能原因：\n' +
                         '1. API 密钥无效或未配置\n' +
                         '2. AI 服务暂时不可用\n' +
                         '3. 请求超时';
        } else if (error.message.includes('429')) {
          errorMessage += 'API 请求频率超限。请稍后再试。';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += '未知错误，请查看控制台获取详细信息';
      }
      
      setError(errorMessage);
      setIsGenerating(false);
      
      // 发送错误统计（如果需要）
      console.group('错误详情');
      console.error('错误对象:', error);
      console.error('概念:', concept);
      console.error('时间:', new Date().toISOString());
      console.groupEnd();
    }
  }, [reset, setIsGenerating, setProgressMessage, setGeneratedHtml, 
      setAestheticAnalysis, setEducationalRationale, setInteractionGuide, setError]);

  return { generate };
}
