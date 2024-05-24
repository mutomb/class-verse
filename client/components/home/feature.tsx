import React, { FC } from 'react'
import {Box, Grid, Container, Typography, Slide, Zoom} from '@mui/material'
import { data } from './feature.data'
import HomeFeatureIcon from "../../public/images/home/home-feature.png"
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import logo from "../../public/logo.svg"
import {useAuth} from '../auth'
import { StyledLinearProgress } from '../progress'
import { useTheme } from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers'

const HomeFeature: FC = () => {
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  if(isAuthenticated().user) return(<></>)
  return (
    <WallPaperYGW variant='linear' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: {xs: 'unset', md: '50%'},
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}>
      <Box id="features" sx={{ py: { xs: 10, md: 14}}}>
        <Container sx={{px: {xs: 0, sm: 'unset'}}}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
                <Box sx={{ position: 'relative' }}>
                  <Box component='img' src={HomeFeatureIcon} sx={{width:'100%', height:'auto'}} alt="Feature img"/>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -36,
                      right: { xs: 0, md: -36 },
                      '&:hover':{boxShadow: 2},
                      borderRadius: 1,
                      px: 2.2,
                      py: 1.4,
                      zIndex: 1,
                      backgroundColor: 'background.default',
                      width: 190,
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 1, color: 'text.primary' }}>
                      Popular Categories
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Web development
                      </Typography>
                      <StyledLinearProgress variant="determinate"  value={100} order={1} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Mobile Development
                      </Typography>
                      <StyledLinearProgress variant="determinate" value={75} order={2} />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        ML/AI
                      </Typography>
                      <StyledLinearProgress variant="determinate" value={40} order={3} />
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="left" in={true} color='inherit'>
                <Typography
                  component="h2"
                  sx={{
                    position: 'relative',
                    fontSize: { xs: '2rem', md: '3.5rem' },
                    ml: { xs: 0, md: 4 },
                    mt: 2,
                    mb: 3,
                    lineHeight: 1,
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}
                >
                  Make your{' '}
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
                    Learning <br />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: { xs: 20, md: 28 },
                        transform: 'rotate(3deg)',
                        left: 2,
                        '& img': { width: { xs: 140, md: 175 }, height: 'auto' },
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={HeadLineCurve} alt="Headline curve" />
                    </Box>
                  </Typography>
                  Enjoyable
                </Typography>
              </Slide>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="left" in={true} color='inherit'>
                <Typography sx={{ color: 'text.primary', lineHeight: 1.6 , fontWeight: 700, mb: 2, ml: { xs: 0, md: 4 } }}>
                  Set the way of learning according to your wishes with some of the benefits that you get us, so you on
                  enjoy the lessons that we provide.
                </Typography>
              </Slide>
              <Grid container spacing={2} sx={{ ml: { xs: 0, md: 2 } }}>
                {data.map(({ title, description, icon }, index) => (
                  <Grid key={String(index)} item xs={12} sm={6}>
                    <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="left" in={true} color='inherit'>
                      <Box sx={{ px: 2, py: 1.5, boxShadow: 1, borderRadius: 4, display: 'flex', flexDirection:{xs:'column', md:'row'}, alignItems: 'center', bgcolor: 'background.paper'}}>
                        <Box
                          sx={{
                            mr: 1,
                            backgroundColor: 'primary.main',
                            borderRadius: '50%',
                            height: 36,
                            width: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.contrastText',
                            '& svg': {
                              fontSize: 30,
                            },
                          }}
                        >
                          {icon}
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                          <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, color: 'secondary.main' }}>
                            {title}
                          </Typography>
                          <Typography sx={{ lineHeight: 1.3, color: 'text.secondary' }} variant="subtitle1">
                            {description}
                          </Typography>
                        </Box>
                      </Box>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
  )
}

export default HomeFeature
