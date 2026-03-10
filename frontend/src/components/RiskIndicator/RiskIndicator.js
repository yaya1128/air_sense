import React from 'react';
import { Box, Typography } from '@mui/material';
import { RISK_LEVELS, getRiskLevelIndex } from '../../utilities/decisionUtils';

/**
 * Phase 2.1–2.4: 五色风险等级指示器
 * 2.1 5 个等级横向排列：圆点、等级名、AQI 区间、行为徽章
 * 2.2 行为文案：Go Outside / Limit Time / Stay Inside / Stay Home / Emergency
 * 2.3 当前等级高亮：边框 + 轻微上移 + 缩放
 * 2.4 沿用 /api/risk/current (data)
 */
const RiskIndicator = ({ data, aqi: aqiProp }) => {
  const aqi = data?.aqi ?? aqiProp;
  if (aqi == null) return null;

  const currentIndex = getRiskLevelIndex(aqi);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 1.5 },
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 'var(--card-padding)',
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 10,
      }}
    >
      {RISK_LEVELS.map((level, idx) => {
        const isActive = idx === currentIndex;
        return (
          <Box
            key={level.label}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              minWidth: { xs: 72, sm: 88 },
              maxWidth: { xs: 100, sm: 120 },
              padding: '12px 8px',
              borderRadius: '8px',
              border: isActive ? `3px solid ${level.color}` : '3px solid transparent',
              transform: isActive ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
              transition: 'transform 0.2s, border 0.2s',
              background: isActive ? `${level.color}08` : 'transparent',
            }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: level.color,
                flexShrink: 0,
                mb: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: isActive ? 800 : 600,
                color: isActive ? 'var(--text)' : 'var(--sub)',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {level.label}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '10px', sm: '11px' },
                color: 'var(--sub)',
                textAlign: 'center',
                mt: 0.25,
              }}
            >
              {level.aqiRange}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: isActive ? 800 : 600,
                color: level.color,
                textAlign: 'center',
                mt: 0.5,
                lineHeight: 1.2,
              }}
            >
              {level.action}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default RiskIndicator;
