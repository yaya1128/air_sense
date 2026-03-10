"""当前风险等级服务 - Epic 1.2"""
from app.services.waqi_client import fetch_malaysia_waqi_data, fetch_waqi_data
from app.services.risk_mapper import get_risk_level


def get_current_risk(lat: float = None, lon: float = None) -> dict:
    """
    获取当前空气质量风险等级
    五色 (Green/Yellow/Orange/Red/Maroon) + 健康建议 (≤8 词)
    """
    if lat is not None and lon is not None:
        waqi_data = fetch_waqi_data(lat, lon)
    else:
        waqi_data = fetch_malaysia_waqi_data()

    aqi = waqi_data.get("aqi", 0)
    city_name = waqi_data.get("city", {}).get("name", "Kuala Lumpur")
    risk = get_risk_level(aqi, is_pm25=False)

    return {
        "color": risk["color"],
        "advisory": risk["advisory"],
        "aqi": aqi,
        "location": city_name,
    }
