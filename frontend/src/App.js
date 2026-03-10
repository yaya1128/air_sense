import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import AlertModal from './components/AlertModal/AlertModal';
import OnboardingModal from './components/OnboardingModal/OnboardingModal';
import HeroSection from './components/HeroSection/HeroSection';
import ActionsRow from './components/ActionsRow/ActionsRow';
import RiskIndicator from './components/RiskIndicator/RiskIndicator';
import HourlyForecast from './components/HourlyForecast/HourlyForecast';
import PollutantsCard from './components/PollutantsCard/PollutantsCard';
import { fetchWaqiData } from './api/WaqiService';
import { fetchNextDayForecast, fetchRiskCurrent, fetch24hForecast } from './api/backendApi';
import { fetchPollutantsFromBackend } from './api/backendApi';
import ErrorBox from './components/Reusable/ErrorBox';
import {
  transformWaqiToTodayWeather,
  transformWaqiToTodayForecast,
  transformWaqiToWeekForecast,
  transformWaqiTo24hForecast,
  build24hFrom3SlotsAndNext,
  transformWaqiToPollutants,
  mergePollutants,
} from './utilities/WaqiDataUtils';
import { getDecision } from './utilities/decisionUtils';
import { loadOnboarding } from './utilities/onboardingUtils';

const MALAYSIA_CITY_LABEL = 'Kuala Lumpur, Malaysia';
const MALAYSIA_LAT = 3.139;
const MALAYSIA_LON = 101.6869;

/** User Story 1.1: 获取用户位置，失败则用吉隆坡 */
function useUserLocation() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: MALAYSIA_LAT, lon: MALAYSIA_LON });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setCoords({ lat: MALAYSIA_LAT, lon: MALAYSIA_LON }),
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
  const [riskCurrent, setRiskCurrent] = useState(null);
  const [forecast24h, setForecast24h] = useState(null);
  const [pollutants, setPollutants] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [onboardingData, setOnboardingData] = useState(() => loadOnboarding());
  const [showOnboarding, setShowOnboarding] = useState(true);

  const coords = useUserLocation();

  const currentAqi = riskCurrent?.aqi ?? todayWeather?.aqi ?? 0;
  const locationLabel = todayWeather?.city || riskCurrent?.location || '—';
  const showAlertModal = currentAqi > 100 && !alertDismissed;

  useEffect(() => {
    if (currentAqi <= 100) setAlertDismissed(false);
  }, [currentAqi]);

  useEffect(() => {
    if (coords == null) return;

    const loadWeather = async () => {
      try {
        const { lat, lon } = coords;
        const [waqiData, forecastData, riskData, forecast24hData, backendPollutants] = await Promise.all([
          fetchWaqiData(lat, lon),
          fetchNextDayForecast(lat, lon).catch(() => null),
          fetchRiskCurrent(lat, lon).catch(() => null),
          fetch24hForecast(lat, lon).catch(() => null),
          fetchPollutantsFromBackend().catch(() => null),
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
        setRiskCurrent(riskData);
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
        setPollutants(
          mergePollutants(
            transformWaqiToPollutants(waqiData),
            backendPollutants ? { pm25: backendPollutants.pm25, pm10: backendPollutants.pm10, o3: backendPollutants.o3, no2: backendPollutants.no2 } : null
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

  // Epic 1.1: 每 30 秒轮询告警和风险（1 分钟内触发）
  useEffect(() => {
    if (coords == null) return;
    const poll = async () => {
      try {
        const riskData = await fetchRiskCurrent(coords.lat, coords.lon);
        setRiskCurrent(riskData);
        setLastUpdatedAt(Date.now());
      } catch {
        // 静默失败
      }
    };
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }, [coords]);

  const scrollToTips = () => {
    const el = document.getElementById('tipsCard');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
            riskCurrent={riskCurrent}
            nextDayForecast={nextDayForecast}
            todayWeather={todayWeather}
            onTomorrowClick={() => {}}
            onboardingData={onboardingData}
          />
        </Grid>
        <Grid item xs={12}>
          <RiskIndicator
            data={riskCurrent}
            aqi={riskCurrent?.aqi ?? todayWeather?.aqi}
          />
        </Grid>
        <Grid item xs={12}>
          <ActionsRow
            onSetReminder={() => {}}
            onBestTime={() => {}}
            onHealthTips={scrollToTips}
          />
        </Grid>
        <Grid item xs={12}>
          <HourlyForecast data={forecast24h} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PollutantsCard pollutants={pollutants} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '28px',
              height: '100%',
            }}
          >
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <WeeklyForecast data={weekForecast} />
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
          }}
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
            cursor: 'pointer',
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

      {/* 5.1–5.4: 首次访问 Onboarding 弹窗 */}
      <OnboardingModal
        open={showOnboarding}
        onComplete={(data) => {
          setOnboardingData(data);
          setShowOnboarding(false);
        }}
      />

      {/* Full-screen alert modal when AQI > 100 */}
      <AlertModal
        open={showAlertModal}
        onGotIt={() => setAlertDismissed(true)}
        onSetReminder={() => {}}
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
