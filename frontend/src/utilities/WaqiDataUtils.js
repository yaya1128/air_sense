/**
 * 将 WAQI API 数据转换为应用所需的格式
 * WAQI 主要提供空气质量数据，同时包含温度、湿度、风速等
 */

/**
 * 根据 AQI 值获取描述和图标
 */
function getAqiDescriptionAndIcon(aqi) {
  const aqiNum = Number(aqi) || 0;
  if (aqiNum <= 50) {
    return { description: '空气质量良好 Good', icon: '01d.png' };
  }
  if (aqiNum <= 100) {
    return { description: '空气质量一般 Moderate', icon: '02d.png' };
  }
  if (aqiNum <= 150) {
    return { description: '空气质量不佳 Unhealthy for sensitive', icon: '02d.png' };
  }
  if (aqiNum <= 200) {
    return { description: '空气质量差 Unhealthy', icon: '50d.png' };
  }
  if (aqiNum <= 300) {
    return { description: '空气质量很差 Very unhealthy', icon: '50d.png' };
  }
  return { description: '空气质量危险 Hazardous', icon: '50d.png' };
}

/**
 * 将 WAQI 数据转换为 todayWeather 格式（兼容 OpenWeatherMap 结构）
 */
export function transformWaqiToTodayWeather(waqiData, cityLabel) {
  if (!waqiData || !waqiData.iaqi) return null;

  const iaqi = waqiData.iaqi;
  const { description, icon } = getAqiDescriptionAndIcon(waqiData.aqi);

  return {
    city: cityLabel || waqiData.city?.name || 'Kuala Lumpur, Malaysia',
    main: {
      temp: iaqi.t?.v ?? 0,
      feels_like: iaqi.t?.v ?? 0,
      humidity: iaqi.h?.v ?? 0,
    },
    weather: [
      {
        description,
        icon: icon.replace('.png', ''),
      },
    ],
    wind: {
      speed: iaqi.w?.v ?? 0,
    },
    clouds: {
      all: 0, // WAQI 无云量数据
    },
    aqi: waqiData.aqi,
    pm25:
      iaqi.pm25?.v ??
      (() => {
        const n = new Date();
        const today = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
        const todayFc = waqiData.forecast?.daily?.pm25?.find(
          (d) => d.day === today
        );
        return todayFc?.avg ?? null;
      })(),
  };
}

/**
 * 将 WAQI 数据转换为今日预报
 * WAQI 无逐小时数据，使用当日 PM2.5 的 min/avg/max 生成不同时段
 */
export function transformWaqiToTodayForecast(waqiData) {
  if (!waqiData || !waqiData.iaqi) return [];

  const iaqi = waqiData.iaqi;
  const temp = iaqi.t?.v ?? 0;
  const now = new Date();
  const currentDate =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // 从每日预报中找今天的数据
  const todayPm25 = waqiData.forecast?.daily?.pm25?.find(
    (d) => d.day === currentDate
  );

  if (todayPm25) {
    // 用 min/avg/max 生成三个不同时段，显示真实差异
    const slots = [
      { time: '06:00', value: todayPm25.min, label: 'min' },
      { time: '14:00', value: todayPm25.avg, label: 'avg' },
      { time: '22:00', value: todayPm25.max, label: 'max' },
    ];
    return slots.map((slot) => {
      const { icon } = getAqiDescriptionAndIcon(slot.value);
      return {
        time: slot.time,
        icon: icon.replace('.png', ''),
        temperature: `${Math.round(temp)} °C`,
        pm25: slot.value,
        displayText: `PM2.5 ${slot.value} μg/m³`,
      };
    });
  }

  // 无今日预报时，显示当前数据
  const { icon } = getAqiDescriptionAndIcon(waqiData.aqi);
  return [
    {
      time: 'Now',
      icon: icon.replace('.png', ''),
      temperature: `${Math.round(temp)} °C`,
      pm25: waqiData.aqi,
      displayText: `AQI ${waqiData.aqi}`,
    },
  ];
}

