"""Backend 入口 - FastAPI"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.aqi import router as aqi_router
from app.api.health import router as health_router
from app.api.forecast import router as forecast_router
from app.api.pollutants import router as pollutants_router
from app.api.alerts import router as alerts_router
from app.api.risk import router as risk_router

app = FastAPI(
    title="AirSense Backend",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aqi_router, prefix='/api', tags=['aqi'])
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(forecast_router, prefix="/api", tags=["forecast"])
app.include_router(pollutants_router, prefix="/api", tags=["pollutants"])
app.include_router(alerts_router, prefix="/api", tags=["alerts"])
app.include_router(risk_router, prefix="/api", tags=["risk"])


@app.get("/")
def index():
    return {"message": "AirSense Backend", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)
