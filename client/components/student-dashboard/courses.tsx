import React, { useEffect, useState } from 'react'
import {Typography, Box, Grid, Container, Slide} from '@mui/material'
import { listEnrolled } from '../enrollment/api-enrollment'
import {useAuth} from '../auth'
import Enrollments from '../enrollment/Enrollments'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import {useTheme} from '@mui/material/styles'
import logo from '../../public/logo.svg'

export default function Courses(){
  const {isAuthenticated} = useAuth()
  const [enrollments, setEnrollments] = useState([])
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
            setEnrollments(data)
          }
      })
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
                    <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                      Courses
                    </Typography>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
            <Enrollments enrollments={enrollments} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
 )
}