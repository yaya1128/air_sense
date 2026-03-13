import React from 'react';
import { Box, Typography, Button, Fab } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
  if (!open) return null;

  const timeStr = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fab
        sx={{
          // position: 'relative',
          position: 'fixed',
          width: '80%',
          height: 'auto',
        }}
        variant="extended"
        size="medium"
        onClick={onGotIt}>
        <WarningAmberIcon
          sx={{
            fontSize: 64,
            color: '#cc0000',
            // mb: 1.5,
          }}
        />
        Last updated: {timeStr}
        <br></br>
        {location || 'Your area'}
        <br></br>
        {headline}
      </Fab>
    </Box>
    // <Box
    //   sx={{
    //     position: 'fixed',
    //     inset: 0,
    //     zIndex: 2000,
    //     background: 'rgba(0,0,0,0.6)',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     padding: 2,
    //   }}
    //   onClick={(e) => e.target === e.currentTarget && onGotIt()}
    // >
    //   <Box
    //     sx={{
    //       background: 'white',
    //       borderRadius: '10px',
    //       padding: 3,
    //       maxWidth: 420,
    //       width: '100%',
    //       boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
    //       textAlign: 'center',
    //     }}
    //     onClick={(e) => e.stopPropagation()}
    //   >
    //     <WarningAmberIcon
    //       sx={{
    //         fontSize: 64,
    //         color: '#cc0000',
    //         mb: 1.5,
    //       }}
    //     />
    //     <Typography
    //       sx={{
    //         fontSize: '22px',
    //         fontWeight: 700,
    //         color: 'var(--text)',
    //         mb: 0.5,
    //       }}
    //     >
    //       {location || 'Your area'}
    //     </Typography>
    //     <Typography
    //       sx={{
    //         fontSize: '22px',
    //         fontWeight: 600,
    //         color: 'var(--sub)',
    //         mb: 1.5,
    //       }}
    //     >
    //       Last updated: {timeStr}
    //     </Typography>
    //     <Typography
    //       sx={{
    //         fontSize: '28px',
    //         fontWeight: 900,
    //         color: '#cc0000',
    //         textTransform: 'uppercase',
    //         letterSpacing: 0.5,
    //         mb: 1,
    //       }}
    //     >
    //       {headline}
    //     </Typography>
    //     <Typography
    //       sx={{
    //         fontSize: '22px',
    //         fontWeight: 600,
    //         color: 'var(--text)',
    //         lineHeight: 1.5,
    //         mb: 2,
    //       }}
    //     >
    //       {advisory}
    //     </Typography>
    //     <Typography
    //       sx={{
    //         fontSize: '22px',
    //         fontWeight: 600,
    //         color: 'var(--sub)',
    //         mb: 2,
    //       }}
    //     >
    //       AQI: {aqi}
    //     </Typography>
    //     <Box sx={{ display: 'flex', gap: 1.5, flexDirection: 'column' }}>
    //       <Button
    //         fullWidth
    //         variant="contained"
    //         onClick={onGotIt}
    //         sx={{
    //           py: 1.5,
    //           fontSize: '22px',
    //           fontWeight: 700,
    //           borderRadius: '8px',
    //           textTransform: 'none',
    //         }}
    //       >
    //         Got it
    //       </Button>
    //     </Box>
    //   </Box>
    // </Box>
  );
};

export default AlertModal;
