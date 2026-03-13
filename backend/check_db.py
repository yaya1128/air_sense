# check_db.py
from config import DATABASE_URL
import psycopg2

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # 查看所有表
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='public'
    """)
    tables = cur.fetchall()
    print("Public tables:", tables)

    # 可选：查看具体表结构
    for table in ['stations', 'air_quality_hourly']:
        cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name='{table}'")
        print(f"Columns in {table}:", cur.fetchall())

    cur.close()
    conn.close()
except Exception as e:
    print("Database connection failed:", e)