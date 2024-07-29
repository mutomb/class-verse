import React, { FC, useRef } from 'react'
import {Box, Grid, Container, Typography, Slide, Zoom} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { Link as ScrollLink } from 'react-scroll'
import { StyledButton } from '../styled-buttons'
import {Check, PlayArrow} from '@mui/icons-material'
import { data } from './hero.data'
// import HomeHeroIcon from "../../public/images/home/home-hero.png"
import HomeHeroIcon from "../../public/images/home/Project_Manager_7.svg"
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import logo from "../../public/logo.svg"
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { Link } from 'react-router-dom'
import Slider, { Settings } from 'react-slick'
import { HomePopularCourses } from '.'

const HomeHero: FC = () => {
  const sliderRef = useRef(null)
  const theme = useTheme()
  const sliderConfig: Settings = {
    infinite: true,
    autoplay: true, 
    speed: 8000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    vertical: true,
    swipe: true,
    useTransform: true,
    focusOnSelect: true,
    verticalSwiping: true,
    easing: 'cubic-bezier(0, 0, 1, 3)',

  }
  return (
    <WallPaperYGW variant='linear' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default} //secondaryColor={theme.palette.mode==='light'? theme.palette.secondary.light: theme.palette.secondary.dark}
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
    <Box id="hero" sx={{ position: 'relative', pt: 4, pb: { xs: 2, md: 4 } }}>
      <Container maxWidth={false} sx={{px: {xs: 0, sm: 1, md: 2}}}>
        <Grid container spacing={0} sx={{ flexDirection: { xs: 'column', sm: 'unset' } }}>
          <Grid item xs={12} sm={6}>
            <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="right" in={true} color='inherit'>
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}>
                <Box sx={{ mb: 3, px: {xs: 1, md: 2} }}>
                  <Typography
                    component="h2"
                    sx={{
                      position: 'relative',
                      fontSize: { xs: '2rem', md: '4.5rem' },
                      letterSpacing: 1.5,
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      color: 'text.primary'
                    }}
                  >
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
                      Upskill{' '}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: { xs: 24, md: 34 },
                          left: 2, px: {xs: 1, md: 2},
                          transform: 'rotate(3deg) scale(1.1)',
                          '& img': { width: { xs: 100, sm: 120, md: 210 }, height: 'auto' },
                        }}
                      >
                        <Box component='img' src={HeadLineCurve}  />
                      </Box>
                    </Typography>
                    With{' '}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        position: 'relative',
                        '& svg': {
                          position: 'absolute',
                          top: {xs: -10, md: 0},
                          right: -21,
                          width: { xs: 22, md: 30 },
                          height: 'auto',
                        },
                      }}
                    >
                      GO<Typography component='sup' sx={{ display: 'inline', position: 'relative', color: 'primary.main', fontWeight: 'inherit', fontSize: { xs: '1.3rem', md: '2.5rem' }}}>2</Typography>
                      <svg version="1.1" viewBox="0 0 3183 3072">
                        <g id="Layer_x0020_1">
                          <path
                            fill="#127C71"
                            d="M2600 224c0,0 0,0 0,0 236,198 259,562 52,809 -254,303 -1849,2089 -2221,1776 -301,-190 917,-1964 1363,-2496 207,-247 570,-287 806,-89z"
                          />
                          <path
                            fill="#127C71"
                            d="M3166 2190c0,0 0,0 0,0 64,210 -58,443 -270,516 -260,90 -1848,585 -1948,252 -104,-230 1262,-860 1718,-1018 212,-73 437,39 500,250z"
                          />
                          <path
                            fill="#127C71"
                            d="M566 3c0,0 0,0 0,0 -219,-26 -427,134 -462,356 -44,271 -255,1921 90,1962 245,62 628,-1392 704,-1869 36,-221 -114,-424 -332,-449z"
                          />
                        </g>
                      </svg>
                    </Typography>{' '}
                    <br/>
                    <Typography
                    component="h3"
                    sx={{
                      position: 'relative',
                      fontSize: { xs: '1.5rem', md: '3.5rem' },
                      letterSpacing: 1.5,
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      color: 'text.primary',
                      pt: {xs: 2, md: 0}
                    }}
                  >
                    Easier E-Teaching and E-Learning
                  </Typography>
                  </Typography>
                </Box>
                <Box id='courses' sx={{px: 0, mb: 4, width: '100%' }}>
                  {/* <Typography variant="h5" component="p" sx={{ color: 'text.primary', lineHeight: 1.6 , fontSize: {xs: 17, md: 19}, fontWeight: {xs: 500, md: 600}}}>
                    {
                      "Let's take an online course to improve your skills in a different way, you can set your own study time according to your learning speed. So you can study comfortably and absorb the material easily."
                    }
                  </Typography> */}
                  <Box sx={{['& .slick-list']: { ml: 0}, transform: 'unset', //['& .slick-slide.slick-active.slick-current']: {bgcolor: 'red', transition: theme.transitions.create(['background-color'], {duration: 5000})},
                    /*mt: '25%',*/borderRadius: 2, // boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
                    background: theme.palette.mode ==='dark'? `radial-gradient(rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)`:`radial-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`}}>
                    <Slider ref={sliderRef} {...sliderConfig}>
                      {data.map(({ title, description, icon, iconStyle }, index) => (
                      <Zoom key={String(index)} timeout={1000} appear={true} in={true} color='inherit' unmountOnExit={true}>
                        <Box sx={{height: 350, mb: '-4vh', px: {xs: 0, md: 2}}}>
                          <Box sx={{ display: 'flex', flexDirection:{xs:'column', md:'row'}, alignItems: 'center', py: 2, px: {xs: 1, sm: 2}, mb:4}}>
                            <Box
                              sx={{
                                mr: 1, backgroundColor: 'primary.main', borderRadius: '50%', height: {xs: 30, md: 36}, width: {xs: 30, md: 36}, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: 'primary.contrastText',
                                '& svg': {
                                  fontSize: {xs: 24, md: 30},
                                },
                                ...iconStyle
                              }}>
                              {icon}
                            </Box>
                            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', px: {xs: 0, md: 1} }}>
                              <Typography variant="h4" sx={{ fontSize: {xs: 16, sm: 18, md:22}, mb: 1, color: 'secondary.main' }}>
                                {title}
                              </Typography>
                              <Typography component='ul' sx={{ m: 0, p: 0, listStyle: 'none' }}>
                                {description && description.map(({li}, index) => (
                                <Box key={index} sx={{display: 'flex', alignItems: 'start', justifyContent: 'flex-start', mb: 1, textWrap: 'wrap'}}>
                                  <Check sx={{color: 'primary.main', verticalAlign: 'text-top'}} />
                                  <Typography component="li" variant="subtitle1" align="left">
                                    <Typography variant="h5" component="p" sx={{ color: 'text.primary', lineHeight: 1.6 , fontSize: {xs: 12, sm: 14, md: 17}, fontWeight: {xs: 500, md: 600}}}>
                                      {li}
                                    </Typography>
                                  </Typography>
                                </Box>
                                ))}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Zoom>
                      ))}
                    </Slider>
                  </Box>
                </Box>
                <Box sx={{ '& button': { mr: 2, my:{xs:1, md:0 }}, px: {xs: 1, md: 2}, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Link to='/signin' style={{textDecoration: 'none'}}>
                    <StyledButton color="primary" variant="contained">
                      Get Started
                    </StyledButton>
                  </Link>
                  <ScrollLink to="intro-video" spy={true} smooth={true} offset={0} duration={350}>
                    <StyledButton color="primary" variant="outlined" startIcon={<PlayArrow />}>
                      Watch Video
                    </StyledButton>
                  </ScrollLink>
                </Box>
              </Box>
            </Slide>
          </Grid>
          <Grid item xs={12} sm={6} 
          sx={{ 
          display: 'flex', alignItems: 'flex-end', position: 'relative',
          '&::before': {
            content: '""',
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundImage: `url(${HomeHeroIcon})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 1,
          },
          '& > div':{
            position: 'relative',
            background: theme.palette.mode ==='dark'? `radial-gradient(rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)`:`radial-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`
          },
          }}>
            <HomePopularCourses />
          </Grid>
        </Grid>
      </Container>
    </Box>
    </WallPaperYGW>
  )
}

export default HomeHero
