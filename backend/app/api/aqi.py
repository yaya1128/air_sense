from fastapi import APIRouter, Query
from app.services.waqi_client import fetch_waqi_data

from pydantic import BaseModel
import psycopg2
from psycopg2.extras import execute_values
from config import DATABASE_URL

router = APIRouter()

@router.get("/aqi")
def get_aqi(
    lat: float = Query(),
    lon: float = Query(),
):
    data = fetch_waqi_data(lat, lon)
    # return {
    #     'city': data.get('city'),
    #     'aqi': data.get('aqi'),
    #     'time': data.get('time')
    # }
    # data['aqi'] = 150
    # raise Exception()
    return data

class StationData(BaseModel):
    waqi_uid: str
    name: str
    lat: float
    lon: float

@router.post('/station')
def post_station(station: StationData):
    print(station)
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                        INSERT INTO stations
                        (waqi_uid, name, lat, lon)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT DO NOTHING        
                        """, (station.waqi_uid, station.name, station.lat, station.lon))

class AQIData(BaseModel):
    aqi_data: list

@router.post("/aqi")
def post_aqi(data: AQIData):
    data_to_insert = list(map(lambda r: (
        int(r['stationId']),
        r['date'],
        float(r['pm25']) if r['pm25'].strip() or None else None,
        float(r['pm10']) if r['pm10'].strip() or None else None,
        float(r['o3']) if r['o3'].strip() or None else None,
        float(r['no2']) if r['no2'].strip() or None else None,
        float(r['co']) if r['co'].strip() or None else None,
        float(r['aqi']) if r['aqi'].strip() or None else None,
    ), data.aqi_data))
    print(data_to_insert[:3])
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            sql = """
                INSERT INTO air_quality_hourly (station_id, timestamp, pm25, pm10, o3, no2, co, aqi)
                SELECT 
                    s.id, 
                    t.timestamp::timestamp,  -- <--- Add the cast here
                    t.pm25::float, 
                    t.pm10::float, 
                    t.o3::float, 
                    t.no2::float, 
                    t.co::float, 
                    t.aqi::float
                FROM (VALUES %s) AS t(waqi_uid, timestamp, pm25, pm10, o3, no2, co, aqi)
                JOIN stations s ON s.waqi_uid = t.waqi_uid::int
                ON CONFLICT DO NOTHING
            """
            # Use execute_values instead of cur.executemany
            execute_values(cur, sql, data_to_insert)
