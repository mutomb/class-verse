import React, { FC, useRef } from 'react'
import {Box, Grid, Container, Typography, IconButton, Slide, Zoom} from '@mui/material'
import Slider, { Settings } from 'react-slick'
import { styled } from '@mui/material/styles'
import IconArrowBack from '@mui/icons-material/ArrowBack'
import IconArrowForward from '@mui/icons-material/ArrowForward'
import {useTheme} from '@mui/material/styles'
import { TestimonialItem } from '../testimonial'
import { data } from './testimonial.data'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import HomeTestimonialIcon from "../../public/images/home/home-testimonial.png"
import logo from '../../public/logo.svg'
import { WallPaperYGW } from '../wallpapers/wallpapers'

interface SliderArrowArrow {
  onClick?: () => void
  type: 'next' | 'prev'
  className?: 'string'
}

const SliderArrow: FC<SliderArrowArrow> = (props) => {
  const { onClick, type, className } = props
  return (
    <IconButton
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
        bottom: { xs: '-28px !important', md: '64px !important' },
        left: 'unset !important',
        right: type === 'prev' ? '90px !important' : '30px !important',
        zIndex: 10,
        boxShadow: 1,
      }}
      disableRipple
      onClick={onClick}
      className={className}
    >
      {type === 'next' ? <IconArrowForward sx={{ fontSize: 22 }} /> : <IconArrowBack sx={{ fontSize: 22 }} />}
    </IconButton>
  )
}

const StyledSlickContainer = styled('div')(({style}) => ({
  position: 'relative',
  '& .slick-list': { marginLeft: 0, marginBottom: '24px' },
  ...style
}))

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
                Testimonial What our{' '}
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
                  Students{' '}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: 20, md: 28 },
                      left: 2,
                      '& img': { width: { xs: 130, md: 175 }, height: 'auto' },
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={HeadLineCurve} alt="Headline curve" />
                  </Box>
                </Typography>
                Say
              </Typography>
            </Slide>
            <StyledSlickContainer style={{backgroundColor: theme.palette.background.default, borderRadius: 10,  boxShadow: theme.shadows[5]}}>
              <Slider ref={sliderRef} {...sliderConfig}>
                {data.map((item, index) => (
                  <TestimonialItem key={String(index)} item={item} />
                ))}
              </Slider>
            </StyledSlickContainer>
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
