// 生成状态显示 - 增强版
import { useAppStore } from '../stores/appStore';
import { useState, useEffect } from 'react';

export function GenerationStatus() {
  const { isGenerating, progressMessage, error } = useAppStore();
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  // 动画点点点效果
  useEffect(() => {
    if (!isGenerating) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // 模拟进度条（基于消息变化）
  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      return;
    }

    // 根据进度消息估算进度
    if (progressMessage?.includes('构建提示词')) {
      setProgress(20);
    } else if (progressMessage?.includes('调用 AI')) {
      setProgress(40);
    } else if (progressMessage?.includes('生成中')) {
      // 从消息中提取字符数
      const match = progressMessage.match(/(\d+)\s*字符/);
      if (match) {
        const chars = parseInt(match[1]);
        // 假设完整代码约 8000 字符
        const estimatedProgress = Math.min(90, 40 + (chars / 8000) * 50);
        setProgress(estimatedProgress);
      } else {
        setProgress(60);
      }
    } else if (progressMessage?.includes('验证')) {
      setProgress(95);
    }
  }, [isGenerating, progressMessage]);

  if (!isGenerating && !error && !progressMessage) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-6">
      {error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5 shadow-lg animate-shake">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 mb-2 text-lg">⚠️ 生成失败</h3>
              <p className="text-red-700 leading-relaxed">{error}</p>
              <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>建议：</strong>
                  <br />• 检查网络连接是否正常
                  <br />• 确认 API 密钥是否有效
                  <br />• 尝试简化输入的概念描述
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : isGenerating ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="animate-spin h-7 w-7 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-800 mb-2 text-lg">
                🎨 AI 正在创造教学场景{dots}
              </h3>
              <p className="text-blue-700 mb-3 leading-relaxed">{progressMessage}</p>
              
              {/* 进度条 */}
              <div className="relative">
                <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 mt-1 inline-block font-medium">
                  {Math.round(progress)}% 完成
                </span>
              </div>
              
              {/* 提示信息 */}
              <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>💡 AI 正在做什么？</strong>
                  <br />• 分析您输入的概念并构建教学策略
                  <br />• 生成完整的 Three.js 3D 可视化代码
                  <br />• 确保代码安全性和教学有效性
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : progressMessage ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 shadow-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-800 mb-2 text-lg">✅ 生成成功！</h3>
              <p className="text-green-700 leading-relaxed">{progressMessage}</p>
            </div>
          </div>
        </div>
      ) : null}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
