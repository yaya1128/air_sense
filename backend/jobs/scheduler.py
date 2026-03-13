"""AirSense 数据采集调度器

每小时执行一次 collect_waqi.main()，启动后立即采集一次，
之后每隔 INTERVAL_SECONDS 秒循环执行。
"""
import os
import sys
import time
from datetime import datetime

# 将 backend 目录加入 sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.normpath(os.path.join(BASE_DIR, ".."))
sys.path.insert(0, BACKEND_DIR)

from jobs.collect_waqi import main as collect_main  # noqa: E402

INTERVAL_SECONDS = int(os.getenv("COLLECT_INTERVAL_SECONDS", "3600"))  # 默认 1 小时


def run_scheduler():
    print(f"[SCHEDULER] 启动，采集间隔 {INTERVAL_SECONDS} 秒", flush=True)
    while True:
        start = datetime.utcnow()
        print(f"[SCHEDULER] 开始采集 {start.isoformat()}", flush=True)
        try:
            collect_main()
        except Exception as exc:  # noqa: BLE001
            print(f"[SCHEDULER] 采集异常: {exc}", flush=True)
        elapsed = (datetime.utcnow() - start).total_seconds()
        sleep_for = max(0, INTERVAL_SECONDS - elapsed)
        print(f"[SCHEDULER] 采集完成，{sleep_for:.0f} 秒后下次执行", flush=True)
        time.sleep(sleep_for)


if __name__ == "__main__":
    run_scheduler()
