import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import WeeklyForecastItem from './WeeklyForecastItem';

const UnfedForecastItem = (props) => {
  return (
    <>
      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          paddingLeft: { xs: '12px', sm: '20px', md: '32px' },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '14px', sm: '16px' },
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          {props.day}
        </Typography>
        <Box
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '31px',
          }}
        >
          <Box
            component="img"
            sx={{
              width: { xs: '24px', sm: '28px', md: '31px' },
              height: 'auto',
              marginRight: '4px',
            }}
            alt="weather"
            src={props.src}
          />
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              color: 'var(--sub)',
            }}
          >
            {props.value}
          </Typography>
        </Box>
      </Grid>

      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WeeklyForecastItem
          type="temperature"
          value={props.value}
          color="black"
        />
        <WeeklyForecastItem type="clouds" value={props.value} color="black" />
      </Grid>

      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WeeklyForecastItem type="wind" value={props.value} color="green" />
        <WeeklyForecastItem type="humidity" value={props.value} color="green" />
      </Grid>
    </>
  );
};

export default UnfedForecastItem;
