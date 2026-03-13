import React, { useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn'

function handlePromptLocationError(err) {
  if (err.code === 1) { // User denied permission
    console.log('User denied permission');
    // TODO display error message to user
  } else {
    console.error(err);
  }
}

const LocationPrompt = ({onSet}) => {
  function getUserLocation() {
    console.log('Getting user location');
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        console.log('User location:', pos)
        onSet(pos)
      },
      handlePromptLocationError,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }

  return (
    <Box
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 4 }}
    >
      <TextField id="outlined-basic" label="Location" variant='outlined'></TextField>
      <IconButton onClick={getUserLocation} aria-label='location'><LocationOn></LocationOn></IconButton>
    </Box>
  )
}

export default LocationPrompt;
