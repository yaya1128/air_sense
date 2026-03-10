# AirSense Backend

Python 后端，支持 Epic 1.0 / 2.0 空气质量监测功能。

## Step 0 已完成

- [x] 项目结构
- [x] 虚拟环境配置
- [x] PostgreSQL 连接
- [x] 数据库表结构
- [x] 健康检查 API

## 技术栈

- **FastAPI** - Web 框架
- **Uvicorn** - ASGI 服务器
- **PostgreSQL** - 数据库（Epic 2.2 使用）

## 快速开始

### 1. 创建虚拟环境并安装依赖

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 配置 PostgreSQL

确保 PostgreSQL 已安装并运行，然后创建数据库：

```bash
createdb weather_aqi
```

或使用 psql：

```sql
CREATE DATABASE weather_aqi;
```

执行迁移：

```bash
psql -U postgres -d weather_aqi -f migrations/001_initial.sql
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，设置 DATABASE_URL
# 格式: postgresql://用户名:密码@localhost:5432/weather_aqi
```

### 4. 启动服务

```bash
python main.py
```

默认端口 5001（macOS 5000 常被 AirPlay 占用）。或使用 Flask：

```bash
export FLASK_APP=main.py
flask run --host=0.0.0.0 --port=5001
```

### 5. 验证

- `GET http://localhost:5001/` - 基础信息
- `GET http://localhost:5001/api/health` - 健康检查
- `GET http://localhost:5001/api/health/db` - 数据库连接检查（需 PostgreSQL 运行）
- `GET http://localhost:5001/api/forecast/next-day` - 次日预报（Epic 2.1）
- `GET http://localhost:5001/api/alerts/status` - 实时告警（Epic 1.1，AQI≥151 触发）
- `GET http://localhost:5001/api/risk/current` - 当前风险等级（Epic 1.2，五色+建议）

## 目录结构

```
backend/
├── app/
│   ├── api/          # API 路由
│   └── db/           # 数据库
├── migrations/       # SQL 迁移
├── config.py
├── main.py
└── requirements.txt
```
