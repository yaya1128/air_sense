import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

/**
 * Phase 4.1: 污染物网格 2×2
 * PM2.5 / PM10 / O₃ / NO₂，含数值、单位、状态徽章
 * 4.2: WAQI iaqi，缺项用占位
 */
const POLLUTANT_CONFIG = [
  { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', desc: 'Fine particles' },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', desc: 'Coarse particles' },
  { key: 'o3', label: 'O₃', unit: 'μg/m³', desc: 'Ozone' },
  { key: 'no2', label: 'NO₂', unit: 'μg/m³', desc: 'Nitrogen dioxide' },
];

function getStatusBadge(key, val) {
  if (val == null) return null;
  const num = Number(val);
  if (key === 'pm25' || key === 'pm10') {
    if (num <= 12) return { label: 'Good', color: 'var(--good)' };
    if (num <= 35) return { label: 'Moderate', color: 'var(--mod)' };
    if (num <= 55) return { label: 'Unhealthy', color: 'var(--usg)' };
    return { label: 'Poor', color: 'var(--bad)' };
  }
  if (key === 'o3') {
    if (num <= 60) return { label: 'Good', color: 'var(--good)' };
    if (num <= 100) return { label: 'Moderate', color: 'var(--mod)' };
    return { label: 'High', color: 'var(--usg)' };
  }
  if (key === 'no2') {
    if (num <= 40) return { label: 'Good', color: 'var(--good)' };
    if (num <= 80) return { label: 'Moderate', color: 'var(--mod)' };
    return { label: 'High', color: 'var(--usg)' };
  }
  return null;
}

const PollutantsCard = ({ pollutants }) => {
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
        Air Pollutants
      </Typography>
      <Grid container spacing={2}>
        {POLLUTANT_CONFIG.map(({ key, label, unit, desc }) => {
          const val = pollutants?.[key];
          const num = val != null ? Number(val) : null;
          const badge = getStatusBadge(key, val);
          const displayVal = num != null ? `${Math.round(num)} ${unit}` : '—';
          const color = badge?.color ?? 'var(--sub)';

          return (
            <Grid item xs={6} key={key}>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '14px 10px',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--sub)',
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: num != null ? color : 'var(--sub)',
                    mt: 0.5,
                  }}
                >
                  {displayVal}
                </Typography>
                {badge ? (
                  <Typography
                    sx={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: badge.color,
                      mt: 0.5,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {badge.label}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: '10px',
                      color: 'var(--sub)',
                      mt: 0.5,
                    }}
                  >
                    {desc}
                  </Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PollutantsCard;
