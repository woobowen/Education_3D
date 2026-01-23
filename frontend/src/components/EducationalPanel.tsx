// 教育性信息面板 - 显示算法复杂度、学习建议等
import { useState } from 'react';

interface EducationalPanelProps {
  concept: string;
}

export function EducationalPanel({ concept }: EducationalPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 这里可以从 AI 生成的内容中提取教育信息
  // 现在先用硬编码的示例数据
  const educationalInfo = {
    coreConcept: '通过不断将搜索范围减半来快速定位目标值的高效查找算法',
    applications: [
      '数据库索引查询',
      '字典和词典的查找',
      '版本控制系统中的二分提交查找'
    ],
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    learningTips: [
      '理解"减半"的核心思想：每次比较都能排除一半的数据',
      '常见误区：二分查找必须在有序数组上使用',
      '实践建议：手动追踪每一步的 left、right、mid 值来加深理解'
    ],
    relatedConcepts: [
      '线性搜索',
      '插值查找',
      '二叉搜索树',
      '跳表'
    ]
  };

  return (
    <div className="absolute top-6 left-6 max-w-md z-10">
      <div className={`bg-white rounded-lg shadow-2xl border-2 border-purple-200 transition-all ${isExpanded ? 'max-h-[700px]' : 'max-h-16'} overflow-hidden`}>
        {/* 标题栏 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h3 className="font-semibold text-gray-800">学习指南</h3>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 内容区 */}
        <div className="px-5 pb-5 overflow-y-auto max-h-[620px]">
          {/* 核心概念 */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <span>💡</span> 核心概念
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {educationalInfo.coreConcept}
            </p>
          </div>

          {/* 复杂度分析 */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>⏱️</span> 复杂度分析
            </h4>
            
            <div className="space-y-2">
              {/* 时间复杂度 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-semibold text-gray-700 mb-2 text-sm">时间复杂度</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-green-100 rounded border border-green-200">
                    <div className="text-green-800 font-semibold">最好</div>
                    <div className="text-green-700 font-mono">{educationalInfo.timeComplexity.best}</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-100 rounded border border-yellow-200">
                    <div className="text-yellow-800 font-semibold">平均</div>
                    <div className="text-yellow-700 font-mono">{educationalInfo.timeComplexity.average}</div>
                  </div>
                  <div className="text-center p-2 bg-red-100 rounded border border-red-200">
                    <div className="text-red-800 font-semibold">最坏</div>
                    <div className="text-red-700 font-mono">{educationalInfo.timeComplexity.worst}</div>
                  </div>
                </div>
              </div>

              {/* 空间复杂度 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-semibold text-gray-700 mb-1 text-sm">空间复杂度</div>
                <div className="text-purple-700 font-mono text-sm font-semibold">
                  {educationalInfo.spaceComplexity}
                </div>
              </div>
            </div>
          </div>

          {/* 适用场景 */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>🎯</span> 适用场景
            </h4>
            <ul className="space-y-1">
              {educationalInfo.applications.map((app, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 学习建议 */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>✨</span> 学习建议
            </h4>
            <ol className="space-y-2">
              {educationalInfo.learningTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 相关概念 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>🔗</span> 相关概念
            </h4>
            <div className="flex flex-wrap gap-2">
              {educationalInfo.relatedConcepts.map((concept, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
