import React from 'react';
import { Box, Typography } from '@mui/material';
import { getWeekDays } from '../../utilities/DatetimeUtils';
import { aqiColor, aqiLevelLabel } from '../../utilities/decisionUtils';

function pm25ToAqi(pm25) {
  if (pm25 <= 12) return Math.round(50 * pm25 / 12);
  if (pm25 <= 35.4) return Math.round(50 + 50 * (pm25 - 12) / 23.4);
  if (pm25 <= 55.4) return Math.round(100 + 50 * (pm25 - 35.4) / 20);
  if (pm25 <= 150.4) return Math.round(150 + 100 * (pm25 - 55.4) / 95);
  return Math.min(300, Math.round(200 + 100 * (pm25 - 55.4) / 95));
}

/**
 * 周预报 — 全宽，横向 6 天块
 */
const WeeklyForecast = ({ data }) => {
  const noData = !data?.list?.length;
  const forecastDays = getWeekDays();

  if (noData) return null;

  const list = data.list.slice(0, 6);

  return (
    <Box
      sx={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '28px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Typography
          sx={{
            fontFamily: "'Fraunces', serif",
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          Weekly Forecast
        </Typography>
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            color: 'var(--sub)',
            textTransform: 'uppercase',
          }}
        >
          Next 6 days
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 1.25,
        }}
      >
        {list.map((item, idx) => {
          const pm25 = item.pm25 ?? item.avg ?? 0;
          const aqi = pm25ToAqi(pm25);
          const color = aqiColor(aqi);
          const dayLabel = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : (item.date ? new Date(item.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' }) : forecastDays[idx] || '—');
          const isToday = idx === 0;

          return (
            <Box
              key={idx}
              sx={{
                background: isToday ? `${color}0f` : 'rgba(0,0,0,0.03)',
                borderRadius: 8,
                padding: '16px 12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                border: isToday ? `1px solid ${color}4d` : '1px solid transparent',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
                '&:hover': { background: 'rgba(255,255,255,0.5)' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  color: isToday ? color : 'var(--sub)',
                  textTransform: 'uppercase',
                }}
              >
                {dayLabel}
              </Typography>
              <Box sx={{ fontSize: '1.3rem' }}>
                {aqi <= 50 ? '☀️' : aqi <= 100 ? '⛅' : '😷'}
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  background: 'rgba(0,0,0,0.08)',
                  borderRadius: '100px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${Math.min(100, aqi / 1.8)}%`,
                    background: color,
                    borderRadius: '100px',
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color,
                }}
              >
                {Math.round(aqi)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.62rem',
                  color: 'var(--sub)',
                }}
              >
                PM2.5 {pm25 != null ? Math.round(pm25) : '—'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color,
                }}
              >
                {aqiLevelLabel(aqi)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeeklyForecast;
