import React, { useEffect, useState } from 'react'
import {Typography, Box, Grid, Container, Slide} from '@mui/material'
import { listEnrolled } from '../enrollment/api-enrollment'
import {useAuth} from '../auth'
import Enrollments from '../enrollment/Enrollments'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import {useTheme} from '@mui/material/styles'
import logo from '../../public/logo.svg'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import { Error } from '@mui/icons-material'
import { StyledSnackbar } from '../styled-banners'

export default function Courses(){
  const {isAuthenticated} = useAuth()
  const [enrollments, setEnrollments] = useState([])
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
              setEnrollments(data)
            }
        })
      }
      return function cleanup(){
          abortController.abort()
      }
  }, [])
  return ( 
    <WallPaperYGW secondaryColor={theme.palette.background.paper} primaryColor={theme.palette.background.default}
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
      <Box id="courses" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="right" in={true} color='inherit'>
                <Box sx={{ height: '100%', width: { xs: '100%', md: '90%' }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, }} >
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
                        <img src={HeadLineCurve}/>
                      </Box>
                    </Typography>
                  </Typography>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
            <Enrollments enrollments={enrollments} />
            </Grid>
          </Grid>
        </Container>
        <StyledSnackbar
          open={error? true: false}
          duration={3000}
          handleClose={()=>setError('')}
          icon={<Error/>}
          heading={"Error"}
          body={error}
          variant='error'
          />
      </Box>
    </WallPaperYGW>
 )
}