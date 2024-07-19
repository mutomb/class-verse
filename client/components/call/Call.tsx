import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { socket, PeerConnection } from './communication';
import {CallHome, CallWindow, CallModal} from '.';
import { Box } from '@mui/material';
import { WallPaperYGW } from '../wallpapers/wallpapers';
import {useTheme } from '@mui/material/styles';
import logo from '../../public/logo.svg'
import { StyledSnackbar } from '../styled-banners';
import { Error } from '@mui/icons-material';

let pc: any = {}
let config: any = null

const Call = () =>{
  const theme = useTheme()
  const [videoaudichat, setVideoAudioChat] = useState(
    {
      callWindow: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null
    })
  const [error, setError] = useState('')
  const closeError = () =>{
    setError('')
  }
  useEffect(()=>{
    socket.on('request', ({ from: callFrom }) => {
      setVideoAudioChat({...videoaudichat, callModal: 'active', callFrom });
    })

    socket.on('call', (data) => {
      if (data.sdp) {
        pc.setRemoteDescription(data.sdp);
        if (data.sdp.type === 'offer') pc.createAnswer();
      } else pc.addIceCandidate(data.candidate);
    })

    socket.on('error', ({error}) => {
      setError(error)
    })

    socket.on('end', ()=> {
      endCall(false)
    })

    socket.emit('new token');
    
  }, [])
/**
 * Start the call with or without video
 * @param {Boolean} video
 */
  const startCall = (isCaller, friendID, config) => {
    config = config;
    let pc = new PeerConnection(friendID)
    
    pc.on('localStream', (src) => {
        const newState: any = { callWindow: 'active', localSrc: src };
        if (!isCaller) newState.callModal = '';
        setVideoAudioChat({...videoaudichat, ...newState});
      })

    pc.on('peerStream', (src) => {
      setVideoAudioChat({...videoaudichat, peerSrc: src })
    })

    pc.start(isCaller);
  }

  const rejectCall= () => {
    const { callFrom } = videoaudichat
    socket.emit('end', { to: callFrom });
    setVideoAudioChat({...videoaudichat, callModal: '' });
  }

  const endCall = (isStarter: boolean) => {
    if (_.isFunction(pc.stop)) {
      pc.stop(isStarter);
    }
    pc = {};
    config = null;
    setVideoAudioChat({
      ...videoaudichat,
      callWindow: '',
      callModal: '',
      localSrc: null,
      peerSrc: null
    });
  }
    return (
      <WallPaperYGW secondaryColor={theme.palette.primary.main} primaryColor={theme.palette.secondary.main}
      style={{
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          opacity: 0.5,
        },
        '& > div':{
          position: 'relative'
        }
      }}>
        <Box sx={{width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <CallHome startCall={startCall} />
          {!_.isEmpty(config) && (
            <CallWindow
              status={videoaudichat.callWindow}
              localSrc={videoaudichat.localSrc}
              peerSrc={videoaudichat.peerSrc}
              config={config}
              mediaDevice={pc.mediaDevice}
              endCall={endCall}
            />
          ) }
          <CallModal
            status={videoaudichat.callModal}
            startCall={startCall}
            rejectCall={rejectCall}
            callFrom={videoaudichat.callFrom}
          />
        </Box>
        <StyledSnackbar
        open={error? true: false}
        duration={3000}
        handleClose={closeError}
        icon={<Error/>}
        heading={"Error"}
        body={error}
        variant='error'
        />
      </WallPaperYGW>
    );
}

export default Call;
