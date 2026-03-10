import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Layout from '../Reusable/Layout';

const COLOR_MAP = {
  green: '#00e400',
  yellow: '#ffff00',
  orange: '#ff7e00',
  red: '#ff0000',
  maroon: '#7e0023',
  gray: '#666666',
};

const NextDayForecast = ({ data }) => {
  if (!data) return null;

  const { forecast_date, color, advisory, pm25_avg, risk_level } = data;
  const bgColor = COLOR_MAP[color] || COLOR_MAP.gray;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const content = (
    <Grid container spacing={2} sx={{ marginTop: '0.5rem' }}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${bgColor}22 0%, ${bgColor}44 100%)`,
            border: `2px solid ${bgColor}`,
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: bgColor,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 600,
                color: 'white',
                fontFamily: 'Poppins',
              }}
            >
              {formatDate(forecast_date)}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '18px', sm: '22px' },
                fontWeight: 700,
                color: 'white',
                fontFamily: 'Poppins',
                marginTop: '4px',
                textTransform: 'uppercase',
              }}
            >
              {advisory}
            </Typography>
            {pm25_avg != null && (
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '14px' },
                  color: 'rgba(255,255,255,0.8)',
                  marginTop: '4px',
                }}
              >
                PM2.5 avg: {pm25_avg} µg/m³ · Risk: {risk_level}
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Layout
      title="NEXT DAY FORECAST"
      content={content}
      mb="1rem"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 1rem',
      }}
    />
  );
};

export default NextDayForecast;
