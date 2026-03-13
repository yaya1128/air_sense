from fastapi import APIRouter, Query
from app.services.waqi_client import fetch_waqi_data

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
    # data['aqi'] = 50
    # raise Exception()
    return data
