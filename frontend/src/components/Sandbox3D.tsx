// 3D 沙箱渲染容器 - 全屏显示
import { useRef, useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { InteractionGuide } from './InteractionGuide';
import { NaturalLanguageConsole } from './NaturalLanguageConsole';

interface Sandbox3DProps {
  htmlContent: string;
  isLoading: boolean;
}

export function Sandbox3D({ htmlContent, isLoading }: Sandbox3DProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { reset, currentConcept } = useAppStore();
  const [showNLConsole, setShowNLConsole] = useState(false);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-700 text-xl font-medium">正在生成教学可视化...</p>
          <p className="text-gray-500 text-sm mt-2">AI 正在分析概念并创建3D场景</p>
        </div>
      </div>
    );
  }

  if (!htmlContent) {
    return null;
  }

  return (
    <div className="relative w-screen h-screen">
      {/* 左下角返回按钮 */}
      <button
        onClick={() => reset()}
        className="absolute bottom-6 left-6 z-50 bg-white text-gray-700 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回首页
      </button>
      
      {/* 交互指南 */}
      <InteractionGuide />

      {/* 全屏 iframe */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin"
        srcDoc={htmlContent}
        className="w-full h-full border-none"
        title="3D Interactive Visualization"
      />
      
      {/* 自然语言控制台 - 固定在右下角，不遮挡模型名称 */}
      <NaturalLanguageConsole isVisible={showNLConsole} onToggle={() => setShowNLConsole(!showNLConsole)} />
    </div>
  );
}
