import React, { useState, FC } from "react";
import {Box, Zoom} from "@mui/material";
import { Error } from "@mui/icons-material";
import { StyledSnackbar } from "../../styled-banners";
import {Header, Conversation } from ".";
interface ChatBoxProps{
  scope?: string,
  conversationId?: string|null,
  user?: any,
  handleBackToList?: () => void,
  addAnonymousEmail?: (email: string) => void,
  sender?: any,
}
const ChatBox:FC<ChatBoxProps> = ({scope, conversationId, user, handleBackToList, addAnonymousEmail, sender}) => {
  const [error, setError] = useState('');
  return (
  <Zoom timeout={1000} id="zoom-chatbox" appear={true} in={true} unmountOnExit={true} style={{borderRadius: 16}}>
    <Box sx={{ width:'100%', height: '100%'}}>
      <Box sx={{ position: 'relative', width: '100%',  height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', bgcolor: 'background.default', borderRadius: {xs:2, md: 4}}}>
          <Header  user={user} scope={scope} handleBackToList={handleBackToList} />
          <Conversation sender={sender} addAnonymousEmail={addAnonymousEmail} scope={scope} conversationId={conversationId} user={user}/>
      </Box>
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
  </Zoom>
  );
};

export default ChatBox;
