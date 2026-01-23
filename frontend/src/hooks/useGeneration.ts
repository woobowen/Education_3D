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
      console.error('生成错误:', error);
      setError(error instanceof Error ? error.message : '未知错误');
      setIsGenerating(false);
    }
  }, [reset, setIsGenerating, setProgressMessage, setGeneratedHtml, 
      setAestheticAnalysis, setEducationalRationale, setInteractionGuide, setError]);

  return { generate };
}
