/**
 * WAQI (World Air Quality Index) API 服务
 * 文档: https://aqicn.org/api/
 * 马来西亚吉隆坡坐标: 3.1390, 101.6869
 */

const WAQI_API_URL = 'https://api.waqi.info';
const WAQI_TOKEN = '7030f542870e6d665f6f53ca145614e95e5b09ca';

// 马来西亚吉隆坡坐标
const MALAYSIA_LAT = 3.139;
const MALAYSIA_LON = 101.6869;

/**
 * 获取指定坐标的空气质量和天气相关数据
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @returns {Promise<Object>} WAQI API 响应数据
 */
export async function fetchWaqiData(lat, lon) {
  // try {
  //   const url = `${WAQI_API_URL}/feed/geo:${lat};${lon}/?token=${WAQI_TOKEN}`;
  //   const response = await fetch(url);
  //   const data = await response.json();

  //   if (data.status !== 'ok' || !data.data) {
  //     throw new Error(data.data?.message || 'WAQI API 请求失败');
  //   }

  //   return data.data;
  // } catch (error) {
  //   console.error('WAQI fetch error:', error);
  //   throw error;
  // }
}

/**
 * 获取马来西亚（吉隆坡）的空气质量和天气数据
 */
export async function fetchMalaysiaWaqiData() {
  return fetchWaqiData(MALAYSIA_LAT, MALAYSIA_LON);
}
