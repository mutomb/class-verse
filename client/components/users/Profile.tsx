import React, { useState, useEffect } from 'react'
import {Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
IconButton, Typography, Box, Avatar} from '@mui/material'
import Edit from '@mui/icons-material/Edit'
import DeleteUser from './DeleteUser'
import auth from '../auth/auth-helper'
import {read} from './api-user'
import {Redirect, Link} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

export default function Profile({match}){
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
  const jwt = auth.isAuthenticated()
  const theme = useTheme();

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])
  const userPhotoUrl = user._id ? `/api/users/photo/${user._id}?${new Date().getTime()}`: '/api/users/defaultphoto'
  const companyLogoUrl = (user._id && user.company?._id) ? 
                        `/api/users/${user._id}/company/photo/${user.company._id}?${new Date().getTime()}`: '/api/users/defaultphoto'

    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (
      <Paper 
      sx={{
        width: {xs: '100%', md: 700},
        m: 'auto',
        mx: { xs: 0, md: 'auto'},
        backgroundColor: 'background.paper'
      }}
      elevation={6} 
      square>
        <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'background.paper'
            }}>
          <Box sx={{ textAlign: 'center', backgroundColor: 'background.paper'}}>
            <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
              Profile
            </Typography>
          </Box>
          <Box sx={{ mt: 1, width: '100%'}}>
            <List dense={true}>
              <ListItem
              sx={{display: 'flex', justifyContent: 'flex-start',  flexDirection: {xs: 'column', md:'row'}, py: 3, 
              backgroundColor: 'background.default'}} 
              >
                <ListItemAvatar
                  sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                  fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}}}
                >
                  <Avatar 
                    src={userPhotoUrl}
                    alt='profile picture' 
                    sx={{
                      width: 80,
                      height: 80,
                      margin: {xs: 'auto', md: 5},
                    }}/>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} sx={{textAlign: {xs: 'center', md: 'unset'}}} /> 
                {auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id &&
                  (<ListItemSecondaryAction sx={{position: 'absolute', top:{xs: 20, md: 50}, right:{xs: 20, md: 50}, flex:'none'}}>
                    <Link to={"/user/edit/" + user._id}>
                      <IconButton aria-label="Edit" color="primary" 
                      sx={{
                          zIndex: 10,
                          boxShadow: 3,
                          transform: 'unset',
                          mr: 1, 
                          ':hover':{
                            transform: 'translateY(-3px)',
                            transition: theme.transitions.create(['transform'])
                          }}}>
                        <Edit/>
                      </IconButton>
                    </Link>
                    <DeleteUser userId={user._id} />
                  </ListItemSecondaryAction>)
                }
              </ListItem>
              {user.teacher && (<>
                <ListItem sx={{display: 'flex', justifyContent: 'flex-start',  flexDirection: {xs: 'column', md:'row'}, 
                py: {xs: 1, md: 3}, px: {xs: 1, md: 3}, backgroundColor: 'background.default'}} >
                  <ListItemText 
                    primary={"Experience"} 
                    sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                    fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}}}
                  />
                  <ListItemText sx={{textAlign:'justify' }} primary={user.experience}/>         
                </ListItem>
                <ListItem sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: {xs: 'column', md:'row'},
                              py: {xs: 1, md: 3}, px: {xs: 1, md: 3}, backgroundColor: 'background.paper',
                                }} >
                  <ListItemText primary={"Specialist in"} 
                   sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                   fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}}}
                  />
                  <ListItemText sx={{textAlign:'justify'}} primary={user.category}/>         
                </ListItem>
                </>)
              }
              {user.company && (<>
                <ListItem sx={{display: 'flex', flexDirection: {xs: 'column', md:'row'}, justifyContent: 'flex-start', 
                              py: {xs: 1, md: 3}, px: {xs: 1, md: 3}, backgroundColor: 'background.default'              
              }} >
                  <ListItemText primary={"Company"} 
                   sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                   fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}}}
                  />
                  <ListItemText sx={{textAlign:'justify'}} primary={user.company.name} 
                    secondary={<Box sx={{ overflow: 'hidden', borderRadius: 2, height: 50, mb: 2 }}>
                      <Box component='img' src={companyLogoUrl} sx={{width: 50, height:'auto'}} alt={user.company.name + ' logo'} />
                    </Box>} />
                </ListItem>
                </>)
              }
              <ListItem sx={{backgroundColor: 'background.paper', py: {xs: 1, md: 3}, px: {xs: 1, md: 3} }}>
                <ListItemText primary={"Joined: " + (new Date(user.created)).toDateString()}/>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>
    )
  }