/**
 * 将 WAQI 每日预报转换为周预报格式
 * 每日 PM2.5/PM10 来自 API 真实数据，温度/湿度/风速沿用当前值（API 无每日数据）
 */
export function transformWaqiToWeekForecast(waqiData, cityLabel) {
  if (!waqiData?.forecast?.daily?.pm25) return [];

  const iaqi = waqiData.iaqi || {};
  const now = new Date();
  const today =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  let pm25List = waqiData.forecast.daily.pm25.filter((d) => d.day >= today);
  let pm10List = (waqiData.forecast.daily.pm10 || []).filter(
    (d) => d.day >= today
  );
  if (pm25List.length === 0) {
    pm25List = waqiData.forecast.daily.pm25;
    pm10List = waqiData.forecast.daily.pm10 || [];
  }

  return pm25List.slice(0, 6).map((pm25Item, idx) => {
    const { description, icon } = getAqiDescriptionAndIcon(pm25Item.avg);
    const pm10Item = pm10List.find((p) => p.day === pm25Item.day);

    return {
      date: pm25Item.day,
      temp: iaqi.t?.v ?? 0, // WAQI 无每日温度，使用当前温度
      humidity: iaqi.h?.v ?? 0,
      wind: iaqi.w?.v ?? 0,
      clouds: 0,
      description,
      icon,
      pm25: pm25Item.avg,
      pm10: pm10Item?.avg,
    };
  });
}

/**
 * Phase 3: 将 WAQI 每日数据插值为 24 小时预测（前端 fallback，与后端逻辑一致）
 * 典型曲线：6am=min, 2pm=avg, 10pm=max
 */
function interpolatePm25(hour, minVal, avgVal, maxVal) {
  if (hour <= 6) {
    const nightVal = (avgVal + maxVal) / 2;
    const t = hour / 6;
    return nightVal * (1 - t) + minVal * t;
  }
  if (hour <= 14) {
    const t = (hour - 6) / 8;
    return minVal * (1 - t) + avgVal * t;
  }
  if (hour <= 22) {
    const t = (hour - 14) / 8;
    return avgVal * (1 - t) + maxVal * t;
  }
  const t = (hour - 22) / 2;
  return maxVal * (1 - t) + (avgVal + minVal) / 2 * t;
}

function pm25ToAqi(pm25) {
  if (pm25 <= 12) return Math.round(50 * pm25 / 12);
  if (pm25 <= 35.4) return Math.round(50 + 50 * (pm25 - 12) / 23.4);
  if (pm25 <= 55.4) return Math.round(100 + 50 * (pm25 - 35.4) / 20);
  if (pm25 <= 150.4) return Math.round(150 + 100 * (pm25 - 55.4) / 95);
  if (pm25 <= 250.4) return Math.round(200 + 100 * (pm25 - 150.4) / 100);
  if (pm25 <= 500.4) return Math.round(300 + 200 * (pm25 - 250.4) / 250);
  return Math.min(500, Math.round(500 + (pm25 - 500.4) / 2));
}

export function transformWaqiTo24hForecast(waqiData) {
  if (!waqiData?.forecast?.daily?.pm25) return null;

  const pm25List = waqiData.forecast.daily.pm25;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const todayData = pm25List.find((d) => d.day === today) || pm25List[0];
  const tomorrowData = pm25List.find((d) => d.day === tomorrowStr) || pm25List[1] || todayData;

  const tMin = todayData?.min ?? 25;
  const tAvg = todayData?.avg ?? 35;
  const tMax = todayData?.max ?? 45;
  const tmMin = tomorrowData?.min ?? tMin;

  const slots = [];
  for (let h = 0; h < 24; h++) {
    const pm25 = h < 23
      ? interpolatePm25(h, tMin, tAvg, tMax)
      : (tMax + tmMin) / 2;
    slots.push({
      hour: h,
      label: `${String(h).padStart(2, '0')}:00`,
      pm25: Math.round(pm25 * 10) / 10,
      aqi: pm25ToAqi(pm25),
    });
  }

  return { date: today, slots };
}

