# AirSense

> 空气质量监测应用 — Know Your Air, Live Well

![Application screenshot](./Users/zbh_1111/the-weather-forecasting/frontend/src/assets/airsense-logo.png)

---

## 简介

**AirSense** 是一款面向马来西亚的空气质量监测应用。用户可搜索城市查看实时 AQI、PM2.5、健康建议，以及未来 24 小时与一周的空气质量预报。

### 技术栈

| 前端 | 后端 | 数据库 |
|------|------|--------|
| React 18 | FastAPI | PostgreSQL |
| Material-UI | Uvicorn | WAQI API |

---

## 项目结构

```
airsense/
├── frontend/     # React 前端
├── backend/      # FastAPI 后端
└── README.md
```

---

## 快速开始

### 环境要求

- Node.js 18+
- Python 3.9+
- PostgreSQL（可选，本地开发可暂不配置）

### 1. 克隆仓库

```bash
git clone https://github.com/yaya1128/airsense.git
cd airsense
```

### 2. 启动前端

```bash
cd frontend
npm install
npm start
```

前端默认运行在 `http://localhost:3000`。

### 3. 启动后端

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

配置环境变量（复制 `.env.example` 为 `.env`，配置 `DATABASE_URL` 和 `WAQI_TOKEN`）：

```bash
cp .env.example .env
```

启动服务：

```bash
python main.py
```

后端默认运行在 `http://localhost:5001`。API 文档：`http://localhost:5001/docs`。

### 4. 数据源

- **WAQI API**：[aqicn.org/api](https://aqicn.org/api/) — 空气质量数据

---

## 部署

推荐部署方案：

- **后端**：Render + PostgreSQL
- **前端**：Vercel

1. 在 Render 创建 PostgreSQL 数据库
2. 在 Render 部署 backend（Root Directory: `backend`，配置 `DATABASE_URL`）
3. 执行 `migrations/001_initial.sql` 初始化表结构
4. 在 Vercel 部署 frontend（Root Directory: `frontend`，配置 `REACT_APP_API_BASE` 为后端 URL）

---

## 主要功能

- 实时 AQI 与 PM2.5 显示
- 健康建议与风险等级
- 24 小时逐时预报
- 次日预报
- 一周预报
- 污染物详情
- 天气信息

---

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /api/health` | 健康检查 |
| `GET /api/health/db` | 数据库连接检查 |
| `GET /api/risk/current` | 当前风险等级 |
| `GET /api/forecast/next-day` | 次日预报 |
| `GET /api/forecast/24h` | 24 小时预报 |
| `GET /api/alerts/status` | 告警状态 |

---

## License

MIT
