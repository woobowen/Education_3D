// 知识点输入面板
import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { useGeneration } from '../hooks/useGeneration';

export function InputPanel() {
  const [inputValue, setInputValue] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    age: 16,
    gender: 'male',
    programmingLanguage: 'Python',
    studyCycle: '3h/day',
    difficulty: 'beginner',
    learningGoal: '理解基本原理'
  });
  const { isGenerating, setCurrentConcept } = useAppStore();
  const { generate } = useGeneration();

  const parseProfile = async (text: string) => {
    try {
      // Use full URL for robustness, or rely on proxy. Assuming proxy is set up or same origin.
      // In Vite dev, we might need to be careful, but usually /api works if proxy is configured.
      // Based on backend setup, it listens on port 3000. Frontend likely on 5173.
      // Vite config usually proxies /api to localhost:3000.
      const response = await fetch('/api/parse-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(prev => ({ ...prev, ...profile }));
        setShowProfile(true);
      }
    } catch (error) {
      console.error('Failed to parse profile:', error);
    }
  };

  useEffect(() => {
    // 1. Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const profileText = params.get('profileText');
    if (profileText) {
      parseProfile(profileText);
      // Optional: Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // 2. Listen for window messages (for iframe/embed scenarios)
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_PROFILE' && typeof event.data.text === 'string') {
        parseProfile(event.data.text);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
      generate(inputValue.trim(), userProfile);
    }
  };

  const handleExampleClick = (concept: string) => {
    if (!isGenerating) {
      setInputValue(concept);
      setCurrentConcept(concept);
      generate(concept, userProfile);
    }
  };

  const handleProfileChange = (key: string, value: any) => {
    setUserProfile(prev => ({ ...prev, [key]: value }));
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

      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button 
          type="button"
          onClick={() => setShowProfile(!showProfile)}
          className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-sm text-gray-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            👤 个性化学习设置 (根据您的画像调整教学风格)
          </span>
          <span>{showProfile ? '收起 ▲' : '展开 ▼'}</span>
        </button>
        
        {showProfile && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 animate-fadeIn">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">年龄</label>
              <input 
                type="number" 
                value={userProfile.age}
                onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">编程语言</label>
              <select 
                value={userProfile.programmingLanguage}
                onChange={(e) => handleProfileChange('programmingLanguage', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Python">Python</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Go">Go</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">难度</label>
              <select 
                value={userProfile.difficulty}
                onChange={(e) => handleProfileChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="beginner">入门 (通俗易懂)</option>
                <option value="intermediate">进阶 (标准教学)</option>
                <option value="advanced">专家 (底层原理)</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">学习目标</label>
              <input 
                type="text" 
                value={userProfile.learningGoal}
                onChange={(e) => handleProfileChange('learningGoal', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="例如：应付期末考试、面试准备、兴趣学习..."
              />
            </div>
          </div>
        )}
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
