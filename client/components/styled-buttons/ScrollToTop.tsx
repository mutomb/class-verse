import React, {MouseEvent} from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/styles';
import { Link as ScrollLink } from 'react-scroll';

export default function ScrollTop() {
  const trigger = useScrollTrigger();
  const theme = useTheme();
  // const handleClick = (event: MouseEvent<HTMLDivElement>) => {
  //   const anchor = (
  //     (event.target as HTMLDivElement).ownerDocument || document
  //   ).querySelector('#hero');

  //   if (anchor) {
  //     anchor.scrollIntoView({
  //       block: 'center',
  //     });
  //   }
  // };

  return (
    <Fade in={trigger}>
        <Box
            // onClick={handleClick}
            role="presentation"
            sx={{ position: 'fixed', bottom: 16, right: 16, zIndex:'999' }}
        >
          <Box
            component={ScrollLink}
            key={'hero'}
            to={'hero'}
            spy={true}
            smooth={true}
            duration={350}
          >
            <Fab size="small" aria-label="scroll back to top" variant='circular' 
            sx={{backgroundColor:'primary.main', 
                color:'primary.contrastText', 
                ':hover':{
                  backgroundColor:'primary.main',
                  transition: theme.transitions.create(['transform']),
                  transform: 'translateY(-3px)',
                }
                }}>
            <KeyboardArrowUpIcon color='inherit' />
            </Fab>
          </Box>
        </Box>
    </Fade>
  );
}