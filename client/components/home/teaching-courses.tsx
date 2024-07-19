import React, {useState, useEffect} from 'react'
import {Box, Container, Grid, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {useAuth} from '../auth'
import {listBySpecialist} from '../courses/api-course'
import {Info} from '@mui/icons-material'
import {Redirect} from 'react-router-dom'
import Courses from '../courses/Courses'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { StyledBanner } from '../styled-banners'
import logo from '../../public/logo.svg'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"

export default function TeachingCourses(){
    const {isAuthenticated} = useAuth()
    const [courses, setCourses] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
    const theme = useTheme()
    /** Fetch courses I am teaching*/
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        if (!isAuthenticated().user || (isAuthenticated().user && !isAuthenticated().user.specialist)) return function cleanup(){ setRedirectToSignin(true)}
        listBySpecialist({
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
    {isAuthenticated().user && isAuthenticated().user.specialist && (
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
    }} overlayStyle={{bgcolor: theme.palette.mode==='dark'? 'rgba(33, 33, 33, 0.7)': 'rgba(242, 245, 245, 0.7)'}}>
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
                Teaching{' '}
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
                  Courses{' '}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: 20, md: 28 },
                      left: 2,
                      '& img': { width: { xs: 100, md: 200 }, height: 'auto' },
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={HeadLineCurve} alt="Headline curve" />
                  </Box>
                </Typography>
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