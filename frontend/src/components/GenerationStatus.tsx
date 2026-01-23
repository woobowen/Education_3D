// 生成狀態顯示
import { useAppStore } from '../stores/appStore';

export function GenerationStatus() {
  const { isGenerating, progressMessage, error } = useAppStore();

  if (!isGenerating && !error && !progressMessage) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-6">
      {error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">生成失敗</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : isGenerating ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">正在生成中</h3>
              <p className="text-blue-700">{progressMessage}</p>
            </div>
          </div>
        </div>
      ) : progressMessage ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-800 mb-1">成功</h3>
              <p className="text-green-700">{progressMessage}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
