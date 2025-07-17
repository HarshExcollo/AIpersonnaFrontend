import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

interface GlobalLoaderProps {
  open: boolean;
  message?: string;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ open, message = "Loading..." }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress 
          color="primary" 
          size={60}
          thickness={4}
          sx={{
            color: '#0A9969',
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#fff',
            fontWeight: 500,
            fontSize: '18px',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalLoader; 