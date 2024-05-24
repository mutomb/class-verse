import React, { FC, useEffect, useState } from 'react'
import {Box, Grid, Typography, Container, IconButton, useMediaQuery, Slide} from '@mui/material'
import Slider, { Settings } from 'react-slick'
import { useTheme } from '@mui/material/styles'
import {SliderArrow, SliderDots} from '../styled-buttons'
import { CourseCardItem } from '../courses'
import { listPopular } from '../courses/api-course'
import { listEnrolled } from '../enrollment/api-enrollment'
import {useAuth} from '../auth'
import { VerifiedUser, DonutLarge } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { AddToCart } from '../cart'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

const HomePopularCourse: FC = () => {
  
  const [courses, setCourses] = useState([])
  const theme = useTheme()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [enrollments, setEnrollments] = useState([])
  const {isAuthenticated} = useAuth()

  const sliderConfig: Settings = {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: xsMobileView ? 1 : smMobileView? 2: 3,
    slidesToScroll: 1,
    rows:1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <SliderDots>{dots}</SliderDots>,
    customPaging: () => (
      <Box sx={{ height: {xs:10, md:8}, width: {xs:10, md:30}, backgroundColor: 'secondary.dark', display: 'inline-block', borderRadius: 4 }} />
    ),
  }
  const isEnrolled = (course) => {
    return enrollments.find((enrollment)=>{return enrollment.course._id === course._id})
  }
  const isTeacher = (course) =>{
    return isAuthenticated().user && isAuthenticated().user._id === course.teacher._id
  }

  const getAction = (course) =>{
    if(isTeacher(course) || (isAuthenticated().user && isAuthenticated().user.teacher)) return <></>
    if(isEnrolled(course) && isEnrolled(course).completed) return (
      <Link style={{textDecorationLine:'none'}}  to={`/learn/${isEnrolled(course)._id}`}>
        <IconButton aria-label={`course-${course.name}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:"primary.main",
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                boxShadow: 2,
                transform: 'translateY(-3px)',
                transition: (theme) => theme.transitions.create(['transform'])
          }}}>
          <VerifiedUser />
        </IconButton>
      </Link>
    )
    if(isEnrolled(course) && !isEnrolled(course).completed) return (
      <Link style={{textDecorationLine:'none'}}  to={`/learn/${isEnrolled(course)._id}`}>
        <IconButton aria-label={`course-${course.name}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:"secondary.main",
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'secondary.main',
                boxShadow: 2,
                transform: 'translateY(-3px)',
                transition: (theme) => theme.transitions.create(['transform'])
          }}}>
          <DonutLarge />
        </IconButton>
      </Link>
    )
    return <AddToCart item={course}/>
  }

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listPopular(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setCourses(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, ['john'])

  useEffect(() => {
    if (!isAuthenticated().user) return function cleanup(){}
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
        console.log(data.error)
        } else { 
        setEnrollments(data)
        }
    })
    return function cleanup(){
        abortController.abort()
    }
  }, ['john'])
  

  return (
    <WallPaperYGW variant='linear' primaryColor={theme.palette.background.default} secondaryColor={theme.palette.background.paper}
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
      <Box id="popular-courses" sx={{ pt: { xs: 6, md: 8, }, pb: 14}}>
        <Container maxWidth="lg" sx={{px:{xs:0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Slide unmountOnExit={true} timeout={1000} id="slide-heading" appear={true} direction="right" in={true} color='inherit'>
                <Box
                  sx={{
                    height: '100%',
                    width: { xs: '100%', md: '90%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}>
                  <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: '2rem', md: '3.5rem'}, color: 'text.primary' }}>
                    Most Popular Courses
                  </Typography>
                </Box>
              </Slide>
            </Grid>

            <Grid item xs={12} md={9}>
              {courses.length < 3 ? 
              (<Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>{
              courses.map((course)=>(
                <CourseCardItem key={String(course._id)} item={course} action={getAction(course)} enrollmentID= {isEnrolled(course) && isEnrolled(course)._id} />
              ))}</Box>):(<Slider {...sliderConfig}>
                {courses.map((course) => (
                  <CourseCardItem key={String(course._id)} item={course} action={getAction(course)} enrollmentID= {isEnrolled(course) && isEnrolled(course)._id} />
                ))}
              </Slider>)}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
 )
}

export default HomePopularCourse
