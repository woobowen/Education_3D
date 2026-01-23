# Education_3D 项目指南

## 📋 项目概述

**Education_3D** 是一个 AI 驱动的 3D 互动教学可视化平台，通过 MiniMax AI 自动生成 Three.js 教学场景。

**核心流程**：
```
用户输入概念 → AI生成HTML/Three.js代码 → 验证安全性 → iframe渲染 → 3D教学场景
```

**技术栈**：
- 前端：React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- 后端：Node.js + Express + TypeScript + SSE
- AI：MiniMax M2.1 (gpt-4o)
- 3D：Three.js + OrbitControls + CSS2DRenderer + Tween.js

---

## 📂 目录结构

```
Education_3D/
├── frontend/                    # React 前端应用
│   ├── src/
│   │   ├── components/          # UI组件
│   │   │   ├── InputPanel.tsx           # 输入面板
│   │   │   ├── Sandbox3D.tsx            # 3D渲染容器（iframe）
│   │   │   ├── GenerationStatus.tsx     # 生成状态显示
│   │   │   ├── InteractionGuide.tsx     # 交互指南
│   │   │   └── NaturalLanguageConsole.tsx  # 自然语言控制台
│   │   ├── hooks/
│   │   │   └── useGeneration.ts         # SSE连接管理
│   │   ├── stores/
│   │   │   └── appStore.ts              # Zustand全局状态
│   │   ├── App.tsx                      # 主应用组件
│   │   ├── main.tsx                     # 应用入口
│   │   └── index.css                    # 全局样式
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # Express 后端服务
│   ├── src/
│   │   ├── routes/
│   │   │   └── generate.ts              # POST /api/generate (SSE)
│   │   ├── services/
│   │   │   ├── minimax.ts               # MiniMax API调用
│   │   │   └── promptEngine.ts          # 提示词构建（1500行规范）
│   │   ├── utils/
│   │   │   ├── codeExtractor.ts         # 从AI响应提取代码
│   │   │   └── validator.ts             # 代码安全验证
│   │   └── index.ts                     # 服务器入口
│   ├── public/libs/             # Three.js本地库文件
│   │   ├── three.min.js
│   │   ├── OrbitControls.js
│   │   ├── CSS2DRenderer.js             # 已修复：继承THREE.Object3D
│   │   └── tween.umd.js
│   ├── tsconfig.json
│   └── package.json
│
├── shared/
│   └── types.ts                 # 共享TypeScript类型定义
│
├── .env.example                 # 环境变量示例
├── .gitignore
├── package.json                 # 根工作空间配置
└── PROJECT_GUIDE.md            # 本文档
```

---

## 🔄 核心工作流程

### 完整请求流程

```
1. 用户输入 → InputPanel.tsx
   ↓
2. 触发生成 → appStore.ts (generate action)
   ↓
3. SSE连接 → POST /api/generate
   ↓
4. 构建提示词 → promptEngine.ts (buildSystemPrompt + buildUserPrompt)
   ↓
5. 调用AI → minimax.ts (流式响应)
   ↓
6. 提取代码 → codeExtractor.ts (extractContent)
   ↓
7. 安全验证 → validator.ts (validateGeneratedCode)
   ↓
8. 返回结果 → SSE stream
   ↓
9. 前端接收 → appStore.ts (更新状态)
   ↓
10. 渲染场景 → Sandbox3D.tsx (iframe + srcDoc)
```

### 数据流

```typescript
// 1. 用户输入
{ concept: "快速排序" }

// 2. SSE消息流
{ type: "progress", message: "正在构建提示词..." }
{ type: "progress", message: "正在调用AI..." }
{ type: "progress", message: "生成中... (500字符)" }
{ type: "progress", message: "正在提取代码..." }
{ type: "complete", htmlContent: "<!DOCTYPE html>...", ... }

// 3. 前端状态
{
  currentConcept: "快速排序",
  isGenerating: false,
  generatedHtml: "<!DOCTYPE html>...",
  error: null
}
```

---

## 🔑 关键模块说明

### 1. 前端状态管理 (appStore.ts)

使用 Zustand 管理全局状态：

```typescript
interface AppState {
  currentConcept: string;           // 当前知识点
  isGenerating: boolean;            // 是否生成中
  progressMessage: string;          // 进度消息
  generatedHtml: string | null;     // 生成的HTML
  error: string | null;             // 错误信息
  
  generate: (concept: string) => Promise<void>;  // 生成动作
  reset: () => void;                             // 重置
}
```

**核心方法**：`generate()` - 建立SSE连接，接收流式响应

### 2. 提示词引擎 (promptEngine.ts)

**职责**：构建发送给AI的提示词（约1500行详细规范）

**包含内容**：
- 教学设计原则（教学第一、循序渐进、参数可控）
- 视觉美学标准（配色、材质、灯光、布局）
- HTML代码模板（左75%画布 + 右25%控制面板）
- JavaScript逻辑模板（Three.js初始化、步骤系统、自动演示）
- 特定算法处理模板（二叉树、汉诺塔等）
- 错误预防清单（函数定义、全局对象、防止undefined）

**关键函数**：
- `buildSystemPrompt()` - 系统提示词（规范和模板）
- `buildUserPrompt(concept)` - 用户提示词（知识点和要求）

### 3. 代码提取器 (codeExtractor.ts)

从AI的Markdown响应中提取结构化内容：

