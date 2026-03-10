import { Typography } from '@mui/material';
import React from 'react';

const SectionHeader = ({ title, mb }) => {
  return (
    <Typography
      variant="h5"
      component="h2"
      sx={{
        fontSize: { xs: '12px', sm: '14px', md: '16px' },
        color: 'var(--sub)',
        fontWeight: 700,
        letterSpacing: 1.2,
        textAlign: 'left',
        textTransform: 'uppercase',
        marginBottom: mb || '1rem',
      }}
    >
      {title}
    </Typography>
  );
};

export default SectionHeader;
