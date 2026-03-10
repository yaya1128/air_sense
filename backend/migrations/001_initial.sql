-- Step 0: 初始表结构
-- 执行: psql -U postgres -d weather_aqi -f migrations/001_initial.sql

-- 1. 原始 AQI 读数（时序主表）
CREATE TABLE IF NOT EXISTS aqi_readings (
    id              BIGSERIAL PRIMARY KEY,
    location_id     VARCHAR(50) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    recorded_at     TIMESTAMPTZ NOT NULL,
    aqi             INTEGER NOT NULL,
    pm25            DECIMAL(6,2),
    pm10            DECIMAL(6,2),
    source          VARCHAR(20) DEFAULT 'waqi',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, recorded_at)
);

-- 2. 每日聚合
CREATE TABLE IF NOT EXISTS daily_aggregates (
    id              BIGSERIAL PRIMARY KEY,
    location_id     VARCHAR(50) NOT NULL,
    date            DATE NOT NULL,
    aqi_avg         DECIMAL(6,2) NOT NULL,
    aqi_max         INTEGER NOT NULL,
    pm25_avg        DECIMAL(6,2),
    pm10_avg        DECIMAL(6,2),
    reading_count   INTEGER DEFAULT 1,
    UNIQUE(location_id, date)
);

-- 3. 预报缓存
CREATE TABLE IF NOT EXISTS forecast_cache (
    id              BIGSERIAL PRIMARY KEY,
    location_id     VARCHAR(50) NOT NULL,
    forecast_date   DATE NOT NULL,
    pm25_min        INTEGER,
    pm25_avg        INTEGER,
    pm25_max        INTEGER,
    risk_level      VARCHAR(10),
    advisory        VARCHAR(100),
    fetched_at      TIMESTAMPTZ NOT NULL,
    UNIQUE(location_id, forecast_date)
);

-- 4. 季节模式
CREATE TABLE IF NOT EXISTS seasonal_patterns (
    id              SERIAL PRIMARY KEY,
    location_id     VARCHAR(50) NOT NULL,
    pattern_type    VARCHAR(20) NOT NULL,
    start_month     INTEGER,
    end_month       INTEGER,
    risk_level      VARCHAR(10),
    description     TEXT,
    confidence      DECIMAL(3,2),
    computed_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_aqi_readings_location_time 
    ON aqi_readings(location_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_aggregates_location_date 
    ON daily_aggregates(location_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_forecast_cache_location_date 
    ON forecast_cache(location_id, forecast_date);
