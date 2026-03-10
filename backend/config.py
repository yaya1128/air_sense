"""应用配置"""
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/weather_aqi"
)

# WAQI API
WAQI_TOKEN = os.getenv(
    "WAQI_TOKEN",
    "7030f542870e6d665f6f53ca145614e95e5b09ca"
)

# 马来西亚吉隆坡坐标
MALAYSIA_LAT = 3.139
MALAYSIA_LON = 101.6869

# Flask
FLASK_ENV = os.getenv("FLASK_ENV", "development")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
