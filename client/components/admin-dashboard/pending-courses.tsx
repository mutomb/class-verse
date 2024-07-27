import React, { useEffect, useState } from 'react'
import {List, ListItemAvatar, ListItemText, Avatar, ListItem, IconButton, listItemClasses,Typography, Box, Grid, Container, Slide,
  MenuItem,  Zoom} from '@mui/material'
import { VerifiedOutlined, ReadMore, Error} from '@mui/icons-material'
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import {useAuth} from '../auth'
import {listPending} from '../courses/api-course'
import { MoreMenuVertButton } from '../styled-buttons'
import {socket} from './communication'
import { StyledSnackbar } from '../styled-banners'
import { Link } from 'react-router-dom'

export default function Courses(){
  const theme = useTheme()
  const {isAuthenticated} = useAuth()
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const refresh_list = () => listPending({token: isAuthenticated().token}, signal).then((data) => {
                                  if (data && data.error) {
                                    setError(data.error)
                                  } else {
                                    setCourses(data)
                                  }
                                })
    socket.on('course pending approval admin', (data)=>{
        refresh_list()
    })
    refresh_list()
    return function cleanup(){
      socket.off('course pending approval admin')
      abortController.abort()
    }
  }, [])

  return (
    <WallPaperYGW secondaryColor={theme.palette.background.paper} primaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}> 
      <Box id="courses" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="right" in={true} color='inherit'>
                <Box
                    sx={{
                    height: '100%',
                    width: { xs: '100%', md: '90%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    }}>
                  <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                    Courses
                  </Typography>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Box 
                sx={{ px: {xs: 0, sm:2}, py: 1.5, 
                  borderRadius: 4, display: 'flex',
                  flexDirection: {xs:'column', md:'row'},
                  alignItems: 'center', bgcolor:'background.default'}}>
                <Box sx={{ mt: 1, width: '100%'}}>
                  <Box sx={{  width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
                  textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                    <Avatar sx={{ borderRadius: '50%', width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}>
                      {courses && courses.length}
                    </Avatar>
                    <Typography variant="h2" component="h3" 
                    sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem'}, color: 'text.primary'}}>
                    Course Approval Requests
                    </Typography>
                  </Box>
                  <List dense sx={{width: '100%', px: {xs: 1, sm:5}, [`.${listItemClasses.root}`]: { px: {xs:0, sm: 3}},
                    [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
                  {courses && courses.map((course, i) => {
                      return(
                      <Zoom timeout={1000} id="zoom-course" appear={true} in={true} color='inherit' unmountOnExit={true}>
                        <ListItem key={i} sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center', '&:hover':{boxShadow: 2},
                                      my: {xs:1, sm:2}, borderRadius: 3, bgcolor: 'background.paper'}}>
                          <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <ListItemAvatar 
                            sx={{ flex: 0.5,
                              lineHeight: 0,
                              overflow: 'hidden',
                              borderRadius: 3,
                              height: 200,
                              mb: 2,
                              }}>
                              <Avatar src={'/api/courses/photo/'+course._id+"?" + new Date().getTime()} 
                              sx={{
                                borderRadius: 3,
                                width:{xs: '100%', sm: '100%'},
                                height: {xs: 'auto', md: 'auto'}
                              }}
                              />
                            </ListItemAvatar>
                            <ListItemText 
                              sx={{flex: 1.5, ml: {xs: 0, sm: 1, textAlign: 'center', color: 'text.primary'}}}
                              primary={
                                <Typography component="h2" variant="h2" sx={{ mb: 2, height: 56, overflow: 'hidden', fontSize: '1.4rem', fontWeight: 600, color: 'text.primary' }}>
                                  {course.title}
                                </Typography>
                              } 
                              secondaryTypographyProps={{component: 'div'}}
                              secondary={
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <Box sx={{overflow: "hidden", textOverflow: "ellipsis",textAlign: 'justify', p:1}}>
                                        <Typography variant="body1" sx={{width: '100%', mb: 2}}>
                                          {course.description && course.description.substring(0,250)}{course.description && course.description.substring(250).length>0 && '...'}
                                        </Typography>
                                    </Box>
                                    <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="h5" sx={{color: 'primary.main'}}>
                                        {course.currency +" "+course.price}
                                      </Typography>
                                      <Typography variant="h6" sx={{color: 'text.primary'}}>/ course</Typography>
                                    </Box>
                                    <Box component='span' 
                                      sx={{margin: '7px 10px 0 10px', alignItems: 'center', color: 'text.disabled', display: 'inline-flex',
                                          '& > svg': {
                                            mr: 10,
                                            color: course.status === 'Approved'?'primary.dark': course.status === 'Not approved'? 'error.main': course.status === 'Not published'? 'text.disabled': 'secondary.dark'
                                          }
                                      }}>
                                      <VerifiedOutlined/> {course.status} 
                                    </Box>
                                  </Box>
                              }/>
                          </Box>
                          <Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <MoreMenuVertButton>
                              <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                                <Link style={{textDecoration:'none', color: 'inherit'}} to={"/specialist/course/"+course._id}> 
                                  <IconButton aria-label="Edit" color="inherit" sx={{fontSize: '1rem'}}>
                                    <ReadMore sx={{mr: 1, verticalAlign: 'text-top'}}/> View More  
                                  </IconButton>
                                </Link>
                              </MenuItem>
                            </MoreMenuVertButton>
                          </Box>
                        </ListItem>
                      </Zoom>
                      )})}
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
        </Container>
      </Box>
    </WallPaperYGW>
 )
}