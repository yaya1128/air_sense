import React from 'react';
import { Grid, Typography } from '@mui/material';
import DailyForecastItem from './DailyForecastItem';
import ErrorBox from '../../Reusable/ErrorBox';
import Layout from '../../Reusable/Layout';

const DailyForecast = ({ data, forecastList }) => {
  const noDataProvided =
    !data ||
    !forecastList ||
    Object.keys(data).length === 0 ||
    data.cod === '404' ||
    forecastList.cod === '404';

  let subHeader;

  if (!noDataProvided && forecastList.length > 0)
    subHeader = (
      <Typography
        variant="h5"
        component="h5"
        sx={{
          fontSize: { xs: '10px', sm: '12px' },
          textAlign: 'center',
          lineHeight: 1,
          color: 'var(--sub)',
          fontFamily: 'Roboto Condensed',
          marginBottom: '1rem',
        }}
      >
        {forecastList.length === 1
          ? '1 available forecast'
          : `${forecastList.length} available forecasts`}
      </Typography>
    );

  let content;

  if (noDataProvided) content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided && forecastList.length > 0)
    content = (
      <Grid
        item
        container
        xs={12}
        spacing={2}
        sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
      >
        {forecastList.map((item, idx) => (
          <Grid
            key={idx}
            item
            xs={4}
            sm={4}
            md={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <DailyForecastItem item={item} data={data} />
          </Grid>
        ))}
      </Grid>
    );

  if (!noDataProvided && forecastList && forecastList.length === 0)
    subHeader = (
      <ErrorBox
        flex="1"
        type="info"
        margin="2rem auto"
        errorMessage="No available forecasts for tonight."
      />
    );

  return (
    <Layout
      title="TODAY'S FORECAST"
      content={content}
      sectionSubHeader={subHeader}
      sx={{ marginTop: '2.9rem' }}
      mb="0.3rem"
    />
  );
};

export default DailyForecast;
