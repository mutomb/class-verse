import React, { FC } from 'react'
import {Box, Grid, Container, Typography, Slide, Zoom} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { Link as ScrollLink } from 'react-scroll'
import { StyledButton } from '../styled-buttons'
import {PlayArrow} from '@mui/icons-material'
import CertificateIcon from "../../public/images/icons/certificate.png"
import HomeHeroIcon from "../../public/images/home/home-hero.png"
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import logo from "../../public/logo.svg"
import {useAuth} from '../auth'
import { WallPaperYGW } from '../wallpapers/wallpapers'

interface Exp {
  label: string
  value: string
}
interface ExpItemProps {
  item: Exp
}

const exps: Array<Exp> = [
  {
    label: 'Students',
    value: '10K+',
  },
  {
    label: 'Quality Course',
    value: '20+',
  },
  {
    label: 'Experience Teachers',
    value: '10+',
  },
]

const ExpItem: FC<ExpItemProps> = ({ item }) => {
  const { value, label } = item
  return (
    <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 } }}>
        <Typography
          sx={{ color: 'secondary.main', mb: { xs: 1, md: 2 }, fontSize: { xs: 34, md: 44 }, fontWeight: 'bold' }}
        >
          {value}
        </Typography>
        <Typography variant="h5" sx={{color: 'text.secondary'}}>
          {label}
        </Typography>
      </Box>
    </Zoom>
  )
}

const HomeHero: FC = () => {
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  if(isAuthenticated().user) return(<></>)
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
    <Box id="hero" sx={{ position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'unset'}}}>
        <Grid container spacing={0} sx={{ flexDirection: { xs: 'column', sm: 'unset' } }}>
          <Grid item xs={12} sm={7}>
          <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="right" in={true} color='inherit'>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ mb: 3 }}>
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
                        left: 2,
                        transform: 'rotate(3deg)',
                        '& img': { width: { xs: 146, md: 210 }, height: 'auto' },
                      }}
                    >
                      {/* eslint-disable-next-line */}
                      <img src={HeadLineCurve} alt="Headline curve" />
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
                  <br />
                  Made Uber Easy
                </Typography>
              </Box>
              <Box sx={{ mb: 4, width: { xs: '100%', md: '70%' } }}>
                <Typography sx={{ color: 'text.primary', lineHeight: 1.6 , fontWeight: 700}}>
                  {
                    "Let's take an online course to improve your skills in a different way, you can set your own study time according to your learning speed. So you san study comfortable and absorb the material easily."
                  }
                </Typography>
              </Box>
              <Box sx={{ '& button': { mr: 2, my:{xs:1, md:0 }} }}>
                <ScrollLink to="popular-course" spy={true} smooth={true} offset={0} duration={350}>
                  <StyledButton color="primary" size="large" variant="contained">
                    Get Started
                  </StyledButton>
                </ScrollLink>
                <ScrollLink to="intro-video" spy={true} smooth={true} offset={0} duration={350}>
                  <StyledButton color="primary" size="large" variant="outlined" startIcon={<PlayArrow />}>
                    Watch Video
                  </StyledButton>
                </ScrollLink>
              </Box>
            </Box>
          </Slide>
          </Grid>
          <Grid item xs={12} sm={5} sx={{ position: 'relative' }}>
            {/* Certificate badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 30,
                left: { xs: 0, md: -150 },
                boxShadow: 1,
                borderRadius: 3,
                px: {xs: 0, sm: 2},
                py: 1.4,
                zIndex: 1,
                backgroundColor: 'inherit',
                display: 'flex',
                alignItems: 'flex-start',
                bgcolor: 'background.default'
              }}
            >
              <Box
                sx={{
                  boxShadow: 1,
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: {xs: 0, md: 2},
                  '& img': { width: '32px !important', height: 'auto' },
                }}
              >
                <Box component='img' src={CertificateIcon} alt="Certificate icon" sx={{width:'100%', height:'auto'}} />
              </Box>
              <Box>
                <Typography
                  component="h6"
                  sx={{ color: 'secondary.main', fontSize: '1.1rem', fontWeight: 700, mb: 0.5 }}
                >
                  Certificate
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', lineHeight: 1.3 }}>
                  There are certificates for all courses.
                </Typography>
              </Box>
            </Box>
            <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
              <Box sx={{ lineHeight: 0}} >
                <Box component='img' src={HomeHeroIcon} sx={{width:'100%', height:'auto'}} alt="Hero img" />
              </Box>
            </Zoom>
          </Grid>
        </Grid>

        {/* Experience */}
        <Box sx={{ boxShadow: 2, py: 4, px: {xs: 0, sm: 7}, borderRadius: 4, bgcolor: 'background.default' }}>
          <Grid container spacing={2}>
            {exps.map((item) => (
              <Grid key={item.value} item xs={12} md={4}>
                <ExpItem item={item}/>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
    </WallPaperYGW>
  )
}

export default HomeHero
