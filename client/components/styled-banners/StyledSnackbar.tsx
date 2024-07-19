import React, { FC, ReactNode } from 'react'
import { IconButton, Snackbar, snackbarContentClasses } from '@mui/material'
import { StyledBanner } from '.';
import { Close } from '@mui/icons-material';
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
    variant?: 'error' | 'success' | 'info',
    action?: ReactNode 
}
const StyledSnackbar: FC<StyledBannerProps> = ({handleClose, open, duration=5000, icon, heading, body, wrapperStyle, iconStyle, headingStyle, bodyStyle, variant, action}) => {
    const color= variant==='error'? 'error.main': variant==='success'? 'primary.main': variant==='info'? 'secondary.main': ''
    return (
        <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        action={action ||(<IconButton onClick={handleClose}>
                                <Close sx={{color: 'primary.main'}} />
                            </IconButton>)}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        sx={{borderRadius: 3, borderWidth:2, borderColor: color || 'secondary.main', borderStyle: 'solid', bgcolor: 'background.paper', p:0, 
            [`& .${snackbarContentClasses.root}`]:{ bgcolor: 'unset', p:0}, [`& .${snackbarContentClasses.message}`]:{p:0, width: '100%'},
            [`& .${snackbarContentClasses.action}`]:{position: 'absolute', top: 0, right: 0}
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