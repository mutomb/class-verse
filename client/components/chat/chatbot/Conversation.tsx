import React, { FC, useEffect, useState } from 'react'
import { Box} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ConversationMessage, ConversationFooter, AddEmail} from '.'
import { useAuth } from '../../auth'
import logo from '../../../public/logo.svg'
import { socket } from '../communication'
import { getConversationMessages, getConversationMessagesAnonymous, sendConversationMessage, } from './api-chatbot'
import { StyledSnackbar } from '../../styled-banners'
import { Error } from '@mui/icons-material'
import { useChatScroll } from '..'
import { ConversationSkeleton } from '../../skeletons'
import { HashLoader } from '../../progress'
import { WallPaperYGW } from '../../wallpapers/wallpapers'

interface ConversationProps{
  messages?: Array<any>,
  addAnonymousEmail?: (email: string) => void,
  scope?: string,
  conversationId?: string | null,
  user?: any,
  sender?: any,
}
const timeStamp = new Date().toString()
const Conversation: FC<ConversationProps> = ({scope, conversationId, user, addAnonymousEmail, sender}) => {
    const {isAuthenticated}= useAuth()
    const [openEmail, setOpenEmail] = useState(true)
    const [newConversationMessage, setNewConversationMessage] = useState("");
    const [messages, setConversationMessages] = useState([]);
    const [lastConversationMessage, setLastConversationMessage] = useState(null);
    const [error, setError] = useState('');
    const ref = useChatScroll(messages)
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const theme = useTheme()
    const handleClose = () => {
      setOpenEmail(false)
    }
    useEffect(() => {
        reloadConversationMessages();
    }, [lastConversationMessage, conversationId, user && user._id]);
    
    useEffect(() => {
      if(!isAuthenticated().user && sender){
        socket.on(`messages-${sender._id}`, (data) => {
          if (data && data.error) {
             setError(data.error)
          } else {
            setLastConversationMessage(data)
          }
        });
        return function cleanUp(){
          socket.off(`messages-${sender._id}`)
        }
      }
      if(isAuthenticated().user){
        socket.on(`messages-${isAuthenticated().user._id}`, (data) => {
          if (data && data.error) {
              setError(data.error)
          } else {
            setLastConversationMessage(data)
          }
          return function cleanUp(){
            socket.off(`messages-${isAuthenticated().user._id}`)
          }
        });
      }
    }, []);
    const reloadConversationMessages = () => {
      (!submitting && messages.length===0) && setLoading(true)
      if(!isAuthenticated().user){
        if (scope !== null && user && sender) {
          getConversationMessagesAnonymous({
            token: isAuthenticated().token
          }, {
            userId: user._id,
            anonymousId: sender._id
          }).then((data) =>{
              if(data && data.error){
                 setError(data.error);
                 setLoading(false)
              }else{
                setConversationMessages(data);
                setLoading(false)
              }
          });
        }else{
          setConversationMessages([]);
          setLoading(false)
        }
      } else {
        if (scope !== null && user) {
          if(user.role){
            getConversationMessages({
              token: isAuthenticated().token
            }, {
              userId: user._id,
            }).then((data) =>{
                if(data && data.error){
                   setError(data.error);
                  setLoading(false)
                }else{
                  setConversationMessages(data);
                  setLoading(false)
                }
            });
          } else{
            getConversationMessagesAnonymous({
              token: isAuthenticated().token
            }, {
              userId: isAuthenticated().user._id,
              anonymousId: user._id
            }).then((data) =>{
                if(data && data.error){
                   setError(data.error);
                   setLoading(false)
                }else{
                  setConversationMessages(data);
                  setLoading(false)
                }
            });
          }
        }else{
          setConversationMessages([]);
          setLoading(false)
        }
      }
    };
    const handleSubmit = () => {
      const messageData = new FormData()
      if (!newConversationMessage){return setError('Please enter message/attach photo')};
      if (!user && !user._id){return setError('Please select a user')};
      if ((!isAuthenticated().user && !sender) && (isAuthenticated().user && !user)){setSubmitting(false); return setError('Sender-Receiver connection error. Please re-open Chatbot.')};
      setSubmitting(true)
      newConversationMessage && messageData.append('body', newConversationMessage)
      if(isAuthenticated().user){
        newConversationMessage && user && messageData.append('to', user._id)
        newConversationMessage && user && messageData.append('from', isAuthenticated().user._id)
      }else{
        newConversationMessage && user && messageData.append('to', user._id)
        newConversationMessage && user && messageData.append('from', sender._id)
      }
      sendConversationMessage(messageData).then((data) => {
        if(data && data.error){
            setError(data.error)
            setSubmitting(false)
        }else{
          setNewConversationMessage("");
          setSubmitting(false)
        }
      });
    };
    const enterKey = (event) => {
      if(event.keyCode === 13){
        event.preventDefault()
        handleSubmit()
      }
    }
    const handleChange = (name) => event => {
      let value = name === 'body'? event.target.value: event.target.files[0]
      name === 'body' && setNewConversationMessage(value)
    }
    const isReceived = (message) =>{
        return message.from !== isAuthenticated().user?._id
    } 
    if(loading){
      return <ConversationSkeleton sx={{minHeight: {xs: '80vh', md:'70vh'}, maxHeight: {xs: '80vh', md:'70vh'}}} />
    } 
    return (
      <WallPaperYGW variant='linear' primaryColor={theme.palette.background.default} secondaryColor={theme.palette.background.paper}
        style={{
          minHeight: {xs: '80vh', md:'70vh'}, maxHeight: {xs: '80vh', md:'70vh'},
          '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          opacity: 0.2,
          overflow: 'hidden'
        },
        '& > div':{
          position: 'relative',
        },
      }} 
      overlayStyle={{bgcolor: theme.palette.mode==='dark'? 'rgba(33, 33, 33, 0.7)': 'rgba(242, 245, 245, 0.7)'}}>
        <Box ref={ref} id="Conversation"  sx={{ pb:'10vh', pt:'20vh', px: 0, width: '100%', height: '100%', minHeight: {xs: '80vh', md:'70vh'}, maxHeight: {xs: '80vh', md:'70vh'}, overflowY: 'scroll',  scrollbarWidth: {xs: 'none',  sm:'thin'} }}>
        {!isAuthenticated().user &&
        <> 
        <ConversationMessage timeout={2000} variant={'received'} message={{created: timeStamp, body: "Hi there! We are excited to assist you.", fromObj: [{name: 'Support Agent', role: 'AI bot'}] }}/>
        <ConversationMessage timeout={4000} variant={'received'} message={{created: timeStamp, body: "Can you please provide your email? We'll use this in case we get disconnected.", fromObj: [{name: 'Support Agent', role: 'AI bot' }] }}/>
        </>}
        {messages && messages.map((message, index)=>(<ConversationMessage key={index} variant={ isReceived(message)? 'received':'sent'} message={message}/>))}
        {submitting && (<HashLoader style={{marginTop: '10px'}} size={10}/>)}
        {!isAuthenticated().user && addAnonymousEmail && openEmail && sender && !sender.email && <AddEmail timeout={5000} send={addAnonymousEmail} close={handleClose}/>}
        <ConversationFooter sx={{position: 'absolute !important', bottom: 0}} newConversationMessage={newConversationMessage} handleChange={handleChange} handleSubmit={handleSubmit} enterKey={enterKey}/>
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
      </WallPaperYGW>
    )
}   
export default Conversation