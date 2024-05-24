import React, {useState, useEffect} from 'react'
import {Box, Container, Grid, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {useAuth} from '../auth'
import {listByTeacher} from '../courses/api-course'
import {Info} from '@mui/icons-material'
import {Redirect} from 'react-router-dom'
import Courses from '../courses/Courses'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { StyledBanner } from '../styled-banners'
import logo from '../../public/logo.svg'

export default function TeachingCourses(){
    const {isAuthenticated} = useAuth()
    const [courses, setCourses] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
    const theme = useTheme()
    /** Fetch courses I am teaching*/
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        if (!isAuthenticated().user) return function cleanup(){}
        listByTeacher({
          userId: isAuthenticated().user && isAuthenticated().user._id
        }, {token: isAuthenticated().token}, signal).then((data) => {
          if (data && data.error) {
            setRedirectToSignin(true)
          } else {
            setCourses(data)
          }
        })
        return function cleanup(){
          abortController.abort()
        }
      }, [])

    if (redirectToSignin) {
        return <Redirect to='/signin'/>
    }
    
    return (<>
    {isAuthenticated().user && isAuthenticated().user.teacher && (
    <WallPaperYGW primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: {xs:'unset', md: '50%'},
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}>
    <Box id="teaching-in-courses" sx={{ pt: { xs: 6, md: 8, }, pb: 14}} >
        <Container maxWidth="lg" sx={{px:{xs: 0, sm: 'unset'}}}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
            <Box
                sx={{
                height: '100%',
                width: { xs: '100%', md: '90%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                }}
            >
                <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                Teaching Courses
                </Typography>
            </Box>
            </Grid>
            <Grid item xs={12} md={9}>
            {courses.length != 0 ? (<Courses courses={courses} searched={false} enrollments={[]} columns={{xs: 12, sm: 6, md: 4}}/>):
            (<StyledBanner icon={<Info/>} heading={"No courses found"} body={"You have not yet published a course. Click Teach (on the Menu), or Courses (on the side-bar). Navigate to My Courses, then Add Course."} />)
            }
            </Grid>
        </Grid>
        </Container>
        </Box>
        </WallPaperYGW>)}
    </>)
}