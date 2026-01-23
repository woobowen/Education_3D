# EduVibe 3D - AI 驱动的 3D 互动教学可视化平台

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![Branch](https://img.shields.io/badge/branch-optimization-orange.svg)

**通过 AI 和 3D 技术，让抽象概念变得可视化、可交互、易理解**

[快速开始](#快速开始) • [核心特性](#核心特性) • [技术架构](#技术架构) • [项目文档](#项目文档) • [开发指南](#开发指南)

</div>

---

## 📖 项目简介

EduVibe 3D 是一个突破性的教育技术平台，通过 **MiniMax AI** 自动生成专业的 3D 互动教学场景。输入任意计算机科学或编程概念（如"快速排序"、"二叉树遍历"、"图的最短路径"），AI 将在几秒内生成包含自动演示、参数控制、步骤说明的完整 3D 可视化。

### 🎯 核心价值

```
用户输入概念 → AI 分析理解 → 生成 Three.js 代码 → 安全验证 → 3D 渲染 → 互动式学习
```

---

## ✨ 核心特性

### 🤖 AI 智能生成
- **MiniMax M2.1 模型**：强大的语义理解和代码生成能力
- **1500+ 行提示词工程**：确保生成的代码专业、安全、教学性强
- **流式响应**：实时显示生成进度，提供流畅的用户体验

### 🎮 自动演示系统
- **一键播放**：自动循序渐进展示算法的每个步骤
- **步进控制**：手动控制演示进度（播放/暂停/上一步/下一步）
- **速度调节**：根据学习节奏调整演示速度
- **步骤说明**：每一步都有详细的文字解释

### ⚙️ 参数控制
- **自定义输入**：用户可以修改数组、树结构、图数据等
- **实时应用**：参数更改后立即重新生成场景
- **错误检测**：智能验证用户输入，提供友好的错误提示

### 🎨 专业美学设计
- **现代化配色**：教育友好的浅色背景 + 高对比度元素
- **物理渲染**：使用 `MeshStandardMaterial` 实现真实的光照和材质
- **动画流畅**：基于 Tween.js 的平滑过渡动画
- **响应式布局**：左侧 75% 3D 画布 + 右侧 25% 控制面板

### 🗣️ 自然语言控制台
- **语音指令**：用中文指令控制演示（如"开始演示"、"下一步"）
- **参数设置**：通过自然语言修改参数（如"设置数组为 1,2,3,4,5"）
- **视角切换**：语音切换上帝视角和数据视角
- **智能理解**：支持多种表达方式

### 🔒 安全沙箱
- **iframe 隔离**：生成的代码在沙箱环境中运行
- **代码验证**：多层安全检查（禁止 localStorage、eval、parent 访问等）
- **自动修复**：尝试自动修复常见的安全问题
- **白名单机制**：仅允许加载可信的外部资源

### 🔧 开发者友好
- **TypeScript 全栈**：完整的类型定义和类型安全
- **热更新**：Vite HMR 提供极速的开发体验
- **模块化设计**：清晰的代码结构，易于维护和扩展
- **详细文档**：完善的项目文档和代码注释

---

## 🏗️ 技术架构

### 技术栈

**前端**
```
React 18.3          - 现代化的 UI 框架
TypeScript 5.5      - 类型安全
Vite 5.4           - 极速构建工具
Tailwind CSS 3.4   - 实用优先的 CSS 框架
Zustand 4.5        - 轻量级状态管理
```

**后端**
```
Node.js 20+        - 高性能运行时
Express 4.19       - 简洁的 Web 框架
TypeScript 5.5     - 类型安全
OpenAI SDK 4.67    - AI 接口调用
Server-Sent Events - 实时流式响应
```

**3D 渲染**
```
Three.js r170      - WebGL 3D 引擎
OrbitControls      - 相机轨道控制
CSS2DRenderer      - 2D 标签渲染
Tween.js 25.0      - 补间动画库
```

**AI 引擎**
```
MiniMax M2.1       - 通过 OpenAI 兼容接口调用
Model: gpt-4o      - 强大的代码生成能力
Temperature: 0.7   - 平衡创造性和准确性
Max Tokens: 8192   - 支持复杂场景生成
```

### 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    前端层 (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ InputPanel   │  │ Sandbox3D    │  │ Status Panel │  │
│  │ (输入框)     │  │ (3D 渲染)    │  │ (进度显示)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           ↓                ↑                ↑            │
│  ┌────────────────────────────────────────────────┐     │
│  │       Zustand 状态管理 (appStore.ts)           │     │
│  └────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/SSE
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    后端层 (Express)                      │
│  ┌────────────────────────────────────────────────┐     │
│  │         API 路由: POST /api/generate            │     │
│  │              (SSE 流式响应)                     │     │
│  └─────────────────────┬──────────────────────────┘     │
│                        ↓                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │              服务层 (Services)                   │    │
│  │  ┌──────────────┐    ┌──────────────┐          │    │
│  │  │ promptEngine │ →  │ MiniMax API  │          │    │
│  │  │ (提示词构建) │    │ (AI 生成)    │          │    │
│  │  └──────────────┘    └──────────────┘          │    │
│  └─────────────────────────┬───────────────────────┘    │
│                            ↓                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │              工具层 (Utils)                      │    │
│  │  ┌──────────────┐    ┌──────────────┐          │    │
│  │  │ codeExtractor│ →  │ validator    │          │    │
│  │  │ (代码提取)   │    │ (安全验证)   │          │    │
│  │  └──────────────┘    └──────────────┘          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │      静态资源服务 (/libs - Three.js 库)         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                 外部服务 (MiniMax AI)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **MiniMax API Key** - 用于 AI 生成功能

### 安装步骤

#### 1. 克隆项目

```bash
git clone <repository-url>
cd Education_3D
git checkout optimization  # 切换到优化分支
```

#### 2. 安装依赖

```bash
npm install
```

这将自动安装前端、后端和根目录的所有依赖。

#### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# MiniMax API 配置
MINIMAX_API_KEY=your-api-key-here
MINIMAX_BASE_URL=https://vip.dmxapi.com/v1
MINIMAX_MODEL=gpt-4o

# 服务器端口
PORT=3000
```

#### 4. 启动开发服务器

```bash
npm run dev
```

这将同时启动前端和后端开发服务器：
- **后端**: http://localhost:3000
- **前端**: http://localhost:5173

#### 5. 访问应用

打开浏览器访问：**http://localhost:5173**

---

## 📚 使用指南

### 基础使用

1. **输入概念**：在输入框中输入任意编程/算法概念
   ```
   例如：快速排序、二分查找、二叉树遍历、图的最短路径
   ```

2. **等待生成**：AI 将在几秒到几十秒内生成完整的 3D 场景
   - 实时显示生成进度
   - 自动进行安全验证

3. **互动学习**：
   - 点击"自动演示"按钮开始学习
   - 使用步进控制查看每个步骤
   - 修改参数自定义数据

### 高级功能

#### 自然语言控制

点击右上角的 "🤖 显示自然语言控制台"，然后输入指令：

```
开始演示              # 启动自动演示
下一步                # 执行下一步
暂停                  # 暂停演示
重置                  # 重置场景
设置数组为 5,2,8,1,9  # 修改参数
切换到上帝视角        # 切换相机视角
```

#### 参数自定义

在右侧控制面板的"参数设置"区域：
- 修改输入数据（数组、树结构、图数据等）
- 点击"应用参数"按钮
- 场景将使用新参数重新生成

#### 视角控制

- **鼠标左键拖拽**：旋转相机
- **鼠标右键拖拽**：平移相机
- **鼠标滚轮**：缩放视图
- **快捷按钮**：上帝视角 / 数据视角

---

## 🔧 开发指南

### 项目结构

```
Education_3D/
├── frontend/                    # React 前端应用
│   ├── src/
│   │   ├── components/          # UI 组件
│   │   │   ├── InputPanel.tsx           # 输入面板
│   │   │   ├── Sandbox3D.tsx            # 3D 沙箱容器
│   │   │   ├── GenerationStatus.tsx     # 生成状态
│   │   │   ├── InteractionGuide.tsx     # 交互指南
│   │   │   └── NaturalLanguageConsole.tsx  # 自然语言控制台
│   │   ├── hooks/
│   │   │   └── useGeneration.ts         # SSE 连接管理
│   │   ├── stores/
│   │   │   └── appStore.ts              # Zustand 状态管理
│   │   ├── App.tsx                      # 主应用组件
│   │   └── main.tsx                     # 应用入口
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # Express 后端服务
│   ├── src/
│   │   ├── routes/
│   │   │   └── generate.ts              # 生成 API (SSE)
│   │   ├── services/
│   │   │   ├── minimax.ts               # MiniMax API 调用
│   │   │   └── promptEngine.ts          # 提示词引擎 (1500+ 行)
│   │   ├── utils/
│   │   │   ├── codeExtractor.ts         # 代码提取器
│   │   │   └── validator.ts             # 安全验证器
│   │   └── index.ts                     # 服务器入口
│   ├── public/libs/             # Three.js 本地库
│   │   ├── three.min.js
│   │   ├── OrbitControls.js
│   │   ├── CSS2DRenderer.js             # ✅ 已修复继承问题
│   │   └── tween.umd.js
│   └── package.json
│
├── shared/
│   └── types.ts                 # 共享类型定义
│
├── PROJECT_GUIDE.md             # 项目详细指南
├── CLEANUP_REPORT.md            # 清理报告
├── README.md                    # 本文档
├── .env.example                 # 环境变量示例
└── package.json                 # 根工作空间配置
```

### 开发命令

```bash
# 开发模式（同时启动前后端）
npm run dev

# 仅启动后端
npm run dev:backend

# 仅启动前端
npm run dev:frontend

# 构建生产版本
npm run build

# 构建后端
npm run build:backend

# 构建前端
npm run build:frontend

# 启动生产环境
cd backend && npm start
```

### 添加新功能

#### 1. 添加新的 Three.js 库

```bash
# 1. 下载库文件到 backend/public/libs/
# 2. 在 promptEngine.ts 中添加引用
<script src="http://localhost:3000/libs/new-library.js"></script>
# 3. 在 validator.ts 中添加到白名单
```

#### 2. 扩展提示词模板

编辑 `backend/src/services/promptEngine.ts`：
- 在 `buildSystemPrompt()` 中添加新的算法模板
- 在 `buildUserPrompt()` 中添加特定要求

#### 3. 添加新的 UI 组件

```bash
# 在 frontend/src/components/ 创建新组件
# 在 App.tsx 中引入并使用
# 使用 Zustand store 管理状态
```

### 代码规范

- **TypeScript**：使用严格模式，定义完整的类型
- **注释**：关键逻辑必须有中文注释
- **命名**：使用驼峰命名法，语义化命名
- **格式**：使用 Prettier 自动格式化

---

## 🐛 故障排除

### 常见问题

#### Q1: 提示 "错误：未设置 MINIMAX_API_KEY 环境变量"

**解决方案**：
1. 确保根目录有 `.env` 文件
2. 检查 `MINIMAX_API_KEY=your-key` 是否正确
3. 重启后端服务器

```bash
cd backend
npm run dev
```

#### Q2: 前端无法连接后端

**检查清单**：
- [ ] 后端是否已启动（默认端口 3000）
- [ ] 检查 `vite.config.ts` 中的代理配置
- [ ] 检查防火墙是否阻止端口

#### Q3: 生成的 3D 场景无法显示

**可能原因**：
1. **Three.js 库未加载**
   - 检查 `backend/public/libs/` 是否包含所有库文件
   - 查看浏览器控制台是否有 404 错误

2. **iframe 沙箱权限**
   - 确保 `sandbox="allow-scripts allow-same-origin"`

3. **代码错误**
   - 打开浏览器开发者工具
   - 切换到 iframe 内部查看错误

#### Q4: CSS2DObject 错误

**错误信息**：
```
THREE.Object3D.add: object not an instance of THREE.Object3D
```

**解决方案**：
- ✅ **已修复**：optimization 分支已修复此问题
- `CSS2DObject` 现在正确继承 `THREE.Object3D`

#### Q5: 自然语言控制台无响应

**可能原因**：
- iframe 通信未建立
- 生成的代码中未实现消息监听

**解决方案**：
- 确保生成的代码包含 `window.addEventListener('message', ...)` 监听器

---

## 🔒 安全性

### 多层安全防护

#### 1. iframe 沙箱隔离
```html
<iframe sandbox="allow-scripts allow-same-origin" />
```
- ✅ 禁止提交表单
- ✅ 禁止打开新窗口
- ✅ 禁止访问父窗口
- ✅ 物理隔离执行环境

#### 2. 代码验证白名单
```typescript
// 禁止的 API
❌ localStorage / sessionStorage
❌ document.cookie
❌ parent / top 窗口
❌ eval / Function 构造器

// 允许的外部脚本
✅ localhost:3000/libs/*
✅ cdn.jsdelivr.net
✅ unpkg.com
✅ cdnjs.cloudflare.com
```

#### 3. 自动修复机制
- 检测到危险代码时自动注释
- 提供详细的错误报告
- 尝试修复后重新验证

#### 4. 环境变量保护
```bash
# .env 文件已加入 .gitignore
# API Key 不会被提交到版本控制
```

---

## 📊 性能优化

### optimization 分支优化项

1. **代码生成优化**
   - ✅ 1500+ 行高质量提示词工程
   - ✅ 明确的错误预防清单
   - ✅ 统一的代码风格规范

2. **渲染性能**
   - ✅ CSS2DRenderer 正确实现
   - ✅ 对象池管理（避免频繁创建销毁）
   - ✅ 视锥体剔除（仅渲染可见对象）
   - ✅ 深度排序优化

3. **网络优化**
   - ✅ SSE 流式响应
   - ✅ 本地库文件（避免 CDN 延迟）
   - ✅ 增量进度更新

4. **用户体验**
   - ✅ 实时进度反馈
   - ✅ 友好的错误提示
   - ✅ 自然语言控制台
   - ✅ 响应式布局

---

## 📄 项目文档

### 核心文档

- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - 完整的项目指南
  - 项目概述和技术栈
  - 详细的目录结构
  - 核心工作流程（12 个步骤）
  - 关键模块详解
  - 数据流分析
  - 安全机制
  - 快速开始

- **[CLEANUP_REPORT.md](./CLEANUP_REPORT.md)** - 清理和优化报告
  - 删除的冗余文件列表
  - 繁体中文转简体中文的详细记录
  - 项目状态总结

### API 文档

#### POST /api/generate

生成 3D 可视化（SSE 流式响应）

**请求**：
```json
{
  "concept": "快速排序"
}
```

**响应** (Server-Sent Events)：
```
data: {"type":"progress","message":"正在构建提示词..."}
data: {"type":"progress","message":"正在调用 AI 生成器..."}
data: {"type":"progress","message":"生成中... (500 字符)"}
data: {"type":"complete","htmlContent":"<!DOCTYPE html>...","aestheticAnalysis":{...}}
```

#### GET /health

健康检查

**响应**：
```json
{
  "status": "ok",
  "timestamp": "2026-01-23T12:00:00.000Z"
}
```

---

## 🎓 教学设计理念

### 核心原则

1. **教学第一**
   - 3D 只是手段，不是目的
   - 每个视觉元素都服务于教学目标
   - 避免过度炫酷的效果干扰学习

2. **循序渐进**
   - 通过自动演示逐步展示算法步骤
   - 每一步都有清晰的文字说明
   - 学生可以按自己的节奏学习

3. **参数可控**
   - 让学生输入自己的数据
   - 通过实验验证理解
   - 支持错误输入并给出反馈

4. **专业美学**
   - 使用教育友好的配色
   - 现代、简洁的设计
   - 高对比度确保清晰可见

### 视觉设计规范

**配色方案**：
```
背景色：浅色渐变 (#f0f4f8 → #edf2f7)
未激活：淅灰蓝 #94a3b8
处理中：鲜明橙色 #f59e0b
已完成：鲜绿色 #10b981
错误：红色 #ef4444
```

**材质风格**：
```javascript
// 使用物理渲染材质
new THREE.MeshStandardMaterial({
  roughness: 0.3-0.5,    // 轻微粗糙
  metalness: 0.1-0.3,    // 微金属质感
  transparent: true,
  opacity: 0.9
})
```

**布局结构**：
```
┌─────────────────────────────────────┐
│  左侧 75%：3D 画布                   │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     Three.js 场景           │   │
│  │                             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
┌────────────┐
│ 右侧 25%： │
│ 控制面板   │
│  ┌──────┐ │
│  │视角  │ │
│  │参数  │ │
│  │控制  │ │
│  │步骤  │ │
│  └──────┘ │
└────────────┘
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建功能分支
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 提交更改
   ```bash
   git commit -m "Add: 添加某某功能"
   ```
4. 推送到分支
   ```bash
   git push origin feature/amazing-feature
   ```
5. 开启 Pull Request

### Commit 规范

```
Add: 新增功能
Fix: 修复 Bug
Update: 更新功能
Refactor: 重构代码
Docs: 更新文档
Style: 代码格式调整
Test: 添加测试
Chore: 构建/工具链更新
```

---

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

- **MiniMax AI** - 强大的 AI 模型支持
- **Three.js** - 优秀的 3D 渲染引擎
- **React** - 现代化的 UI 框架
- **所有贡献者** - 感谢你们的付出

---

## 📞 联系方式

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: your-email@example.com

---

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 Star ⭐！

---

<div align="center">

**让学习变得更生动，用 3D 让知识更具象** 🎓✨

Made with ❤️ by EduVibe Team

</div>
