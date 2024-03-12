import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { StyledButton } from '../styled-buttons'
import { withRouter, Link } from 'react-router-dom'
import auth from '../auth/auth-helper'
import Library from '@mui/icons-material/LocalLibrary'

const AuthNavigation =  withRouter(({history}) => (
    <Box sx={{ '& button:first-of-type': { mr: 2 } }}>
      {!auth.isAuthenticated() && (
      <>
          <Link to="/signin">
            <StyledButton disableHoverEffect={false} variant="outlined">Sign In </StyledButton>
          </Link>
          <Link to="/signup">
            <StyledButton disableHoverEffect={false}>Sign Up</StyledButton>
          </Link>
      </>)
      }
      { auth.isAuthenticated() && (<>
          {auth.isAuthenticated().user.educator && (
          <Link to="/teach/courses">
            <StyledButton disableHoverEffect={false} variant="outlined">
              <Library/> Teach 
            </StyledButton>
          </Link>)
          }
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <StyledButton disableHoverEffect={false} variant="outlined">Profile </StyledButton>
          </Link>
          <StyledButton disableHoverEffect={false} variant="outlined"
          onClick={() => {
            auth.clearJWT(() => history.push('/'))
          }}>
            Sign out 
          </StyledButton>
        </>)
      }
    </Box>
))

export default AuthNavigation
