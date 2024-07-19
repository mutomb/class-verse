import React from 'react';
import {Box, Container, Grid, Skeleton, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles'
import { useLoading } from '../progress';

export default function SectionSkeleton() {
  const theme= useTheme()

  return (
    <Box sx={{zIndex: 1000, py: { xs: 10, md: 14 }}}>
      <Container maxWidth='lg' sx={{minHeight: '100vh', px: 0, mx:0, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 4 }}>
        <Grid container spacing={3} sx={{display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row'}}}>
          <Grid id="image" item xs={12} md={5}>
           <Skeleton  width={'100%'} height={200} sx={{boxShadow: 4, borderRadius: 1, background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
          </Grid>
          <Grid id="text" item xs={12} md={7}>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' },
                pl: { xs: 0, md: 4 },
                pt: 2,
                pb: 3,
                lineHeight: 1,
                fontWeight: 'bold',
                width: '100%',
              }}>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>

            <Typography sx={{fontSize: '1.2rem', fontWeight: 600, pb: 2, pl: { xs: 0, md: 4 }, width: '100%' }}>
              <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
            </Typography>
            <Typography sx={{ pb: 2, pl: { xs: 0, md: 4 }, fontWeight: 600, width: '100%' }}>
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
