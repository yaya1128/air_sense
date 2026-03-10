import { Box, Typography } from '@mui/material';
import React from 'react';

const CityDateDetail = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: { xs: 'center', sm: 'center' },
        textAlign: 'center',
      }}
    >
      <Typography
        variant="body1"
        component="p"
        sx={{
          fontSize: { xs: '14px', sm: '16px' },
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: 1.4,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {props.city}
      </Typography>
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: 'var(--sub)',
          mt: 0.5,
        }}
      >
        Today {props.date}
      </Typography>
    </Box>
  );
};

export default CityDateDetail;
