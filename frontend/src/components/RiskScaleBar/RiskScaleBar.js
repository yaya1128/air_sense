import React from 'react';
import { Box, Typography } from '@mui/material';
import { RISK_LEVELS, getRiskLevelIndex } from '../../utilities/decisionUtils';

/**
 * Phase 2: 五色风险等级刻度条
 * 水平条展示 Good | Moderate | Unhealthy | Very Unhealthy | Hazardous
 * 当前 AQI 对应段高亮（老年人友好：大字号、高对比）
 */
const RiskScaleBar = ({ aqi, showLabels = true }) => {
  const currentIndex = getRiskLevelIndex(aqi);

  return (
    <Box
      sx={{
        background: 'var(--white)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--card-radius)',
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
        Air Quality Index
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          height: { xs: 16, sm: 20 },
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {RISK_LEVELS.map((level, idx) => {
          const isActive = idx === currentIndex;
          return (
            <Box
              key={level.label}
              sx={{
                flex: 1,
                background: level.color,
                opacity: isActive ? 1 : 0.4,
                transition: 'opacity 0.2s',
                borderRight: idx < RISK_LEVELS.length - 1 ? '1px solid rgba(255,255,255,0.4)' : 'none',
                boxShadow: isActive ? '0 0 0 1.5px rgba(0,0,0,0.2)' : 'none',
              }}
              title={level.label}
              aria-label={level.label}
            />
          );
        })}
      </Box>
      {showLabels && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 1,
            gap: 0.5,
          }}
        >
          {RISK_LEVELS.map((level, idx) => {
            const isActive = idx === currentIndex;
            return (
              <Typography
                key={level.label}
                sx={{
                  flex: 1,
                  fontSize: { xs: '12px', sm: '13px' },
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? 'var(--text)' : 'var(--sub)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {level.label}
              </Typography>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default RiskScaleBar;
