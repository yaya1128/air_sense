import os
import sys
from datetime import datetime, timedelta

import psycopg2

# 复用 backend/config.py 中的 DATABASE_URL
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.normpath(os.path.join(BASE_DIR, ".."))
sys.path.insert(0, BACKEND_DIR)

from config import DATABASE_URL  # type: ignore  # noqa: E402


def check_data():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    try:
        # === 检查 stations 表 ===
        print("=== 检查 stations 表 ===")
        cur.execute("SELECT COUNT(*) FROM stations")
        station_count = cur.fetchone()[0]
        print(f"站点数量: {station_count}")
        if station_count == 0:
            print("⚠️ stations 表为空！请先运行 update_stations()")
            return

        # === 检查 air_quality_hourly 最近 24 小时数据 ===
        print("\n=== 检查 air_quality_hourly 表最近 24 小时数据 ===")
        now = datetime.utcnow()
        yesterday = now - timedelta(days=1)

        cur.execute(
            """
            SELECT s.name, a.timestamp, a.aqi, a.pm25, a.pm10, a.o3, a.no2, a.co
            FROM air_quality_hourly a
            JOIN stations s ON a.station_id = s.id
            WHERE a.timestamp >= %s
            ORDER BY a.timestamp DESC
            """,
            (yesterday,),
        )

        rows = cur.fetchall()
        if not rows:
            print("⚠️ 最近 24 小时没有数据！")
        else:
            print(f"最近 24 小时数据条数: {len(rows)}")
            for r in rows[:10]:  # 只显示前 10 条
                name, ts, aqi, pm25, pm10, o3, no2, co = r
                issues = []
                for field_name, val in [
                    ("AQI", aqi),
                    ("PM2.5", pm25),
                    ("PM10", pm10),
                    ("O3", o3),
                    ("NO2", no2),
                    ("CO", co),
                ]:
                    if isinstance(val, (int, float)) and val < 0:
                        issues.append(field_name)
                issue_str = f"⚠️ 非法值: {issues}" if issues else ""
                print(f"{ts} | {name} | AQI={aqi} | PM2.5={pm25} | PM10={pm10} {issue_str}")

        # === 检查重复写入 ===
        print("\n=== 检查重复数据 (station_id + timestamp) ===")
        cur.execute(
            """
            SELECT station_id, timestamp, COUNT(*)
            FROM air_quality_hourly
            GROUP BY station_id, timestamp
            HAVING COUNT(*) > 1
            ORDER BY station_id, timestamp
            """
        )
        duplicates = cur.fetchall()
        if duplicates:
            print("⚠️ 存在重复数据:")
            for station_id, ts, count in duplicates:
                print(f"station_id={station_id} timestamp={ts} 重复 {count} 次")
        else:
            print("✅ 没有重复数据")
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    check_data()