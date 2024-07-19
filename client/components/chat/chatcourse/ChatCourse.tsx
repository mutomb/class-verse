import React, { useEffect, useState } from 'react'
import {Grid, Tabs, Tab, Box, useMediaQuery} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {ChatBox, Conversations, Users} from '.'
import { scroller } from 'react-scroll';

const ChatCourse = ({match}) => {
    const [scope, setScope] = useState('Global Chat');
    const [tab, setTab] = useState<false | number>(0);
    const [user, setUser] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const theme = useTheme()
    const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
    const handleChange = (e, newVal) => {
        setTab(newVal);
        xsMobileView && setUser(null)
    };
    useEffect(() => {
        scroller.scrollTo('chat-course', {
          duration: 1500,
          delay: 100,
          smooth: true,
          offset: -50
        })
        
      }, [])
    return (
        <Grid container id='chat-course' sx={{flex: 1}}>
            {((xsMobileView && !user) || !xsMobileView) &&
            (<Grid item xs={12} sm={5} md={4} sx={{zIndex: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box sx={{height: '100%'}}>
                    <Tabs sx={{boxShadow: 2}} onChange={handleChange} variant="fullWidth" value={tab} indicatorColor="primary" textColor="primary">
                        <Tab label="Chats" sx={{'&:hover': {transform: {xs:'translateY(-2px)', md: 'translateY(-2px) scale(1.02)'}}, transition: (theme)=>theme.transitions.create(['transform'], {duration: 500})}}/>
                        <Tab label="Users" sx={{'&:hover': {transform: {xs:'translateY(-2px)', md: 'translateY(-2px) scale(1.02)'}}, transition: (theme)=>theme.transitions.create(['transform'], {duration: 500})}} />
                    </Tabs>
                    {tab === 0 && (
                        <Conversations
                            setUser={setUser}
                            setScope={setScope}
                            setConversationId={setConversationId}
                            courseId={match.params && match.params.courseId}
                        />
                    )}
                    {tab === 1 && (
                        <Users setUser={setUser} setScope={setScope} courseId={match.params && match.params.courseId}/>
                    )}
                </Box>
            </Grid>)}
            {((xsMobileView && user) || !xsMobileView) &&
            (<Grid item xs={12} sm={7} md={8}>
                <ChatBox courseId={match.params && match.params.courseId} conversationId={conversationId} scope={scope} user={user} handleBackToList={()=>handleChange(undefined, 0)}/>
            </Grid>)}
        </Grid>
    );
};

export default ChatCourse;
