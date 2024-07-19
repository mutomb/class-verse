import React, { useState, useEffect, FC } from "react";
import {Avatar, Divider, Zoom, Box, Typography} from "@mui/material";
import { Error, Language } from "@mui/icons-material";
import {socket} from '../communication'
import { getConversations, getLastGlobalMessage } from "./api-chat";
import { useAuth } from "../../auth";
import { StyledSnackbar } from "../../styled-banners";
import { ConversationsSkeleton } from "../../skeletons";

interface ConversationsProps{ 
  setScope: (scope: string) => void ,
  setUser: (user: any) => void
  setConversationId: (user: any) => void,
  courseId: string 
}
const Conversations:FC<ConversationsProps> = ({setScope, setUser, setConversationId, courseId}) => {
  const [conversations, setConversations] = useState([]);
  const [newConversation, setNewConversation] = useState(null);
  const [lastGlobalMessage, setLastGlobalMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {isAuthenticated} = useAuth()
  
 /** Returns the recipient that is not the current user. */
  const handleRecipient = (recipients) => {
    for (let i = 0; i < recipients.length; i++) {
      if (recipients[i]._id && isAuthenticated().user && recipients[i]._id!==isAuthenticated().user._id) {
        return recipients[i];
      }
    }
    return null;
  };

  const handleClick = (conversation) => {
    let user = handleRecipient(conversation.recipientObj)
    let fullname = user.name && user.surname && (user.name +" "+ user.surname)
    let scope = fullname && fullname.substring(0, fullname.length>15? 15: fullname.length)
    scope+= fullname.substring(15).length>0? '...': ''
    setUser(user);
    setScope(scope);
    setConversationId(conversation._id);
  };
  useEffect(() => {
    if(!newConversation || !newConversation.global){
      setLoading(true)
      getConversations({
        token: isAuthenticated().token
      },{
        courseId: courseId
      }).then((data) => { 
        if(data && data.error){
          setError(data.error)
          setLoading(false)
        }else{
          setConversations(data)
          setLoading(false)
        }
      });
    }
    if(!newConversation || newConversation.global){
      setLoading(true)
      getLastGlobalMessage({
        courseId: courseId
      }).then((data) => { 
        console.log('data', data)
        if(data && data.error){
           setError(data.error)
           setLoading(false)
        }else{
          setLastGlobalMessage(data)
          setLoading(false)
        }
      });
    }
  }, [newConversation]);

  useEffect(() => {
    socket.on(`messages-${courseId}`, (data) => {
      setLoading(true)
      if(data && data.error){
         setError(data.error)
         setLoading(false)
      }else{
        setNewConversation(data);
        setLoading(false)
      }
    })
    return () => {
      socket.removeListener(`messages-${courseId}`);
    };
  }, []);
  if(loading){
    return <ConversationsSkeleton />
  }
  return (
    <Zoom timeout={1000} id="zoom-conversations" appear={true} in={true} unmountOnExit={true}>
      <Box sx={{ width:'100%', height: '100%'}}>
        {/* <Header variant='conversations' handleClose={()=>{}} /> */}
        <Box id='conversations-list' sx={{pt:'10vh', height: 'calc(100% - 48px)', px: {xs: 0, sm: 2}, py: 4, width: '100%', overflowY: 'scroll', 
            scrollbarWidth: {xs: 'none',  sm:'thin'}, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', bgcolor: 'background.default'}}>
          <Zoom timeout={1000} id="zoom-conversation" appear={true} in={true} unmountOnExit={true}>
            <Box sx={{width: '100%'}}>
              <Box component='div' onClick={() => { setScope("Global Chat"); setUser(true)}} sx={{borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer',
                  px: {xs: 0, sm: 2}, bgcolor: 'background.paper', boxShadow: 2, '&:hover':{boxShadow: 4}}}>
              <Avatar src={'/api/courses/photo/'+courseId+"?" + new Date().getTime()} sx={{ height: {xs: 40, md: 50}, width: {xs: 40, md: 50}, borderRadius: '50%' }}/>
              <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <Typography variant='subtitle1' sx={{color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, fontWeight: 700,  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    Course Chat Room <Language sx={{ml: 1, color: 'primary.main', width: '1rem', height: '1rem'}} />
                  </Typography>
                  {lastGlobalMessage &&
                  (<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', px: 1, pt: 1}}>
                    <Typography variant='body2' sx={{color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem', alignItems: 'center'}}}>
                    {lastGlobalMessage.body && lastGlobalMessage.body.substring(0, lastGlobalMessage.body.length>10? 10: lastGlobalMessage.body.length)+'...'}
                    </Typography>
                    <Typography variant='subtitle1' className='chat__message_timestamp' sx={{pt: 2, alignSelf: 'flex-end', color: 'text.secondary', fontSize: {xs: '0.5rem', md: '0.6rem'}}}>
                      {lastGlobalMessage.updated? 
                      `${new Date(lastGlobalMessage.updated).toLocaleTimeString()} | ${ new Date(lastGlobalMessage.updated).toLocaleDateString()}`: 
                      `${new Date(lastGlobalMessage.created).toLocaleTimeString()} | ${new Date(lastGlobalMessage.created).toLocaleDateString()}`}
                    </Typography>
                  </Box>)}
              </Box>
              </Box>
            </Box>
          </Zoom>
          <Divider sx={{my: 0.5}}/> 
          {conversations && conversations.map((conversation, index) => {
          const userPhotoUrl = handleRecipient(conversation.recipientObj)? `/api/users/photo/${handleRecipient(conversation.recipientObj)._id}?${new Date().getTime()}`:'/api/users/defaultphoto'
          return(<Zoom key={index} timeout={1000} id="zoom-conversation" appear={true} in={true} unmountOnExit={true}>
          <Box sx={{width: '100%'}}>
            <Box component='div'
              onClick={() => handleClick(conversation)} 
              sx={{cursor: 'pointer', borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', px: {xs: 0, sm: 2}, bgcolor: 'background.paper', boxShadow: 2, '&:hover':{boxShadow: 4}}}>
              <Avatar src={userPhotoUrl} sx={{bgcolor: 'background.paper', display: {xs: 'none', sm: 'unset'}, borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}, mr: {xs: 1, md: 2}}} alt={handleRecipient(conversation.recipientObj).name && handleRecipient(conversation.recipientObj).name[0]} />
              <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                  <Typography variant='subtitle1' sx={{color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, fontWeight: 700}}>
                    {handleRecipient(conversation.recipientObj)?.name}
                  </Typography>
                  <Typography variant='subtitle1' sx={{ml: 1, color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, fontWeight: 700}}>
                    {handleRecipient(conversation.recipientObj)?.surname}
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', px: 1, pt: 1}}>
                  <Typography variant='body2' sx={{color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem', alignItems: 'center'}}}>
                  {conversation.lastMessage? conversation.lastMessage.substring(0, conversation.lastMessage.length>10? 10: conversation.lastMessage.length)+'...': ''}
                  </Typography>
                  <Typography variant='subtitle1' className='chat__message_timestamp' sx={{pt: 2, alignSelf: 'flex-end', color: 'text.secondary', fontSize: {xs: '0.5rem', md: '0.6rem'}}}>
                      {conversation.updated? 
                      `${new Date(conversation.updated).toLocaleTimeString()} | ${ new Date(conversation.updated).toLocaleDateString()}`: 
                      `${new Date(conversation.created).toLocaleTimeString()} | ${new Date(conversation.created).toLocaleDateString()}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          </Zoom>)
          })}
          <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
        </Box>
      </Box>
    </Zoom>
  );
};

export default Conversations;
