import React, { FC, useEffect, useState } from 'react';
import {ActionButton} from '.';
import { socket } from './communication';
import { Box, TextField, Typography, formControlLabelClasses, formLabelClasses, inputLabelClasses, outlinedInputClasses, textFieldClasses } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Call, Error, VideoCall } from '@mui/icons-material';
import { StyledSnackbar } from '../styled-banners';

interface CallHomeProps{
  startCall: (isCaller: boolean, friendID: string, config: any) => void
}
const CallHome:FC<CallHomeProps> = ({ startCall }) => {
  const [friendID, setFriendID] = useState(null);/**called */
  const [clientID, setClientID] = useState(''); /**caller */
  const [error, setError] = useState('');
  const theme = useTheme()
  useEffect(() => {
    socket.on('new token', ({ id }) => {
        document.title = `${id} - VideoCall`;
        setClientID(id);
      });
    socket.on('error',({error})=>setError(error))
  }, []);
  /**
   * Start the call with or without video, audio always on
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };
  const handleChange = (event) =>{
      setFriendID(event.target.value)
  }
  const closeError = () =>{
    setError('')
}
  return (
    <Box sx={{width: '100%', minHeight: '70vh', py: 4,  mx: {xs: 0, sm: 5, md: 10}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,}}>
      <Box sx={{ textAlign: 'center'}}>
        <Typography variant='h1' sx={{color: 'text.primary', fontWeight: 700}}>
          Hi, your caller ID is 
          {clientID?
          (<Typography component='span' variant='h1' 
          sx={{color: 'primary.dark', fontWeight: 900, display: 'inline', ml: 2, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.8)`:`rgba(255,255,255,0.8)`, 
          borderWidth: 1, borderStyle: 'solid', borderColor: 'primary.dark', borderRadius: 2, p: 1,
          }}>
            {clientID} 
          </Typography>):
          (<Typography variant='h1' sx={{color: 'error.main', fontWeight: 700}}>
            An error occured while getting your caller ID. Please refresh page.
          </Typography>)
          }
        </Typography>
        <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
            Get started by calling a friend below
        </Typography>
      </Box>
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
        [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
        [`& .${inputLabelClasses.focused}`]: { 
          color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
        },
        [`& .${textFieldClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
        [`& .${textFieldClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
        [`& .${outlinedInputClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
      }}>
        <TextField
            margin="normal"
            required
            sx={{width: {xs: '100%', md: '50%'}}}
            id="friendID"
            label="Friend ID"
            name="friendID"
            autoComplete="name"
            value={friendID} 
            onChange={handleChange}
          />
        <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', md: 'space-around'}}}>
          <ActionButton
            icon={<VideoCall/>}
            onClick={callWithVideo(true)}
          />
          <ActionButton
            icon={<Call/>}
            onClick={callWithVideo(false)}
          />
        </Box>
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
    </Box>
  );
}

export default CallHome;
