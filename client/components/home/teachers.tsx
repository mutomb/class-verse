import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Slider, { Settings } from 'react-slick'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import {SliderArrow, SliderDots} from '../styled-buttons'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { TeacherCardItem } from '../teacher'
import { data } from './teachers.data'

const HomeOurTeachers: FC = () => {
  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))

  const sliderConfig: Settings = {
    infinite: true,
    // autoplay: true,
    speed: 300,
    slidesToShow: matchMobileView ? 1 : 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <SliderDots>{dots}</SliderDots>,
    customPaging: () => (
      <Box sx={{ height: {xs:10, md:8}, width: {xs:10, md:30}, backgroundColor: 'divider', display: 'inline-block', borderRadius: 4 }} />
    ),
  }

  return (
    <Box
      id="teachers"
      sx={{
        pt: {
          xs: 6,
          md: 8,
        },
        pb: {
          xs: 8,
          md: 12,
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
          Our Expert Teachers
        </Typography>

        <Slider {...sliderConfig}>
          {data.map((item) => (
            <TeacherCardItem key={String(item.id)} item={item} />
          ))}
        </Slider>
      </Container>
    </Box>
  )
}

export default HomeOurTeachers
