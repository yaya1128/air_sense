"""WAQI API 客户端"""
import requests

from config import WAQI_TOKEN, MALAYSIA_LAT, MALAYSIA_LON

WAQI_API_URL = "https://api.waqi.info"


def fetch_waqi_data(lat: float = None, lon: float = None) -> dict:
    """
    获取指定坐标的空气质量数据
    默认使用马来西亚吉隆坡坐标
    """
    lat = lat or MALAYSIA_LAT
    lon = lon or MALAYSIA_LON

    url = f"{WAQI_API_URL}/feed/geo:{lat};{lon}/?token={WAQI_TOKEN}"
    response = requests.get(url, timeout=10)
    data = response.json()

    if data.get("status") != "ok" or not data.get("data"):
        msg = data.get("data", {}).get("message", "WAQI API 请求失败")
        raise RuntimeError(msg)

    return data["data"]


def fetch_malaysia_waqi_data() -> dict:
    """获取马来西亚（吉隆坡）空气质量数据"""
    return fetch_waqi_data(MALAYSIA_LAT, MALAYSIA_LON)
