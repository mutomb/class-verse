import React, { FC } from 'react'
import { Box, Avatar, IconButton, avatarClasses, svgIconClasses, Toolbar, AppBar, Container, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import { SearchOutlined, AttachFile, ReadMore, Delete, Edit, ClearAll, CircleTwoTone, Circle} from '@mui/icons-material'
import image from '../../../public/images/avatars/5.jpg'
import { useAuth } from '../../auth'
import { MoreMenuVertButton } from '../../styled-buttons'

interface HeaderProps{
    handleBackToList?: (deleted?: boolean)=>void,
    chatRoom?: any,
    removeChatRoom?: () => void,
    scope?: string,
    user?: string,
}

const Header: FC<HeaderProps> = ({chatRoom, handleBackToList, removeChatRoom, scope, user}) => {
    const {isAuthenticated} = useAuth()
    const theme = useTheme()
    const mobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
    const isOnline = (chatRoom && chatRoom.activeAnonymous>1)? true: false
    /** if user is admin then toggle between AI and actual admin photo depending on online state. If user is non-admin then simply use registered or anonymous user's photo*/
    const userPhotoUrl = (user && user.role === 'admin')? 
                        (isOnline? 
                        ('/api/users/photo/'+user?._id+"?" + new Date().getTime()):image): 
                        ((user && user.role)?
                        ('/api/users/photo/'+user?._id+"?" + new Date().getTime()):
                        ('/api/anonymous/photo/'+user?._id+"?" + new Date().getTime()))
                        
    const getHeading = ()=>{
        return (<Box component='small' sx={{pt: 0, pb: {xs: 0, sm: 1}, color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, width: '100%', textAlign: 'center'}}>
                    {(isAuthenticated().user && isAuthenticated().user.role ==='admin')? '' : "Hi! please send us a message, we'll respond soon."}
                </Box>)
    }
    const getScope = ()=>{
        return (<>
            {scope && 
            (<Box sx={{py: 0, color: 'text.primary', fontWeight: 700, fontSize: {xs: '0.6rem', md: '0.8rem'}, width: '100%', textAlign: 'center'}}>
                {scope}
            </Box>)}
            </>)
    }
    return (
    <AppBar elevation={0} position="absolute" color='inherit' enableColorOnDark={true} sx={{boxShadow: 2, zIndex: '1099'}}>
        <Toolbar sx={{ backgroundColor: 'inherit', px: {xs: 0, sm: 'unset'}, minHeight: 'unset !important'}}>
            <Box sx={{ backgroundColor: 'inherit', width: '100%', mx:0}}>
                <Container sx={{ py: 0, px: {xs: 0, sm: 'unset'}}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', position: 'absolute', top: 0, width: '100%'}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', width: '100%', px: {xs: 0, sm: 2}, py: 0, 
                        [` & .${avatarClasses.root}`]:{ color: 'primary.main', width: {xs: 30, sm: 40}, height: {xs: 30, sm: 40}}
                        }}>
                            <Box component='span' sx={{position: 'relative'}}>
                                <Avatar src={userPhotoUrl} 
                                sx={{ height: {xs: 40, md: 50}, width: {xs: 40, md: 50}, borderRadius: '50%' }} />
                                <CircleTwoTone sx={{zIndex: 1101, position: 'absolute', top: -1, right: -5, width: '1rem', height: '1rem', color:isOnline? 'green': 'error.light'}}/>
                            </Box>
                            {!mobileView && getScope()}
                            <Box className="HeaderRight" 
                            sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', [`& .${svgIconClasses.root}`]:{ color: 'primary.main', width: 20, height: 20}}}>
                                <IconButton>
                                    <AttachFile />
                                </IconButton>
                                {isAuthenticated().user && isAuthenticated().user.role === 'admin' &&
                                (<MoreMenuVertButton style={{mr: 0}}>
                                    <MenuItem onClick={handleBackToList? ()=> handleBackToList(): undefined} sx={{color: "primary.main", transition:(theme)=> theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                        <ReadMore sx={{mr: 1, verticalAlign: 'text-top'}}/> List Conversations  
                                    </MenuItem>
                                    {isAuthenticated().user && isAuthenticated().user.role === 'admin' && scope &&
                                    (<>
                                    <MenuItem sx={{color: "primary.dark", transition: (theme)=> theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                        <Edit sx={{mr: 1, verticalAlign: 'text-top'}}/> Edit Chat  
                                    </MenuItem>
                                    <MenuItem>
                                        <ClearAll sx={{mr: 1, verticalAlign: 'text-top'}}/> Clear Messages  
                                    </MenuItem>
                                    {removeChatRoom &&
                                    (<MenuItem onClick={removeChatRoom} sx={{color: "red", transition:(theme)=>  theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                        <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/> Delete Conversation 
                                    </MenuItem>)}
                                    </>)}
                                </MoreMenuVertButton>)}
                            </Box>
                        </Box>
                        {mobileView && getScope()}
                        {getHeading()}
                    </Box>
                </Container>
            </Box>
        </Toolbar>
    </AppBar>
    )
}   
export default Header