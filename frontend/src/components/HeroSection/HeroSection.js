import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  getDecision,
  aqiColor,
  aqiLevelLabel,
} from '../../utilities/decisionUtils';
import HealthTipsCard from '../HealthTipsCard/HealthTipsCard';
import RiskIndicator from '../RiskIndicator/RiskIndicator';

/**
 * Hero 左右分栏：主 AQI 左 + 健康建议+明日 右
 */
const HeroSection = ({
  todayWeather,
  nextDayForecast,
  onTomorrowClick,
  onboardingData,
}) => {
  const todayAqi = todayWeather?.aqi ?? 0;
  const todayDecision = getDecision(todayAqi);

  const tmrAqi = nextDayForecast?.aqi ?? nextDayForecast?.pm25_avg ?? 0;
  const tmrDecision = getDecision(tmrAqi);
  const tmrPm25 = nextDayForecast?.pm25_avg;

  const aqiColorVal = aqiColor(todayAqi);

  const formatDate = (isTomorrow = false) => {
    const d = new Date();
    if (isTomorrow) d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-MY', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 380px' },
        gap: 2,
        alignItems: 'stretch',
      }}
    >
      {/* 左：主 AQI 卡片 */}
      <Box
        sx={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 3,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 340,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${aqiColorVal}14 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: 'var(--sub)',
                  textTransform: 'uppercase',
                }}
              >
                {formatDate(false)}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mt: 1,
                  background: `${aqiColorVal}1f`,
                  border: `1px solid ${aqiColorVal}40`,
                  borderRadius: 1,
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: aqiColorVal,
                }}
              >
                {todayDecision.headline} · {todayDecision.sub}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, my: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: { xs: '5rem', sm: '6rem', md: '7rem' },
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: aqiColorVal,
                textShadow: `0 2px 20px ${aqiColorVal}26`,
              }}
            >
              {todayAqi}
            </Typography>
            <Box sx={{ pb: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                {aqiLevelLabel(todayAqi)}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'var(--sub)' }}>
                Air Quality Index
              </Typography>
            </Box>
          </Box>
          <Grid item xs={12}>
            <RiskIndicator
              aqi={todayAqi}
            />
          </Grid>
        </Box>
      </Box>

      {/* 右：健康建议 + 明日 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <HealthTipsCard
            aqi={todayAqi}
            onboardingData={onboardingData}
          />
        </Box>
        <Box
          onClick={onTomorrowClick}
          sx={{
            background: `linear-gradient(135deg, ${aqiColor(tmrAqi)}20 0%, ${aqiColor(tmrAqi)}10 100%)`,
            border: `1px solid ${aqiColor(tmrAqi)}33`,
            borderRadius: 10,
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: onTomorrowClick ? 'pointer' : 'default',
            transition: 'transform 0.18s, box-shadow 0.18s',
            '&:hover': onTomorrowClick
              ? { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
              : {},
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
                color: 'var(--sub)',
                textTransform: 'uppercase',
              }}
            >
              Tomorrow · {formatDate(true)}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: aqiColor(tmrAqi),
                mt: 0.5,
              }}
            >
              {tmrDecision.headline}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'var(--sub)', mt: 0.25 }}>
              {tmrPm25 != null
                ? `PM2.5 avg ${tmrPm25} µg/m³ · ${aqiLevelLabel(tmrAqi)}`
                : `Risk: ${aqiLevelLabel(tmrAqi)}`}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: '2.8rem',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: aqiColor(tmrAqi),
              }}
            >
              {tmrAqi}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                color: 'var(--sub)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                mt: 0.25,
              }}
            >
              AQI Index
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
