# 🚀 快速開始指南

本指南將幫助您快速啟動 EduVibe 3D 專案並進行測試。

## 📋 前置檢查清單

在開始之前，請確保您已經完成以下準備：

- [x] ✅ Node.js (>= 20.0.0) 已安裝
- [x] ✅ npm 或 yarn 已安裝
- [x] ✅ 已獲取 MiniMax API Key

快速檢查 Node.js 版本：
```bash
node --version  # 應該顯示 v20.0.0 或更高版本
```

---

## 🔧 第一步：安裝依賴

### 方案 A：一鍵安裝（推薦）

在專案根目錄執行：

```bash
npm install
```

這個命令會自動安裝根目錄、前端和後端的所有依賴。

### 方案 B：分別安裝

如果遇到問題，可以分別安裝：

```bash
# 1. 安裝根目錄依賴
npm install

# 2. 安裝後端依賴
cd backend
npm install

# 3. 安裝前端依賴
cd ../frontend
npm install

# 4. 返回根目錄
cd ..
```

---

## 🔑 第二步：配置環境變量

### 1. 檢查 `.env` 文件

專案已經包含了 `.env` 文件，但請確認 API Key 是否正確：

```bash
# Windows PowerShell
Get-Content .env

# Linux/Mac
cat .env
```

應該看到類似內容：

```env
MINIMAX_API_KEY=sk-nxTM7Y4jqlxkDz2BQcoZEhlUd3S3CBOEzlVckl1GdWcM4Lol
MINIMAX_BASE_URL=https://vip.dmxapi.com/v1
MINIMAX_MODEL=gpt-4o
PORT=3000
```

### 2. （可選）更新 API Key

如果您有自己的 API Key，請編輯 `.env` 文件：

```bash
# Windows
notepad .env

# Linux/Mac
nano .env
```

將 `MINIMAX_API_KEY` 改為您的 API Key。

---

## ▶️ 第三步：啟動專案

### 方案 A：同時啟動前端和後端（推薦）

在專案根目錄執行：

```bash
npm run dev
```

您會看到類似輸出：

```
[0] ✨ EduVibe 3D 後端服務運行在 http://localhost:3000
[0] 📡 API 端點: http://localhost:3000/api/generate
[1] 
[1]   VITE v5.1.0  ready in 326 ms
[1] 
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

### 方案 B：分別啟動

**啟動後端（終端 1）：**

```bash
npm run dev:backend
```

等待看到：
```
✨ EduVibe 3D 後端服務運行在 http://localhost:3000
📡 API 端點: http://localhost:3000/api/generate
```

**啟動前端（終端 2）：**

```bash
npm run dev:frontend
```

等待看到：
```
➜  Local:   http://localhost:5173/
```

---

## 🧪 第四步：測試功能

### 1. 訪問前端

打開瀏覽器，訪問：

```
http://localhost:5173
```

您應該看到 EduVibe 3D 的主頁，包含：
- 頂部輸入框
- 示例概念按鈕
- 功能介紹

### 2. 測試健康檢查

在瀏覽器訪問後端健康檢查端點：

```
http://localhost:3000/health
```

應該返回：
```json
{
  "status": "ok",
  "timestamp": "2026-01-23T..."
}
```

### 3. 測試 Three.js 庫文件

檢查庫文件是否可以訪問：

```
http://localhost:3000/libs/three.min.js
http://localhost:3000/libs/OrbitControls.js
http://localhost:3000/libs/CSS2DRenderer.js
http://localhost:3000/libs/tween.umd.js
```

每個 URL 都應該顯示 JavaScript 代碼（不是 404 錯誤）。

### 4. 測試 AI 生成功能

#### 步驟 1：輸入概念

在前端輸入框中輸入：
```
二分查找
```

或點擊示例按鈕「二分查找」。

#### 步驟 2：等待生成

您會看到：
1. 「正在生成中」狀態提示
2. 進度消息（「正在構建提示詞...」、「正在呼叫 AI 生成器...」）
3. 生成完成後，頁面切換到全屏 3D 場景

#### 步驟 3：測試互動

在 3D 場景中測試：
- ✅ **右側控制面板**：應該看到參數設置、演示控制、步驟說明
- ✅ **自動演示按鈕**：點擊後應該自動播放算法步驟
- ✅ **參數輸入**：修改輸入數據後點擊「應用參數」
- ✅ **步進控制**：「上一步」/「下一步」按鈕應該正常工作
- ✅ **3D 互動**：鼠標拖拽旋轉視角，滾輪縮放
- ✅ **返回按鈕**：左上角「返回首頁」按鈕應該返回輸入頁面

---

## 🔍 第五步：檢查日誌

### 後端日誌

查看後端終端，正常運行應該看到：

```
✨ EduVibe 3D 後端服務運行在 http://localhost:3000
📡 API 端點: http://localhost:3000/api/generate
```

如果出現錯誤，會顯示詳細信息。

### 前端日誌

打開瀏覽器開發者工具（F12），查看 Console 標籤頁。

正常情況應該沒有紅色錯誤信息。

---

## ✅ 測試清單

完成以下測試項目，確保專案正常運行：

### 基礎功能測試

- [ ] 前端頁面正常加載
- [ ] 後端健康檢查返回 OK
- [ ] Three.js 庫文件可以訪問
- [ ] 輸入框可以輸入文字
- [ ] 示例按鈕可以點擊

### AI 生成測試

- [ ] 輸入「二分查找」後可以生成 3D 場景
- [ ] 生成過程中顯示進度消息
- [ ] 生成完成後切換到全屏場景
- [ ] 沒有出現錯誤提示

### 3D 場景測試

- [ ] 3D 場景正常渲染（不是空白）
- [ ] 右側控制面板顯示正常
- [ ] 可以看到參數輸入框
- [ ] 可以看到演示控制按鈕
- [ ] 可以看到步驟說明區域

### 互動功能測試

- [ ] 點擊「自動演示」按鈕有反應
- [ ] 步驟說明會隨著演示更新
- [ ] 點擊「上一步」/「下一步」可以控制演示
- [ ] 修改參數後點擊「應用參數」會重新渲染
- [ ] 鼠標可以拖拽旋轉 3D 視角
- [ ] 滾輪可以縮放場景
- [ ] 點擊「返回首頁」可以返回輸入頁面

---

## 🐛 常見問題排查

### 問題 1：前端無法連接後端

**症狀**：輸入概念後一直顯示「正在生成中」，沒有任何進度。

**解決方案**：
1. 確認後端已經啟動（檢查終端是否有後端日誌）
2. 訪問 `http://localhost:3000/health` 確認後端可訪問
3. 檢查防火牆是否阻止了 3000 端口
4. 查看瀏覽器控制台是否有網絡錯誤

