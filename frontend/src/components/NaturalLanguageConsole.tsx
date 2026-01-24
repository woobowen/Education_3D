// 自然语言控制台组件 - 使用 Gemini API
import { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'user' | 'system';
  text: string;
}

interface ControlAction {
  action: string;
  explanation: string;
  params?: any;
}

interface NaturalLanguageConsoleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function NaturalLanguageConsole({ isVisible, onToggle }: NaturalLanguageConsoleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([
    { type: 'system', text: '👋 你好!我是模型控制助手。' },
    { type: 'system', text: '💡 试试说:"增加复杂度"或"换个遍历方式"' }
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

  // 直接操作iframe DOM的辅助函数
  const executeInIframe = (callback: (doc: Document, win: Window) => void) => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentDocument || !iframe.contentWindow) {
      console.error('找不到iframe或无法访问');
      return false;
    }
    try {
      callback(iframe.contentDocument, iframe.contentWindow);
      return true;
    } catch (e) {
      console.error('执行iframe操作失败:', e);
      return false;
    }
  };

  // 逐步对比演示函数 - 增强版
  const performStepByStepComparison = async (
    doc: Document, 
    win: Window, 
    variants: string[], 
    comparisonDetails: any
  ) => {
    const variant1 = variants[0];
    const variant2 = variants[1];
    const variantNames: Record<string, string> = {
      'preorder': '前序遍历',
      'inorder': '中序遍历', 
      'postorder': '后序遍历'
    };
    const variantRules: Record<string, string> = {
      'preorder': '根→左→右',
      'inorder': '左→根→右',
      'postorder': '左→右→根'
    };
    const variantDescriptions: Record<string, string> = {
      'preorder': '先访问根节点，然后递归遍历左子树，最后遍历右子树。适合复制/克隆树结构。',
      'inorder': '先遍历左子树，然后访问根节点，最后遍历右子树。对于BST会得到有序（升序）序列。',
      'postorder': '先遍历左子树，然后遍历右子树，最后访问根节点。适合删除树或计算表达式树。'
    };

    // 获取控制元素
    const select = doc.getElementById('variant-type') as HTMLSelectElement
      || doc.querySelector('select[id*="variant"]') as HTMLSelectElement
      || doc.querySelector('select[id*="traversal"]') as HTMLSelectElement;
    
    const resetBtn = doc.querySelector('button[onclick*="reset"]') as HTMLButtonElement
      || doc.querySelector('button:contains("重置")') as HTMLButtonElement;
    
    const applyBtn = doc.querySelector('button[onclick*="applyParameters"]') as HTMLButtonElement
      || doc.querySelector('button:contains("应用")') as HTMLButtonElement;
    
    const playBtn = doc.querySelector('button[onclick*="autoPlay"]') as HTMLButtonElement
      || doc.querySelector('button:contains("自动演示")') as HTMLButtonElement;

    // 步骤1：先完全重置，确保从干净状态开始
    setHistory(prev => [...prev, { 
      type: 'system', 
      text: `🔄 正在准备对比演示...`
    }]);

    // 多次重置确保状态干净
    if (resetBtn) {
      resetBtn.click();
      await new Promise(r => setTimeout(r, 300));
      resetBtn.click();
    }
    await new Promise(r => setTimeout(r, 500));

    // 步骤2：演示第一种遍历
    setHistory(prev => [...prev, { 
      type: 'system', 
      text: `\n📍 **第一阶段**: ${variantNames[variant1]} (${variantRules[variant1]})\n${variantDescriptions[variant1]}`
    }]);

    if (select) {
      select.value = variant1;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    await new Promise(r => setTimeout(r, 300));

    if (applyBtn) applyBtn.click();
    await new Promise(r => setTimeout(r, 500));

    // 重置以确保遍历序号从1开始
    if (resetBtn) resetBtn.click();
    await new Promise(r => setTimeout(r, 500));

    // 自动播放第一种遍历
    if (playBtn) playBtn.click();

    // 等待演示完成（演示速度较慢，确保用户能看清）
    const waitTime = 10000;
    await new Promise(r => setTimeout(r, waitTime));

    setHistory(prev => [...prev, { 
      type: 'system', 
      text: `✅ ${variantNames[variant1]} 演示完成！\n\n⏳ 3秒后开始演示 ${variantNames[variant2]}...` 
    }]);

    // 暂停让用户有时间观察结果
    await new Promise(r => setTimeout(r, 3000));

    // 步骤3：完全重置，准备第二种遍历
    if (resetBtn) {
      resetBtn.click();
      await new Promise(r => setTimeout(r, 300));
      resetBtn.click();
    }
    await new Promise(r => setTimeout(r, 500));

    // 步骤4：演示第二种遍历
    setHistory(prev => [...prev, { 
      type: 'system', 
      text: `\n📍 **第二阶段**: ${variantNames[variant2]} (${variantRules[variant2]})\n${variantDescriptions[variant2]}`
    }]);

    if (select) {
      select.value = variant2;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    await new Promise(r => setTimeout(r, 300));

    if (applyBtn) applyBtn.click();
    await new Promise(r => setTimeout(r, 500));

    // 重置以确保遍历序号从1开始
    if (resetBtn) resetBtn.click();
    await new Promise(r => setTimeout(r, 500));

    // 自动播放第二种遍历
    if (playBtn) playBtn.click();

    await new Promise(r => setTimeout(r, waitTime));

    // 演示完成，显示详细对比总结
    const summaryMsg = `\n✅ **对比演示完成！**\n\n` +
      `📊 **对比总结**:\n\n` +
      `🔵 ${variantNames[variant1]} (${variantRules[variant1]}):\n` +
      `   ${variantDescriptions[variant1]}\n\n` +
      `🟢 ${variantNames[variant2]} (${variantRules[variant2]}):\n` +
      `   ${variantDescriptions[variant2]}\n\n` +
      `💡 **核心区别**: 根节点的访问时机不同！\n` +
      `   • 前序：根在最前面访问\n` +
      `   • 中序：根在中间访问\n` +
      `   • 后序：根在最后访问\n\n` +
      `🎯 **记忆技巧**: "前中后"指的是根节点的访问位置`;

    setHistory(prev => [...prev, { type: 'system', text: summaryMsg }]);
  };

  // 执行控制操作 - 同时使用postMessage和直接DOM操作确保兼容性
  const executeControlAction = (action: ControlAction) => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) {
      return;
    }

    switch (action.action) {
      case 'setParameter':
        // 设置单个参数 - 直接操作DOM
        executeInIframe((doc) => {
          const element = doc.getElementById(action.params?.name);
          if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
              (element as HTMLInputElement).value = action.params?.value?.toString() || '';
              element.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (element.tagName === 'SELECT') {
              (element as HTMLSelectElement).value = action.params?.value?.toString() || '';
              element.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
          // 点击应用参数按钮
          const applyBtn = doc.querySelector('button[onclick*="applyParameters"]') as HTMLButtonElement;
          if (applyBtn) applyBtn.click();
        });
        // 同时发送postMessage作为备用
        iframe.contentWindow.postMessage({
          type: 'setParameter',
          name: action.params?.name,
          value: action.params?.value
        }, '*');
        break;

      case 'setArray':
        // 设置数组参数
        executeInIframe((doc) => {
          const element = doc.getElementById('input-array') as HTMLInputElement;
          if (element) {
            element.value = action.params?.value?.toString() || '';
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const applyBtn = doc.querySelector('button[onclick*="applyParameters"]') as HTMLButtonElement;
          if (applyBtn) applyBtn.click();
        });
        iframe.contentWindow.postMessage({
          type: 'setArray',
          value: action.params?.value
        }, '*');
        break;

      case 'switchVariant':
        // 切换算法变体 - 直接操作DOM
        executeInIframe((doc) => {
          const select = doc.getElementById('variant-type') as HTMLSelectElement
            || doc.querySelector('select[id*="variant"]') as HTMLSelectElement
            || doc.querySelector('select[id*="traversal"]') as HTMLSelectElement;
          if (select && action.params?.variant) {
            select.value = action.params.variant;
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // 点击应用参数按钮
          const applyBtn = doc.querySelector('button[onclick*="applyParameters"]') as HTMLButtonElement;
          if (applyBtn) applyBtn.click();
        });
        iframe.contentWindow.postMessage({
          type: 'switchVariant',
          variant: action.params?.variant
        }, '*');
        break;

      case 'compareVariants':
        // 对比模式 - 创建并排的两个二叉树视图
        const variants = action.params?.variants as string[];
        const comparisonDetails = action.params?.comparisonDetails;
        
        if (variants && variants.length >= 2) {
          // 先添加对比说明到聊天记录
          if (comparisonDetails) {
            const explanationMsg = `📊 **对比模式启动**\n\n` +
              `🔵 左侧：${comparisonDetails.variant1?.name || '前序遍历'} (${comparisonDetails.variant1?.rule || '根→左→右'})\n` +
              `🟢 右侧：${comparisonDetails.variant2?.name || '中序遍历'} (${comparisonDetails.variant2?.rule || '左→根→右'})\n\n` +
              `💡 **核心区别**：${comparisonDetails.keyDifference || '访问根节点的时机不同'}`;
            
            setHistory(prev => [...prev, { type: 'system', text: explanationMsg }]);
          }
          
          // 发送对比模式消息到 iframe
          iframe.contentWindow.postMessage({
            type: 'enterCompareMode',
            variants: variants,
            comparisonDetails: comparisonDetails
          }, '*');
          
          // 执行 iframe 内部的对比模式
          const iframeDoc = iframe.contentDocument;
          const iframeWin = iframe.contentWindow;
          
          if (iframeDoc && iframeWin) {
            // 检查是否有对比模式函数
            if (typeof (iframeWin as any).enterCompareMode === 'function') {
              (iframeWin as any).enterCompareMode(variants, comparisonDetails);
            } else {
              // 如果没有对比模式，使用逐步对比方式
              performStepByStepComparison(iframeDoc, iframeWin, variants, comparisonDetails);
            }
          }
        }
        break;

      case 'playDemo':
        // 播放演示 - 直接操作DOM
        executeInIframe((doc) => {
          const playBtn = doc.querySelector('button[onclick*="autoPlay"]') as HTMLButtonElement;
          if (playBtn) playBtn.click();
        });
        iframe.contentWindow.postMessage({
          type: 'autoPlay'
        }, '*');
        break;

      case 'resetDemo':
        // 重置演示 - 直接操作DOM
        executeInIframe((doc) => {
          const resetBtn = doc.querySelector('button[onclick*="reset"]') as HTMLButtonElement;
          if (resetBtn) resetBtn.click();
        });
        iframe.contentWindow.postMessage({
          type: 'reset'
        }, '*');
        break;

      case 'switchToGodView':
        executeInIframe((doc) => {
          const btn = doc.querySelector('button[onclick*="switchToGodView"]') as HTMLButtonElement;
          if (btn) btn.click();
        });
        iframe.contentWindow.postMessage({
          type: 'switchToGodView'
        }, '*');
        break;

      case 'switchToDataView':
        executeInIframe((doc) => {
          const btn = doc.querySelector('button[onclick*="switchToDataView"]') as HTMLButtonElement;
          if (btn) btn.click();
        });
        iframe.contentWindow.postMessage({
          type: 'switchToDataView'
        }, '*');
        break;

      case 'stepDemo':
        // 单步演示
        executeInIframe((doc) => {
          const direction = action.params?.direction || 'next';
          if (direction === 'next') {
            const nextBtn = doc.querySelector('button[onclick*="nextStep"]') as HTMLButtonElement
              || doc.querySelector('button:has-text("下一步")') as HTMLButtonElement;
            if (nextBtn) nextBtn.click();
          } else {
            const prevBtn = doc.querySelector('button[onclick*="prevStep"]') as HTMLButtonElement
              || doc.querySelector('button:has-text("上一步")') as HTMLButtonElement;
            if (prevBtn) prevBtn.click();
          }
        });
        iframe.contentWindow.postMessage({
          type: 'stepDemo',
          direction: action.params?.direction || 'next'
        }, '*');
        break;

      case 'explain':
        // 仅解释，不执行操作
        break;

      default:
        console.warn('未知的操作类型:', action.action);
    }
  };

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
                  
                  // 尝试解析为控制指令
                  try {
                    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const controlAction: ControlAction = JSON.parse(jsonMatch[0]);
                      
                      // 显示解释
                      setHistory(prev => [...prev, { 
                        type: 'system', 
                        text: `🎮 ${controlAction.explanation}` 
                      }]);
                      
                      // 执行控制操作
                      executeControlAction(controlAction);
                    } else {
                      // 纯文本回复
                      setHistory(prev => [...prev, { type: 'system', text: fullResponse }]);
                    }
                  } catch (e) {
                    // 解析失败，作为普通文本显示
                    setHistory(prev => [...prev, { type: 'system', text: fullResponse }]);
                  }
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
    <>
      {/* 切换按钮 - 固定在右下角 */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
      >
        <span className="text-lg">🤖</span>
        {isVisible ? '收起' : 'AI控制'}
      </button>
      
      {/* 控制台面板 - 从底部弹出 */}
      {isVisible && (
        <div className="fixed bottom-20 right-6 w-80 h-[22rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200 z-40">
          {/* 标题栏 */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <h3 className="font-semibold text-sm">AI 模型控制</h3>
            </div>
            <button onClick={onToggle} className="text-white/80 hover:text-white">✕</button>
          </div>

          {/* 对话历史 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] px-3 py-2 rounded-xl ${
                    msg.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  <p className="text-xs whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* 显示正在流式输出的消息 */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[90%] px-3 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 shadow-sm">
                  <p className="text-xs whitespace-pre-line leading-relaxed">{streamingMessage}</p>
                  <span className="inline-block w-1.5 h-3 bg-purple-600 animate-pulse ml-1"></span>
                </div>
              </div>
            )}
            
            {/* 加载指示器 */}
            {isLoading && !streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例如：增加复杂度..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-xs"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs font-medium"
              >
                发送
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
