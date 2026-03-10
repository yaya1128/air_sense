import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * 快捷操作 3 列：Set Reminder / Best Time Out / Health Tips
 */
const ActionsRow = ({ onSetReminder, onBestTime, onHealthTips }) => {
  const actions = [
    {
      icon: '🔔',
      iconBg: 'rgba(245,158,11,0.1)',
      title: 'Set Reminder',
      sub: 'Alert when AQI changes',
      onClick: onSetReminder,
    },
    {
      icon: '🕐',
      iconBg: 'rgba(34,197,94,0.1)',
      title: 'Best Time Out',
      sub: '06:00 – 08:00 AM today',
      onClick: onBestTime,
    },
    {
      icon: '🫁',
      iconBg: 'rgba(239,68,68,0.1)',
      title: 'Health Tips',
      sub: 'Personalized for you',
      onClick: onHealthTips,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 1.5,
      }}
    >
      {actions.map((a, i) => (
        <Box
          key={i}
          component="button"
          onClick={a.onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            padding: '20px 24px',
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
            textAlign: 'left',
            fontFamily: 'inherit',
            '&:hover': {
              background: 'rgba(0,0,0,0.02)',
              borderColor: 'rgba(0,0,0,0.12)',
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              background: a.iconBg,
              flexShrink: 0,
            }}
          >
            {a.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'Fraunces', serif",
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text)',
              }}
            >
              {a.title}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: 'var(--sub)', mt: 0.125 }}>
              {a.sub}
            </Typography>
          </Box>
          <Typography sx={{ color: 'var(--sub)', fontSize: '0.8rem' }}>›</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ActionsRow;
