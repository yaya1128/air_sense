import os
import sys
import time
from datetime import datetime
from typing import Any, Dict, Iterable, Tuple

import requests

# 将 backend 目录加入 sys.path，复用后端已有配置
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.normpath(os.path.join(BASE_DIR, ".."))
sys.path.insert(0, os.path.normpath(BACKEND_DIR))

from config import WAQI_TOKEN  # type: ignore  # noqa: E402
from app.db.connection import get_db_cursor  # type: ignore  # noqa: E402
from app.services.waqi_client import WAQI_API_URL  # type: ignore  # noqa: E402

MAP_URL = f"{WAQI_API_URL}/map/bounds/?latlng=0,99,8,120&token={WAQI_TOKEN}"
DETAIL_URL = f"{WAQI_API_URL}/feed/@{{uid}}/?token={WAQI_TOKEN}"

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2


def _to_float_or_none(value: Any) -> float | None:
    """将 WAQI 字段转换为 float；'-'、空值、非数值统一转 None。"""
    if value is None:
        return None
    if isinstance(value, str):
        value = value.strip()
        if value in {"", "-"}:
            return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _to_int_or_none(value: Any) -> int | None:
    """将 WAQI 字段转换为 int；'-'、空值、非数值统一转 None。"""
    parsed = _to_float_or_none(value)
    if parsed is None:
        return None
    return int(parsed)


def _get_with_retries(url: str) -> Dict[str, Any]:
    """带有限次重试的 GET 请求，失败时返回空 dict。"""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            return resp.json() or {}
        except Exception as exc:  # noqa: BLE001
            print(f"[WARN] request failed ({attempt}/{MAX_RETRIES}) url={url} error={exc}")
            if attempt == MAX_RETRIES:
                print(f"[ERROR] giving up request url={url}")
                return {}
            time.sleep(RETRY_DELAY_SECONDS)
    return {}


def update_stations():
    data = _get_with_retries(MAP_URL)

    if data.get("status") != "ok":
        print(f"[ERROR] WAQI API returned error: {data.get('data')}")
        return

    stations = data.get("data", [])
    if not isinstance(stations, list):
        print(f"[ERROR] stations data is not a list: {stations}")
        return

    with get_db_cursor() as cur:
        for s in stations:
            if not isinstance(s, dict):
                print(f"[WARN] skip invalid station record (not dict): {s}")
                continue
            uid = s["uid"]
            name = s["station"]["name"]
            lat = s["lat"]
            lon = s["lon"]

            cur.execute(
                """
                INSERT INTO stations (waqi_uid, name, lat, lon)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (waqi_uid) DO NOTHING
                """,
                (uid, name, lat, lon),
            )


def collect_station_data():
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT id, waqi_uid FROM stations")
            stations: Iterable[Tuple[int, int]] = cur.fetchall()

            for sid, uid in stations:
                url = DETAIL_URL.format(uid=uid)
                data = _get_with_retries(url)

                if data.get("status") != "ok":
                    print(f"[WARN] skip station {uid}: status={data.get('status')}")
                    continue

                payload = data.get("data", {}) or {}
                iaqi = payload.get("iaqi", {}) or {}

                pm25 = _to_float_or_none(iaqi.get("pm25", {}).get("v"))
                pm10 = _to_float_or_none(iaqi.get("pm10", {}).get("v"))
                o3 = _to_float_or_none(iaqi.get("o3", {}).get("v"))
                no2 = _to_float_or_none(iaqi.get("no2", {}).get("v"))
                co = _to_float_or_none(iaqi.get("co", {}).get("v"))

                aqi = _to_int_or_none(payload.get("aqi"))

                timestamp = datetime.utcnow().replace(microsecond=0)

                try:
                    cur.execute("SAVEPOINT sp_insert_air_quality")
                    cur.execute(
                        """
                        INSERT INTO air_quality_hourly
                        (station_id, timestamp, aqi, pm25, pm10, o3, no2, co)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT DO NOTHING
                        """,
                        (sid, timestamp, aqi, pm25, pm10, o3, no2, co),
                    )
                    cur.execute("RELEASE SAVEPOINT sp_insert_air_quality")
                except Exception as exc:  # noqa: BLE001
                    cur.execute("ROLLBACK TO SAVEPOINT sp_insert_air_quality")
                    cur.execute("RELEASE SAVEPOINT sp_insert_air_quality")
                    print(f"[ERROR] failed to insert hourly data for station_id={sid}: {exc}")
    except Exception as exc:  # noqa: BLE001
        print(f"[ERROR] failed to collect station list from DB: {exc}")


def main():

    print("update stations")
    update_stations()

    print("collect AQI")
    collect_station_data()

    print("done")


if __name__ == "__main__":
    main()