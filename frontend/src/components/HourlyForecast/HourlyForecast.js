import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { aqiColor } from '../../utilities/decisionUtils';
import { weatherIcon } from '../../utilities/IconsUtils';

/**
 * 根据 AQI 获取图标
 */
function getIconForAqi(aqi) {
  const v = Number(aqi) || 0;
  if (v <= 50) return '01d';
  if (v <= 100) return '02d';
  if (v <= 200) return '50d';
  return '50d';
}

const DEFAULT_VISIBLE = 6;

/**
 * Phase 3.1–3.5: 24 小时预测
 * 3.1 竖向列表，每行 ≥64px
 * 3.2 每行：时间
 * 3.3 当前小时高亮（蓝色背景 + "Now"）
 * 3.4 默认 6 条，底部「Show Full Day ▼」展开
 * 3.5 数据：WAQI/后端，无逐时用今日 3 时段 + 次日近似
 */
const HourlyForecast = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  if (!data?.slots?.length) return null;

  const { date, slots } = data;
  const currentHour = new Date().getHours();
  // 从当前小时开始排序，便于「Now」出现在前 6 条
  const orderedSlots = [...slots.slice(currentHour), ...slots.slice(0, currentHour)];
  const visibleSlots = expanded ? orderedSlots : orderedSlots.slice(0, DEFAULT_VISIBLE);
  const hasMore = orderedSlots.length > DEFAULT_VISIBLE;

  const formatDate = (d) => {
    const [, m, day] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${parseInt(day, 10)}`;
  };

  return (
    <Box
      sx={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 'var(--card-padding)',
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: 1.5,
          color: 'var(--sub)',
          textTransform: 'uppercase',
          mb: 1.5,
        }}
      >
        24-Hour Forecast · {formatDate(date)}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {visibleSlots.map((slot, idx) => {
          const isNow = slot.hour === currentHour;
          const color = aqiColor(slot.aqi);
          const icon = getIconForAqi(slot.aqi);
          return (
            <Box
              key={idx}
              sx={{
                minHeight: 64,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                padding: '0 16px',
                borderRadius: '6px',
                background: isNow ? 'rgba(0, 105, 148, 0.12)' : 'transparent',
                borderLeft: isNow ? '4px solid #006994' : '4px solid transparent',
              }}
            >
              <Typography
                sx={{
                  minWidth: 56,
                  fontSize: '16px',
                  fontWeight: isNow ? 800 : 600,
                  color: isNow ? '#006994' : 'var(--text)',
                }}
              >
                {isNow ? 'Now' : slot.label}
              </Typography>
              <Box
                component="img"
                src={weatherIcon(`${icon}.png`)}
                alt=""
                sx={{ width: 28, height: 28, objectFit: 'contain' }}
              />
              <Typography sx={{ fontSize: '16px', fontWeight: 800, color, minWidth: 36 }}>
                {slot.aqi}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: 'var(--sub)' }}>
                {slot.pm25} μg/m³
              </Typography>
            </Box>
          );
        })}
      </Box>
      {hasMore && (
        <Button
          fullWidth
          onClick={() => setExpanded(!expanded)}
          sx={{
            mt: 1,
            color: 'var(--sub)',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {expanded ? 'Show Less ▲' : 'Show Full Day ▼'}
        </Button>
      )}
    </Box>
  );
};

export default HourlyForecast;
