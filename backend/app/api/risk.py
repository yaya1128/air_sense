"""风险等级 API - Epic 1.2"""
from fastapi import APIRouter, Query

from app.services.risk_service import get_current_risk

router = APIRouter()


@router.get("/risk/current")
def risk_current(
    lat: float = Query(None, description="纬度"),
    lon: float = Query(None, description="经度"),
):
    """
    当前空气质量风险等级
    五色 (green/yellow/orange/red/maroon) + 健康建议
    """
    return get_current_risk(lat=lat, lon=lon)
