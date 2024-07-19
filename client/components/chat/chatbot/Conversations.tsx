import React, { useState, useEffect, FC } from "react";
import {Avatar, Zoom, Box, Typography} from "@mui/material";
import { Error } from "@mui/icons-material";
import {socket} from '../communication'
import { getConversations } from "./api-chatbot";
import { useAuth } from "../../auth";
import { StyledSnackbar } from "../../styled-banners";
import { ConversationsSkeleton } from "../../skeletons";

interface ConversationsProps{ 
  setScope: (scope: string) => void ,
  setUser: (user: any) => void
  setConversationId: (user: any) => void,
}
const Conversations:FC<ConversationsProps> = ({setScope, setUser, setConversationId}) => {
  const [conversations, setConversations] = useState([]);
  const [newConversation, setNewConversation] = useState(null);
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
    let user = handleRecipient(conversation.recipientObj) || handleRecipient(conversation.recipientAnonymousObj)
    let name = user.name
    let email = user.email
    setUser(user);
    setScope(name? name: email? email: user._id);
    setConversationId(conversation._id);
  };
  useEffect(() => {
      setLoading(true)
      getConversations({
        token: isAuthenticated().token
      }).then((data) => { 
        if(data && data.error){
          setError(data.error)
          setLoading(false)
        }else{
          setConversations(data)
          setLoading(false)
        }
      });
  }, [newConversation]);

  useEffect(() => {
    socket.on(`messages-${isAuthenticated().user && isAuthenticated().user._id}`, (data) => {
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
      socket.removeListener(`messages-${(isAuthenticated().user && isAuthenticated().user._id)}`);
    };
  }, []);
  if(loading){
    return <ConversationsSkeleton sx={{minHeight: {xs: '80vh', md:'70vh'}, maxHeight: {xs: '80vh', md:'70vh'}}} />
  }
  return (
    <Zoom timeout={1000} id="zoom-conversations" appear={true} in={true} unmountOnExit={true}>
      <Box sx={{ width:'100%', height: '100%'}}>
        {/* <Header variant='conversations' handleClose={()=>{}} /> */}
        <Box id='conversations-list' sx={{pt:'10vh', minHeight: {xs: '80vh', md:'70vh'}, maxHeight: {xs: '80vh', md:'70vh'}, px: {xs: 0, sm: 1}, py: 4, width: '100%', overflowY: 'scroll', 
            scrollbarWidth: {xs: 'none',  sm:'thin'}, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', bgcolor: 'background.default'}}>
          {conversations && conversations.map((conversation, index) => {
          
          const user = handleRecipient(conversation.recipientObj) || handleRecipient(conversation.recipientAnonymousObj)
          const userPhotoUrl = (user && user.role)? `/api/users/photo/${user._id}?${new Date().getTime()}`:`/api/anonymous/photo/${user._id}?${new Date().getTime()}`
          return(<Zoom key={index} timeout={1000} id="zoom-conversation" appear={true} in={true} unmountOnExit={true}>
          <Box sx={{width: '100%', mb: 1}}>
            <Box component='div'
              onClick={() => handleClick(conversation)} 
              sx={{cursor: 'pointer', borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', px: {xs: 0, sm: 2}, bgcolor: 'background.paper', boxShadow: 2, '&:hover':{boxShadow: 4}}}>
              <Avatar src={userPhotoUrl} sx={{bgcolor: 'background.paper', display: {xs: 'none', sm: 'unset'}, borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}, mr: {xs: 1, md: 2}}} alt={user.name && user.name[0]} />
              <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                  <Typography variant='subtitle1' sx={{color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, fontWeight: 700}}>
                    {user?.name ? user.name: user?.email ? user.email: user._id}
                  </Typography>
                  <Typography variant='subtitle1' sx={{ml: 1, color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, fontWeight: 700}}>
                    {user?.surname ? user?.surname: ''}
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
