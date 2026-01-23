// 后端入口文件
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRouter from './routes/generate.js';
import chatRouter from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 提供静态文件服务（Three.js 库文件）
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

// 路由
app.use('/api', generateRouter);
app.use('/api', chatRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✨ EduVibe 3D 后端服务运行在 http://localhost:${PORT}`);
  console.log(`📡 API 端点: http://localhost:${PORT}/api/generate`);
  console.log(`💬 聊天 API: http://localhost:${PORT}/api/chat`);
});
