import React, { FC } from 'react'
import {Box } from '@mui/material'
import { StyledButton } from '../styled-buttons'
import { useHistory, Link } from 'react-router-dom'
import {useAuth} from '../auth'
import { useColorMode } from '../../config/theme/MUItheme-hooks'

interface AuthNavigation{
  onClick?: ()=> void
}
const AuthNavigation: FC<AuthNavigation> =  ({onClick}) => {
  const {clearJWT, isAuthenticated} = useAuth()
  const {clearPreference} = useColorMode()
  const history = useHistory()
  const signOut = async () => {
    clearJWT(() => {clearPreference(); history.push('/'); onClick && onClick()})    
  }
  const handleClick = () => {
    onClick && onClick()
  }
  return (
    <Box sx={{ display: 'flex', flexDirection:{ xs: 'column', md: 'row'}, 
    flex: 'auto', alignItems: 'center', width: { xs: 'unset', md: '50%'},
    justifyContent: isAuthenticated().user? 'space-between': 'space-evenly',
    '& button:first-of-type': { my: {xs: 1, sm: 'unset'}}
    }}>
      {!isAuthenticated().user && (
      <>
          <Link to="/signin">
            <StyledButton onClick={handleClick} disableHoverEffect={false} variant="outlined">Sign In </StyledButton>
          </Link>
          <Link to="/signup">
            <StyledButton onClick={handleClick} disableHoverEffect={false}>Sign Up</StyledButton>
          </Link>
      </>)
      }
      { isAuthenticated().user && (
          <StyledButton disableHoverEffect={false} variant="contained"
          onClick={signOut}>
            Sign out 
          </StyledButton>
        )
      }
    </Box>
)}

export default AuthNavigation
