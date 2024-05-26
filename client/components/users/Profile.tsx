import React, { useState, useEffect } from 'react'
import {List, ListItem, ListItemAvatar, ListItemText,Typography, Box, Avatar, listItemTextClasses, 
  Container, Grid, listItemAvatarClasses, MenuItem,
  iconButtonClasses} from '@mui/material'
import {Edit} from '@mui/icons-material'
import DeleteUser from './DeleteUser'
import {useAuth} from '../auth'
import {fetchImage, read} from './api-user'
import {Redirect, Link} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import stripeButton from '../../public/images/icons/stripeButton.png'
// import config from '../../../server/config/config'
import logo from '../../public/logo.svg'

export default function Profile({match}){
  const stripe_connect_test_client_id = process.env.STRIPE_TEST_CLIENT_ID
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
  const {isAuthenticated} = useAuth()
  const theme = useTheme()

  const defaultPhotoURL = '/api/users/defaultphoto'
  const [localPhoto, setLocalPhoto] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const [localLogo, setLocalLogo] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {token: isAuthenticated().token}, signal).then((data) => {
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

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(user._id){
      const userPhotoUrl = `/api/users/photo/${user._id}?${new Date().getTime()}`;          
      fetchImage(userPhotoUrl, {token: isAuthenticated().token}, signal).then(({data, isDefault}) => {
        if(data) setLocalPhoto({ data: data, url: URL.createObjectURL(data), isDefault: isDefault });
      })
    }
    return function cleanup(){
      abortController.abort()
    }

  }, [user._id])

  useEffect(() => {
    setUser({...user, photo: localPhoto.data})
  }, [localPhoto.data])

  useEffect(() => { 
    const abortController = new AbortController()
    const signal = abortController.signal
    if(user._id && user.company && user.company._id){
      const companyLogoUrl = `/api/users/${user._id}/company/photo/${user.company._id}?${new Date().getTime()}`;
      fetchImage(companyLogoUrl, {token: isAuthenticated().token}, signal).then(({ data, isDefault }) => {
        if(data)  setLocalLogo({ data: data, url: URL.createObjectURL(data), isDefault: isDefault})
      })
    }

    return function cleanup(){
      abortController.abort()
    }

  }, [user.company && user.company._id])

  useEffect(() => {
    setUser({...user, company: {...user.company, logo: localLogo.data}})
  }, [localLogo.data])
    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (<>
    <WallPaperYGW secondaryColor={theme.palette.background.paper} primaryColor={theme.palette.background.default}
      style={{
        minHeight: '100vh',
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'space',
          backgroundSize: 'contain',
          opacity: 0.5,
        },
        '& > div':{
          position: 'relative'
        }
      }}>
      <Box id="personal" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Box 
                sx={{ px: 0, pb: 0, pt: 16.5, width: '100%',
                  borderRadius: 4, bgcolor: 'rgba(0,0,0,0)', alignItems: 'center'}}>
                <Box sx={{ mt: 1, width: '100%'}}>
                  <List dense={true} sx={{pb:0}}>
                    <ListItem
                    sx={{display: 'flex', justifyContent: 'center',  flexDirection: 'column', backgroundColor: 'background.paper', pt: 4, boxShadow: 4,
                    [`& .${listItemAvatarClasses.root}`]:{ display: 'flex', justifyContent: 'center'}, borderTopLeftRadius: '100%', borderTop: 'solid', borderTopWidth: 50, borderColor: 'secondary.main',
                    transition: (theme) => theme.transitions.create(['box-shadow']),
                    '&:hover': {
                      [`& .${iconButtonClasses.root}`]: {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        boxShadow: 2,
                      },
                    }}} 
                    >
                      <ListItemAvatar
                        sx={{ flex:1, width:'100%', '&>span': {fontSize: { xs: '1rem', md: '1.5rem' },
                        fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}}}
                      >
                        <Avatar 
                          src={localPhoto.url? localPhoto.url : defaultPhotoURL}
                          alt='profile picture' 
                          sx={{
                            width: {xs: 150, sm: 200},
                            height: {xs: 150, sm: 200},
                            boxShadow: 4,
                            mt: -15
                          }}/>
                      </ListItemAvatar>
                      <ListItemText primary={user.name+" "+user.surname } secondary={user.email} 
                      sx={{color: 'text.primary', flex:1, textAlign: {xs: 'center', md: 'unset'}, fontSize: '2rem', fontWeight: 600,
                          [`& .${listItemTextClasses.primary}`]:{fontSize: {xs: '1.0rem', sm: '1.5rem', md:'2rem' }},
                          [`& .${listItemTextClasses.secondary}`]:{fontSize: { sm: '1.0rem', md:'1.5rem' }}
                      }}/> 
                      {isAuthenticated().user && isAuthenticated().user._id == user._id &&
                        (<Box sx={{width: '100%',  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                          <MoreMenuVertButton>
                            <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                              <Link to={"/user/edit/" + user._id} style={{width: '100%', textDecoration: 'none', color: 'inherit'}}>
                                <Box aria-label="Edit" color="inherit" sx={{fontSize: '1rem'}}>
                                   <Edit sx={{mr: 1, verticalAlign: 'text-top'}}/>Edit Profile
                                </Box>
                              </Link>
                            </MenuItem>
                            <DeleteUser userId={user._id} />
                          </MoreMenuVertButton>
                        </Box>)
                      }
                      {isAuthenticated().user && isAuthenticated().user._id == user._id &&
                      (<Box sx={{width: '100%',  display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {user.teacher &&
                          (user.stripe_seller
                            ? (<StyledButton variant="contained" disabled={true}>
                                Stripe connected
                              </StyledButton>)
                            : (<Box component='a' href={"https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+stripe_connect_test_client_id+"&scope=read_write"}>
                                <Box sx={{width: {xs: 150, md: 200}, height: 'auto'}} component='img' src={stripeButton}/>
                              </Box>)
                            )
                          }
                      </Box>)}
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {user.teacher && (<><Box id="experience" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
            <Box
                sx={{
                height: '100%',
                width: { xs: '100%', md: '90%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                textAlign: {xs: 'center', md: 'start'}
                }}
            >
                <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                Teaching Experience
                </Typography>
            </Box>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Box 
                sx={{ px: {xs: 0, sm:2}, py: 1.5, boxShadow: 1, 
                  borderRadius: 4, display: 'flex',
                  flexDirection: {xs:'column', md:'row'},
                  alignItems: 'center', bgcolor: 'background.paper'}}>
                <Box sx={{ mt: 1, width: '100%'}}>
                  <List dense={true}>
                    <ListItem sx={{display: 'flex', justifyContent: 'flex-start',  flexDirection: {xs: 'column', md:'row'}, 
                    pt: 4, pb: { xs: 8, md: 10 }, px: {xs: 1, md: 3}, backgroundColor: 'background.default'}} >
                      <ListItemText 
                        primary={"Experience"} 
                        sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                        fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}, color: 'text.primary'}}
                      />
                      <ListItemText sx={{textAlign:'justify', color: 'text.secondary' }} primary={user.experience}/>         
                    </ListItem>
                    <ListItem sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: {xs: 'column', md:'row'},
                                  pt: 4, pb: { xs: 8, md: 10 }, px: {xs: 1, md: 3}, backgroundColor: 'background.paper',
                                    }} >
                      <ListItemText primary={"Specialist in"} 
                      sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                      fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}, color: 'text.primary'}}
                      />
                      <ListItemText sx={{textAlign:'justify', color: 'text.secondary'}} primary={user.category}/>         
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box id="company" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
            <Box
                sx={{
                height: '100%',
                width: { xs: '100%', md: '90%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                textAlign: {xs: 'center', md: 'start'}, 
                }}
            >
                <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                Professional info
                </Typography>
            </Box>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Box 
                sx={{ px: {xs: 0, sm:2}, py: 1.5, boxShadow: 1, 
                  borderRadius: 4, display: 'flex',
                  flexDirection: {xs:'column', md:'row'},
                  alignItems: 'center', bgcolor: 'background.paper'}}>
                <Box sx={{ mt: 1, width: '100%'}}>
                  <List dense={true}>
                    {user.company && (<>
                      <ListItem sx={{display: 'flex', flexDirection: {xs: 'column', md:'row'}, justifyContent: 'flex-start', 
                                    pt: 4, pb: { xs: 8, md: 10 }, px: {xs: 1, md: 3}, backgroundColor: 'background.default'              
                      }}>
                        <ListItemText primary={"Company"} 
                        sx={{ flex:'none', width: {xs: '100%', md: '20%'}, mr: {xs: 0, md: 5}, '&>span': {fontSize: { xs: '1rem', md: '1.5rem' }, 
                        fontWeight: 'bold', textAlign: {xs: 'center', md: 'unset'}}}}
                        />
                        <ListItemText sx={{textAlign:'justify', color: 'text.secondary'}} primary={user.company.name} 
                          secondary={<Box sx={{ overflow: 'hidden', borderRadius: 2, height: 50, mb: 2 }}>
                            <Box component='img' src={localLogo.url? localLogo.url : defaultPhotoURL} sx={{width: 50, height:'auto'}} alt={user.company.name + ' logo'} />
                          </Box>} />
                      </ListItem>
                      </>)
                    }
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box></>)}
      <Box id="autogenerate-info" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Box 
            sx={{ px: {xs: 0, sm: 2}, py: 1.5, boxShadow: 1, 
              borderRadius: 4, display: 'flex',
              flexDirection: {xs:'column', md:'row'},
              alignItems: 'center', bgcolor: 'background.paper'}}>
            <Box sx={{ mt: 1, width: '100%'}}>
              <List dense={true}>
                <ListItem sx={{backgroundColor: 'background.paper', pt: 4, pb: { xs: 8, md: 10 }, px: {xs: 1, md: 3},  mb: 2, color: 'text.secondary'}}>
                  <ListItemText primary={"Joined: " + (new Date(user.created)).toDateString()} sx={{color: 'text.secondary'}}/>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Container>
      </Box>
      </WallPaperYGW>
      </>)
  }