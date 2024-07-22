import React from 'react';
import {useScrollTrigger, Box, Fab, Fade} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import { scroller } from 'react-scroll';
import {useAuth} from '../auth';

export default function ScrollTop() {
  const trigger = useScrollTrigger();
  const theme = useTheme();
  const {isAuthenticated} = useAuth()
  const scrollToAnchor = (destination:string) => {
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -10
    })
  }

  return (
    <Fade in={trigger}>
      <Box role="presentation" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1099 }} >
        <Box component='a' onClick={isAuthenticated().user? ()=>scrollToAnchor('enrolled-in-courses'):()=>scrollToAnchor('search')}>
          <Fab size="small" aria-label="scroll back to top" variant='extended' 
          sx={{backgroundColor: 'rgba(0,0,0,0.5)',
              color:'primary.contrastText', 
              borderRadius:1,
              border:'1px solid',
              borderColor:'primary.contrastText',
              ':hover':{
                backgroundColor:'secondary.main',
                transition: theme.transitions.create(['transform'], {duration: 500}),
                transform: 'translateY(-3px) scale(1.1)',
              }
              }}>
          <KeyboardArrowUpIcon color='inherit' sx={{mx:0, my:0}}/>
          </Fab>
        </Box>
      </Box>
    </Fade>
  );
}