/**
 * Phase 3.5: 无逐时数据时，用今日 3 时段 + 次日预报做近似
 * todayForecast: [{ time, pm25 }, ...] 来自 transformWaqiToTodayForecast
 * nextDayForecast: { pm25_avg } 来自后端
 */
export function build24hFrom3SlotsAndNext(todayForecast, nextDayForecast, waqiAqi) {
  const slots = [];
  const def = waqiAqi ? Math.round(waqiAqi * 0.4) : 35;
  const t06 = todayForecast?.find((s) => s.time === '06:00')?.pm25 ?? def;
  const t14 = todayForecast?.find((s) => s.time === '14:00')?.pm25 ?? def;
  const t22 = todayForecast?.find((s) => s.time === '22:00')?.pm25 ?? def;
  const tmr = nextDayForecast?.pm25_avg ?? nextDayForecast?.pm25 ?? t14;

  for (let h = 0; h < 24; h++) {
    const pm25 = h < 23 ? interpolatePm25(h, t06, t14, t22) : (t22 + tmr) / 2;
    slots.push({
      hour: h,
      label: `${String(h).padStart(2, '0')}:00`,
      pm25: Math.round(pm25 * 10) / 10,
      aqi: pm25ToAqi(pm25),
    });
  }

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return { date: today, slots };
}

/**
 * Phase 4: 污染物数据
 * WAQI iaqi: pm25, pm10, o3, no2 (部分站点可能缺项)
 * 缺项时从 forecast.daily 补充 PM2.5/PM10
 */
export function transformWaqiToPollutants(waqiData) {
  if (!waqiData) return null;

  const iaqi = waqiData.iaqi || {};
  const getIaqi = (key) => iaqi[key]?.v ?? null;

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayPm25 = waqiData.forecast?.daily?.pm25?.find((d) => d.day === today);
  const todayPm10 = waqiData.forecast?.daily?.pm10?.find((d) => d.day === today);

  const pm25FromAqi = (aqi) => {
    if (aqi <= 50) return Math.round(12 * aqi / 50);
    if (aqi <= 100) return Math.round(12 + 23.4 * (aqi - 50) / 50);
    if (aqi <= 150) return Math.round(35.4 + 20 * (aqi - 100) / 50);
    return Math.round(55.4 + 95 * (aqi - 150) / 150);
  };

  return {
    pm25: getIaqi('pm25') ?? getIaqi('pm2.5') ?? todayPm25?.avg ?? (waqiData.aqi ? pm25FromAqi(waqiData.aqi) : null),
    pm10: getIaqi('pm10') ?? todayPm10?.avg ?? null,
    o3: getIaqi('o3') ?? null,
    no2: getIaqi('no2') ?? null,
    so2: getIaqi('so2') ?? null,
    co: getIaqi('co') ?? null,
  };
}

/**
 * 合并 WAQI 与补充 API 污染物数据
 * 当 O₃、NO₂ 缺失时，基于 PM2.5 做粗略估算（仅作参考）
 */
export function mergePollutants(waqiPollutants, supplementPollutants) {
  const w = waqiPollutants || {};
  const s = supplementPollutants || {};
  const pm25 = w.pm25 ?? s.pm25 ?? null;
  const pm10 = w.pm10 ?? s.pm10 ?? null;
  let o3 = w.o3 ?? s.o3 ?? null;
  let no2 = w.no2 ?? s.no2 ?? null;

  // 当 O₃、NO₂ 仍为空且 PM2.5 有值时，用典型比例估算（CAMS 模型经验关系，仅供参考）
  if (pm25 != null && (o3 == null || no2 == null)) {
    if (o3 == null) o3 = Math.round(pm25 * 1.2 + 20); // O₃ 与颗粒物有相关性
    if (no2 == null) no2 = Math.round(pm25 * 0.8 + 5);  // NO₂ 与交通排放相关
  }

  return {
    pm25,
    pm10,
    o3,
    no2,
    so2: w.so2 ?? null,
    co: w.co ?? null,
  };
}
