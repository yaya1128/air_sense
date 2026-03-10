import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  HEALTH_CONDITIONS,
  AGE_GROUPS,
  saveOnboarding,
} from '../../utilities/onboardingUtils';

const TEAL = '#007A8A';
const TEAL_LT = '#E0F4F7';
const INK = '#0F1923';
const INK2 = '#374151';
const INK3 = '#6B7280';
const RULE = '#E8EAED';

/**
 * 5.1–5.4: 首次访问弹窗
 * 按钮样式明确，避免 MUI 覆盖导致变白
 */
const OnboardingModal = ({ open, onComplete }) => {
  const [conditions, setConditions] = useState([]);
  const [ageGroup, setAgeGroup] = useState(null);

  const toggleCondition = (id) => {
    if (id === 'none') {
      setConditions((prev) => (prev.includes('none') ? [] : ['none']));
      return;
    }
    setConditions((prev) => {
      const next = prev.filter((c) => c !== 'none');
      if (next.includes(id)) return next.filter((c) => c !== id);
      return [...next, id];
    });
  };

  const handleSubmit = () => {
    const data = {
      conditions: conditions.length ? conditions : ['none'],
      ageGroup: ageGroup || AGE_GROUPS[0].id,
      completedAt: Date.now(),
    };
    saveOnboarding(data);
    onComplete(data);
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        background: 'rgba(10,18,26,0.72)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        animation: 'fadeIn 0.4s ease',
      }}
    >
      <Box
        sx={{
          background: '#FFFFFF',
          borderRadius: 10,
          padding: '44px 36px 40px',
          maxWidth: 460,
          width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.24)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${TEAL}, #00bcd4, #2E9E4F)`,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: TEAL,
            mb: 1.25,
          }}
        >
          AirSense · Personalised
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Fraunces', serif",
            fontSize: 30,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          Welcome to AirSense
        </Typography>
        <Typography sx={{ fontSize: 16, color: INK3, lineHeight: 1.6, mb: 4 }}>
          We'll tailor every alert and recommendation specifically for you.
        </Typography>

        {/* 5.2 健康条件多选 */}
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: INK3,
            mb: 1.5,
          }}
        >
          Health conditions (select all that apply)
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 3.5 }}>
          {HEALTH_CONDITIONS.map(({ id, label }) => {
            const sel = conditions.includes(id);
            return (
              <Box
                key={id}
                component="button"
                type="button"
                onClick={() => toggleCondition(id)}
                sx={{
                  padding: '11px 20px',
                  borderRadius: 8,
                  border: `1.5px solid ${sel ? TEAL : RULE}`,
                  background: sel ? TEAL : '#FFFFFF',
                  color: sel ? '#FFFFFF' : INK2,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  outline: 'none',
                  '&:hover': {
                    borderColor: TEAL,
                    color: sel ? '#FFFFFF' : TEAL,
                    background: sel ? TEAL : TEAL_LT,
                  },
                  '&:active': {
                    background: sel ? '#006670' : TEAL_LT,
                    color: sel ? '#FFFFFF' : TEAL,
                  },
                }}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        {/* 5.3 年龄段单选 */}
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: INK3,
            mb: 1.5,
          }}
        >
          Age group
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 4 }}>
          {AGE_GROUPS.map(({ id, label }) => {
            const sel = ageGroup === id;
            return (
              <Box
                key={id}
                component="button"
                type="button"
                onClick={() => setAgeGroup(id)}
                sx={{
                  padding: '11px 20px',
                  borderRadius: 8,
                  border: `1.5px solid ${sel ? TEAL : RULE}`,
                  background: sel ? TEAL : '#FFFFFF',
                  color: sel ? '#FFFFFF' : INK2,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  outline: 'none',
                  '&:hover': {
                    borderColor: TEAL,
                    color: sel ? '#FFFFFF' : TEAL,
                    background: sel ? TEAL : TEAL_LT,
                  },
                  '&:active': {
                    background: sel ? '#006670' : TEAL_LT,
                    color: sel ? '#FFFFFF' : TEAL,
                  },
                }}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        {/* 主按钮：进入页面 */}
        <Box
          component="button"
          type="button"
          onClick={handleSubmit}
          sx={{
            width: '100%',
            padding: '19px 24px',
            borderRadius: 8,
            border: 'none',
            background: INK,
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(15,25,35,0.3)',
            transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
            outline: 'none',
            '&:hover': {
              background: '#1a2d3d',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 28px rgba(15,25,35,0.4)',
              color: '#FFFFFF',
            },
            '&:active': {
              background: '#0a1620',
              color: '#FFFFFF',
              transform: 'translateY(0)',
            },
          }}
        >
          Start Using AirSense →
        </Box>
      </Box>
    </Box>
  );
};

export default OnboardingModal;
