FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# 工作目录（对应 backend 目录）
WORKDIR /app

# 安装后端依赖
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 拷贝当前 backend 代码到容器（docker-compose 中会用 volume 覆盖成宿主机代码）
COPY . .

# 默认启动 FastAPI 后端（backend/main.py -> main:app）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]