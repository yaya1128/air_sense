-- stations 表
CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    waqi_uid INT UNIQUE NOT NULL,
    name VARCHAR(200),
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 实时空气质量
CREATE TABLE IF NOT EXISTS air_quality_hourly (
    id SERIAL PRIMARY KEY,
    station_id INT REFERENCES stations(id),
    timestamp TIMESTAMP NOT NULL,
    aqi INT,
    pm25 FLOAT,
    pm10 FLOAT,
    o3 FLOAT,
    no2 FLOAT,
    co FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (station_id, timestamp)
);

-- 预测数据
CREATE TABLE IF NOT EXISTS daily_forecast (
    id SERIAL PRIMARY KEY,
    station_id INT REFERENCES stations(id),
    date DATE NOT NULL,
    pm25_min FLOAT,
    pm25_avg FLOAT,
    pm25_max FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (station_id, date)
);

-- 查询最近站点用
CREATE INDEX IF NOT EXISTS idx_station_location
ON stations (lat, lon);