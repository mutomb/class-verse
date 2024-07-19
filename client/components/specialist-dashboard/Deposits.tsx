import React from 'react';
import {Box, Link as MuiLink, Typography, Zoom} from '@mui/material';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
    <Box sx={{bgcolor: 'background.paper', borderRadius: 3, p: 1}}>
     <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{color: 'text.primary'}}>
        Recent Deposits
      </Typography>
      <Typography component="p" variant="h4" sx={{color: 'primary.main'}}>
        $8,047.42
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {new Date().toLocaleDateString()}
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
