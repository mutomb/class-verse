import React, { FC } from 'react';
import {Box, Divider, Skeleton} from '@mui/material';
import {SxProps, Theme, useTheme} from '@mui/material/styles'
interface ConversationsSkeletonProps{
  sx?: SxProps<Theme>
}
const ConversationsSkeleton: FC<ConversationsSkeletonProps> = ({ sx })=>{
  const theme= useTheme()
  return (
  <Box sx={{ width:'100%', height: '100%', ...sx}}>
    <Box id='conversations-list' sx={{pt:'10vh', height: 'calc(100% - 48px)', px: {xs: 0, sm: 2}, py: 4, width: '100%', overflowY: 'scroll', 
        scrollbarWidth: {xs: 'none',  sm:'thin'}, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', bgcolor: 'background.default'}}>
      <Box sx={{width: '100%'}}>
      {Array.from(new Array(5)).map((item, index) => (
      <Box key={index} sx={{width: '100%'}}>
        <Box  sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
          <Skeleton id='image'  width={40} height={40} sx={{boxShadow: 2, borderRadius: '50%', background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
          <Box id='description' sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Skeleton id='details'  width={'100%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/>
            <Skeleton id='details-1' width={'50%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/>
          </Box>
        </Box>
        <Divider sx={{ my: 0.5 }}/>
      </Box>
      ))}
      </Box>
    </Box>
  </Box>
  );
}
export default ConversationsSkeleton
