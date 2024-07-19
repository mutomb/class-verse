import React, { FC } from 'react';
import {ActionButton} from '.';
import { Box, Typography } from '@mui/material';
import {useTheme} from '@mui/material/styles';
import { Call, CallEnd, VideoCall } from '@mui/icons-material';

interface CallModalProps{
  status: string
  callFrom: string,
  startCall: (visCaller: boolean, friendID: string, config: any)=> void,
  rejectCall: ()=>void
}

const CallModal: FC<CallModalProps> = ({ status, callFrom, startCall, rejectCall }) => {
  const theme = useTheme()
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <Box sx={{
      width: 400,
      padding: 2,
      textAlign: 'center',
      display: status === 'active'? "block" : 'none', minHeight: '70vh',
      bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
    }}>
      <Typography variant='body2' sx={{color: 'text.primary', display: 'inline'}}>
        <Typography component='span' sx={{color: 'text.primary', mr: 1}}>
        {callFrom}
        </Typography>
        is calling
      </Typography>
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', md: 'space-around'}}}>
          <ActionButton
            icon={<VideoCall/>}
            onClick={acceptWithVideo(true)}
          />
          <ActionButton
            icon={<Call/>}
            onClick={acceptWithVideo(false)}
          />
          <ActionButton
            icon={<CallEnd/>}
            onClick={rejectCall}
          />
        </Box>
    </Box>
  );
}
export default CallModal;
