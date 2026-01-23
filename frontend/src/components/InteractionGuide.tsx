// 互動指南面板
import { useState } from 'react';
import { useAppStore } from '../stores/appStore';

export function InteractionGuide() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { interactionGuide, aestheticAnalysis, educationalRationale } = useAppStore();

  if (!interactionGuide || interactionGuide.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-6 right-6 max-w-md z-10">
      <div className={`bg-white rounded-lg shadow-2xl border-2 border-gray-200 transition-all ${isExpanded ? 'max-h-[600px]' : 'max-h-16'} overflow-hidden`}>
        {/* 標題欄 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-gray-800">互動指南</h3>
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

        {/* 內容區 */}
        <div className="px-5 pb-5 overflow-y-auto max-h-[520px]">
          {/* 互動方式 */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">可用的互動方式：</h4>
            <ul className="space-y-2">
              {interactionGuide.map((guide, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 教育設計理念 */}
          {educationalRationale && (
            <div className="mb-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">設計理念：</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{educationalRationale}</p>
            </div>
          )}

          {/* 美學分析 */}
          {aestheticAnalysis && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">美學設計：</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">藝術風格：</span>
                  <span className="text-gray-600 ml-2">{aestheticAnalysis.aesthetic_decision.art_movement}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">材質風格：</span>
                  <span className="text-gray-600 ml-2">{aestheticAnalysis.aesthetic_decision.material_style}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">配色方案：</span>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(aestheticAnalysis.aesthetic_decision.color_palette).map(([name, color]) => (
                      <div key={name} className="flex items-center gap-1">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color.split(' ')[0] }}
                          title={name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
