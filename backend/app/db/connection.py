"""PostgreSQL 连接管理"""
import psycopg2
from psycopg2 import pool
from contextlib import contextmanager

# 延迟导入，避免循环依赖
def _get_config():
    from config import DATABASE_URL
    return DATABASE_URL

# 连接池（最小 1，最大 10）
_connection_pool = None


def init_pool():
    """初始化连接池"""
    global _connection_pool
    if _connection_pool is None:
        try:
            _connection_pool = pool.SimpleConnectionPool(
                1, 10, _get_config()
            )
        except Exception as e:
            raise RuntimeError(f"Failed to connect to PostgreSQL: {e}") from e


def get_connection():
    """获取连接"""
    if _connection_pool is None:
        init_pool()
    return _connection_pool.getconn()


def return_connection(conn):
    """归还连接"""
    if _connection_pool:
        _connection_pool.putconn(conn)


@contextmanager
def get_db_cursor():
    """上下文管理器：获取连接和游标"""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        return_connection(conn)


def test_connection():
    """测试数据库连接"""
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT 1")
            cur.fetchone()
        return True
    except Exception:
        return False
