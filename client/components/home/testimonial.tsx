import React, { FC, useRef } from 'react'
import {Box, Grid, Container, Typography, Slide, Zoom} from '@mui/material'
import Slider, { Settings } from 'react-slick'
import {useTheme} from '@mui/material/styles'
import { TestimonialItem } from '../testimonial'
import { data } from './testimonial.data'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import HomeTestimonialIcon from "../../public/images/home/home-testimonial.png"
import logo from '../../public/logo.svg'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { SliderArrow } from '../styled-buttons'
import { useAuth } from '../auth'

const HomeTestimonial: FC = () => {
  const sliderRef = useRef(null)
  const theme = useTheme()
  const sliderConfig: Settings = {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
  }
  const {isAuthenticated} = useAuth()
  if(isAuthenticated().user) return <></>
  return (
    <WallPaperYGW variant='linear' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
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
    <Box id="testimonials" sx={{ pb: { xs: 6, md: 10, }}}>
      <Container sx={{px: {xs: 0, sm: 'unset'}}}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Slide unmountOnExit={true} timeout={1000} id="slide-heading" appear={true} direction="right" in={true} color='inherit'>
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
                  Clients{' '}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: 20, md: 28 },
                      left: 2,
                      '& img': { width: { xs: 100, md: 175 }, height: 'auto' },
                      mb: {xs: 1, sm: 0}
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={HeadLineCurve} alt="Headline curve" />
                  </Box>
                </Typography>
                Testimonials
              </Typography>
            </Slide>
            <Box sx={{position: 'relative', '& .slick-list': { ml: 0, mb: 3 }, backgroundColor: 'background.default', borderRadius: 2,  boxShadow: 2}}>
              <Slider ref={sliderRef} {...sliderConfig}>
                {data.map((item, index) => (
                  <TestimonialItem key={String(index)} item={item} />
                ))}
              </Slider>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
              <Box sx={{ width: { xs: '100%', md: '90%' } }}>
                <Box component='img' src={HomeTestimonialIcon} sx={{width:'100%', height:'auto'}} alt="Testimonial img" />
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </WallPaperYGW>
  )
}

export default HomeTestimonial
