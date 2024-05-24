import React, { FC } from 'react'
import {Box, InputBase, Container, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { StyledButton } from '../styled-buttons'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { useAuth } from '../auth'
import { Parallax } from 'react-parallax'
import image from '../../public/images/courses/photo-1670057037226-b3d65909424f.png'
import logo from '../../public/logo.svg'

const HomeNewsLetter: FC = () => {
  const theme = useTheme()
  const {isAuthenticated} = useAuth()

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
        }}
      />)}>
    <Box id="news-letter" sx={{ py: { xs: 8, md: 10 } }}>
      <Container sx={{px: {xs: 0, sm: 'unset'}}}>
      <WallPaperYGW style={{borderRadius: 10, py: { xs: 4, md: 10 }, px: { xs: 4, md: 8 }, textAlign: 'center'}}  variant='linear' primaryColor={theme.palette.secondary.main} secondaryColor={theme.palette.secondary.dark}>
        <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '3.0rem'}, color: 'text.primary'  }}>
          {isAuthenticated().user? "Write A Feedback" : "Subscribe to Our News Letter"}
        </Typography>
        <Typography sx={{ mb: 6, fontWeight: 600, color: 'text.primary' }}>
          {isAuthenticated().user? 
          "To help us improve your experience on the App, please share with us any positive or negative comments."
          :"Submit your email address to our marketing promotions and updates via email."}
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
            placeholder= {isAuthenticated().user? "Enter Your Comment" : "Enter your Email Address"}
          />
          <Box>
            <StyledButton disableHoverEffect={false} size="large">
              {isAuthenticated().user? 'Submit' :'Subscribe' }
            </StyledButton>
          </Box>
        </Box>
      </WallPaperYGW>
      </Container>
    </Box>
  </Parallax>
  )
}

export default HomeNewsLetter
