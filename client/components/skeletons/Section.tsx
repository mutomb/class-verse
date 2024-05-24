import React from 'react';
import {Box, Container, Grid, Skeleton, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles'

export default function MediaSkeleton() {
  const theme= useTheme()
  return (
    <Box sx={{zIndex: 1000, py: { xs: 10, md: 14 }}}>
      <Container 
      sx={{px: {xs: 0, sm: 'unset'}, bgcolor: `rgba(0,0,0,0.2)`, borderRadius: 4, boxShadow: 4,
      transform: 'unset',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-3px)',
        transition: (theme) => theme.transitions.create(['box-shadow, transform'], {duration: 1000}),
      },
      }}>
        <Grid container spacing={3} sx={{display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row'}}}>
          <Grid  id="image" item xs={12} md={5}>
           <Skeleton  width={'100%'} height={200} sx={{boxShadow: 4, borderRadius: 1, background: `linear-gradient(rgba(0,0,0, 1) 0%, rgba(0,0,0, 1) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
          </Grid>
          <Grid id="text" item xs={12} md={7}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' },
                ml: { xs: 0, md: 4 },
                mt: 2,
                mb: 3,
                lineHeight: 1,
                fontWeight: 'bold',
                
              }}
            >
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>

            <Typography sx={{fontSize: '1.2rem', fontWeight: 600, mb: 2, ml: { xs: 0, md: 4 } }}>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
            <Typography sx={{ mb: 2, ml: { xs: 0, md: 4 }, fontWeight: 600, }}>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
