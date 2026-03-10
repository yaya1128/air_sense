/**
 * AirSense Decision Utils — Single Source of Truth
 * Canonical mapping: AQI → Decision headline + sub-label
 */

/**
 * Get decision for display. ALL CAPS headline, max 3 words.
 */
export function getDecision(aqi) {
  const v = Number(aqi) || 0;
  if (v <= 50) return { headline: 'GO OUTSIDE', sub: 'Air is safe. Enjoy your day.' };
  if (v <= 100) return { headline: 'LIMIT OUTDOOR', sub: 'Reduce time outside.' };
  if (v <= 200) return { headline: 'STAY INSIDE', sub: 'Air is unhealthy today.' };
  if (v <= 300) return { headline: 'STAY HOME', sub: 'Do not go outside.' };
  return { headline: 'EMERGENCY', sub: 'Seek medical advice if unwell.' };
}

/**
 * Background gradient per AQI level (Malaysian API standard)
 */
export function aqiGradient(aqi) {
  const v = Number(aqi) || 0;
  if (v <= 50) return 'linear-gradient(135deg, #1e7a38, #2E9E4F)';
  if (v <= 100) return 'linear-gradient(135deg, #A87C00, #C9A800)';
  if (v <= 200) return 'linear-gradient(135deg, #B85000, #E07000)';
  if (v <= 300) return 'linear-gradient(135deg, #8B1010, #C0252A)';
  return 'linear-gradient(135deg, #3d0516, #6B0F2A)';
}

/**
 * AQI color hex for badges, bars, dots
 */
export function aqiColor(aqi) {
  const v = Number(aqi) || 0;
  if (v <= 50) return '#2E9E4F';
  if (v <= 100) return '#C9A800';
  if (v <= 200) return '#E07000';
  if (v <= 300) return '#C0252A';
  return '#6B0F2A';
}

/**
 * Risk level label (Title Case)
 */
export function aqiLevelLabel(aqi) {
  const v = Number(aqi) || 0;
  if (v <= 50) return 'Good';
  if (v <= 100) return 'Moderate';
  if (v <= 200) return 'Unhealthy';
  if (v <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Phase 2: 五色风险等级配置
 * 与 backend risk_mapper 及 index.css 变量一致
 * 2.2 行为徽章：Go Outside / Limit Time / Stay Inside / Stay Home / Emergency
 */
export const RISK_LEVELS = [
  { aqiMax: 50, color: 'var(--good)', label: 'Good', aqiRange: '0–50', action: 'Go Outside' },
  { aqiMax: 100, color: 'var(--mod)', label: 'Moderate', aqiRange: '51–100', action: 'Limit Time' },
  { aqiMax: 200, color: 'var(--usg)', label: 'Unhealthy', aqiRange: '101–200', action: 'Stay Inside' },
  { aqiMax: 300, color: 'var(--bad)', label: 'Very Unhealthy', aqiRange: '201–300', action: 'Stay Home' },
  { aqiMax: 1000, color: 'var(--hazard)', label: 'Hazardous', aqiRange: '301+', action: 'Emergency' },
];

/**
 * 获取当前 AQI 对应的风险等级索引 (0–4)
 */
export function getRiskLevelIndex(aqi) {
  const v = Number(aqi) || 0;
  for (let i = 0; i < RISK_LEVELS.length; i++) {
    if (v <= RISK_LEVELS[i].aqiMax) return i;
  }
  return 4;
}

/**
 * Phase 4.3: 健康建议三档 — 普通 / 紧急 / 严重
 * 4.4: 默认通用建议，支持个性化覆盖
 * @param {number} aqi
 * @param {Object} options - 预留个性化逻辑接口
 * @param {Array<string>} [options.customTips] - 覆盖默认建议
 * @param {Function} [options.getTips] - (aqi) => tips 自定义逻辑
 */
export function getHealthTips(aqi, options = {}) {
  const { customTips, getTips } = options;
  if (Array.isArray(customTips) && customTips.length > 0) return customTips;
  if (typeof getTips === 'function') {
    const tips = getTips(aqi);
    if (tips?.length) return tips;
  }

  const v = Number(aqi) || 0;
  if (v <= 50) {
    return [
      'Enjoy outdoor activities safely.',
      'Good time for a walk or exercise.',
      'Windows can stay open for fresh air.',
    ];
  }
  if (v <= 100) {
    return [
      'Finish outdoor activities before 9 AM.',
      'Reduce prolonged outdoor exposure.',
      'Sensitive people: limit heavy exercise.',
    ];
  }
  if (v <= 150) {
    return [
      'Stay indoors when possible.',
      'Close windows to reduce indoor pollution.',
      'Use air purifier if available.',
    ];
  }
  if (v <= 200) {
    return [
      'Rest at home today.',
      'Avoid outdoor exercise completely.',
      'Wear N95 mask if you must go out.',
    ];
  }
  return [
    'Do not go outside.',
    'Seek medical advice if unwell.',
    'Keep windows and doors closed.',
  ];
}

/** Phase 4.3: 三档 — 普通(0-100) / 紧急(101-200) / 严重(201+) */
export function getHealthTipsTier(aqi) {
  const v = Number(aqi) || 0;
  if (v <= 100) return { tier: 'normal', label: 'Normal', color: 'var(--good)' };
  if (v <= 200) return { tier: 'urgent', label: 'Urgent', color: 'var(--usg)' };
  return { tier: 'severe', label: 'Severe', color: 'var(--bad)' };
}
