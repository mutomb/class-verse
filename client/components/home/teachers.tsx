import React, { FC } from 'react'
import Slider, { Settings } from 'react-slick'
import {Container, Box, Typography, Slide} from '@mui/material'
import {SliderArrow, SliderDots} from '../styled-buttons'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import TeacherCardItem from './teacher-card-item'
import { data } from './teachers.data'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

const HomeOurTeachers: FC = () => {
  const theme = useTheme()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const sliderConfig: Settings= {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: xsMobileView ? 1 : smMobileView? 2: 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <SliderDots>{dots}</SliderDots>,
    customPaging: () => (
      <Box sx={{ height: {xs:10, md:8}, width: {xs:10, md:30}, backgroundColor: 'secondary.dark', display: 'inline-block', borderRadius: 4 }} />
    ),
  }

  return (
  <WallPaperYGW variant='linear' primaryColor={theme.palette.background.default} secondaryColor={theme.palette.background.paper}
  style={{
    pb: 10,
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
   <Box id="teachers" sx={{pt: {xs: 6,md: 8, }, pb: { xs: 8, md: 12, }}}>
      <Container maxWidth="lg" sx={{px:{xs:0, sm: 'unset'}}}>
        <Slide unmountOnExit={true} timeout={1000} id="slide-heading" appear={true} direction="right" in={true} color='inherit'>
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3.5rem', color: 'text.primary' } }}>
            Our Expert Teachers
          </Typography>
        </Slide>
        <Slider {...sliderConfig}>
          {data.map((item) => (
            <TeacherCardItem key={String(item.id)} item={item} />
          ))}
        </Slider>
      </Container>
    </Box>
  </WallPaperYGW>
  )
}

export default HomeOurTeachers
