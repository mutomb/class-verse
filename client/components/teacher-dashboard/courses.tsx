import React, {} from 'react'
import {Typography, Box, Grid, Container, Slide} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {MyCourses} from '../courses'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

export default function Courses(){
  const theme = useTheme()
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
            <Box
                sx={{
                height: '100%',
                width: { xs: '100%', md: '90%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                }}>
              <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                Courses
              </Typography>
            </Box>
            </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <MyCourses />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
 )
}