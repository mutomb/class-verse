import React, { useRef } from 'react';
import {Box, Grid, Typography, Zoom, Container, useMediaQuery} from '@mui/material';
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from "../../public/logo.svg"
import Slider, { Settings } from 'react-slick';
import { data } from './specialists.data'
import { TiersConnect } from '../users';
import {tiers} from '../users/tiers.data'
import {exps} from './exps.data'
import ExpItem from './ExpItem';

export default function Pricing() {
  const theme= useTheme()
  const sliderRef = useRef(null)
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const sliderConfig: Settings = {
    infinite: true,
    autoplay: true, 
    speed: 5000,
    slidesToShow: xsMobileView ? 2 : smMobileView? 3: 4,
    slidesToScroll: 1,
    arrows: false,
    swipe: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    easing: 'cubic-bezier(0, 0, 1, 3)',

  }
  
  return (
    <WallPaperYGW id='pricing' variant='linear' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}>
    <Box id="pricing" sx={{ position: 'relative', pt: 0, pb: 0}}>
      <Container maxWidth={false} sx={{px: '0 !important'}}>
        <WallPaperYGW style={{ boxShadow: 4, textAlign: 'center'}} overlayStyle={{bgcolor: 'rgba(0,0,0,0)', py: { xs: 4, md: 10 }, px: { xs: 0, sm: 2, md: 8 }}}  variant='linear' secondaryColor={`rgba(208, 130, 28, 0.7)`} primaryColor={`rgba(18, 124, 113, 0.7)`}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                      component="h2"
                      sx={{
                      position: 'relative', fontSize: { xs: '2rem', md: '3.5rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, 
                      lineHeight: 1, fontWeight: 'bold', color: 'primary.contrastText'
                      }}>
                    Companies
                  </Typography>
                  <Typography variant="h5" component="p" sx={{ color: 'primary.contrastText', lineHeight: 1.6 }}>
                  Examplary companies our Specialist are affiliated with  
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{'& .slick-list': { ml: 0}, transform: 'unset', '& .slick-slide .slick-active': {py: 8, fontSize: 20}}}>
                    <Slider ref={sliderRef} {...sliderConfig}>
                      {data.map((item, index) => (
                      item.company && item.company.logo &&
                      (<Zoom key={String(index)} timeout={2000} appear={true} in={true} color='inherit' unmountOnExit={true}>
                        <Box sx={{px: {xs: 1, sm: 2, md: 4}}}>
                          <Box sx={{ '& img': { height: {xs: 26, sm: 40, md:50} }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box component='img' src={item.company.logo} />
                          </Box>
                        </Box>
                      </Zoom>)
                      ))}
                    </Slider>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{bgcolor: 'rgba(0,0,0,0)', boxShadow: 4, borderRadius: {xs: 2, sm: 4}}}>
              {exps.map((item) => (
                <Grid key={item.value} item xs={12} md={4}>
                  <ExpItem item={item}/>
                </Grid>
              ))}
              </Grid>
            </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} sx={{textAlign: 'center', py: 8}}>
                  <Grid item xs={12}>
                    <Typography
                        component="h2"
                        sx={{
                        position: 'relative', fontSize: { xs: '2rem', md: '3.5rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, 
                        lineHeight: 1, fontWeight: 'bold', color: 'primary.contrastText'
                        }}>
                    Pricing
                    </Typography>
                    <Typography variant="h5" component="p" sx={{ color: 'primary.contrastText', lineHeight: 1.6 }}>
                    We understand you have a budget, so we offer a variety of plans to fit it: Free plan offers a limited set of feature. Study plan gives an individual users full access to all features. Upskill package offers all features to a group of clients needing multiple courses and training tailored to their needs. 
                    </Typography>
                  </Grid>
                </Grid>
                {<TiersConnect tiers={tiers} />}
              </Grid>
          </Grid>
        </WallPaperYGW>
      </Container>
    </Box>
  </WallPaperYGW>
  );
}