```typescript
interface ExtractedContent {
  htmlCode: string;              // HTML代码块
  aestheticAnalysis: string;     // 美学分析JSON
  educationalRationale: string;  // 教育设计理念
  interactionGuide: string;      // 交互指南
}
```

**提取方法**：使用正则表达式匹配 `\`\`\`html` 代码块

### 4. 安全验证器 (validator.ts)

**验证规则**：
- ❌ 禁止 localStorage/sessionStorage
- ❌ 禁止访问 parent/top 窗口
- ❌ 禁止 document.cookie
- ❌ 禁止 eval/Function 构造器
- ⚠️ 警告 innerHTML（XSS风险）
- ✅ 外部脚本白名单检查（仅允许 localhost:3000）

**自动修复**：
```typescript
autoFixCode(code) {
  // 注释掉危险API调用
  code = code.replace(/localStorage/g, '/* REMOVED: localStorage */');
  code = code.replace(/parent\./g, '/* REMOVED: parent. */');
  return code;
}
```

### 5. CSS2D渲染器 (CSS2DRenderer.js)

**已修复**：CSS2DObject 现在正确继承 THREE.Object3D

```javascript
class CSS2DObject extends THREE.Object3D {
  constructor(element) {
    super();  // 调用父类构造函数
    this.element = element;
    this.isCSS2DObject = true;  // 标记类型
  }
}
```

**渲染逻辑**：
- 更新世界矩阵 `updateMatrixWorld()`
- 投影到屏幕坐标
- 深度排序（z-index）
- 视锥体剔除

---

## 🔐 安全机制

### 1. iframe沙箱隔离

```html
<iframe sandbox="allow-scripts allow-same-origin" srcDoc={htmlContent} />
```

- `allow-scripts`：允许执行JavaScript（Three.js需要）
- `allow-same-origin`：允许访问同源资源（加载本地库）
- 限制：不能提交表单、打开新窗口、访问父窗口

### 2. 代码验证白名单

```typescript
const allowedDomains = ['localhost:3000', '127.0.0.1:3000'];
// 检查所有<script src="...">是否在白名单内
```

### 3. 环境变量保护

```bash
# .env（已加入.gitignore）
MINIMAX_API_KEY=your-api-key
MINIMAX_BASE_URL=https://vip.dmxapi.com/v1
MINIMAX_MODEL=gpt-4o
PORT=3000
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入 MINIMAX_API_KEY
```

### 3. 启动开发服务器

```bash
npm run dev
# 后端: http://localhost:3000
# 前端: http://localhost:5173
```

### 4. 测试

访问 http://localhost:5173，输入概念如"快速排序"，点击生成。

---

## 🐛 已修复的问题

### ✅ CSS2DObject继承问题

**错误**：`THREE.Object3D.add: object not an instance of THREE.Object3D`

**原因**：CSS2DObject类没有继承THREE.Object3D

**修复**：
- 修改 `backend/public/libs/CSS2DRenderer.js`
- 让CSS2DObject继承THREE.Object3D
- 添加isCSS2DObject标记
- 改进render方法

**效果**：
- ✅ CSS2D标签正确显示在3D对象上
- ✅ 支持完整的场景图层级
- ✅ 正确的世界坐标变换

### ⚠️ iframe sandbox警告（预期行为）

**警告**：`An iframe which has both allow-scripts and allow-same-origin...`

**说明**：这是正常警告，不是错误
- Three.js需要执行JavaScript
- 需要访问本地库文件
- 已通过多层安全验证确保安全

---

## 📝 类型定义 (shared/types.ts)

```typescript
// 生成请求
interface GenerationRequest {
  concept: string;
}

// SSE消息格式
interface GenerationProgress {
  type: 'progress' | 'complete' | 'error';
  message?: string;
  htmlContent?: string;
  aestheticAnalysis?: AestheticAnalysis;
  interactionGuide?: string[];
}

// 验证结果
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

---

## 🎯 项目特点

1. **AI驱动**：MiniMax M2.1自动生成完整的3D教学场景
2. **流式响应**：SSE实现实时进度反馈
3. **安全沙箱**：iframe隔离 + 多层代码验证
4. **教学优先**：每个设计决策都服务于教学效果
5. **本地库加载**：避免CDN不稳定，确保100%可用

---

## 🛠️ 开发命令

```bash
# 开发
npm run dev              # 同时启动前后端
npm run dev:backend      # 仅后端
npm run dev:frontend     # 仅前端

# 构建
npm run build            # 构建全部
npm run build:backend    # 构建后端 → backend/dist/
npm run build:frontend   # 构建前端 → frontend/dist/

# 启动生产环境
cd backend && npm start  # 运行 node dist/index.js
```

---

## 📌 重要提示

1. **API Key**：确保 .env 中配置了有效的 MINIMAX_API_KEY
2. **端口冲突**：如果端口被占用，修改 .env 中的 PORT
3. **库文件**：Three.js库必须放在 backend/public/libs/
4. **安全验证**：所有生成的代码都会经过 validator.ts 验证

---

## 🔗 核心API端点

- `POST /api/generate` - 生成3D可视化（SSE流式响应）
- `GET /health` - 健康检查
- `GET /libs/*` - 静态库文件服务

---

## 📚 项目状态

- ✅ 基础功能完整
- ✅ CSS2DObject继承问题已修复
- ✅ 安全验证机制完善
- ✅ SSE流式响应稳定
- ✅ 所有中文已统一为简体中文

---

**最后更新**：2026-01-23  
**项目版本**：1.0.0
