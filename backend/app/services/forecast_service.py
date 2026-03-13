"""次日预报服务 - Epic 2.1 / Phase 3 24h"""
from datetime import datetime, timedelta

from app.services.waqi_client import fetch_malaysia_waqi_data, fetch_waqi_data
from app.services.risk_mapper import get_risk_level, pm25_to_aqi

import csv


def _interpolate_pm25(hour: int, min_val: float, avg_val: float, max_val: float) -> float:
    """
    根据典型日变化曲线插值：6am=min, 2pm=avg, 10pm=max
    0-5: 夜间偏高，线性降至 6am 的 min
    """
    if hour <= 6:
        night_val = (avg_val + max_val) / 2
        t = hour / 6.0
        return night_val * (1 - t) + min_val * t
    if hour <= 14:
        t = (hour - 6) / 8.0
        return min_val * (1 - t) + avg_val * t
    if hour <= 22:
        t = (hour - 14) / 8.0
        return avg_val * (1 - t) + max_val * t
    t = (hour - 22) / 2.0
    return max_val * (1 - t) + (avg_val + min_val) / 2 * t


def get_24h_forecast(lat: float = None, lon: float = None) -> dict:
    """
    Phase 3: 24 小时预测
    从 WAQI 每日 min/avg/max 插值生成 24 个整点数据
    """
    waqi_data = fetch_malaysia_waqi_data() if (lat is None and lon is None) else fetch_waqi_data(lat, lon)
    pm25_list = waqi_data.get("forecast", {}).get("daily", {}).get("pm25", [])
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")

    today_data = next((d for d in pm25_list if d["day"] == today), None)
    tomorrow_data = next((d for d in pm25_list if d["day"] == tomorrow), None)

    if not today_data:
        today_data = pm25_list[0] if pm25_list else {"min": 25, "avg": 35, "max": 45}
    if not tomorrow_data:
        tomorrow_data = pm25_list[1] if len(pm25_list) > 1 else today_data

    t_min, t_avg, t_max = today_data.get("min", 25), today_data.get("avg", 35), today_data.get("max", 45)
    tm_min = tomorrow_data.get("min", t_min)

    slots = []
    for h in range(24):
        if h < 23:
            pm25 = _interpolate_pm25(h, t_min, t_avg, t_max)
        else:
            pm25 = (t_max + tm_min) / 2
        aqi = pm25_to_aqi(pm25)
        slots.append({
            "hour": h,
            "label": f"{h:02d}:00",
            "pm25": round(pm25, 1),
            "aqi": aqi,
        })

    return {
        "date": today,
        "slots": slots,
    }


def get_next_day_forecast(lat: float = None, lon: float = None) -> dict:
    """
    获取次日 24 小时空气质量预报
    返回五色风险等级 + 健康建议
    """
    waqi_data = fetch_malaysia_waqi_data() if (lat is None and lon is None) else fetch_waqi_data(lat, lon)

    # 计算明天日期
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

    pm25_list = waqi_data.get("forecast", {}).get("daily", {}).get("pm25", [])
    tomorrow_data = next((d for d in pm25_list if d["day"] == tomorrow), None)

    if not tomorrow_data:
        # 若无次日数据，取第一条预报
        tomorrow_data = pm25_list[0] if pm25_list else None

    if not tomorrow_data:
        return {
            "forecast_date": tomorrow,
            "risk_level": "unknown",
            "color": "gray",
            "advisory": "No forecast available",
            "pm25_avg": None,
            "pm25_min": None,
            "pm25_max": None,
        }

    pm25_avg = tomorrow_data.get("avg", 0)
    risk = get_risk_level(pm25_avg, is_pm25=True)

    return {
        "forecast_date": tomorrow_data["day"],
        "risk_level": risk["color"],
        "color": risk["color"],
        "advisory": risk["advisory"],
        "pm25_avg": pm25_avg,
        "pm25_min": tomorrow_data.get("min"),
        "pm25_max": tomorrow_data.get("max"),
        "aqi": risk["aqi"],
    }

def get_range_forecast(start, end):
    data = []
    with open('../hist_data/kuala-lumpur-air-quality.csv') as data_file:
        reader = csv.reader(data_file)
        next(reader)
        for date_str, pm25, pm10, o3, no2, so2, co, aqi in reader:
            date = datetime.strptime(date_str, '%Y/%m/%d')
            if start <= date and date <= end:
                data.append([date, aqi.strip() or None])
    return data
