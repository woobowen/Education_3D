// 自然语言控制台组件 - 使用 Gemini API
import { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'user' | 'system';
  text: string;
}

export function NaturalLanguageConsole() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([
    { type: 'system', text: '👋 你好!我是 EduVibe 3D 智能助手。' },
    { type: 'system', text: '我可以帮助你理解算法、数据结构和编程概念。' },
    { type: 'system', text: '💡 试试问我:"什么是二分查找?"或"快速排序的时间复杂度是多少?"' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, streamingMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // 添加用户消息
    setHistory(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: history.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'progress') {
                  fullResponse += data.content;
                  setStreamingMessage(fullResponse);
                } else if (data.type === 'complete') {
                  fullResponse = data.content;
                  setStreamingMessage('');
                  setHistory(prev => [...prev, { type: 'system', text: fullResponse }]);
                } else if (data.type === 'error') {
                  setStreamingMessage('');
                  setHistory(prev => [...prev, { 
                    type: 'system', 
                    text: `❌ 错误: ${data.message}` 
                  }]);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('聊天错误:', error);
      setStreamingMessage('');
      setHistory(prev => [...prev, { 
        type: 'system', 
        text: `❌ 连接失败: ${error instanceof Error ? error.message : '未知错误'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200 z-50">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold">智能助手 (Gemini)</h3>
      </div>

      {/* 对话历史 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {/* 显示正在流式输出的消息 */}
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-2 rounded-2xl bg-white text-gray-800 border border-gray-200 shadow-sm">
              <p className="text-sm whitespace-pre-line leading-relaxed">{streamingMessage}</p>
              <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1"></span>
            </div>
          </div>
        )}
        
        {/* 加载指示器 */}
        {isLoading && !streamingMessage && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问我任何关于编程的问题..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
          >
            发送
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 提示：试试问"什么是快速排序?"
        </p>
      </form>
    </div>
  );
}
