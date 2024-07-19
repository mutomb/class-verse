import React, { FC, useState } from 'react'
import {Box, InputBase, Container, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { StyledButton } from '../styled-buttons'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { useAuth } from '../auth'
import { Parallax } from 'react-parallax'
import image from '../../public/images/courses/photo-1670057037226-b3d65909424f.png'
import logo from '../../public/logo.svg'
import { createAnonymous, listAdmins } from '../users/api-user'
import { sendConversationMessage } from '../chat/chatbot/api-chatbot'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'
import { CheckCircleOutline, Error } from '@mui/icons-material'

const HomeNewsLetter: FC = () => {
  const theme = useTheme()
  const [values, setValues] = useState({email: '', body: ''})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const {isAuthenticated} = useAuth()
  const handleChange = (name: string) => (event)=>{
    setValues({...values, [name]: event.target.value})
  }
  const send = () => {
    if(!isAuthenticated().user && !values.email) return setError('Please fill out your email.')
    if(isAuthenticated().user && !values.body) return setError('Please fill out your feeback.')
    setSubmitting(true)
    const abortController = new AbortController()
    const signal = abortController.signal
    listAdmins(signal,{
      token: isAuthenticated().token
    }).then((data) => {
      if (data && data.error) {
          setError(data.error)
          setSubmitting(false)
      } else {
        let admin = data[Math.floor(Math.random()*data.length)];
        if(!isAuthenticated().user){
          let anonymousData = new FormData()
          values.email && anonymousData.append('anonymous_email', values.email)
            createAnonymous(anonymousData).then((anonymousData)=>{
              if(anonymousData && anonymousData.error){
                  setError(anonymousData.error)
                  setSubmitting(false)
              }else{
                let messageData = new FormData()
                messageData.append('to', admin._id)
                messageData.append('from', anonymousData._id)
                messageData.append('body', '[NewsLetter]')
                sendConversationMessage(messageData).then((data) => {
                  if(data && data.error){
                      setError(data.error)
                      setSubmitting(false)
                  }else{
                    setSuccess('Subscribed successfully.')
                    setValues({...values, body: '', email: ''})
                    setSubmitting(false)
                  }
                });
              }
            })
        }else{
          let messageData = new FormData()
          messageData.append('to', admin._id)
          messageData.append('from', isAuthenticated().user._id)
          messageData.append('body', '[NewsLetter] '+values.body)
          sendConversationMessage(messageData).then((data) => {
            if(data && data.error){
                setError(data.error)
                setSubmitting(false)
            }else{
              setSuccess('Subscribed successfully.')
              setValues({...values, body: '', email: ''})
              setSubmitting(false)
            }
          });
        }
      }
    })
  }
  return (
  <Parallax bgImage={image}  strength={300} blur={10}
      renderLayer={percentage=>(
      <WallPaperYGW variant='linear' primaryColor={theme.palette.background.default} secondaryColor={theme.palette.primary.main} 
        style={{
          opacity: percentage*0.7, position: 'absolute', width: '100%', height: '100%',
          '&::before': {
            content: '""',
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'space',
            backgroundSize: 'contain',
            opacity: percentage*0.5
          },
          '& > div':{
            position: 'relative'
          }
        }} overlayStyle={{bgcolor: 'rgba(0,0,0,0)'}}
      />)}>
    <Box id="news-letter" sx={{ py: { xs: 8, md: 10 } }}>
      <Container sx={{px: {xs: 0, sm: 'unset'}}}>
      <WallPaperYGW style={{borderRadius: 10, boxShadow: 4}} overlayStyle={{bgcolor: 'rgba(0,0,0,0)', py: { xs: 4, md: 10 }, px: { xs: 0, sm: 2, md: 8 }, textAlign: 'center'}}  variant='linear' primaryColor={`rgba(208, 130, 28, 0.7)`} secondaryColor={`rgba(13, 106, 105, 0.7)`}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '3.0rem'}, color: 'text.primary'  }}>
            {isAuthenticated().user? "Write A Feedback" : "Subscribe to Our News Letter"}
          </Typography>
          <Typography sx={{ mb: 6, fontWeight: 600, color: 'text.primary' }}>
            {isAuthenticated().user? 
            "To help us improve your experience on the App, please review the app or request a feature you'd like us to see in future."
            :"Please submit your email address to benefit from our marketing promotions and updates."}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-around',
              width: { xs: '100%', md: '70%' },
              mx: 'auto',
            }}
          >
            <InputBase
              multiline={isAuthenticated().user? true: false}
              rows={isAuthenticated().user? 3: 1}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 3,
                width: '100%',
                height: isAuthenticated().user? 'unset' :48,
                px: 2,
                mr: { xs: 0, md: 3 },
                mb: { xs: 2, md: 0 },
              }}
              onChange={isAuthenticated().user? handleChange('body'): handleChange('email')}
              value={isAuthenticated().user? values.body: values.email}
              placeholder= {isAuthenticated().user? "Enter Your Comment" : "Enter your Email Address"}
            />
            <Box>
              {submitting?
              (<HashLoader style={{marginTop: '10px'}} size={10}/>):
              (<StyledButton onClick={send} disableHoverEffect={false} color='secondary'>
                {isAuthenticated().user? 'Submit' :'Subscribe' }
              </StyledButton>)}
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
            <StyledSnackbar
            open={success? true: false}
            duration={3000}
            handleClose={()=>setSuccess('')}
            icon={<CheckCircleOutline/>}
            heading={"Sent!"}
            body={success}
            variant='success'
            />
          </Box>
      </WallPaperYGW> 
      </Container>
    </Box>
  </Parallax>
  )
}

export default HomeNewsLetter
