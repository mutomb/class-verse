import React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/styles';
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
        <Box
            role="presentation"
            sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1099 }}
        >
          <Box
            component='a'
            onClick={isAuthenticated().user? ()=>scrollToAnchor('enrolled-in-courses'):()=>scrollToAnchor('search')}
          >
            <Fab size="small" aria-label="scroll back to top" variant='extended' 
            sx={{backgroundColor:'primary.main', 
                color:'primary.contrastText', 
                borderRadius:1,
                border:'1px solid',
                borderColor:'primary.contrastText',
                ':hover':{
                  backgroundColor:'secondary.main',
                  transition: theme.transitions.create(['transform']),
                  transform: 'translateY(-3px)',
                }
                }}>
            <KeyboardArrowUpIcon color='inherit' sx={{mx:0, my:0}}/>
            </Fab>
          </Box>
        </Box>
    </Fade>
  );
}