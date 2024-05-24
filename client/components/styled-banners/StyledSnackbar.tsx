import React, { FC, ReactNode } from 'react'
import { Snackbar, snackbarContentClasses } from '@mui/material'
import { StyledBanner } from '.';
interface StyledBannerProps{
    handleClose: ()=>void,
    open: boolean,
    duration?: number,
    icon?: ReactNode,
    heading?: String,
    body?: String,
    wrapperStyle?: any,
    iconStyle?: any,
    headingStyle?: any,
    bodyStyle?: any,
    variant?: 'error' | 'success' | 'info' 
}
const StyledSnackbar: FC<StyledBannerProps> = ({handleClose, open, duration=5000, icon, heading, body, wrapperStyle, iconStyle, headingStyle, bodyStyle, variant}) => {
    const color= variant==='error'? 'red': variant==='success'? 'primary.main': variant==='info'? 'secondary.main': ''
    return (
        <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        sx={{borderRadius: 3, borderWidth:2, borderColor: color || 'secondary.main', borderStyle: 'solid', bgcolor: 'background.paper', p:0, 
            [`& .${snackbarContentClasses.root}`]:{ bgcolor: 'unset', p:0}, [`& .${snackbarContentClasses.message}`]:{p:0, width: '100%'}
        }}
        message={
          <StyledBanner  icon={icon} heading={heading} body={body}
          bodyStyle={{color: 'text.primary', ...bodyStyle}}
          wrapperStyle={{bgcolor: 'background.paper', borderRadius: 3, ...wrapperStyle}}
          iconStyle={{color: color || 'secondary.main', ...iconStyle}}
          headingStyle={{color: color || 'secondary.main', ...headingStyle}}
          variant={variant}
          />
        }/>);
}
export default StyledSnackbar