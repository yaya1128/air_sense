/**
 * 后端 API 调用
 * REACT_APP_API_URL 默认 http://localhost:5001
 * User Story 1.1: 支持 lat/lon 实现 location-based 告警
 */
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function withCoords(url, lat, lon) {
  if (lat != null && lon != null) {
    const u = new URL(url);
    u.searchParams.set('lat', lat);
    u.searchParams.set('lon', lon);
    return u.toString();
  }
  return url;
}

export async function fetchNextDayForecast(lat, lon) {
  const res = await fetch(withCoords(`${API_BASE}/api/forecast/next-day`, lat, lon));
  if (!res.ok) throw new Error('Forecast API failed');
  return res.json();
}

/**
 * Phase 3: 24 小时预测
 */
export async function fetch24hForecast(lat, lon) {
  const res = await fetch(withCoords(`${API_BASE}/api/forecast/24h`, lat, lon));
  if (!res.ok) throw new Error('24h Forecast API failed');
  return res.json();
}

export async function fetchAlertStatus(lat, lon) {
  const res = await fetch(withCoords(`${API_BASE}/api/alerts/status`, lat, lon));
  if (!res.ok) throw new Error('Alert API failed');
  return res.json();
}

export async function fetchRiskCurrent(lat, lon) {
  const res = await fetch(withCoords(`${API_BASE}/api/risk/current`, lat, lon));
  if (!res.ok) throw new Error('Risk API failed');
  return res.json();
}

/**
 * Phase 4: 污染物数据（后端代理 Open-Meteo，补充 O₃、NO₂）
 * 返回 { pm25, pm10, o3, no2 }
 */
export async function fetchPollutantsFromBackend() {
  const res = await fetch(`${API_BASE}/api/pollutants/open-meteo`);
  if (!res.ok) throw new Error('Pollutants API failed');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
