import React, {useState, useEffect} from 'react'
import {Box, Container, Grid, Typography} from '@mui/material'
import {useAuth} from '../auth'
import {useTheme} from '@mui/material/styles'
import {listEnrolled} from '../enrollment/api-enrollment'
import Enrollments from '../enrollment/Enrollments'
import {Error, Info} from '@mui/icons-material'
import { StyledBanner, StyledSnackbar } from '../styled-banners'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"

export default function EnrolledInCourses(){
    const {isAuthenticated} = useAuth()
    const [enrolled, setEnrolled] = useState([])
    const theme = useTheme()
    const [error, setError] = useState('')
    /** Fetch enrolled in courses */
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        if(isAuthenticated().user){
            listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
                if (data && data.error) {
                 setError(data.error)
                } else {
                setEnrolled(data)
                }
            })
        }
        return function cleanup(){
            abortController.abort()
        }
    }, [])

    return (<>
    {isAuthenticated().user && isAuthenticated().user.specialist === false && 
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
                    }}>
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
                    Enrollments
                    <Box
                        sx={{
                        position: 'absolute',
                        top: { xs: 20, md: 28 },
                        left: 2,
                        '& img': { width: { xs: 100, md: 250 }, height: 'auto' },
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={HeadLineCurve}  />
                    </Box>
                    </Typography>
                </Typography>
                </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>): 
                (<StyledBanner icon={<Info/>} variant='info' heading={"No courses found"} body={"You are not yet enrolled in any courses. Choose from popular courses or use the search box at the top to find other courses."} />) 
                }
                </Grid>
            </Grid>
            <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
            </Container>
    </Box>
    </WallPaperYGW>)}
    </>)
}