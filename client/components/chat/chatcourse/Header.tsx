import React, { FC } from 'react'
import { Box, Avatar, IconButton, avatarClasses, svgIconClasses, Toolbar, AppBar, Container, MenuItem, useMediaQuery } from '@mui/material'
import { Close, SearchOutlined, AttachFile, ReadMore, Delete, Edit, ClearAll} from '@mui/icons-material'
import { useAuth } from '../../auth'
import { MoreMenuVertButton } from '../../styled-buttons'
import { useTheme } from '@mui/material/styles'

interface HeaderProps{
    handleClose?: () => void,
    handleBackToList?: (deleted?: boolean)=>void,
    chatRoom?: any,
    removeChatRoom?: () => void,
    scope?: string,
    courseId?: string,
    user?: string,
}

const Header: FC<HeaderProps> = ({handleClose, chatRoom, handleBackToList, removeChatRoom, scope, courseId, user}) => {
    const {isAuthenticated} =useAuth()
    const theme = useTheme()
    const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
    const getHeading = ()=>{
        return (<>
            {scope && 
            (<Box sx={{py: 0, color: 'text.primary', fontWeight: 700, fontSize: {xs: '0.6rem', md: '0.8rem'} }}>
                {scope==='Global Chat'? 'Course Chat Room': scope}
            </Box>)}
            {scope && scope!=='Global Chat'?
            (<Box component='small' sx={{py: 2, color: 'text.primary', fontWeight: 700, fontSize: {xs: '0.6rem', md: '0.8rem'} }}>
                {(isAuthenticated().user && isAuthenticated().user.specialist && isAuthenticated().user.role === 'admin')? 'User': ''}
                {(isAuthenticated().user && isAuthenticated().user.specialist && isAuthenticated().user.role !== 'admin')? 'Client': ''}
                {(isAuthenticated().user && !isAuthenticated().user.specialist)? 'Specialist': ''}
                {chatRoom && chatRoom.activeAnonymous>1? ' online': ' offline'}
            </Box>)
            :(<Box component='small' sx={{pb: 2, color: 'text.primary', fontWeight: 700, fontSize: {xs: '0.6rem', md: '0.8rem'} }}>
                {(isAuthenticated().user && isAuthenticated().user.specialist)? '' : "Hi! please send us a message, we'll respond soon."}
            </Box>)}
            </>)
    }
    return (
    <AppBar elevation={0} position="absolute" color='inherit' enableColorOnDark={true} sx={{boxShadow: 2, zIndex: '1099'}}>
        <Toolbar sx={{ backgroundColor: 'inherit', px: {xs: 0, sm: 'unset'}, minHeight: 'unset !important'}}>
            <Box sx={{ backgroundColor: 'inherit', width: '100%', mx:0}}>
                <Container sx={{ py: 0, px: {xs: 0, sm: 'unset'}}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderTopRightRadius: 16, borderTopLeftRadius: 16, position: 'absolute', top: 0, width: '100%'}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', width: '100%', px: {xs: 0, sm: 2}, py: 0, 
                        [` & .${avatarClasses.root}`]:{ color: 'primary.main', width: {xs: 30, sm: 40}, height: {xs: 30, sm: 40}}
                        }}>
                            <Avatar src={scope === 'Global Chat'? '/api/courses/photo/'+courseId+"?" + new Date().getTime(): '/api/users/photo/'+user?._id+"?" + new Date().getTime() } 
                            sx={{ height: {xs: 40, md: 50}, width: {xs: 40, md: 50}, borderRadius: '50%' }}/>
                            {!xsMobileView && 
                            (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                {getHeading()}
                            </Box>)}
                            <Box className="HeaderRight" 
                            sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width:{xs: '100%', sm:'unset'},
                                [`& .${svgIconClasses.root}`]:{ color: 'primary.main', width: {xs: 20, sm: 30}, height: {xs: 20, sm: 30}},
                            }}>
                                <IconButton>
                                    <SearchOutlined />
                                </IconButton>
                                <IconButton>
                                    <AttachFile />
                                </IconButton>
                                <MoreMenuVertButton>
                                    <MenuItem onClick={handleBackToList? ()=> handleBackToList(): undefined} sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                        <ReadMore sx={{mr: 1, verticalAlign: 'text-top'}}/> List Conversations  
                                    </MenuItem>
                                    {isAuthenticated().user && isAuthenticated().user.role === 'admin' && scope && scope ==='Global Chat' &&
                                    (<>
                                    <MenuItem sx={{color: "primary.dark", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                        <Edit sx={{mr: 1, verticalAlign: 'text-top'}}/> Edit Chat  
                                    </MenuItem>
                                    <MenuItem>
                                        <ClearAll sx={{mr: 1, verticalAlign: 'text-top'}}/> Clear Messages  
                                    </MenuItem>
                                    {removeChatRoom &&
                                    (<MenuItem onClick={removeChatRoom} sx={{color: "red", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                        <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/> Delete Conversation 
                                    </MenuItem>)}
                                    </>)}
                                </MoreMenuVertButton>
                                {handleClose &&
                                (<IconButton  onClick={handleClose}>
                                    <Close sx={{color: 'primary.main'}} />
                                </IconButton>)}
                            </Box>
                        </Box>
                        {xsMobileView && getHeading()}
                    </Box>
                </Container>
            </Box>
        </Toolbar>
    </AppBar>
    )
}   
export default Header