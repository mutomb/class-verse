import React, {useState, useEffect} from 'react'
import {List, ListItemAvatar, ListItemText, Avatar, Typography, Box, useMediaQuery, 
  ListItem, IconButton, listItemClasses,
  MenuItem,
  Zoom} from '@mui/material'
import {useAuth} from '../auth'
import {listByTeacher} from './api-course'
import {Redirect, Link} from 'react-router-dom'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { AddBox, Info, VerifiedOutlined, ReadMore} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { StyledBanner } from '../styled-banners'

export default function MyCourses(){
  const {isAuthenticated} = useAuth()
  const [courses, setCourses] = useState([])
  const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
  const { breakpoints, transitions } = useTheme()
  const xsMobileView = useMediaQuery(breakpoints.down('sm'))
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByTeacher({
      userId: isAuthenticated().user && isAuthenticated().user._id 
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setCourses(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])


  if (redirectToSignin) {
    return <Redirect to='/signin'/>
  }
  return ( 
          <Box 
            sx={{ px: {xs: 0, sm:2}, py: 1.5, 
              borderRadius: 4, display: 'flex',
              flexDirection: {xs:'column', md:'row'},
              alignItems: 'center', bgcolor:'background.default'}}>
            <Box sx={{ mt: 1, width: '100%'}}>
              <Box sx={{  width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', 
              textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                <Box sx={{flex: {xs:0, sm: 1}}} /> {/*magic box*/}
                <Typography variant="h1" component="h1" 
                sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem', color: 'text.primary' }, color: 'text.primary'}}>
                  My courses
                </Typography>
                <Box sx={{flex: 1, display: 'flex', justifyContent: xsMobileView? 'flex-end': 'center', ...(xsMobileView?{mr: 5}:{})}}>
                  <Link style={{textDecoration:'none'}} to="/teach/course/new">
                    <StyledButton disableHoverEffect={false} variant="contained" color='primary'>
                        <AddBox sx={{verticalAlign: 'text-top'}}/> { xsMobileView? '': 'Add Course'} 
                    </StyledButton>
                  </Link>
                </Box>
              </Box>
              <Box sx={{  width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'text.disabled',
              textAlign: {xs: 'start', md: 'center'}, bgcolor: 'background.default', borderRadius: 3}}>
                <StyledBanner icon={<Info/>} heading={courses.length>0?  <>Private <VerifiedOutlined sx={{color: 'text.disabled'}}/> or Published <VerifiedOutlined sx={{color: 'secondary.main'}}/> </>:" Courses Not Found."} 
                body={ courses.length<0? "Click the button (cross) above to add a new course.":
                  "Any private courses is only visible to you. Select the course, add all lessons then PUBLISH, make it publicly visible."} />
              </Box>
              <List dense sx={{width: '100%', px: {xs: 1, sm:5}, [`.${listItemClasses.root}`]: { px: {xs:0, sm: 3}},
                [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
              {courses.map((course, i) => {
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
                              {course.name}
                            </Typography>
                          } 
                          secondaryTypographyProps={{component: 'div'}}
                          secondary={
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Box sx={{overflow: "hidden", textOverflow: "ellipsis",textAlign: 'justify', p:1}}>
                                    <Typography variant="body1" sx={{ mb: 2, maxHeight: {xs: 150,  md: 200}}}>{course.description}</Typography>
                                </Box>
                                <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="h5" sx={{color: 'primary.main'}}>
                                    {course.currency + course.price}
                                  </Typography>
                                  <Typography variant="h6" sx={{color: 'text.primary'}}>/ course</Typography>
                                </Box>
                                <Box component='span' 
                                  sx={{margin: '7px 10px 0 10px', alignItems: 'center', color: 'text.disabled', display: 'inline-flex',
                                      '& > svg': {
                                        mr: 10,
                                        color: course.published? 'secondary.main':'text.disabled'
                                      }
                                  }}>
                                  <VerifiedOutlined/> {course.published?'published':'private'} 
                                </Box>
                              </Box>
                          }/>
                      </Box>
                      <Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <MoreMenuVertButton>
                          <MenuItem sx={{color: "primary.main", transition: transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                            <Link style={{textDecoration:'none', color: 'inherit'}} to={"/teach/course/"+course._id}> 
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

 )
}