import React from 'react';
import { Box, Grid } from '@mui/material';
import { getDayMonthFromDate } from '../../../utilities/DatetimeUtils';
import { weatherIcon } from '../../../utilities/IconsUtils';
import ErrorBox from '../../Reusable/ErrorBox';
import CityDateDetail from './CityDateDetail';
import TemperatureWeatherDetail from './TemperatureWeatherDetail';
import WeatherIconDetail from './WeatherIconDetail';
import Layout from '../../Reusable/Layout';

const dayMonth = getDayMonthFromDate();

const Details = ({ data }) => {
  const noDataProvided =
    !data || Object.keys(data).length === 0 || data.cod === '404';

  let content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided)
    content = (
      <Grid item xs={12}>
        <Box
          sx={{
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--card-radius)',
            padding: 'var(--card-padding)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <CityDateDetail city={data.city} date={dayMonth} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TemperatureWeatherDetail
            temperature={data.main.temp}
            description={data.weather[0].description}
            aqi={data.aqi}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <WeatherIconDetail src={weatherIcon(`${data.weather[0].icon}.png`)} />
        </Grid>
          </Grid>
        </Box>
      </Grid>
    );

  return <Layout title="CURRENT WEATHER" content={content} />;
};

export default Details;
