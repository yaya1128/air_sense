import { Box, Typography } from '@mui/material';
import React from 'react';
import { weatherIcon } from '../../../utilities/IconsUtils';

const DailyForecastItem = (props) => {
  return (
    <Box
      sx={{
        background: 'var(--white)',
        border: '1.5px solid var(--border)',
        borderRadius: '8px',
        textAlign: 'center',
        padding: '14px 12px',
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontWeight: '400',
          fontSize: { xs: '10px', sm: '12px' },
          color: 'var(--sub)',
          lineHeight: 1,
          padding: '4px',
          fontFamily: 'Poppins',
        }}
      >
        {props.item.time}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text)',
          padding: '4px',
        }}
      >
        <Box
          component="img"
          sx={{
            width: { xs: '36px', sm: '42px' },
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            margin: '0 auto',
          }}
          alt="weather"
          src={weatherIcon(
            props.item.icon
              ? (props.item.icon.endsWith('.png') ? props.item.icon : `${props.item.icon}.png`)
              : `${props.data.weather[0].icon}.png`
          )}
        />
      </Box>
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontWeight: '600',
          fontSize: { xs: '12px', sm: '14px' },
          color: 'var(--text)',
          lineHeight: 1.3,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {props.item.displayText || props.item.temperature}
      </Typography>
    </Box>
  );
};

export default DailyForecastItem;
