import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * User Story 1.1: Location-based 实时告警
 * 大字号、简单文案、警告图标，老年人友好
 * AQI >= 151 (Unhealthy) 时显示，含用户所在区域
 */
const AlertBanner = ({ data }) => {
  if (!data?.active) return null;

  const { message, aqi, location } = data;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: { xs: '1rem', sm: '1.5rem 2rem' },
        marginBottom: '1rem',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
        border: '3px solid #fff',
        boxShadow: '0 4px 20px rgba(255,0,0,0.4)',
      }}
    >
      <WarningAmberIcon
        sx={{
          fontSize: { xs: 48, sm: 64 },
          color: 'white',
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: { xs: '20px', sm: '28px', md: '32px' },
            fontWeight: 700,
            color: 'white',
            fontFamily: 'DM Sans, Noto Sans SC, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {message}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '14px', sm: '16px' },
            color: 'rgba(255,255,255,0.9)',
            marginTop: '4px',
          }}
        >
          {location
            ? `Air quality is poor in ${location}. Stay inside. AQI: ${aqi}`
            : `Air quality is unhealthy. Stay indoors. AQI: ${aqi}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default AlertBanner;
