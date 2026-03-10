"""污染物 API - Phase 4 补充 O₃、NO₂"""
from fastapi import APIRouter, Query
import requests

router = APIRouter()
# 文档: https://open-meteo.com/en/docs/air-quality-api
# 若 DNS 解析失败，可尝试 api.open-meteo.com（该域名可能返回 404）
OPEN_METEO_URL = "https://air-quality.api.open-meteo.com/v1/air-quality"
MALAYSIA_LAT = 3.139
MALAYSIA_LON = 101.6869


@router.get("/pollutants/open-meteo")
def get_open_meteo_pollutants(
    lat: float = Query(MALAYSIA_LAT),
    lon: float = Query(MALAYSIA_LON),
):
    """
    代理 Open-Meteo 空气质量 API，补充 O₃、NO₂
    后端请求避免 CORS，返回 { pm25, pm10, o3, no2 }
    """
    try:
        url = f"{OPEN_METEO_URL}?latitude={lat}&longitude={lon}&hourly=pm2_5,pm10,ozone,nitrogen_dioxide"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        return {"error": str(e), "pm25": None, "pm10": None, "o3": None, "no2": None}

    h = data.get("hourly") or {}
    return {
        "pm25": h.get("pm2_5", [None])[0] if h.get("pm2_5") else None,
        "pm10": h.get("pm10", [None])[0] if h.get("pm10") else None,
        "o3": h.get("ozone", [None])[0] if h.get("ozone") else None,
        "no2": h.get("nitrogen_dioxide", [None])[0] if h.get("nitrogen_dioxide") else None,
    }
