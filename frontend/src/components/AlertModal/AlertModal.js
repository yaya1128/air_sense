import React from 'react';
import { Box, Fab, Slide, Stack, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { aqiColor } from '../../utilities/decisionUtils';


const getAqiIcon = (aqi) => {
  if (aqi >= 100) {
    return <WarningAmberIcon
      sx={{
        fontSize: 42,
        color: aqiColor(aqi),
        flexShrink: 0,
      }}
    />
  }
  return <CheckCircleIcon
    sx={{
      fontSize: 42,
      color: aqiColor(aqi),
      flexShrink: 0,
    }}
  />
}

/**
 * Full-screen modal when AQI > 100 (Unhealthy threshold)
 * Location, last update, decision headline, advisory, Got it / Set Reminder
 * Min 22px font, warning icon
 */
const AlertModal = ({
  open,
  onGotIt,
  location,
  lastUpdatedAt,
  headline,
  advisory,
  aqi,
}) => {
  const timeStr = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 2000,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Slide
        direction="down"
        in={open}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 600, exit: 600 }}
      >
        <Fab
          variant="extended"
          onClick={onGotIt}
          sx={{
            position: "fixed",
            top: 16,
            width: "80%",
            maxWidth: 520,
            px: 3,
            py: 2,
            borderRadius: 3,
            height: "auto",
            alignItems: "stretch",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {getAqiIcon(aqi)}

            {/* Text content */}
            <Stack spacing={0.5}>
              {/* Headline (primary emphasis) */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {headline}
              </Typography>

              {/* Secondary info */}
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {location || "Your area"} • Updated {timeStr}
              </Typography>
            </Stack>
          </Stack>
        </Fab>
      </Slide>
    </Box>
  );
};

export default AlertModal;
