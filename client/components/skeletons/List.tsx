import React from 'react';
import {Box, Divider, Skeleton} from '@mui/material';
import {useTheme} from '@mui/material/styles'

export default function ListSkeleton() {
    const theme= useTheme()
  return (
  <Box  sx={{minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    {Array.from(new Array(10)).map((item, index) => (
      <Box key={index} sx={{width: '100%'}}>
        <Box  sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
          <Skeleton id='image'  width={70} height={70} sx={{boxShadow: 2, borderRadius: 1, background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
          <Box id='description' sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Skeleton id='details'  width={'100%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/>
            <Skeleton id='details-1' width={'50%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/>
          </Box>
          <Skeleton  width={40} height={40} sx={{boxShadow: 2, borderRadius: '50%', bgcolor: 'primary.main'}} variant="rounded"/>              
        </Box>
        {index<9 && <Divider sx={{opacity: 0, my: 1}} />}
      </Box>
    ))}
  </Box>);
}
