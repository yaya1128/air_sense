"""告警 API - Epic 1.1"""
from fastapi import APIRouter, Query

from app.services.alert_service import get_alert_status

router = APIRouter()


@router.get("/alerts/status")
def alerts_status(
    lat: float = Query(None, description="纬度"),
    lon: float = Query(None, description="经度"),
):
    """
    实时告警状态
    AQI >= 151 (Unhealthy) 时 active=true
    """
    return get_alert_status(lat=lat, lon=lon)
