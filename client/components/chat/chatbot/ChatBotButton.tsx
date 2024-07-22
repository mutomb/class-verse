import React, { FC, useEffect, useState } from 'react'
import { Box, Fade, Fab, Badge, badgeClasses, fabClasses, IconButton, iconButtonClasses } from '@mui/material'
import {Close, Email} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import {socket} from '../communication'
import { useAuth } from '../../auth';

interface InputButtonProps{
    handleOpen: () => void
}

const ChatBotButton: FC<InputButtonProps> = ({handleOpen}) => {
    const trigger = useScrollTrigger();
    const theme = useTheme()
    const {isAuthenticated} = useAuth()
    const [notificationCount, setNotificationCount] = useState(0) 
    const [hidden, setHidden] = useState(false) 

    useEffect(()=>{
        if(isAuthenticated().user){ /** if not anonymous then refresh list*/   
            socket.on(`message-${isAuthenticated().user._id}`, (data)=>{
                setNotificationCount(notificationCount+1)
            })
            return function cleanup(){
                
                socket.off(`message-${isAuthenticated().user._id}`)
            }
        }
    }, [])
    
    const reset = () => {
        setNotificationCount(0)
    }
    const toggleHidden = () => {
        setHidden(!hidden)
    }
    return (
    <Fade in={hidden? trigger: true}>
        <Box role="presentation"
            sx={{ position: 'fixed', bottom: {xs:60, md: 16}, left: hidden? -30: {xs: 16, md: 70}, zIndex: 1100, [`& .${iconButtonClasses.root}`]:{display: 'none', opacity: 0}, transform: 'unset', transition: (theme)=> theme.transitions.create(['left'], {duration: 1000}),
                '&:hover':{[`& .${iconButtonClasses.root}`]:{display: 'flex', opacity: 1, transform: 'translateY(-5px) scale(1.1)', transition: (theme)=> theme.transitions.create(['transform', 'opacity'], {duration: 1000})}}, 
                ...(hidden && {'&:hover':{left: 0, transition: theme.transitions.create(['right'], {duration: 1000})}}) }}>
            <IconButton  onClick={toggleHidden}
                size='small'
                sx={{opacity: 0.8, backgroundColor: 'primary.main', zIndex: 2, '&:hover':{transform: 'translateY(-10px) scale(1.1)', transition: theme.transitions.create(['right'], {duration: 500})}}}>
                {<Close sx={{color: 'primary.contrastText', width: {xs: 15, sm: 20}, height: {xs: 15, sm: 20}}} />}
            </IconButton>
           <Badge invisible={false} 
            badgeContent={notificationCount} 
            sx={{zIndex: 1,
            transform: 'unset', [`& .${badgeClasses.badge}`]:{bgcolor: 'secondary.main'}, boxShadow: 4, borderRadius: '50%',
            '&:hover':{
                transition: theme.transitions.create(['transform'], {duration: 1000}), transform: 'translateY(-10px) scale(1.1)', 
                [`& .${fabClasses.root}`]:{ bgcolor:'secondary.main', transition: theme.transitions.create(['background-color'], {duration: 1000})},
                [`& .${badgeClasses.badge}`]:{bgcolor:'primary.main', transition: theme.transitions.create(['background-color'], {duration: 1000})}
            }}}>
                <Fab onClick={()=> {handleOpen(); reset(); hidden && toggleHidden()}} aria-label="open-chatbot" variant='circular'
                    sx={{backgroundColor:'primary.main', color:'primary.contrastText', border:'1px solid', borderColor:'primary.contrastText', transform: 'unset',
                        opacity: 0.8, width: {xs: 70, sm: 80, md: 90}, height: {xs: 70, sm: 80, md: 90}}}>
                    <Email color='inherit' sx={{mx:0, my:0, width: {xs: 40, sm: 50, md: 60}, height: {xs: 40, sm: 50, md: 60}}}/>
                </Fab>
            </Badge>
        </Box>
    </Fade>)
}
export default ChatBotButton