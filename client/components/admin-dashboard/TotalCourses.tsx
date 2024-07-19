import React from 'react';
import {Box, Typography, Zoom} from '@mui/material';


export default function TotalCourses() {
  return (
    <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
    <Box sx={{bgcolor: 'background.paper', borderRadius: 3, p: 1}}>
     <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{color: 'text.primary'}}>
        Total Number of Courses 
      </Typography>
      <Typography component="p" variant="h4" sx={{color: 'primary.main'}}>
        300
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {new Date().toLocaleString()}
      </Typography>
    </Box>
    </Zoom>
  );
}
