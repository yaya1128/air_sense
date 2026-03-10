"""实时告警服务 - Epic 1.1"""
from app.services.waqi_client import fetch_malaysia_waqi_data, fetch_waqi_data
from app.services.risk_mapper import get_risk_level

# Unhealthy 阈值：AQI >= 151
UNHEALTHY_THRESHOLD = 151


def get_alert_status(lat: float = None, lon: float = None) -> dict:
    """
    获取当前告警状态
    AQI >= 151 时触发 Unhealthy 告警
    """
    if lat is not None and lon is not None:
        waqi_data = fetch_waqi_data(lat, lon)
    else:
        waqi_data = fetch_malaysia_waqi_data()

    aqi = waqi_data.get("aqi", 0)
    city_name = waqi_data.get("city", {}).get("name", "Kuala Lumpur")

    if aqi >= UNHEALTHY_THRESHOLD:
        risk = get_risk_level(aqi, is_pm25=False)
        return {
            "active": True,
            "message": risk["advisory"],
            "aqi": aqi,
            "color": risk["color"],
            "advisory": risk["advisory"],
            "location": city_name,
        }

    return {
        "active": False,
        "message": None,
        "aqi": aqi,
        "color": None,
        "advisory": None,
        "location": city_name,
    }
