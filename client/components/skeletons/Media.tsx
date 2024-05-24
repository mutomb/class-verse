import React from 'react';
import {Box, Skeleton} from '@mui/material';
import {useTheme} from '@mui/material/styles'

export default function MediaSkeleton() {
    const theme= useTheme()
  return (
    <>
    <Skeleton  width={'100%'} height={20} sx={{boxShadow: 4, background:  'background.default'}} variant="rectangular"/>
    <Skeleton  width={'100%'} height={200} sx={{boxShadow: 4, borderRadius: 1, background: `linear-gradient(rgba(0,0,0, 1) 0%, rgba(0,0,0, 1) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <Skeleton  width={'20%'} height={10} sx={{boxShadow: 4, bgcolor: 'primary.main'}} />
        <Skeleton  width={20} height={20} sx={{boxShadow: 4, borderRadius: '50%', bgcolor: 'primary.main'}} variant="rounded"/>            
        <Skeleton  width={'20%'} height={10} sx={{boxShadow: 4,  bgcolor: 'primary.main'}}/>            
    </Box>
    <Box sx={{ mt: 0.5 }}/>
    <Skeleton sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
    <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>  
    </>
  );
}
