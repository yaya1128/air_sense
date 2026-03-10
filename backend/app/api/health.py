"""健康检查 API"""
from fastapi import APIRouter, status

router = APIRouter()


@router.get("/health")
def health():
    """基础健康检查"""
    return {
        "status": "ok",
        "service": "airsense-backend",
        "version": "0.1.0"
    }


@router.get("/health/db")
def health_db():
    """数据库连接检查"""
    from fastapi.responses import JSONResponse
    try:
        from app.db.connection import test_connection
        if test_connection():
            return {"status": "ok", "database": "connected"}
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "error", "database": "connection failed"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "error", "database": str(e)}
        )
