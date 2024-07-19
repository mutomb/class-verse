import React, { FC, useState, useEffect} from 'react';
import {ActionButton} from '.';
import { Box } from '@mui/material';
import { Box, useTheme } from '@mui/material/styles';
import { MediaPlayer } from '../media';
import { Call, CallEnd, VideoCall } from '@mui/icons-material';

interface CallModalProps{
  status: string
  localSrc: any 
  peerSrc: any
  config: {
    audio: boolean,
    video: boolean
  }
  mediaDevice: any,
  endCall: (isStarter: boolean) => void
}

const CallWindow: FC<CallModalProps> = ({ peerSrc, localSrc, config, mediaDevice, status, endCall }) => {
  // const peerVideo = useRef(null);
  // const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
 const theme = useTheme()
  // useEffect(() => {
  //   if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
  //   if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  // });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {'Audio' | 'Video'} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === 'Video') {
      setVideo(!video);
    }
    if (deviceType === 'Audio') {
      setAudio(!audio);
    }
    mediaDevice.toggle(deviceType);
  };

  return (
      <Box
      sx={{
        width: '100%',
        height: '100%',
        opacity: 0.3,
        bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
        transition: (theme) => theme.transitions.create(['opacity'], {duration: 500}),
        ...(status ===  'active' && {opacity: 1}),
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column',
      }}>
        <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <MediaPlayer srcObj={peerSrc} />
          <MediaPlayer srcObj={localSrc} />
        </Box>
        {/* <video id="peerVideo" ref={peerVideo} autoPlay />
        <video id="localVideo" ref={localVideo} autoPlay muted /> */}
        <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', md: 'space-around'}}}>
          <ActionButton
            icon={<VideoCall/>}
            disabled={!video}
            onClick={()=>toggleMediaDevice('Video')}
          />
          <ActionButton
            icon={<Call />}
            disabled={!audio}
            onClick={()=>toggleMediaDevice('Audio')}
          />
          <ActionButton
            icon={<CallEnd />}
            onClick={()=>endCall(true)}
          />
        </Box>
      </Box>
  );
}

export default CallWindow;
