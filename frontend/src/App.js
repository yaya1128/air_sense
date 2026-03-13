import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import AlertModal from './components/AlertModal/AlertModal';
// import OnboardingModal from './components/OnboardingModal/OnboardingModal';
import HeroSection from './components/HeroSection/HeroSection';
import HourlyForecast from './components/HourlyForecast/HourlyForecast';
// import { fetchWaqiData } from './api/WaqiService';
import { fetchAqiData, fetchNextDayForecast, fetch24hForecast, fetchHistForecast } from './api/backendApi';
import ErrorBox from './components/Reusable/ErrorBox';
import {
  transformWaqiToTodayWeather,
  transformWaqiToTodayForecast,
  transformWaqiToWeekForecast,
  transformWaqiTo24hForecast,
  build24hFrom3SlotsAndNext,
} from './utilities/WaqiDataUtils';
import { getDecision } from './utilities/decisionUtils';
import AQICalendar from './components/Calendar/Calendar';
// import { loadOnboarding } from './utilities/onboardingUtils';

const MALAYSIA_CITY_LABEL = 'Kuala Lumpur, Malaysia';
const MALAYSIA_LAT = 3.139;
const MALAYSIA_LON = 101.6869;

/** User Story 1.1: 获取用户位置，失败则用吉隆坡 */
function useUserLocation() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.debug(`Using default location: ${MALAYSIA_LAT}, ${MALAYSIA_LON}`);
      setCoords({ lat: MALAYSIA_LAT, lon: MALAYSIA_LON });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.debug(`Using real user location: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => console.error(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return coords;
}

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [nextDayForecast, setNextDayForecast] = useState(null);
  const [forecast24h, setForecast24h] = useState(null);
  const [forecastHist, setForecastHist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [lastDismissTime, setLastDismiss] = useState(0);

  const coords = useUserLocation();

  const currentAqi = todayWeather?.aqi ?? 0;
  const locationLabel = todayWeather?.city || '—';

  // Handle showAlertModal
  const handleShowAlert = (aqi) => {
    console.log(aqi, showAlertModal, Date.now() > lastDismissTime + 30000)
    if (aqi > 100 && !showAlertModal && Date.now() > lastDismissTime + 30000) {
      // Show alert
      console.debug('Show alert');
      setShowAlertModal(true);
      return;
    }

    if (aqi <= 100 && showAlertModal) {
      // Dismiss alert
      setTimeout(() => {
        setShowAlertModal(false);
        setLastDismiss(Date.now());
        console.debug(`Auto dismiss alert`);
      }, 5000); // 5 second delay
      return;
    }
  }

  // Load data
  useEffect(() => {
    if (coords == null) return;

    const loadWeather = async () => {
      try {
        const { lat, lon } = coords;
        const now = new Date();
        const histStart = new Date();
        histStart.setMonth(now.getMonth() - 3);
        const histEnd = new Date();
        histEnd.setMonth(now.getMonth() + 3);
        const [waqiData, forecastData, forecast24hData, histForecast] = await Promise.all([
          fetchAqiData(lat, lon),
          fetchNextDayForecast(lat, lon).catch(() => null),
          fetch24hForecast(lat, lon).catch(() => null),
          fetchHistForecast(histStart.toISOString().split('T')[0], histEnd.toISOString().split('T')[0]),
        ]);

        const cityLabel =
          waqiData.city?.name || MALAYSIA_CITY_LABEL;

        setTodayWeather(
          transformWaqiToTodayWeather(waqiData, cityLabel)
        );
        setTodayForecast(transformWaqiToTodayForecast(waqiData));
        setWeekForecast({
          city: cityLabel,
          list: transformWaqiToWeekForecast(waqiData, cityLabel),
        });
        setNextDayForecast(forecastData);
        setForecastHist(histForecast);
        setLastUpdatedAt(Date.now());
        setForecast24h(
          forecast24hData ??
          transformWaqiTo24hForecast(waqiData) ??
          build24hFrom3SlotsAndNext(
            transformWaqiToTodayForecast(waqiData),
            forecastData,
            waqiData?.aqi
          )
        );
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [coords]);

  // Epic 1.1: 每 5 秒轮询告警和风险（1 分钟内触发）
  useEffect(() => {
    if (coords == null) return;
    const poll = async () => {
      try {
        console.debug('Polling waqi');
        const waqiData = await fetchAqiData(coords.lat, coords.lon);
        const cityLabel = waqiData.city;
        setTodayWeather(transformWaqiToTodayWeather(waqiData, cityLabel));
        setLastUpdatedAt(Date.now());
        handleShowAlert(waqiData.aqi)
      } catch (e) {
        // 静默失败
        console.error('Error in polling', e);
        // TODO display error message
      }
    };
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [coords, showAlertModal, lastDismissTime]);

  let appContent = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '400px',
      }}
    >
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--sub)',
        }}
      >
        Loading...
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12}>
          <HeroSection
            todayWeather={todayWeather}
            nextDayForecast={nextDayForecast}
            onTomorrowClick={() => {}}
            onboardingData={{}}
          />
        </Grid>
        <Grid item xs={12}>
          <HourlyForecast data={forecast24h} />
        </Grid>
        <Grid item xs={12}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
        <Grid>
          <AQICalendar aqiData={forecastHist}></AQICalendar>
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '400px',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--sub)',
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  const decision = getDecision(currentAqi) || { headline: '—', sub: '—' };

  return (
    <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingBottom: 4 }}>
      {/* Header */}
      <Box
        sx={{
          background: 'white',
          borderBottom: '1.5px solid var(--border)',
          height: 60,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Box
          component="img"
          src={require('./assets/airsense-logo.png')}
          alt="AirSense"
          sx={{
            height: 56,
            width: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer'
          }}
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        />
        <Box
          component="button"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1.5px solid var(--border)',
            background: 'white',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--text)',
            transition: 'background 0.2s',
            '&:hover': { background: 'var(--bg)' },
          }}
        >
          {coords == null ? (
            'Detecting...'
          ) : (
            <>
              <span>📍</span>
              {locationLabel}
            </>
          )}
        </Box>
      </Box>

      {/* Full-screen alert modal when AQI > 100 */}
      <AlertModal
        open={showAlertModal}
        onGotIt={() => {
          setShowAlertModal(false);
          setLastDismiss(Date.now());
          console.debug(`User dismiss alert at: ${lastDismissTime}`);
          // window.scrollTo({top: 0, behavior: 'smooth'})
        }}
        location={locationLabel}
        lastUpdatedAt={lastUpdatedAt}
        headline={decision.headline}
        advisory={decision.sub}
        aqi={currentAqi}
      />

      {/* Content */}
      <Container
        sx={{
          maxWidth: 1280,
          padding: '0 24px 80px',
          margin: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Grid container spacing={2} sx={{ padding: '20px 0 32px' }}>
          {appContent}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
