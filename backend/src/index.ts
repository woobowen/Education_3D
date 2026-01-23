// 後端入口文件
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRouter from './routes/generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());

// 提供靜態文件服務（Three.js 庫文件）
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

// 路由
app.use('/api', generateRouter);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`✨ EduVibe 3D 後端服務運行在 http://localhost:${PORT}`);
  console.log(`📡 API 端點: http://localhost:${PORT}/api/generate`);
});
