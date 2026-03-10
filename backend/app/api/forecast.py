"""预报 API - Epic 2.1 / Phase 3"""
from fastapi import APIRouter, Query

from app.services.forecast_service import get_next_day_forecast, get_24h_forecast

router = APIRouter()


@router.get("/forecast/24h")
def forecast_24h(
    lat: float = Query(None, description="纬度"),
    lon: float = Query(None, description="经度"),
):
    """
    Phase 3: 24 小时空气质量预测
    从每日 min/avg/max 插值生成 24 个整点
    """
    return get_24h_forecast(lat=lat, lon=lon)


@router.get("/forecast/next-day")
def next_day_forecast(
    lat: float = Query(None, description="纬度"),
    lon: float = Query(None, description="经度"),
):
    """
    次日 24 小时空气质量预报
    返回五色风险等级 (Green/Yellow/Orange/Red/Maroon) + 健康建议
    """
    return get_next_day_forecast(lat=lat, lon=lon)
