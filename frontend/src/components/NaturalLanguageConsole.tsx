// 自然语言控制台组件
import { useState } from 'react';

export function NaturalLanguageConsole() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'user' | 'system'; text: string }>>([
    { type: 'system', text: '👋 欢迎使用自然语言控制台！您可以用中文指令控制演示，例如：' },
    { type: 'system', text: '• "展示二分查找在无序数组中会发生什么"' },
    { type: 'system', text: '• "把汉诺塔设为5层并演示最后一步"' },
    { type: 'system', text: '• "开始演示"、"下一步"、"暂停"等' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户输入到历史
    setHistory(prev => [...prev, { type: 'user', text: input }]);

    // 解析指令（这里可以集成更复杂的 NLP 逻辑）
    const response = parseCommand(input);
    
    // 添加系统回应到历史
    setHistory(prev => [...prev, { type: 'system', text: response }]);
    
    setInput('');
  };

  const parseCommand = (cmd: string): string => {
    const lower = cmd.toLowerCase();

    // 演示控制
    if (lower.includes('演示') || lower.includes('播放') || lower.includes('开始')) {
      postMessageToSandbox({ type: 'autoPlay' });
      return '✅ 正在自动演示...';
    }

    if (lower.includes('暂停') || lower.includes('停止')) {
      postMessageToSandbox({ type: 'pause' });
      return '⏸️ 已暂停演示';
    }

    if (lower.includes('下一步') || lower.includes('继续')) {
      postMessageToSandbox({ type: 'nextStep' });
      return '⏭️ 已执行下一步';
    }

    if (lower.includes('上一步') || lower.includes('回退')) {
      postMessageToSandbox({ type: 'prevStep' });
      return '⏮️ 已返回上一步';
    }

    if (lower.includes('重置') || lower.includes('重新开始')) {
      postMessageToSandbox({ type: 'reset' });
      return '🔄 已重置场景';
    }

    // 参数设置
    const arrayMatch = cmd.match(/数组.*?([0-9,，\s]+)/);
    if (arrayMatch) {
      const arrayStr = arrayMatch[1].replace(/，/g, ',').trim();
      postMessageToSandbox({ type: 'setArray', value: arrayStr });
      return `✅ 已设置数组为: ${arrayStr}`;
    }

    const layerMatch = cmd.match(/(\d+)\s*层/);
    if (layerMatch && (lower.includes('汉诺塔'))) {
      const layers = parseInt(layerMatch[1]);
      postMessageToSandbox({ type: 'setLayers', value: layers });
      return `✅ 已设置汉诺塔为 ${layers} 层`;
    }

    // 视角切换
    if (lower.includes('上帝视角') || lower.includes('俯视')) {
      postMessageToSandbox({ type: 'switchToGodView' });
      return '👁️ 已切换到上帝视角';
    }

    if (lower.includes('数据视角') || lower.includes('第一人称')) {
      postMessageToSandbox({ type: 'switchToDataView' });
      return '🔍  已切换到数据视角';
    }

    // 特殊场景
    if (lower.includes('无序') && lower.includes('二分')) {
      return '💡 好问题！二分查找要求数组必须有序。如果在无序数组上使用二分查找，可能会找不到目标值，即使它确实存在于数组中。让我展示一个例子...';
    }

    return '❓ 抱歉，我不太理解这个指令。您可以尝试：\n• "开始演示"\n• "下一步"\n• "设置数组为 1,2,3,4,5"\n• "切换到数据视角"';
  };

  const postMessageToSandbox = (message: any) => {
    // 尝试向 iframe 发送消息（如果需要与 3D 场景通信）
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, '*');
    }
  };

  return (
    <div className="fixed right-6 bottom-6 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold">自然语言控制台</h3>
      </div>

      {/* 对话历史 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入指令，例如：开始演示"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            发送
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 提示：试试 "开始演示"、"下一步"、"设置数组为 5,2,8,1,9"
        </p>
      </form>
    </div>
  );
}
