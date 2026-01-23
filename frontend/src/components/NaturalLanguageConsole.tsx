// 自然語言控制台組件
import { useState } from 'react';

export function NaturalLanguageConsole() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'user' | 'system'; text: string }>>([
    { type: 'system', text: '👋 歡迎使用自然語言控制台！您可以用中文指令控制演示，例如：' },
    { type: 'system', text: '• "展示二分查找在無序數組中會發生什麼"' },
    { type: 'system', text: '• "把汉诺塔設為5層並演示最後一步"' },
    { type: 'system', text: '• "開始演示"、"下一步"、"暫停"等' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用戶輸入到歷史
    setHistory(prev => [...prev, { type: 'user', text: input }]);

    // 解析指令（這裡可以集成更複雜的 NLP 邏輯）
    const response = parseCommand(input);
    
    // 添加系統回應到歷史
    setHistory(prev => [...prev, { type: 'system', text: response }]);
    
    setInput('');
  };

  const parseCommand = (cmd: string): string => {
    const lower = cmd.toLowerCase();

    // 演示控制
    if (lower.includes('演示') || lower.includes('播放') || lower.includes('開始')) {
      postMessageToSandbox({ type: 'autoPlay' });
      return '✅ 正在自動演示...';
    }

    if (lower.includes('暫停') || lower.includes('停止')) {
      postMessageToSandbox({ type: 'pause' });
      return '⏸️ 已暫停演示';
    }

    if (lower.includes('下一步') || lower.includes('繼續')) {
      postMessageToSandbox({ type: 'nextStep' });
      return '⏭️ 已執行下一步';
    }

    if (lower.includes('上一步') || lower.includes('回退')) {
      postMessageToSandbox({ type: 'prevStep' });
      return '⏮️ 已返回上一步';
    }

    if (lower.includes('重置') || lower.includes('重新開始')) {
      postMessageToSandbox({ type: 'reset' });
      return '🔄 已重置場景';
    }

    // 參數設置
    const arrayMatch = cmd.match(/數組.*?([0-9,，\s]+)/);
    if (arrayMatch) {
      const arrayStr = arrayMatch[1].replace(/，/g, ',').trim();
      postMessageToSandbox({ type: 'setArray', value: arrayStr });
      return `✅ 已設置數組為: ${arrayStr}`;
    }

    const layerMatch = cmd.match(/(\d+)\s*層/);
    if (layerMatch && (lower.includes('漢諾塔') || lower.includes('汉诺塔'))) {
      const layers = parseInt(layerMatch[1]);
      postMessageToSandbox({ type: 'setLayers', value: layers });
      return `✅ 已設置漢諾塔為 ${layers} 層`;
    }

    // 視角切換
    if (lower.includes('上帝視角') || lower.includes('俯視')) {
      postMessageToSandbox({ type: 'switchToGodView' });
      return '👁️ 已切換到上帝視角';
    }

    if (lower.includes('數據視角') || lower.includes('第一人稱')) {
      postMessageToSandbox({ type: 'switchToDataView' });
      return '🔍 已切換到數據視角';
    }

    // 特殊場景
    if (lower.includes('無序') && lower.includes('二分')) {
      return '💡 好問題！二分查找要求數組必須有序。如果在無序數組上使用二分查找，可能會找不到目標值，即使它確實存在於數組中。讓我展示一個例子...';
    }

    return '❓ 抱歉，我不太理解這個指令。您可以嘗試：\n• "開始演示"\n• "下一步"\n• "設置數組為 1,2,3,4,5"\n• "切換到數據視角"';
  };

  const postMessageToSandbox = (message: any) => {
    // 嘗試向 iframe 發送消息（如果需要與 3D 場景通信）
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, '*');
    }
  };

  return (
    <div className="fixed right-6 bottom-6 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200">
      {/* 標題欄 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold">自然語言控制台</h3>
      </div>

      {/* 對話歷史 */}
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

      {/* 輸入框 */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="輸入指令，例如：開始演示"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            發送
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 提示：試試 "開始演示"、"下一步"、"設置數組為 5,2,8,1,9"
        </p>
      </form>
    </div>
  );
}
