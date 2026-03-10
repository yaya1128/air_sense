import { Box, Typography } from '@mui/material';
import React from 'react';
import { aqiLevelLabel } from '../../../utilities/decisionUtils';

const TemperatureWeatherDetail = (props) => {
  const levelLabel = props.aqi != null ? aqiLevelLabel(props.aqi) : null;
  const desc = levelLabel || props.description?.split(/\s+/).pop() || '—';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        component="p"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '28px', sm: '32px' },
          color: 'var(--text)',
          lineHeight: 1.2,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {Math.round(props.temperature)} °C
      </Typography>
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontSize: { xs: '14px', sm: '16px' },
          color: 'var(--sub)',
          fontWeight: 500,
          mt: 0.5,
        }}
      >
        {desc}
      </Typography>
    </Box>
  );
};

export default TemperatureWeatherDetail;
