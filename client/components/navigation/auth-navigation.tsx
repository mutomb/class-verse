import React from 'react'
import {Box } from '@mui/material'
import { StyledButton } from '../styled-buttons'
import { withRouter, Link } from 'react-router-dom'
import auth from '../auth/auth-helper'
import Library from '@mui/icons-material/LocalLibrary'
import {ProfilePicButton} from '../styled-buttons'

const AuthNavigation =  withRouter(({history}) => {
  const userPhotoUrl = auth.isAuthenticated().user? 
  `/api/users/photo/${auth.isAuthenticated().user._id}?${new Date().getTime()}`: 
  '/api/users/defaultphoto'
  return (
    <Box sx={{ display: 'flex', flexDirection:{ xs: 'column', sm: 'row'}, 
    flex: 'auto', alignItems: 'center', width: { xs: 'unset', sm: '50%'},
    justifyContent: auth.isAuthenticated()? 'space-between': 'space-evenly',
    '& button:first-of-type': { my: {xs: 1, sm: 'unset'}}
    }}>
      {!auth.isAuthenticated().user && (
      <>
          <Link to="/signin">
            <StyledButton disableHoverEffect={false} variant="outlined">Sign In </StyledButton>
          </Link>
          <Link to="/signup">
            <StyledButton disableHoverEffect={false}>Sign Up</StyledButton>
          </Link>
      </>)
      }
      { auth.isAuthenticated().user && (<>
          {auth.isAuthenticated().user.teacher && (
          <Link to="/teach/courses">
            <StyledButton disableHoverEffect={false} color='secondary' variant="outlined">
              <Library/> Teach 
            </StyledButton>
          </Link>)
          }
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <ProfilePicButton user={auth.isAuthenticated().user}/>
          </Link>
          <StyledButton disableHoverEffect={false} variant="contained"
          onClick={() => {
            auth.clearJWT(() => history.push('/'))
          }}>
            Sign out 
          </StyledButton>
        </>)
      }
    </Box>
)})

export default AuthNavigation
