import React, {useState, useEffect} from 'react'
import {Box, Container, Grid, Typography} from '@mui/material'
import {useAuth} from '../auth'
import {useTheme} from '@mui/material/styles'
import {listEnrolled} from '../enrollment/api-enrollment'
import Enrollments from '../enrollment/Enrollments'
import {Info} from '@mui/icons-material'
import { StyledBanner } from '../styled-banners'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

export default function EnrolledInCourses(){
    const {isAuthenticated} = useAuth()
    const [enrolled, setEnrolled] = useState([])
    const theme = useTheme()
    /** Fetch enrolled in courses */
    useEffect(() => {
        if (!isAuthenticated().user) return function cleanup(){}
        const abortController = new AbortController()
        const signal = abortController.signal
        listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
            if (data && data.error) {
            console.log(data.error)
            } else {
            setEnrolled(data)
            }
        })
        return function cleanup(){
            abortController.abort()
        }
    }, [])
    return (<>
    {isAuthenticated().user && isAuthenticated().user.teacher === false && 
    (
    <WallPaperYGW primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          left: {xs: 'unset', md: '50%'},
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
    <Box id="enrolled-in-courses" sx={{ pt: { xs: 6, md: 8, }, pb: 14 }} >
            <Container maxWidth="lg">
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
                    <Typography variant="h1" sx={{color: 'text.primary', mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 } }}>
                    Enrollments
                    </Typography>
                </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>): 
                (<StyledBanner icon={<Info/>} variant='info' heading={"No courses found"} body={"You are not yet enrolled in any courses. Choose from popular courses listed below or use the search box to find other courses."} />) 
                }
                </Grid>
            </Grid>
            </Container>
    </Box>
    </WallPaperYGW>)}
    </>)
}