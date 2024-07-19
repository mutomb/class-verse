import React, {FC, useEffect} from 'react'
import {Container, Grid, IconButton} from '@mui/material'
import { StyledBanner } from '../styled-banners'
import { DonutLarge, Info, VerifiedUser } from '@mui/icons-material'
import { CourseCardItem } from '.'
import { useAuth } from '../auth'
import { Link } from 'react-router-dom'
import { AddToCart } from '../cart'
import { scroller } from 'react-scroll';

interface CoursesProps{
  courses:Array<any>,
  searched: boolean
  enrollments:Array<any>
  columns?: any
}

const Courses:FC<CoursesProps> = ({courses, searched, enrollments, columns}) =>{
    const {isAuthenticated} = useAuth()

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
      scroller.scrollTo('searched-courses', {
        duration: 1500,
        delay: 100,
        smooth: true,
        offset: -50
      })
      
    }, [])
    return (<Container id='searched-courses' maxWidth="lg" sx={{px:{xs:0, sm: 'inherit'}}}>
      {courses.length > 0 ?
        (
            <Grid container spacing={2}>
              {courses.map((course, index) => {
                return (
                  <Grid key={index} item xs={columns?.xs || 12} sm={columns?.sm || 4} md={columns?.md || 3}>
                    <CourseCardItem key={String(course._id)} item={course} action={getAction(course)} enrollmentID={isEnrolled(course) && isEnrolled(course)._id}/>
                  </Grid>
                ) 
                
                })}
            </Grid>): 
        (searched? (<StyledBanner  heading={"No Course found!"} body={"Enter a course name in the searchbox."} icon={<Info />} />):<></>)
      }
    </Container>)
}
export default Courses;
