import React from 'react'
import { ClientDashBoardOrders} from '.'
import { Box, Container, Grid, Slide, Typography, Zoom } from '@mui/material'
import { StyledLinearProgress } from '../progress'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import {useTheme} from '@mui/material/styles'
import logo from '../../public/logo.svg'
{/*ClientDashBoardChart*/}
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"

export default function Overview(){
  const theme = useTheme()
    return(
    <WallPaperYGW primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        left: {xs: 'unset', md: '50%'},
        position: 'absolute',
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'space',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}>
      <Box id="overview" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
            <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="right" in={true} color='inherit'>
              <Box sx={{ height: '100%', width: { xs: '100%', md: '90%' }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, }} >
                <Typography
                  component="h2"
                  sx={{
                    position: 'relative',
                    fontSize: { xs: '2rem', md: '3.5rem' },
                    mt: { xs: 0, md: 7 },
                    mb: 4,
                    lineHeight: 1,
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}>
                  <Typography
                    component="mark"
                    sx={{
                      position: 'relative',
                      color: 'primary.main',
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      backgroundColor: 'unset',
                    }}
                  >
                    Overview{' '}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: { xs: 20, md: 28 },
                        left: 2,
                        '& img': { width: { xs: 100, md: 250 }, height: 'auto' },
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={HeadLineCurve}/>
                    </Box>
                  </Typography>
                </Typography>
              </Box>
            </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Grid container spacing={2}>
                <Grid id='overall-progress' item xs={12} md={6} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
                    <Box sx={{ mt: 1, width: '100%'}}>
                      <Box sx={{ '&:hover':{boxShadow: 2}, borderRadius: 1, px: 2.2, py: 1.4, zIndex: 1, backgroundColor: 'background.paper', width: 190, }}>
                        <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
                          Study Progress
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="text.secondary">
                            UI/UI Design
                          </Typography>
                          <StyledLinearProgress variant="determinate"  value={80} order={1} />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="text.secondary">
                            Mobile Development
                          </Typography>
                          <StyledLinearProgress variant="determinate" value={40} order={2} />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="text.secondary">
                            Web Development
                          </Typography>
                          <StyledLinearProgress variant="determinate" value={10} order={3} />
                        </Box>
                      </Box>
                    </Box>
                  </Zoom>
                </Grid>
                <Grid id='overall-orders' item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Box 
                    sx={{ px: {xs: 0, sm:2}, py: 1.5, '&:hover':{boxShadow: 2},
                      borderRadius: 4, display: 'flex',
                      flexDirection: {xs:'column', md:'row'},
                      alignItems: 'center'}}>
                    <Box sx={{ mt: 1, width: '100%'}}>
                      <ClientDashBoardOrders />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
    )
}