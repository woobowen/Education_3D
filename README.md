# EduVibe 3D - AI 驅動的 3D 互動教學可視化平台

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

**讓學習變得生動有趣，用 3D 可視化理解複雜概念**

[功能特色](#功能特色) • [技術架構](#技術架構) • [快速開始](#快速開始) • [專案結構](#專案結構) • [開發指南](#開發指南)

</div>

---

## 📖 專案概述

EduVibe 3D 是一個突破性的教育技術應用，通過 AI 技術將抽象的計算機科學概念轉化為互動式 3D 可視化體驗。

### 🎯 核心理念

**輸入** → 任意計算機/編程知識點（如「快速排序」、「二分查找」、「廣度優先搜索」）  
**輸出** → 包含自動演示、參數控制、步驟說明的專業 3D 互動教學場景

### 🌟 功能特色

| 功能 | 描述 |
|------|------|
| 🎮 **自動演示** | 一鍵播放完整算法演示，循序漸進展示每個步驟 |
| ⚙️ **參數控制** | 自定義輸入數據和參數，親自驗證算法邏輯 |
| 📖 **步驟說明** | 每個步驟都有詳細的文字解釋，理解背後原理 |
| 🎨 **專業美學** | 現代化的視覺設計，採用教育友好的配色方案 |
| 🔄 **交互學習** | 手動控制演示進度（播放/暫停/步進） |
| 🔒 **安全沙箱** | iframe 隔離執行生成的代碼，確保安全性 |

---

## 🏗️ 技術架構

### 前端技術棧

```
React 18 + TypeScript    → 現代化的 UI 開發
Vite 5                   → 極速的開發構建工具
Tailwind CSS             → 實用優先的 CSS 框架
Zustand                  → 輕量級狀態管理
Three.js                 → 3D 圖形渲染（通過本地庫加載）
```

### 後端技術棧

```
Node.js 20+              → 高性能 JavaScript 運行時
Express.js               → 簡潔的 Web 框架
Server-Sent Events       → 實時流式響應
OpenAI SDK               → 調用 MiniMax AI API
TypeScript               → 類型安全的開發體驗
```

### AI 引擎

- **模型**: MiniMax M2.1（通過 OpenAI 兼容接口）
- **核心能力**: 語義理解 + 代碼生成 + 教學設計
- **生成內容**: 完整的 HTML + Three.js 3D 場景 + 教學步驟系統

---

## 🚀 快速開始

### 前置要求

- Node.js >= 20.0.0
- npm 或 yarn
- MiniMax API Key（用於 AI 生成功能）

### 1️⃣ 安裝依賴

```bash
# 克隆專案
git clone <repository-url>
cd Education_3D

# 安裝所有依賴（根目錄 + 前端 + 後端）
npm install
```

### 2️⃣ 配置環境變量

創建 `.env` 文件在專案根目錄：

```bash
# 複製示例文件
cp .env.example .env
```

編輯 `.env` 文件，填入你的 MiniMax API Key：

```env
MINIMAX_API_KEY=your-api-key-here
MINIMAX_BASE_URL=https://vip.dmxapi.com/v1
MINIMAX_MODEL=gpt-4o
PORT=3000
```

### 3️⃣ 啟動開發服務器

```bash
# 同時啟動前端和後端
npm run dev

# 或分別啟動
npm run dev:backend   # 後端運行在 http://localhost:3000
npm run dev:frontend  # 前端運行在 http://localhost:5173
```

### 4️⃣ 訪問應用

打開瀏覽器訪問 [http://localhost:5173](http://localhost:5173)

---

## 📁 專案結構

```
Education_3D/
│
├── frontend/                      # React 前端應用
│   ├── src/
│   │   ├── components/           # UI 組件
│   │   │   ├── InputPanel.tsx   # 知識點輸入面板
│   │   │   ├── Sandbox3D.tsx    # 3D 沙箱渲染容器
│   │   │   ├── GenerationStatus.tsx  # 生成狀態顯示
│   │   │   └── InteractionGuide.tsx  # 互動指南面板
│   │   ├── hooks/               # 自定義 Hooks
│   │   │   └── useGeneration.ts # SSE 連接管理
│   │   ├── stores/              # 狀態管理
│   │   │   └── appStore.ts      # Zustand 全局狀態
│   │   ├── App.tsx              # 主應用組件
│   │   ├── main.tsx             # 應用入口
│   │   └── index.css            # 全局樣式
│   ├── index.html               # HTML 模板
│   ├── vite.config.ts           # Vite 配置
│   ├── tailwind.config.js       # Tailwind 配置
│   └── package.json             # 前端依賴
│
├── backend/                      # Express 後端服務
│   ├── src/
│   │   ├── routes/              # API 路由
│   │   │   └── generate.ts      # 生成 API（SSE 流式響應）
│   │   ├── services/            # 業務邏輯
│   │   │   ├── minimax.ts       # MiniMax API 調用
│   │   │   └── promptEngine.ts  # 提示詞構建引擎
│   │   ├── utils/               # 工具函數
│   │   │   ├── codeExtractor.ts # 從 AI 響應提取代碼
│   │   │   └── validator.ts     # 代碼安全驗證
│   │   └── index.ts             # 服務器入口
│   ├── public/                  # 靜態文件
│   │   └── libs/                # Three.js 本地庫文件
│   │       ├── three.min.js     # Three.js 核心
│   │       ├── OrbitControls.js # 軌道控制器
│   │       ├── CSS2DRenderer.js # CSS 2D 渲染器
│   │       └── tween.umd.js     # 補間動畫庫
│   ├── tsconfig.json            # TypeScript 配置
│   └── package.json             # 後端依賴
│
├── shared/                       # 共享類型定義
│   └── types.ts                  # TypeScript 接口
│
├── .env.example                  # 環境變量示例
├── .gitignore                    # Git 忽略文件
├── package.json                  # 根目錄依賴（工作空間配置）
└── README.md                     # 專案文檔
```

---

## 🔄 核心工作流程

### 1. 用戶輸入知識點

用戶在前端輸入框輸入想要學習的概念，如「快速排序」。

### 2. 前端發起請求

```typescript
// frontend/src/hooks/useGeneration.ts
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ concept: '快速排序' })
});
```

### 3. 後端構建提示詞

```typescript
// backend/src/services/promptEngine.ts
const systemPrompt = buildSystemPrompt();  // 包含教學設計規範
const userPrompt = buildUserPrompt(concept);  // 包含用戶輸入的概念
```

### 4. 調用 MiniMax AI

```typescript
// backend/src/services/minimax.ts
await generateVisualization(systemPrompt, userPrompt, {
  onProgress: (chunk) => { /* 流式輸出進度 */ },
  onComplete: (fullContent) => { /* 生成完成 */ }
});
```

### 5. 提取並驗證代碼

```typescript
// backend/src/utils/codeExtractor.ts
const extracted = extractContent(fullContent);  // 提取 HTML 代碼

// backend/src/utils/validator.ts
const validation = validateGeneratedCode(extracted.htmlCode);  // 安全驗證
```

### 6. 返回結果給前端

通過 Server-Sent Events (SSE) 流式返回：
- 進度消息
- 完整的 HTML 代碼
- 美學分析
- 互動指南

### 7. 前端渲染 3D 場景

```typescript
// frontend/src/components/Sandbox3D.tsx
<iframe
  sandbox="allow-scripts allow-same-origin"
  srcDoc={htmlContent}  // 安全地渲染生成的 HTML
/>
```

---

## 📦 核心模塊詳解

### 1. 提示詞引擎 (`promptEngine.ts`)

**職責**: 構建發送給 AI 的提示詞，包含：
- 教學設計原則
- 視覺設計規範
- 代碼生成模板
- 安全性要求

**關鍵特性**:
- 強調教學第一，3D 是手段不是目的
- 要求生成自動演示系統
- 提供參數控制和步驟說明
- 使用教育友好的配色方案（浅色背景，高對比度）

### 2. 代碼提取器 (`codeExtractor.ts`)

**職責**: 從 AI 生成的 Markdown 響應中提取結構化內容。

**提取內容**:
- HTML 代碼塊（在 \`\`\`html 標籤內）
- 美學分析 JSON
- 教育設計理念
- 互動指南列表

### 3. 安全驗證器 (`validator.ts`)

**職責**: 驗證生成的 HTML 代碼是否安全。

**檢查項目**:
- ❌ 禁止使用 localStorage / sessionStorage
- ❌ 禁止訪問 cookie / parent / top 窗口
- ❌ 禁止使用 eval / Function 構造器
- ⚠️ 警告使用 innerHTML（XSS 風險）
- ✅ 白名單檢查外部腳本來源

**自動修復**:
- 註釋掉危險的 API 調用
- 嘗試修復常見的安全問題

### 4. 狀態管理 (`appStore.ts`)

**職責**: 使用 Zustand 管理全局狀態。

**狀態項目**:
```typescript
{
  currentConcept: string;        // 當前知識點
  isGenerating: boolean;         // 是否正在生成
  progressMessage: string;       // 進度消息
  generatedHtml: string | null;  // 生成的 HTML
  aestheticAnalysis: object;     // 美學分析
  educationalRationale: string;  // 教育設計理念
  interactionGuide: string[];    // 互動指南
  error: string | null;          // 錯誤信息
}
```

---

## 🛠️ 開發指南

### 本地開發

```bash
# 監聽文件變化，自動重啟
npm run dev

# 僅啟動後端（帶 TypeScript 監聽）
npm run dev:backend

# 僅啟動前端（帶 HMR）
npm run dev:frontend
```

### 構建生產版本

```bash
# 構建所有（後端 + 前端）
npm run build

# 僅構建後端
npm run build:backend  # 輸出到 backend/dist/

# 僅構建前端
npm run build:frontend  # 輸出到 frontend/dist/
```

### 啟動生產環境

```bash
# 先構建
npm run build

# 啟動後端生產服務器
cd backend
npm start  # 運行 node dist/index.js

# 前端部署 frontend/dist/ 到靜態服務器（如 Nginx）
```

### 添加新的 Three.js 庫

如果需要添加新的 Three.js 擴展庫：

1. 下載庫文件到 `backend/public/libs/`
2. 在 `promptEngine.ts` 的模板中添加引用：
   ```html
   <script src="http://localhost:3000/libs/new-library.js"></script>
   ```
3. 在 `validator.ts` 中確保白名單包含該庫

---

## 🐛 常見問題

### Q1: 提示 "未設置 MINIMAX_API_KEY 環境變量"

**解決方案**:
1. 在專案根目錄創建 `.env` 文件
2. 添加 `MINIMAX_API_KEY=your-api-key`
3. 重啟後端服務器

### Q2: 前端無法連接後端

**檢查清單**:
- [ ] 後端是否已啟動（預設端口 3000）
- [ ] 防火牆是否阻止了端口
- [ ] Vite 代理配置是否正確（`vite.config.ts`）

### Q3: 生成的 3D 場景無法顯示

**可能原因**:
1. Three.js 庫文件未正確加載
   - 檢查 `backend/public/libs/` 是否包含所有庫文件
   - 檢查瀏覽器控制台是否有 404 錯誤
2. iframe 沙箱權限不足
   - 確保 `sandbox="allow-scripts allow-same-origin"`
3. 生成的代碼有錯誤
   - 查看瀏覽器控制台的錯誤信息

### Q4: 如何調試 AI 生成的代碼？

**方法**:
1. 打開瀏覽器開發者工具
2. 切換到包含 iframe 的元素
3. 在 Console 中可以看到 iframe 內的錯誤
4. 或者將 `htmlContent` 保存為獨立 HTML 文件進行調試

---

## 🔐 安全性說明

### Iframe 沙箱

生成的 HTML 運行在 iframe 中，並啟用了以下沙箱限制：
```html
<iframe sandbox="allow-scripts allow-same-origin" ...>
```

### 代碼驗證

所有生成的代碼都會經過 `validator.ts` 的安全檢查，禁止：
- 訪問本地存儲
- 訪問父窗口
- 執行危險函數（eval、Function 構造器）

### 環境變量保護

API Key 通過環境變量管理，`.env` 文件已添加到 `.gitignore`，不會被提交到版本控制。

---

## 🎓 教學設計理念

### 核心原則

1. **教學第一**: 每個視覺元素都服務於教學目標
2. **循序漸進**: 通過自動演示逐步展示算法步驟
3. **參數可控**: 讓學生自定義數據來驗證理解
4. **文字說明**: 每一步都有清晰的解釋

### 視覺設計規範

- **背景**: 使用淺色漸變（#f0f4f8），絕不使用黑色
- **配色**: 高對比度、清晰易辨
  - 未激活: 淺灰藍 #94a3b8
  - 處理中: 鮮明橙色 #f59e0b
  - 已完成: 鮮綠色 #10b981
- **標注**: 深色文字 #1e293b，字體至少 18px
- **佈局**: 左側 75% 3D 畫布 + 右側 25% 控制面板

---

## 📄 授權協議

本專案採用 MIT 授權協議。詳見 [LICENSE](LICENSE) 文件。

---

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 本倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

---

## 📧 聯繫方式

如有問題或建議，請通過以下方式聯繫：

- GitHub Issues: [專案 Issues 頁面](https://github.com/your-repo/issues)
- Email: your-email@example.com

---

<div align="center">

**用 AI 讓學習更生動，用 3D 讓知識更具象** 🎓✨

Made with ❤️ by EduVibe Team

</div>
