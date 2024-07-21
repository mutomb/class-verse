import React, { FC, useEffect, useState } from 'react'
import {Box, IconButton, useMediaQuery} from '@mui/material'
import Slider, { Settings } from 'react-slick'
import { useTheme } from '@mui/material/styles'
import {SliderArrow, SliderDots} from '../styled-buttons'
import { CourseCardItem } from '../courses'
import { listPopular } from '../courses/api-course'
import { listEnrolled } from '../enrollment/api-enrollment'
import {useAuth} from '../auth'
import { VerifiedUser, DonutLarge, Error } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { AddToCart } from '../cart'
import { StyledSnackbar } from '../styled-banners'
import { CardItemSkeleton } from '../skeletons'

const HomePopularCourse: FC = () => {
  
  const [courses, setCourses] = useState([])
  const theme = useTheme()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [enrollments, setEnrollments] = useState([])
  const {isAuthenticated} = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const sliderConfig: Settings = {
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: smMobileView ? 1 : 2,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    swipe: true,
    focusOnSelect: true,
    lazyLoad: 'progressive',
    pauseOnDotsHover: true,
    pauseOnFocus: true,
    pauseOnHover: true,
    centerMode: xsMobileView ? false: true,
    arrows: false,
    appendDots: (dots) => <SliderDots>{dots}</SliderDots>,
    customPaging: () => (
      <Box sx={{ height: {xs:10, md:8}, width: {xs:10, md:30}, backgroundColor: 'secondary.dark', display: 'inline-block', borderRadius: 4 }} />
    ),
  }
  const isEnrolled = (course) => {
    return enrollments.find((enrollment)=>{return enrollment.course._id === course._id})
  }
  const isSpecialist = (course) =>{
    return isAuthenticated().user && isAuthenticated().user._id === course.specialist._id
  }

  const getAction = (course) =>{
    if(isSpecialist(course) || (isAuthenticated().user && isAuthenticated().user.specialist)) return <></>
    if(isEnrolled(course) && isEnrolled(course).completed) return (
      <Link style={{textDecorationLine:'none'}}  to={`/client/${isEnrolled(course)._id}`}>
        <IconButton aria-label={`course-${course.title}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:"primary.main",
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                boxShadow: 2,
                transform: 'translateY(-3px) scale(1.1)',
                transition: (theme) => theme.transitions.create(['transform'], {duration: 500})
          }}}>
          <VerifiedUser />
        </IconButton>
      </Link>
    )
    if(isEnrolled(course) && !isEnrolled(course).completed) return (
      <Link style={{textDecorationLine:'none'}}  to={`/client/${isEnrolled(course)._id}`}>
        <IconButton aria-label={`course-${course.title}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:"secondary.main",
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'secondary.main',
                boxShadow: 2,
                transform: 'translateY(-3px) scale(1.1)',
                transition: (theme) => theme.transitions.create(['transform'], {duration: 500})
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
    setLoading(true)
    listPopular(signal).then((data) => {
      if (data && data.error) {
         setError(data.error)
         setLoading(false)
      } else {
        setCourses(data)
        setLoading(false)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    if(isAuthenticated().user){
      listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
          if (data && data.error) {
          setError(data.error)
          setLoading(false)
          } else { 
          setEnrollments(data)
          setLoading(false)
          }
      })
    }
    return function cleanup(){
        abortController.abort()
    }
  }, [])
  if(loading || !courses || courses.length===0){
    return(
      <Box sx={{width: '100%', ['& .slick-list']: { ml: 0}, ['& .slick-slider']: { width: '100%'}, ['& .slick-slide> div > div > div']: { transform: 'scale(0.8)', transition: theme.transitions.create(['box-shadow', 'transform'], {duration: 2000})}, 
                ['& .slick-slide.slick-active.slick-current > div > div > div']: {boxShadow: 4, transform: 'scale(1.03)', transition: theme.transitions.create(['box-shadow', 'transform'], {duration: 2000})} }}>
        <Slider {...sliderConfig}>
          {Array.from(new Array(4)).map(()=>(<CardItemSkeleton />))}
        </Slider>
      </Box>)
  }
  return (<>
          {(courses.length < 3) ? 
          (<Box sx={{['& .slick-list']: { ml: 0}, ['& .slick-slider']: { width: '100%'}, ['& .slick-slide> div > div > div']: {filter: 'blur(1px)', transform: 'scale(0.8)', transition: theme.transitions.create(['box-shadow', 'transform', 'filter'], {duration: 2000})}, ['& .slick-slide.slick-active.slick-current > div > div > div']: {filter: 'blur(0px)', boxShadow: 4, transform: 'scale(1.03)', transition: theme.transitions.create(['box-shadow', 'transform', 'filter'], {duration: 2000})}, width: '100%', display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
            <Slider {...sliderConfig}>
            {[...courses, ...courses, ...courses].map((course, index)=>(
              <CourseCardItem key={index} item={course} action={getAction(course)} enrollmentID= {isEnrolled(course) && isEnrolled(course)._id} />
            ))}
            </Slider>
          </Box>):
          (<Box sx={{['& .slick-list']: { ml: 0}, ['& .slick-slider']: { width: '100%'}, ['& .slick-slide> div > div > div']: {filter: 'blur(1px)', transform: 'scale(0.8)', transition: theme.transitions.create(['box-shadow', 'transform', 'filter'], {duration: 2000})}, ['& .slick-slide.slick-active.slick-current > div > div > div']: {filter: 'blur(0px)', boxShadow: 4, transform: 'scale(1.03)', transition: theme.transitions.create(['box-shadow', 'transform', 'filter'], {duration: 2000})}, width: '100%', display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
            <Slider {...sliderConfig}>
            {courses.map((course) => (
              <CourseCardItem key={String(course._id)} item={course} action={getAction(course)} enrollmentID={isEnrolled(course) && isEnrolled(course)._id} 
              wrapperStyle={{['& > div']: {bgcolor: theme.palette.mode ==='dark'? 'rgba(0,0,0,0.8) !important':'rgba(255,255,255,0.8) !important'} }}/>
            ))}
            </Slider>
          </Box>)}
          <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
          </>)
}

export default HomePopularCourse
