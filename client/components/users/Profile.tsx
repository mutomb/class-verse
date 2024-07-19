import React, { useState, useEffect } from 'react'
import {Typography, Box, Avatar, Container, Grid, MenuItem, FormControl, selectClasses, Divider, iconButtonClasses, dialogClasses, Dialog, useMediaQuery} from '@mui/material'
import {Edit, Email, Error, ExpandLess, ExpandMore, FileDownload, People, Person, PlaylistPlay, Reviews, Star, Work} from '@mui/icons-material'
import DeleteUser from './DeleteUser'
import {useAuth} from '../auth'
import {fetchImage, read, update} from './api-user'
import {Redirect, Link} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, SelectButton, StyledButton } from '../styled-buttons'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import image from '../../public/images/home/home-search.jpg' 
import { Parallax } from 'react-parallax'
import { StyledSnackbar } from '../styled-banners'
import {ChipsArray} from '../styled-buttons'
import { ProfileSkeleton } from '../skeletons'
import { TiersConnect } from '../users';
import {tiers} from '../users/tiers.data'
import { scroller } from 'react-scroll'

export default function Profile({match}){
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [error, setError] = useState('')
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
  })
  const [loading, setLoading] = useState(false)
  const [openTiersConnect, setOpenTiersConnect] = useState(false)
  const [expandExperience, setExpandExperience] = useState(false)

  const updateResumeStatus = (event)=> {
    let userData = new FormData()
    if(!['none', 'pending', 'approved', 'rejected'].includes(event.target.value)){
      return setError('New status was not validated. Try again.')
    } 
    userData.append('resume_status', event.target.value)
    update({
      userId: user._id
    }, {
      token: isAuthenticated().token
    }, userData).then((data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setUser({...user, resume_status: data.resume_status})
      }
    })
  }
  const updateQualificationStatus = (event)=> {
    let userData = new FormData()
    if(!['none', 'pending', 'approved', 'rejected'].includes(event.target.value)){
      return setError('New status was not validated. Try again.')
    } 
    userData.append('qualification_status', event.target.value)
    update({
      userId: user._id
    }, {
      token: isAuthenticated().token
    }, userData).then((data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setUser({...user, qualification_status: data.qualification_status})
      }
    })
  }

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    read({
      userId: match.params.userId
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
        setLoading(false)
      } else {
        setUser(data)
        setLoading(false)
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
  useEffect(() => {
    scroller.scrollTo('heading', {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -50
    })
    
  }, [])
  if (redirectToSignin) {
    return <Redirect to='/signin'/>
  }
  if(loading){
    return <ProfileSkeleton />
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
    <Container maxWidth={false} sx={{minHeight: '100vh', p:'0px !important', m:'0px !important', backgroundColor: 'background.paper'}}>
      <Container id='heading' maxWidth={false} sx={{px: {xs: 0, sm: 'inherit'}, backgroundColor: 'background.paper', '&:hover': { [`& .${iconButtonClasses.root}`]: {transitions: theme.transitions.create(['box-shadow','color']), boxShadow: 2, backgroundColor: 'primary.main', color: 'primary.contrastText'}} }}>
        <Grid container spacing={0} sx={{bgcolor: 'background.paper'}}>
          <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
            <Parallax bgImage={image}  strength={50} blur={5}
              renderLayer={percentage=>(
              <WallPaperYGW variant='linear' primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.background.paper} 
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
              />
              )}>
              <Box sx={{width: '100%', height: {xs: 150, md: 200}}} />
            </Parallax>
          </Grid>
          {!loading && user._id &&
          (<Grid container spacing={0} sx={{mb: 1, boxShadow: 2, py: 1}}>
            <Grid id='features' item sm={4.5} sx={{display: {xs: 'none', sm: 'flex'}, pr: {sm: 2, md: 'inherit'}}}>
              <Box sx={{color: 'text.secondary', width: '100%', height: '100%', display: 'flex', flexDirection: {xs: 'row', sm: 'column'}, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                {user.spcecialist &&
                (<>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1.4rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1.4rem' }}>
                    Specialist Rating <Star sx={{color: 'primary.main', verticalAlign: 'middle'}}/>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1.4rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1.4rem' }}>
                    Reviews <Reviews sx={{color: 'primary.main', verticalAlign: 'middle'}}/>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1.4rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1.4rem' }}>
                    Clients <People sx={{color: 'primary.main', verticalAlign: 'middle'}}/>
                  </Typography>
                </Box>
                </>)}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1.4rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1.4rem' }}>
                    Courses <PlaylistPlay sx={{color: 'primary.main', verticalAlign: 'middle'}}/>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Box sx={{width: '100%', height: {xs:100, sm:'100%'}, display: 'flex', justifyContent: 'center'}}>
                <Avatar 
                  src={localPhoto.url? localPhoto.url : defaultPhotoURL}
                  alt='profile picture' 
                  sx={{
                    width: {xs: 100, sm: 150, md: 200},
                    height: {xs: 100, sm: 150, md: 200},
                    boxShadow: 2,
                    mt: {xs: -5, sm: '-40%', md:'-30%'},
                    bgcolor: 'background.paper'
                  }}/>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4.5} sx={{pt: {xs: 0, sm: 'inherit'}, pl: {xs: 0, sm: 2, md: 'inherit'}}}>
              <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: {xs: 'center', sm:'flex-start'}, textAlign: {xs: 'center', sm:'flex-start'}, justifyContent: 'flex-start', textWrap: 'wrap'}}>
                <Typography component="h2" variant="h4" sx={{display: 'flex', alignItems: 'center', color: 'primary.main', fontSize: {xs:'1rem', md:'1.4rem'} }}>
                  <Person sx={{color: 'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/> {user.name+" "+user.surname}
                </Typography> 
                {isAuthenticated().user && isAuthenticated().user._id == user._id && 
                (<Typography component="h3" variant="body1" sx={{display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: {xs:'0.8rem', md:'1rem'} }}>
                  <Email sx={{color: 'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/> {user.email}
                </Typography>)}
                {user.company && (
                <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', sm:'flex-start'}, alignItems: 'center'}}>
                  <Typography component="h4" variant="body1" sx={{display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: {xs:'0.8rem', sm: '0.8rem', md:'1.2rem'} }}>
                    <Work sx={{color: 'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/> {user.company.name}
                  </Typography>
                  {localLogo.url && !localLogo.isDefault &&
                  (<Box sx={{ overflow: 'hidden', borderRadius: 2, height: 40, width: 100, mb: 2 }}>
                    <Box component='img' src={localLogo.url} sx={{width: 'auto', height: '100%'}}/>
                  </Box>)}
                </Box>
                )}
                <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection:'column', justifyContent: {xs: 'center', sm:'flex-start'}, alignItems: 'center'}}>
                  {isAuthenticated().user && (isAuthenticated().user.role==='admin' || (isAuthenticated().user._id == user._id && isAuthenticated().user.specialist)) &&
                  (<>
                  <Box sx={{  width: '100%', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: 'center', md:'flex-start'}, alignItems: {xs: 'center', sm: 'flex-start'}}}>
                    <Box {...(user.resume_status !== 'none' && {component:'a', href: '/api/users/resume/'+user._id})} 
                      sx={{mr: 1, display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', sm:'flex-start'}, alignItems: 'center', color: 'text.secondary', 
                          textDecoration: 'none', ...(user.resume_status !== 'none' && { color: 'primary.main', '&:hover':{textDecorationLine: 'underline'}})}}>
                      <Typography component="h3" variant="body1" sx={{display: 'flex', alignItems: 'center', fontSize: {xs:'0.8rem', sm: '0.8rem', md:'1.2rem'} }}>
                        <FileDownload 
                        sx={{color:user.resume_status === 'none'?'primary.dark': user.resume_status === 'rejected'? 'error.main': user.resume_status === 'none'? 'text.secondary': 'secondary.main', 
                            verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/> 
                        Resume 
                      </Typography>
                      <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" />
                      <Typography component="h3" variant="body1" sx={{color: 'text.secondary', fontSize: {xs:'0.8rem', sm: '0.8rem', md:'1.2rem'} }}>
                        {user.resume_status}
                      </Typography>
                    </Box>
                    {isAuthenticated().user && isAuthenticated().user.role === 'admin' && user.resume_status &&
                    (<FormControl aria-label="status" sx={{ minWidth: 80, maxWidth: 200, borderRadius: 3, my: {xs: 2, md: 0}, mr: 0, [`& .${selectClasses.icon}`]: {color: 'primary.contrastText'} }}>
                        <SelectButton options={['none', 'pending', 'approved', 'rejected']} value={user.resume_status} handleChange={updateResumeStatus} label='Status' 
                          styles={{
                            borderRadius: 3,
                            bgcolor: user.resume_status === 'approved'?'primary.dark': user.resume_status === 'rejected'? 'error.main': user.resume_status === 'none'? 'text.secondary': 'secondary.main'
                          }}/>
                      </FormControl>)}
                  </Box>
                  <Box sx={{  width: '100%', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: 'center', md:'flex-start'}, alignItems: {xs: 'center', sm: 'flex-start'}}}>
                    <Box {...(user.qualification_status !== 'none' && {component:'a', href:'/api/users/qualification/'+user._id})} 
                    sx={{mr: 1, display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', sm:'flex-start'}, alignItems: 'center', color: 'text.secondary', textDecoration: 'none', 
                          ...(user.qualification_status !== 'none' && { color: 'primary.main', '&:hover':{textDecorationLine: 'underline'}})}}>
                      <Typography component="h3" variant="body1" sx={{display: 'flex', alignItems: 'center', fontSize: {xs:'0.8rem', sm: '0.8rem', md:'1.2rem'} }}>
                        <FileDownload 
                        sx={{color: user.qualification_status === 'approved'?'primary.dark': user.qualification_status === 'rejected'? 'error.main': user.qualification_status === 'none'? 'text.secondary': 'secondary.main',
                            verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/> 
                        Qualification 
                      </Typography>
                      <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" />
                      <Typography component="h3" variant="body1" sx={{color: 'text.secondary', fontSize: {xs:'0.8rem', sm: '0.8rem', md:'1.2rem'} }}>
                        {user.qualification_status}
                      </Typography>
                    </Box>
                    {isAuthenticated().user && isAuthenticated().user.role === 'admin' && user.qualification_status &&
                    (<FormControl aria-label="status" sx={{ minWidth: 80, maxWidth: 200, borderRadius: 3, my: {xs: 2, md: 0}, mr: 0, [`& .${selectClasses.icon}`]: {color: 'primary.contrastText'} }}>
                        <SelectButton options={['none', 'pending', 'approved', 'rejected']} value={user.qualification_status} handleChange={updateQualificationStatus} label='Status' 
                          styles={{
                            borderRadius: 3,
                            bgcolor: user.qualification_status === 'approved'?'primary.dark': user.qualification_status === 'rejected'? 'error.main': user.qualification_status === 'none'? 'text.secondary': 'secondary.main'
                          }}/>
                      </FormControl>)}
                  </Box>
                  </>)}
                </Box>
                {isAuthenticated().user && isAuthenticated().user._id == user._id &&
                (<Box sx={{alignSelf: 'flex-end'}}>
                  <MoreMenuVertButton>
                    <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                      <Link to={"/user/edit/" + user._id} style={{width: '100%', textDecoration: 'none', color: 'inherit'}}>
                        <Box aria-label="Edit" color="inherit" sx={{fontSize: '1rem'}}>
                            <Edit sx={{mr: 1, verticalAlign: 'text-top'}}/>Edit Profile
                        </Box>
                      </Link>
                    </MenuItem>
                    <DeleteUser userId={user._id} />
                  </MoreMenuVertButton>
                </Box>)}
              </Box>
            </Grid>
            <Grid id='features' item xs={12} sx={{display: {xs: 'flex', sm: 'none'}, pl:0, pt: 0}}>
              <Box sx={{color: 'text.secondary', width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, mr: 1}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                    Specialist Rating <Star sx={{color: 'primary.main', verticalAlign: 'middle', width: 15, height: 15}}/> <Divider component='span' sx={{display: {xs: 'none', sm: 'flex'}, height: 28, m: 0.5,}} orientation="vertical" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, mr: 1}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                    Reviews <Reviews sx={{color: 'primary.main', verticalAlign: 'middle', width: 15, height: 15}}/> <Divider component='span' sx={{display: {xs: 'none', sm: 'flex'}, height: 28, m: 0.5,}} orientation="vertical" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, mr: 1}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                    Clients <People sx={{color: 'primary.main', verticalAlign: 'middle', width: 15, height: 15}}/> <Divider component='span' sx={{display: {xs: 'none', sm: 'flex'}, height: 28, m: 0.5,}} orientation="vertical" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, mr: 1}}>
                  <Typography component="h2" variant="h4" sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }}>
                    0
                  </Typography>
                  <Typography component="h3" variant="h5" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                    Courses <PlaylistPlay sx={{color: 'primary.main', verticalAlign: 'middle', width: 15, height: 15}}/> <Divider component='span' sx={{display: {xs: 'none', sm: 'flex'}, height: 28, m: 0.5,}} orientation="vertical" />
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <ChipsArray chipData={user.skills? user.skills.map((skill, index)=>({key: index, label:skill})):[]}  />
            </Grid>
            <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              {isAuthenticated().user && isAuthenticated().user._id == user._id &&
              (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {user.specialist &&
                (user.stripe_seller?
                (<StyledButton variant="contained" disabled={true}>
                  Stripe Connected
                </StyledButton>):
                user.shopify_seller?
                (<StyledButton variant="contained" disabled={true}>
                  Shopify Connected
                </StyledButton>):
                user.paypal_seller?
                (<StyledButton variant="contained" disabled={true}>
                  Paypal Connected
                </StyledButton>):
                (<StyledButton onClick={()=>setOpenTiersConnect(true)} variant="contained" color='secondary'
                    startIcon={
                      <Typography component="h2" variant="h3" sx={{ color: 'primary.contrastText'}}>
                        $ <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" />
                      </Typography> 
                    }>
                      Get Paid
                </StyledButton>
                ))}
              </Box>)}
            </Grid>
          </Grid>)}
        </Grid>
      </Container>
      {user && user.specialist && 
      (<Container id='body' maxWidth={false} sx={{px: {xs: 0, sm: 2, md: 4}, backgroundColor: 'background.paper' }}>
          <Grid container spacing={2} sx={{bgcolor: 'background.paper',}}>
            <Grid id='experience' item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Grid container spacing={0} sx={{position: 'relative', mb: 1, boxShadow: 2, px: {xs: 0, sm: 1, md: 2}, py: 1, borderBottomLeftRadius: {xs: 2, md: 4}, borderBottomRightRadius: {xs: 2, md: 4}}}>
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Typography component='h2' variant='h2' sx={{ py: {xs: 2, sm: 4}, color: 'secondary.main'}}>
                    About me
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <Typography component="p" variant="body1" sx={{color: 'text.secondary', fontSize: {xs:'0.8rem', sm:'1rem'} }}>
                    {expandExperience?
                    (<>
                    {user.experience}
                    {user.experience && user.experience.substring(xsMobileView? 300: 500).length>0 && 
                    (<Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                      <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandLess/>} onClick={()=>{setExpandExperience(false)}}>Show Less</StyledButton>
                    </Grid>)}
                    </>):
                    (<>
                    {user.experience && user.experience.substring(xsMobileView? 300: 500)}
                    {user.experience && user.experience.substring(xsMobileView? 300: 500).length>0 && 
                    (<Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 40}}>
                      <Box sx={{position: 'absolute', width: '100%', borderRadius: {xs: 2, md: 4}, ml: -2,   bottom: 0, minHeight: '100%', background: theme.palette.mode === 'dark'?'linear-gradient(rgba(34, 33, 40, 0.1) 0%, rgba(34, 33, 40, 1) 90%, rgba(34, 33, 40, 1) 100%)':'linear-gradient(rgba(245, 245, 245, 0.1) 0%, rgba(245, 245, 245, 1) 90%, rgba(245, 245, 245, 1) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent:'center'}}>
                        <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandMore/>} onClick={()=>{setExpandExperience(true)}}>Show More</StyledButton>
                      </Box>
                    </Grid>)}
                    </>)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
      </Container>)}
        {user && user.created &&
        (<Box id="autogenerate-info" sx={{py: {xs: 4, md: 8}, px: {xs: 1, sm: 4, md: 8}, bgcolor: 'background.paper', color: 'text.secondary', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
            {"Member Since: " + (new Date(user.created)).toDateString()}
        </Box>)}
    </Container>
    <Dialog PaperComponent={Box} fullWidth maxWidth='lg' transitionDuration={1000} open={openTiersConnect}  onClose={()=>setOpenTiersConnect(false)} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, width:'100%'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
      <TiersConnect tiers={tiers.filter(tier=>tier.title!=='Free')} />
    </Dialog>
    <StyledSnackbar
      open={error? true: false}
      duration={3000}
      handleClose={()=>setError('')}
      icon={<Error/>}
      heading={"Error"}
      body={error}
      variant='error'
      />
    </WallPaperYGW>
    </>)
  }