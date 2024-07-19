import React from 'react';
import {Box, Container, Divider, Grid, Skeleton, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles'
import { Parallax } from 'react-parallax';
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'

export default function FormSkeleton() {
  const theme= useTheme()
  return (
    <Parallax bgImage={image}  strength={50} blur={5}
    renderLayer={percentage=>(
      <WallPaperYGW variant='linear' primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.background.paper} 
      style={{
        opacity: percentage*0.7, position: 'fixed', width: '100%', height: '100%',
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          left: '50%',
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'space',
          backgroundSize: 'contain',
          opacity: percentage*0.5
        },
        '& > div':{
          position: 'relative'
        }
      }}/>
    )}>
      <Container 
        component='div'
        sx={{overflow: 'hidden', px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
        width: '100%', borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
        }}>
        <Grid container sx={{width: '100%',minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
          <Grid item xs={12} sx={{width: '100%'}}>
            <Box id='heading' sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}} >
              <Skeleton  width={100} height={50} sx={{boxShadow: 2, borderRadius: 1,
               background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`
               }} variant='rectangular'/>
              <Divider sx={{my: 0.5}}/>
              <Box sx={{ textAlign: 'center', width: '100%'}}>
                <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                  <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
                  <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid id="text-fields" item xs={12} sx={{width: '100%'}}>
            <Box sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}} >
              <Skeleton  width={'100%'} height={50} 
                sx={{borderRadius: 2, boxShadow: 2, borderStyle: 'solid', borderWidth: 2, borderColor: 'primary.main',
                  background: theme.palette.mode ==='dark'?
                  `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(0,0,0, 0.5) 97%, ${theme.palette.background.default} 100%)`:
                  `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(255,255,255, 0.5) 97%, ${theme.palette.background.default} 100%)`
                }} 
                variant="rectangular"/>
              <Divider sx={{my: 0.5}}/>
              <Skeleton  width={'100%'} height={50} 
                sx={{borderRadius: 2, boxShadow: 2, borderStyle: 'solid', borderWidth: 2, borderColor: 'primary.main',
                  background: theme.palette.mode ==='dark'?
                  `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(0,0,0, 1) 97%, ${theme.palette.background.default} 100%)`:
                  `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(255,255,255, 0.5) 97%, ${theme.palette.background.default} 100%)`
                }} 
                variant="rectangular"/>
              <Divider sx={{my: 0.5}}/>
              <Skeleton  width={'100%'} height={50} 
                sx={{borderRadius: 2, boxShadow: 2, borderStyle: 'solid', borderWidth: 2, borderColor: 'primary.main',
                  background: theme.palette.mode ==='dark'?
                  `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(0,0,0, 1) 97%, ${theme.palette.background.default} 100%)`:
                  `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(255,255,255, 0.5) 97%, ${theme.palette.background.default} 100%)`
                }} 
                variant="rectangular"/>
              <Divider sx={{my: 0.5}}/>
              <Skeleton  width={'100%'} height={50} 
                sx={{borderRadius: 2, boxShadow: 2, borderStyle: 'solid', borderWidth: 2, borderColor: 'primary.main',
                  background: theme.palette.mode ==='dark'?
                  `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(0,0,0, 1) 97%, ${theme.palette.background.default} 100%)`:
                  `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(255,255,255, 0.5) 97%, ${theme.palette.background.default} 100%)`
                }} 
                variant="rectangular"/>
            </Box>
          </Grid>
          <Divider sx={{my: 0.5}}/>
          <Box id='button' sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', alignItems: 'space-between', justifyContent: 'center', flexDirection: {xs: 'column', sm: 'row'}, width: '100%'}} >
            <Skeleton  width={150} height={50} sx={{boxShadow: 4,  bgcolor: 'primary.main', mx: {xs: 0, sm: 1, md: 2}, my: {xs: 1, sm: 0}}}/>
            <Skeleton  width={150} height={50} sx={{boxShadow: 4,  bgcolor: 'inherit', borderStyle: 'solid', borderWidth: 2, borderColor: 'primary.main', mx: {xs: 0, sm: 1, md: 2}, my: {xs: 1, sm: 0}}}/>
          </Box>
        </Grid>
      </Container>
    </Parallax>
  );
}
