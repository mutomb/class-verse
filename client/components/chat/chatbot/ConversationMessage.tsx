import React, { FC } from 'react'
import { Avatar, Box, Divider, Grow, Typography } from '@mui/material'
import {useTheme } from '@mui/material/styles'
import { VerifiedOutlined } from '@mui/icons-material'
import image from '../../../public/images/avatars/5.jpg'

interface ChatsProps{
    variant: 'sent' | 'received',
    message: any,
    timeout?: number
}

const Chat: FC<ChatsProps> = ({variant, message, timeout=1000}) => {
    const user = message.fromObj[0] || message.fromAnonymousObj[0]
    const userPhotoUrl =(user && user.role==='AI bot')? image: (user && user.role)? `/api/users/photo/${user._id}?${new Date().getTime()}`: `/api/anonymous/photo/${user?._id}?${new Date().getTime()}`
    const date = new Date(message.created)
    const theme = useTheme()
    return (<>
        <Grow easing= 'cubic-bezier(0, 0, 1, 3)' timeout={timeout} id="zoom-conversation" appear={true} in={true} unmountOnExit={true}>
            <Box sx={{px: {xs: 0, sm: 2}, width: '100%', display: 'flex', justifyContent: variant ==='sent'? 'flex-start': 'flex-end', alignItems: 'center'}}>
                <Avatar src={userPhotoUrl} sx={{color: 'primary.main', bgcolor: 'unset', display: {xs: 'none', sm: 'unset'}, width: 40, height: 40, mr: {xs: 1, md: 2}}}/>
                <Box sx={{minWidth:'50%', flexdisplay: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Typography variant='subtitle1' sx={{color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.7rem'}, fontWeight: 600, display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                        {user? (user.name? user.name: user.email? user.email: user._id): 'AI'} <VerifiedOutlined sx={{width: '1rem', height: '1rem', color: (user && user.specialist)? 'primary.main':'secondary.main'}}/>
                    </Typography>
                    <Box sx={{boxShadow: 2, bgcolor: variant ==='sent'?( theme.palette.mode==='dark'? 'primary.dark': 'primary.light'): (theme.palette.mode==='dark'? 'secondary.dark': 'secondary.light'), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', px: 1, pt: 0.5, borderRadius: 3}}>
                        <Typography variant='body2' sx={{color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem'}}}>
                            {message.body? message.body: ''}
                        </Typography>
                        <Typography variant='subtitle1' className='chat__message_timestamp' sx={{pt: 0.5, alignSelf: 'flex-end', color: 'text.secondary', fontSize: {xs: '0.5rem', md: '0.6rem'}}}>
                            {date? `${date.toLocaleTimeString()} | ${date.toLocaleDateString()}`: ''}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Grow>
        <Divider sx={{opacity: 0, my: 1}} />
        </>)
}   
export default Chat