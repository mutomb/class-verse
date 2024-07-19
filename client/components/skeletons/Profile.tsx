import React from 'react';
import {Avatar, Box, Container, Grid, Skeleton, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles'

export default function ProfileSkeleton() {
  const theme= useTheme()
  return (
    <Box sx={{zIndex: 1000, minHeight: '100vh', width: '100%', bgcolor: 'background.paper',}}>
      <Container maxWidth={false}
      sx={{px: {xs: 0, sm: 'unset'}, borderRadius: 4, boxShadow: 4 }}>
        <Grid container spacing={3}>
          <Grid id="background-img" item xs={12}>
           <Skeleton variant="rectangular"  width={'100%'} height={200} sx={{boxShadow: 2, background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}}/>
          </Grid>
          <Grid id="features" item sm={4.5} sx={{display: {xs: 'none', sm: 'flex'}, justifyContent: 'flex-end'}}>
            <Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, lineHeight: 1, fontWeight: 'bold', width: '100%' }} >
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
          </Grid>
          <Grid  id="image" item xs={12} sm={3} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 2}}>
            <Skeleton  width={150} height={150} sx={{mt: {xs: -5, sm: '-40%', md:'-30%'}, boxShadow: 2, borderRadius: '50%', background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.background.paper} 100%)`}} variant="circular">
              <Avatar 
                sx={{
                  width: {xs: 100, sm: 150, md: 200},
                  height: {xs: 100, sm: 150, md: 200},
                  bgcolor: 'background.paper',
                  color: 'primary.main'
                }}/>  
            </Skeleton>
          </Grid>
          <Grid id="features" item xs={12} sx={{display: {xs: 'flex', sm: 'none', justifyContent: 'center'}}}>
            <Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, lineHeight: 1, fontWeight: 'bold', width: '100%'}} >
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
          </Grid>
          <Grid id="personal-details" item xs={12} sm={4.5} sx={{display: 'flex', justifyContent: {xs: 'center', sm:'flex-start'}}}>
            <Typography sx={{fontSize: '1.2rem', fontWeight: 600, mb: 2, ml: { xs: 0, md: 4 }, width: '100%'}}>
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
            <Typography sx={{fontSize: '1.2rem', mb: 2, ml: { xs: 0, md: 4 }, fontWeight: 600, width: '100%'}}>
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
          </Grid>
          <Grid id="other-details" item xs={12}>
            <Typography component="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, lineHeight: 1, fontWeight: 'bold', }} >
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'primary.main', borderRadius: 1}}/>
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, lineHeight: 1, fontWeight: 'bold', }} >
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton  width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, ml: { xs: 0, md: 4 }, mt: 2, mb: 3, lineHeight: 1, fontWeight: 'bold', }} >
              <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton  width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
