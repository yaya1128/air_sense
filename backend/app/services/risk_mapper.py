"""
风险等级映射 - Epic 1.2 / 2.1
五色风险等级 + 老年人友好健康建议（≤8 词）
"""

# AQI 区间 → (颜色, 健康建议)
# 建议控制在 8 词以内，便于老年人理解
RISK_LEVELS = [
    (0, 50, "green", "Safe to go out"),
    (51, 100, "yellow", "Limit outdoor time"),
    (101, 150, "orange", "Stay inside"),
    (151, 200, "red", "Rest at home"),
    (201, 300, "maroon", "Avoid going out"),
    (301, 1000, "maroon", "Stay indoors now"),
]


def pm25_to_aqi(pm25: float) -> int:
    """
    PM2.5 (µg/m³) 转 AQI 的简化映射
    基于 US EPA 标准
    """
    if pm25 <= 12:
        return int(50 * pm25 / 12)
    if pm25 <= 35.4:
        return int(50 + 50 * (pm25 - 12) / 23.4)
    if pm25 <= 55.4:
        return int(100 + 50 * (pm25 - 35.4) / 20)
    if pm25 <= 150.4:
        return int(150 + 100 * (pm25 - 55.4) / 95)
    if pm25 <= 250.4:
        return int(200 + 100 * (pm25 - 150.4) / 100)
    if pm25 <= 500.4:
        return int(300 + 200 * (pm25 - 250.4) / 250)
    return min(500, int(500 + (pm25 - 500.4) / 2))


def get_risk_level(aqi_or_pm25: float, is_pm25: bool = False) -> dict:
    """
    根据 AQI 或 PM2.5 返回风险等级
    Returns: { "color", "advisory", "aqi" }
    """
    if is_pm25:
        aqi = pm25_to_aqi(aqi_or_pm25)
    else:
        aqi = int(aqi_or_pm25)

    for low, high, color, advisory in RISK_LEVELS:
        if low <= aqi <= high:
            return {
                "color": color,
                "advisory": advisory,
                "aqi": aqi,
            }

    return {
        "color": "maroon",
        "advisory": "Stay indoors now",
        "aqi": aqi,
    }
