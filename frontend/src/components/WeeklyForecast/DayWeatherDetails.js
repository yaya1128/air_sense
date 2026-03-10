import { Box, Typography } from '@mui/material';
import React from 'react';
import { aqiLevelLabel } from '../../utilities/decisionUtils';

const DayWeatherDetails = (props) => {
  const label = props.pm25 != null ? aqiLevelLabel(props.pm25) : (props.description?.split(/\s+/).pop() || props.description);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        sx={{
          fontSize: { xs: '14px', sm: '16px' },
          fontWeight: 600,
          color: 'var(--text)',
        }}
      >
        {props.day}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src={props.src}
          alt=""
          sx={{ width: 28, height: 28, objectFit: 'contain' }}
        />
        <Typography
          sx={{
            fontSize: { xs: '12px', sm: '14px' },
            color: 'var(--sub)',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default DayWeatherDetails;
