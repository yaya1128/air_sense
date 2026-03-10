/**
 * Open-Meteo Air Quality API（免费、无需 key）
 * 补充 O₃、NO₂ 等 WAQI 可能缺失的污染物
 * 文档: https://open-meteo.com/en/docs/air-quality-api
 */
const BASE_URL = 'https://air-quality.api.open-meteo.com/v1/air-quality';
const MALAYSIA_LAT = 3.139;
const MALAYSIA_LON = 101.6869;

export async function fetchOpenMeteoAirQuality(lat = MALAYSIA_LAT, lon = MALAYSIA_LON) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'pm2_5,pm10,ozone,nitrogen_dioxide',
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Open-Meteo Air Quality API failed');
  return res.json();
}

/** 从 Open-Meteo 响应提取当前值（取第一个小时） */
export function parseOpenMeteoPollutants(data) {
  if (!data?.hourly) return null;
  const h = data.hourly;
  return {
    pm25: h.pm2_5?.[0] ?? null,
    pm10: h.pm10?.[0] ?? null,
    o3: h.ozone?.[0] ?? null,
    no2: h.nitrogen_dioxide?.[0] ?? null,
  };
}
