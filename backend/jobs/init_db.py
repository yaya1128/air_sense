import os
import sys

import psycopg2


# 将 backend 目录加入 sys.path，复用配置
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.normpath(os.path.join(BASE_DIR, ".."))
sys.path.insert(0, os.path.normpath(BACKEND_DIR))

from config import DATABASE_URL  # type: ignore  # noqa: E402


MIGRATION_FILE = os.path.join(
    BASE_DIR, "..", "migrations", "001_initial.sql"
)


def run_initial_migration() -> None:
    if not os.path.exists(MIGRATION_FILE):
        print(f"[ERROR] migration file not found: {MIGRATION_FILE}")
        return

    with open(MIGRATION_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    if not sql.strip():
        print("[WARN] migration file is empty, nothing to run")
        return

    print(f"[INFO] connecting to database: {DATABASE_URL}")

    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
    except Exception as exc:  # noqa: BLE001
        print(f"[ERROR] failed to connect database: {exc}")
        return

    try:
        with conn.cursor() as cur:
            try:
                cur.execute(sql)
                print("[INFO] initial migration executed successfully")
            except Exception as exc:  # noqa: BLE001
                print(f"[ERROR] failed to run migration: {exc}")
    finally:
        conn.close()
        print("[INFO] database connection closed")


if __name__ == "__main__":
    run_initial_migration()

