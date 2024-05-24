import React from 'react'
import {TeacherDashBoardDeposits, TeacherDashBoardOrders} from '.'
{/*TeacherDashBoardChart*/}
import { Box, Container, Grid, Slide, Typography } from '@mui/material'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import {useTheme} from '@mui/material/styles'
import logo from '../../public/logo.svg'

export default function Overview(){
    const theme = useTheme()
    return(
      <WallPaperYGW primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
      style={{
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          left: {xs: 'unset', md: '50%'},
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'space',
          backgroundSize: 'contain',
          opacity: 0.5,
        },
        '& > div':{
          position: 'relative'
        }
      }}>
        <Box id="overview" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
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
                  }}
              >
                  <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                    Teaching Overview
                  </Typography>
              </Box>
            </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Box 
                    sx={{ px: {xs: 0, sm:2}, py: 1.5, '&:hover':{boxShadow: 2}, bgcolor: 'background.default', 
                      borderRadius: 4, display: 'flex',
                      flexDirection: {xs:'column', md:'row'},
                      alignItems: 'center'}}>
                    <Box sx={{ mt: 1, width: '100%'}}>
                      <TeacherDashBoardDeposits />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Box 
                    sx={{ px: {xs: 0, sm:2}, py: 1.5, '&:hover':{boxShadow: 2}, bgcolor: 'background.default',
                      borderRadius: 4, display: 'flex',
                      flexDirection: {xs:'column', md:'row'},
                      alignItems: 'center'}}>
                    <Box sx={{ mt: 1, width: '100%'}}>
                      {/* <TeacherDashBoardChart /> */}
                      <TeacherDashBoardDeposits />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Box 
                    sx={{ px: {xs: 0, sm:2}, py: 1.5, '&:hover':{boxShadow: 2}, bgcolor: 'background.default',
                      borderRadius: 4, display: 'flex',
                      flexDirection: {xs:'column', md:'row'},
                      alignItems: 'center'}}>
                    <Box sx={{ mt: 1, width: '100%'}}>
                      <TeacherDashBoardOrders />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        </Box>
      </WallPaperYGW>
    )
}