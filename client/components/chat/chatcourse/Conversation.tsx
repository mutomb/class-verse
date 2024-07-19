import React, { FC, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { ConversationMessage, ConversationFooter} from '.'
import { useAuth } from '../../auth'
import logo from '../../../public/logo.svg'
import { socket } from '../communication'
import { getConversationMessages, getGlobalConversationMessages, sendConversationMessage, sendGlobalConversationMessage } from './api-chat'
import { StyledSnackbar } from '../../styled-banners'
import { Error } from '@mui/icons-material'
import { useChatScroll } from '..'
import { ConversationSkeleton } from '../../skeletons'
import { HashLoader } from '../../progress'

interface ConversationProps{
  messages?: Array<any>,
  addAnonymousEmail?: (email: String) => void,
  scope?: string,
  conversationId?: string | null,
  user?: any,
  courseId: string 
}

const Conversation: FC<ConversationProps> = ({scope, conversationId, user, courseId}) => {
    const {isAuthenticated}= useAuth()
    const [newConversationMessage, setNewConversationMessage] = useState("");
    const [messages, setConversationMessages] = useState([]);
    const [lastConversationMessage, setLastConversationMessage] = useState(null);
    const [error, setError] = useState('');
    const ref = useChatScroll(messages)
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        reloadConversationMessages();
    }, [lastConversationMessage, conversationId, user && user._id]);
    
    useEffect(() => {
      socket.on(`messages-${courseId}`, (data) => {
        if (data && data.error) {
           setError(data.error)
        } else {
          setLastConversationMessage(data)
        }
      });
    }, []);
    
    const reloadConversationMessages = () => {
      (!submitting && messages.length===0) && setLoading(true)
      if (scope === "Global Chat") {
        getGlobalConversationMessages({
          courseId: courseId
        }).then((data) => {
          if(data && data.error){
             setError(data.error);
             setLoading(false)
          }else{
            setConversationMessages(data);
            setLoading(false)
          }
        });
      } else if (scope !== null && user) {
        getConversationMessages(user._id, {
          token: isAuthenticated().token
        },{
          courseId: courseId
        }).then((data) =>{
            if(data && data.error){
               setError(data.error);
               setLoading(false)
            }else{
              setConversationMessages(data);
              setLoading(false)
            }
        });
      } else {
        setConversationMessages([]);
        setLoading(false)
      }
    };
    const handleSubmit = () => {
      const messageData = new FormData()
      if (!newConversationMessage){return setError('Please enter message/attach photo')};
      setSubmitting(true)
      if (scope === "Global Chat") {
        newConversationMessage && messageData.append('body', newConversationMessage)
        sendGlobalConversationMessage({
          courseId: courseId
        },{
          token: isAuthenticated().token
        }, messageData).then((data) => {
          if(data && data.error){
             setError(data.error)
             setSubmitting(false)
          }else{
            setNewConversationMessage("");
            setSubmitting(false)
          }
        });
      } else {
        if (!user && !user._id){setSubmitting(false); return setError('Please select a user')};
        newConversationMessage && messageData.append('body', newConversationMessage)
        newConversationMessage && user && messageData.append('to', user._id)
        sendConversationMessage({
          token: isAuthenticated().token
        }, messageData,{
          courseId: courseId
        }).then((data) => {
          if(data && data.error){
             setError(data.error)
             setSubmitting(false)
          }else{
            setNewConversationMessage("");
            setSubmitting(false)
          }
        });
      }
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
      return <ConversationSkeleton />
    } 
    return (
        <Box ref={ref} id="Conversation" sx={{py:'10vh', px: 0, width: '100%', height: '100%', maxHeight: '88vh', overflowY: 'scroll',  scrollbarWidth: {xs: 'none',  sm:'thin'},
        '&::before': {
            content: '""',
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
            opacity: 0.4,
            overflow: 'hidden'
          },
          '& > div':{
            position: 'relative'
          }}}>
            {messages && messages.map((message, index)=>(<ConversationMessage key={index} variant={ isReceived(message)? 'received':'sent'} message={message}/>))}
            {submitting && (<HashLoader style={{marginTop: '10px'}} size={10}/>)}
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
    )
}   
export default Conversation