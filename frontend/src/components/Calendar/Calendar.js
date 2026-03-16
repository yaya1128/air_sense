import React, { useMemo, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { aqiColor, aqiLevelLabel, getRiskLevelIndex } from '../../utilities/decisionUtils';
import { pm25ToAqi } from '../../utilities/WaqiDataUtils';

function getAQIMeta(aqi) {
  if (aqi === undefined || aqi === null) {
    return {
      color: '#f3f4f6',
      textColor: 'var(--sub)',
      label: 'No data',
    };
  }

  const riskLevel = getRiskLevelIndex(aqi);
  const darkText = aqi <= 100;

  return {
    color: aqiColor(aqi),
    textColor: darkText ? '#111827' : '#ffffff',
    label: aqiLevelLabel(aqi),
    riskLevel,
  };
}

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  return days;
}

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function AQICalendar({ aqiData = {}, weekForecast = [] }) {
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Convert forecast into date -> AQI map
  const forecastMap = useMemo(() => {
    if (!weekForecast?.length) return {};

    const map = {};

    weekForecast.slice(0, 6).forEach((item) => {
      if (!item?.date) return;

      const pm25 = item.pm25 ?? item.avg ?? 0;
      const aqi = pm25ToAqi(pm25);

      const key = new Date(item.date)
        .toISOString()
        .slice(0, 10);

      map[key] = {
        aqi,
        pm25,
        forecast: true
      };
    });

    return map;
  }, [weekForecast]);

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const minDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => generateCalendarDays(year, month), [year, month]);

  const changeMonth = (direction) => {
    const newDate = new Date(year, month + direction, 1);
    if (newDate >= minDate && newDate <= maxDate) {
      setCurrentDate(newDate);
    }
  };

  const monthLabel = currentDate.toLocaleDateString('en-MY', {
    month: 'long',
    year: 'numeric',
  });

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box
      sx={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: { xs: 2.5, sm: 3 },
        p: { xs: 1.25, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -80,
          right: -80,
          width: 240,
          height: 240,
          background:
            'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 1.75, sm: 2.5 },
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: { xs: '0.66rem', sm: '0.72rem' },
                letterSpacing: '0.12em',
                color: 'var(--sub)',
                textTransform: 'uppercase',
                mb: 0.4,
              }}
            >
              AQI Calendar
            </Typography>

            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: { xs: '1.15rem', sm: '1.8rem' },
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.1,
              }}
            >
              {monthLabel}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
            <IconButton
              onClick={() => changeMonth(-1)}
              disabled={currentDate <= minDate}
              size="small"
              sx={{
                border: '1px solid var(--border)',
                background: 'var(--white)',
                borderRadius: 2,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                '&:hover': {
                  background: 'rgba(0,0,0,0.03)',
                },
              }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => changeMonth(1)}
              disabled={currentDate >= maxDate}
              size="small"
              sx={{
                border: '1px solid var(--border)',
                background: 'var(--white)',
                borderRadius: 2,
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                '&:hover': {
                  background: 'rgba(0,0,0,0.03)',
                },
              }}
            >
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: { xs: 0.55, sm: 1 },
          }}
        >
          {weekdayLabels.map((label) => (
            <Box
              key={label}
              sx={{
                textAlign: 'center',
                py: { xs: 0.5, sm: 1 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '0.58rem', sm: '0.72rem' },
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--sub)',
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}

          {days.map((day, index) => {
            if (!day) {
              return (
                <Box
                  key={`empty-${index}`}
                  sx={{
                    minHeight: { xs: 60, sm: 84 },
                  }}
                />
              );
            }

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const actualAqi = aqiData[dateKey];
            const forecast = forecastMap[dateKey];

            const aqi = actualAqi ?? forecast?.aqi;
            const isForecast = actualAqi == null && forecast?.forecast;

            const { color, textColor, label } = getAQIMeta(aqi);

            const cellDate = new Date(year, month, day);
            const isToday = isSameDate(cellDate, todayOnly);
            const isPast = cellDate < todayOnly;

            return (
              <Box
                key={dateKey}
                title={aqi != null ? `AQI: ${aqi} · ${label}` : 'No data'}
                sx={{
                  minHeight: { xs: 60, sm: 84 },
                  borderRadius: { xs: 2, sm: 2.5 },
                  px: { xs: 0.75, sm: 1 },
                  py: { xs: 0.65, sm: 0.9 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  // background:
                  //   aqi != null
                  //     ? `linear-gradient(180deg, ${color}f2 0%, ${color}d9 100%)`
                  //     : 'linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%)',
                  background:
                  aqi != null
                    ? isForecast
                      ? `repeating-linear-gradient(
                          135deg,
                          ${color}cc,
                          ${color}cc 6px,
                          ${color}aa 6px,
                          ${color}aa 12px
                        )`
                      : `linear-gradient(180deg, ${color}ee 0%, ${color}cc 100%)`
                    : 'linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%)',
                  border: isToday
                    ? '2px solid #111827'
                    : aqi != null
                      ? '1px solid rgba(255,255,255,0.18)'
                      : '1px solid var(--border)',
                  opacity: isPast ? 0.58 : 1,
                  boxShadow: isToday
                    ? '0 0 0 4px rgba(17,24,39,0.10), 0 12px 28px rgba(0,0,0,0.16)'
                    : 'none',
                  transform: isToday ? 'translateY(-2px) scale(1.02)' : 'none',
                  transition:
                    'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease',
                  '&:hover': {
                    transform: isToday ? 'translateY(-3px) scale(1.025)' : 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    opacity: 1,
                  },
                  '&::after': isToday
                    ? {
                        content: '"Today"',
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        fontSize: { xs: '0.48rem', sm: '0.56rem' },
                        lineHeight: 1,
                        px: 0.7,
                        py: 0.35,
                        borderRadius: 999,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: '#111827',
                        background: 'rgba(255,255,255,0.92)',
                        border: '1px solid rgba(17,24,39,0.08)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }
                    : undefined,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.74rem', sm: '0.84rem' },
                    fontWeight: 800,
                    color: textColor,
                    lineHeight: 1,
                  }}
                >
                  {day}
                </Typography>

                <Box sx={{ mt: { xs: 0.75, sm: 1 } }}>
                  <Typography
                    sx={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: { xs: '0.92rem', sm: '1.15rem' },
                      fontWeight: 700,
                      lineHeight: 1,
                      color: textColor,
                    }}
                  >
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: { xs: '0.52rem', sm: '0.62rem' },
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: textColor,
                      opacity: 0.88,
                    }}
                  >
                    {aqi != null ? 'AQI' : 'No data'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}