import React, { FC, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
interface StyledBannerProps{
    icon?: ReactNode,
    heading?: ReactNode,
    body?: ReactNode,
    wrapperStyle?: any,
    iconStyle?: any,
    headingStyle?: any,
    bodyStyle?: any,
    variant?: 'error' | 'success' | 'info' 
}
const StyledBanner: FC<StyledBannerProps> = ({icon, heading, body, wrapperStyle, iconStyle, headingStyle, bodyStyle, variant}) => {
    const color= variant==='error'? 'error.main': variant==='success'? 'primary.main': variant==='info'? 'secondary.main': ''
    return (
    <Box sx={{ px: 2, py: 1.5, boxShadow: 1, 
      borderRadius: 4, display: 'flex',
      flexDirection: {xs:'column', md:'row'},
      alignItems: 'center',justifyContent: 'center', width: '100%', backgroundColor: 'background.paper', flexWrap: 'wrap', 
      ...wrapperStyle}}>
        <Box
        sx={{
            mr: 1,
            borderRadius: '50%',
            height: 36,
            width: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.contrastText',
            '& svg': {
            color: color ||'secondary.main',
            fontSize: {xs: 20, sm: 30, md: 40}
            },
            ...iconStyle
        }}
        >
            {icon}
        </Box>
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', color: color || 'secondary.main'}}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, mb: 1, ...headingStyle}}>
                {heading}
            </Typography>
        <Typography
        variant='subtitle1' 
        sx={{ lineHeight: 1.3, color: 'text.primary', fontSize: {xs: '0.8rem' , sm: '1rem'}, ...bodyStyle}}
        >
            {body}
        </Typography>
        </Box>
  </Box>);
}
export default StyledBanner