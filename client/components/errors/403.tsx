import React, { useEffect}  from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { StyledButton } from '../styled-buttons'
import {useAuth} from '../auth'
import { StyledBanner } from '../styled-banners'
import { Error } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import { useColorMode } from '../../config/theme/MUItheme-hooks'

const Unauthorized = () => {
  const {clearJWT} = useAuth()
  const {clearPreference} = useColorMode()
  const history = useHistory()
  const login = () => {
    history.replace('/signin')
  }
  useEffect(()=> clearJWT(()=>{clearPreference()}), [])

  return (
    <Box sx={{ backgroundColor: 'background.paper', position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ boxShadow: 2, py: 4, px: 7, borderRadius: 4 }}>
          <StyledBanner
           body={'Your request was not allowed, possibly because you are not logged in or your session expired. Please try to log. Should the issue persist please contact support for assistance.'}
           icon={<Error/>}
           heading={'403 / Unauthorized'} 
           variant='error'
           />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my:2
        }}>
        <StyledButton onClick={login} disableHoverEffect={false} variant="outlined">
          Go To Login Page
        </StyledButton>
      </Box>
      </Container>
    </Box>
  )
}

export default Unauthorized
