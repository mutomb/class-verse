import React from 'react';
import {Box, Skeleton} from '@mui/material';
import {useTheme} from '@mui/material/styles'

export default function MediaSkeleton() {
    const theme= useTheme()
  return (
    <Box sx={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>
      <Skeleton id='heading'  width={'100%'} height={20} sx={{boxShadow: 4, background:  'background.default'}} variant="rectangular"/>
      <Skeleton id='video'  width={'100%'} height={200} sx={{boxShadow: 4, borderRadius: 1, background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
      <Box id='buttons' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%'}}>
          <Skeleton  width={'20%'} height={10} sx={{boxShadow: 4, bgcolor: 'primary.main'}} />
          <Skeleton  width={20} height={20} sx={{boxShadow: 4, borderRadius: '50%', bgcolor: 'primary.main'}} variant="rounded"/>            
          <Skeleton  width={'20%'} height={10} sx={{boxShadow: 4,  bgcolor: 'primary.main'}}/>            
      </Box>
      <Box sx={{ mt: 0.5}}/>
      <Skeleton width={'100%'} id='details' sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
      <Skeleton width={'50%'} id='details-1' sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>  
      <Skeleton width={'100%'} id='details' sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
      <Skeleton width={'100%'} id='details' sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
      <Skeleton width={'100%'} id='details' sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
    </Box>
  );
}