### 問題 2：提示 API Key 未設置

**症狀**：後端啟動時顯示「❌ 錯誤：未設置 MINIMAX_API_KEY 環境變量」

**解決方案**：
1. 確認 `.env` 文件存在於專案根目錄
2. 確認 `.env` 文件內容正確（沒有多餘空格）
3. 重啟後端服務（Ctrl+C 然後重新運行 `npm run dev:backend`）

### 問題 3：Three.js 庫文件 404

**症狀**：3D 場景顯示空白，瀏覽器控制台顯示 404 錯誤。

**解決方案**：
1. 確認 `backend/public/libs/` 目錄存在
2. 確認該目錄包含以下文件：
   - three.min.js
   - OrbitControls.js
   - CSS2DRenderer.js
   - tween.umd.js
3. 如果文件缺失，運行：
   ```bash
   .\setup-libs-simple.ps1
   ```

### 問題 4：生成的場景有錯誤

**症狀**：3D 場景顯示，但控制台有紅色錯誤信息。

**解決方案**：
1. 打開瀏覽器開發者工具（F12）
2. 查看 Console 標籤頁的錯誤信息
3. 檢查是否是 AI 生成的代碼問題
4. 嘗試輸入不同的概念重新生成
5. 如果持續出錯，檢查 `backend/src/services/promptEngine.ts` 的提示詞

### 問題 5：依賴安裝失敗

**症狀**：運行 `npm install` 時出現錯誤。

**解決方案**：
1. 清除緩存：
   ```bash
   npm cache clean --force
   ```
2. 刪除 node_modules 和鎖定文件：
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force node_modules, frontend/node_modules, backend/node_modules
   Remove-Item package-lock.json
   
   # Linux/Mac
   rm -rf node_modules frontend/node_modules backend/node_modules
   rm package-lock.json
   ```
3. 重新安裝：
   ```bash
   npm install
   ```

---

## 🎯 下一步

恭喜！如果您通過了所有測試，專案已經成功運行。

**繼續探索**：
- 嘗試輸入不同的算法概念（如「快速排序」、「廣度優先搜索」）
- 修改參數，觀察算法行為變化
- 查看生成的 HTML 代碼（右鍵點擊 iframe → 查看框架源代碼）
- 研究 `promptEngine.ts` 中的提示詞，了解如何指導 AI 生成更好的可視化

**開發新功能**：
- 參考 `README.md` 中的「開發指南」章節
- 查看「專案結構」了解代碼組織方式
- 閱讀各個模塊的註釋，理解工作原理

---

## 📞 需要幫助？

如果遇到問題：
1. 查看本文檔的「常見問題排查」章節
2. 查看 `README.md` 中的詳細文檔
3. 檢查 GitHub Issues（如果專案已發布）
4. 查看瀏覽器和終端的錯誤日誌

---

**祝您使用愉快！** 🎓✨
