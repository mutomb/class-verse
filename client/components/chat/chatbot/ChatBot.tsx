import React, { useEffect, useState } from 'react'
import {Grid, Tabs, Tab, Box, IconButton, Zoom} from '@mui/material'
import {ChatBotButton, ChatBox, Conversations, Users} from '.'
import { useAuth } from '../../auth';
import {listAdmins, createAnonymous, updateAnonymous, } from '../../users/api-user'
import { ExpandLess, ExpandMore, Error } from '@mui/icons-material';
import { StyledBanner, StyledSnackbar } from '../../styled-banners';
import { HashLoader } from '../../progress';

const ChatBot = () => {
    const [scope, setScope] = useState<string>('Support Agent');
    const [tab, setTab] = useState<false | number>(0);
    const [user, setUser] = useState(null);
    const [sender, setSender] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const {isAuthenticated} = useAuth();
    const [conversationId, setConversationId] = useState(null);
    const handleChange = (e, newVal) => {
        if(isAuthenticated().user && isAuthenticated().user.role ==='admin'){
            setTab(newVal);
            setUser(null)
        }
    };
    const handleAddEmail = (email: string) => {
        if(sender && email){
            let anonymousData = new FormData()
            anonymousData.append('email', email)
            updateAnonymous({
                anonymousId: sender && sender._id,
            }, anonymousData).then((data)=>{
                if(data && data.error){
                    setError(data.error)
                }else{
                    setSender(data)
                }                
            })
        }else{
            setError('Email could not be added. Please try again or re-open Chatbot')
        }
      }
    const handleError = () => {
        setError('')
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        if(open && !user){
            const abortController = new AbortController()
            const signal = abortController.signal
            setLoading(true)
            if(!isAuthenticated().user || (isAuthenticated().user && isAuthenticated().user.role !=='admin')){
                listAdmins(signal,{
                    token: isAuthenticated().token
                }).then((data) => {
                    if (data && data.error) {
                        setError(data.error)
                    } else {
                        let admin = data[Math.floor(Math.random()*data.length)];
                        let fullname = admin.name && admin.surname && (admin.name +" "+ admin.surname)
                        let scope = fullname && fullname.substring(0, fullname.length>15? 15: fullname.length)
                        scope+= fullname.substring(15).length>0? '...': ''
                        if(!isAuthenticated().user){
                            createAnonymous(new FormData()).then((data)=>{
                                if(data && data.error){
                                    setError(data.error)
                                    setLoading(false)
                                }else{
                                    setSender(data)
                                    setUser(admin)
                                    setScope(scope)
                                    setLoading(false)
                                }
                            })
                        }else{
                            setUser(admin)
                            setScope(scope)
                            setLoading(false)
                        }
                    }
                })
            }
        }
      }, [open])

    return (<>
    {!open?
    (<ChatBotButton handleOpen={handleOpen} />):
    (<Zoom timeout={500} id="zoom-chat-bot" appear={true} in={true} unmountOnExit={true} style={{borderRadius: 16}}>
        <Box sx={{width: {xs: '100%', sm: '90%', md: 400}, position: 'fixed', bottom: 5, left: {xs: 0, sm: 5, md: 10}, zIndex: 1100, boxShadow: 4}}>
            <Box sx={{width: '100%',  display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.paper', borderTopLeftRadius: 4, borderTopRightRadius: 4, borderTopWidth: 4, borderTopColor: 'primary.main', borderTopStyle: 'solid'}}>
                <IconButton  onClick={handleClose}
                size='small'
                sx={{backgroundColor: 'primary.main', color: 'primary.contrastText', '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText', transform: 'translateY(3px) scale(1.1)' }, zIndex: 1100, boxShadow: 1, transform: 'unset', 
                    transition: (theme)=> theme.transitions.create(['transform'], {duration: 500})}}>
                {open? <ExpandMore sx={{color:'primary.contrastText'}} />: <ExpandLess sx={{color:'primary.contrastText'}} />}
                </IconButton>
            </Box>
            <Grid container id='chat-bot' sx={{flex: 1}}>
                {!user?
                (isAuthenticated().user && isAuthenticated().user.role === 'admin')? 
                (<Grid item xs={12} sx={{zIndex: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Box sx={{height: '100%', bgcolor: 'background.default'}}>
                        <Tabs sx={{boxShadow: 2, bgcolor: 'background.paper'}} onChange={handleChange} variant="fullWidth" value={tab} indicatorColor="primary" textColor="primary">
                            <Tab label="Chats" sx={{'&:hover': {transform: {xs:'translateY(-2px)', md: 'translateY(-2px) scale(1.02)'}}, transition: (theme)=>theme.transitions.create(['transform'], {duration: 500})}}/>
                            <Tab label="Users" sx={{'&:hover': {transform: {xs:'translateY(-2px)', md: 'translateY(-2px) scale(1.02)'}}, transition: (theme)=>theme.transitions.create(['transform'], {duration: 500})}} />
                        </Tabs>
                        {tab === 0 && (
                            <Conversations
                                setUser={setUser}
                                setScope={setScope}
                                setConversationId={setConversationId}
                            />
                        )}
                        {tab === 1 && (
                            <Users setUser={setUser} setScope={setScope}/>
                        )}
                    </Box>
                </Grid>):
                (<Grid item xs={12}>
                    <Box sx={{bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: {xs: '80vh', md:'70vh'}, maxHeight: {xs: '80vh', md:'70vh'}}}>
                        {loading?
                        (<HashLoader style={{marginTop: '10px'}} size={10}/>):
                        (<StyledBanner variant='error' heading={'Failed To Load Chatbot'} body={'Please re-open Chatbot or try again later.'}/>)}
                    </Box>
                </Grid>):
                (<Grid item xs={12}>
                    <ChatBox addAnonymousEmail={(sender && !sender.email)? handleAddEmail: undefined} conversationId={conversationId} sender={sender} scope={scope} user={user} handleBackToList={()=>handleChange(undefined, 0)}/>
                </Grid>)}
                <StyledSnackbar
                open={error? true: false}
                duration={3000}
                handleClose={()=>setError('')}
                icon={<Error/>}
                heading={"Error"}
                body={error}
                variant='error'
                />
            </Grid>
        </Box>
    </Zoom>)}
    <StyledSnackbar
        open={error? true: false}
        duration={3000}
        handleClose={handleError}
        icon={<Error />}
        heading={"Error"}
        body={error}
        variant='error'
    />
    </>);
};

export default ChatBot;
