import React from 'react';
import {Box, Link as MuiLink, Typography, Zoom} from '@mui/material';
import Title from './Title';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
    <Box sx={{bgcolor: 'background.paper', borderRadius: 3, p: 1}}>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4" sx={{color: 'primary.main'}}>
        $3,024.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2024
      </Typography>
      <div>
        <MuiLink color="primary" href="#" onClick={preventDefault}>
          View balance
        </MuiLink>
      </div>
    </Box>
    </Zoom>
  );
}
