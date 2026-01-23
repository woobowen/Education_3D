// 知识点输入面板
import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { useGeneration } from '../hooks/useGeneration';

export function InputPanel() {
  const [inputValue, setInputValue] = useState('');
  const { isGenerating, setCurrentConcept } = useAppStore();
  const { generate } = useGeneration();

  const exampleConcepts = [
    '二分查找',
    '快速排序',
    '广度优先搜索',
    '深度优先搜索',
    '动态规划',
    '哈希表',
    '二叉搜索树',
    '图的最短路径'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isGenerating) {
      setCurrentConcept(inputValue.trim());
      generate(inputValue.trim());
    }
  };

  const handleExampleClick = (concept: string) => {
    if (!isGenerating) {
      setInputValue(concept);
      setCurrentConcept(concept);
      generate(concept);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          EduVibe 3D
        </h1>
        <p className="text-gray-600 text-lg">
          输入任意计算机/编程知识点，AI 将为您生成专业的3D教学可视化
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ✨ 支持自动演示 • 参数控制 • 步骤说明 • 交互学习
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="例如：二分查找、快速排序、广度优先搜索..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !inputValue.trim()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                生成中...
              </span>
            ) : '🚀 开始生成'}
          </button>
        </div>
      </form>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-3">💡 或选择一个示例快速开始：</p>
        <div className="flex flex-wrap gap-2">
          {exampleConcepts.map((concept) => (
            <button
              key={concept}
              onClick={() => handleExampleClick(concept)}
              disabled={isGenerating}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {concept}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
