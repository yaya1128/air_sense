import React from 'react';
import { Box, Typography } from '@mui/material';
import { getHealthTips, getHealthTipsTier } from '../../utilities/decisionUtils';
import { getConditionBadgeLabel, getPersonalizedTips } from '../../utilities/onboardingUtils';

/**
 * Phase 4.3: 健康建议 — 普通/紧急/严重 三档
 * 5.5: 根据 Onboarding 选择做个性化
 */
const HealthTipsCard = ({ aqi, customTips, getTips, onboardingData }) => {
  if (aqi == null) return null;

  const conditions = onboardingData?.conditions || [];
  const ageGroup = onboardingData?.ageGroup;
  const personalizedTips =
    conditions.length || ageGroup
      ? getPersonalizedTips(conditions, ageGroup, aqi)
      : null;

  const tips = getHealthTips(aqi, {
    customTips: personalizedTips || customTips,
    getTips,
  });
  if (!tips?.length) return null;

  const { color: barColor, label: tierLabel } = getHealthTipsTier(aqi);
  const badgeLabel = getConditionBadgeLabel(conditions) || tierLabel;

  return (
    <Box
      id="tipsCard"
      sx={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '28px',
        borderLeft: `4px solid ${barColor}`,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            color: 'var(--sub)',
            textTransform: 'uppercase',
          }}
        >
          Health Advisory
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 1,
            padding: '3px 8px',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: '#f87171',
          }}
        >
          ❤️ {badgeLabel}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, position: 'relative', zIndex: 1 }}>
        {tips.map((tip, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              fontSize: '0.83rem',
              color: 'var(--text)',
              lineHeight: 1.5,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                background: 'rgba(34,197,94,0.1)',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                flexShrink: 0,
                mt: 0.125,
                color: '#22c55e',
              }}
            >
              ✓
            </Box>
            {tip}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HealthTipsCard;
