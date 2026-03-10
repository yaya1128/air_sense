/**
 * Onboarding 5.4: localStorage 存储
 * 5.5: 条件徽章与健康建议个性化映射
 */

const STORAGE_KEY = 'airsense_onboarding';

export const HEALTH_CONDITIONS = [
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'heart', label: 'Heart Disease' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'pneumonia', label: 'Post-Pneumonia' },
  { id: 'none', label: 'No conditions' },
];

export const AGE_GROUPS = [
  { id: '60-65', label: '60–65' },
  { id: '66-70', label: '66–70' },
  { id: '71-80', label: '71–80' },
  { id: '80+', label: '80+' },
];

export function loadOnboarding() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveOnboarding(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function hasCompletedOnboarding() {
  const data = loadOnboarding();
  return data != null && (data.conditions?.length > 0 || data.ageGroup);
}

/**
 * 5.5: 条件徽章文案
 */
export function getConditionBadgeLabel(conditions) {
  if (!conditions?.length) return null;
  const hasNone = conditions.includes('none');
  if (hasNone || conditions.length === 0) return 'General Profile';
  const labels = conditions
    .filter((c) => c !== 'none')
    .map((id) => HEALTH_CONDITIONS.find((h) => h.id === id)?.label || id);
  return labels.join(' · ');
}

/**
 * 5.5: 个性化健康建议（基础映射）
 */
export function getPersonalizedTips(conditions, ageGroup, aqi) {
  const v = Number(aqi) || 0;
  const tips = [];

  const baseTips = (() => {
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
  })();

  tips.push(...baseTips);

  // 条件个性化追加
  if (conditions?.includes('hypertension') && v > 50) {
    tips.push('Fine particles raise blood pressure. Avoid the afternoon peak (2–4 PM).');
  }
  if (conditions?.includes('asthma')) {
    tips.push('Carry your rescue inhaler. If air quality worsens, use it and head indoors.');
  }
  if (conditions?.includes('heart') && v > 100) {
    tips.push('Avoid strenuous activity during pollution peaks. Chest pain warrants immediate medical attention.');
  }
  if (conditions?.includes('diabetes') && v > 100) {
    tips.push('Monitor blood sugar more closely. Pollution can affect glucose levels.');
  }
  if (conditions?.includes('pneumonia')) {
    tips.push('Your lungs are still recovering. Focus on light indoor activity, keep windows closed.');
  }

  // 年龄段追加（80+ 更保守）
  if (ageGroup === '80+' && v > 50) {
    tips.push('Take extra care. Limit outdoor time to under 15 minutes when AQI is elevated.');
  }

  return tips.slice(0, 6);
}
