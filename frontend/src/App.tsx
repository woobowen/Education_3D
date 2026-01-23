// 主应用组件
import { InputPanel } from './components/InputPanel';
import { GenerationStatus } from './components/GenerationStatus';
import { Sandbox3D } from './components/Sandbox3D';
import { useAppStore } from './stores/appStore';

function App() {
  const { generatedHtml, isGenerating } = useAppStore();

  // 如果有生成的内容，全屏显示
  if (generatedHtml && !isGenerating) {
    return (
      <div className="min-h-screen">
        <Sandbox3D htmlContent={generatedHtml} isLoading={false} />
      </div>
    );
  }

  // 否则显示输入界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* 顶部输入区 */}
      <div className="bg-white shadow-sm">
        <InputPanel />
      </div>

      {/* 状态显示 */}
      <GenerationStatus />

      {/* 中间提示区 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="text-6xl mb-6">🎓</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            EduVibe 3D
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            AI驱动的3D互动教学可视化平台
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 text-left">
            <h3 className="font-semibold text-lg mb-3">✨ 特色功能：</h3>
            <ul className="space-y-2 text-gray-700">
              <li>🎮 <strong>自动演示</strong>：一键播放完整算法演示</li>
              <li>⚙️ <strong>参数控制</strong>：自定义输入数据和参数</li>
              <li>📖 <strong>步骤说明</strong>：每步都有详细的文字解释</li>
              <li>🎨 <strong>专业美学</strong>：现代化的视觉设计</li>
              <li>🔄 <strong>交互学习</strong>：手动控制演示进度</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        <p>
          EduVibe 3D - 让学习变得生动有趣 | 
          <a href="https://github.com" className="text-blue-600 hover:underline ml-1">GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
