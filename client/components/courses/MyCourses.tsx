import React, {useState, useEffect} from 'react'
import {List, ListItemAvatar, ListItemText, Avatar, Typography, Box, useMediaQuery, 
  ListItem, IconButton, listItemClasses,
  MenuItem,
  Zoom,
  iconButtonClasses,
  Divider} from '@mui/material'
import {useAuth} from '../auth'
import {listBySpecialist} from './api-course'
import {Redirect, Link, useHistory} from 'react-router-dom'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { AddBox, Info, VerifiedOutlined, ReadMore, Error} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { StyledBanner, StyledSnackbar } from '../styled-banners'
import { ListSkeleton } from '../skeletons'
import { read } from '../users/api-user'

export default function MyCourses(){
  const {isAuthenticated} = useAuth()
  const [courses, setCourses] = useState([])
  const [user, setUser] = useState()
  const [error, setError] = useState('')
  const [redirectToSignin, setRedirectToSignin] = useState<Boolean>(false)
  const { breakpoints, transitions } = useTheme()
  const xsMobileView = useMediaQuery(breakpoints.down('sm'))
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    if(isAuthenticated().user){
      listBySpecialist({
        userId: isAuthenticated().user && isAuthenticated().user._id 
      }, {token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
          return data
        } else {
          setCourses(data)
          return data
        }
      }).then((data)=>{
        if(data && data.error){
          setError(data.error)
          setLoading(false)
        }else{
          read({
            userId: isAuthenticated().user && isAuthenticated().user._id 
          }, {token: isAuthenticated().token}, signal).then((data) => {
            if (data && data.error) {
              setError(data.error)
              setLoading(false)
            } else {
              setUser(data)
              setLoading(false)
            }
          })
        }
      })
    }
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  const handleAddCourse = () =>{
    if(user && (user.resume_status==='approved' || user.qualification_status==='approved')){
      return history.push("/specialist/course/new")
   }
    if(user && (user.resume_status==='none' && user.qualification_status==='none')){
      return setError('Please first upload your Resume/Qualification on your Profile page.')
    }
    if(user && (user.resume_status==='pending' && user.qualification_status==='none')){
      return setError('Your Resume is still under review. Please check again later. We will also notify via email.')
    }
    if(user && (user.resume_status==='none' && user.qualification_status==='pending')){
      return setError('Your Qualification is still under review. Please check again later. We will also notify via email.')
    }
    if(user && (user.resume_status==='rejected' || user.qualification_status==='rejected')){
      return setError('Your Resume/Qualification was not approved. The reason for this was sent to your email address. Please check your mailbox, or alternatively contact support via our ChatBot or email.')
    }
    return setError('Unable to add a course. Please contact support via ChatBot or email.')
  }

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
                  <StyledButton onClick={handleAddCourse} disableHoverEffect={false} variant="contained" color='primary' startIcon={<AddBox/>}>
                    { xsMobileView? '': 'Add Course'} 
                  </StyledButton>
                </Box>
              </Box>
              {loading?(<ListSkeleton />):
              (<>
              <Box sx={{  width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'text.disabled',
              textAlign: {xs: 'start', md: 'center'}, bgcolor: 'background.default', borderRadius: 3}}>
                <StyledBanner icon={<Info/>} heading={courses?.length>0?  <><Typography variant="h6" sx={{display: 'inline-flex', color: 'text.secondary', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, mb: 1}}>Private</Typography> <VerifiedOutlined sx={{color: 'text.disabled'}}/> <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" /> Published <VerifiedOutlined sx={{color: 'secondary.main'}}/> </>:" Courses Not Found."} 
                body={ courses.length<0? "Click the button (cross) above to add a new course.":
                  "Any private courses is only visible to you. Select the course, add all lessons then PUBLISH to make it publicly visible."} />
              </Box>
              <List dense sx={{width: '100%', px: {xs:0, md:5}, [`.${listItemClasses.root}`]: { px: {xs:1, md: 3}},
                [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
              {courses.map((course, i) => {
                  return(
                  <Zoom key={i} timeout={1000} id="zoom-course" appear={true} in={true} color='inherit' unmountOnExit={true}>
                    <ListItem sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center',
                                   my: {xs:1, sm:2}, borderRadius: 3, bgcolor: 'background.paper', '&:hover': { boxShadow: 2, [`& .${iconButtonClasses.root}`]: {transitions: (theme)=> theme.transitions.create(['box-shadow','color']), boxShadow: 2, backgroundColor: 'primary.main', color: 'primary.contrastText'}} }}>
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
                            <Typography component="h2" variant="h2" sx={{ mb: 2, maxHeight: 40, width: '90%', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1.4rem', fontWeight: 600, color: 'text.primary' }} noWrap>
                              {course.title}
                            </Typography>
                          } 
                          secondaryTypographyProps={{component: 'div'}}
                          secondary={
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Box sx={{textAlign: 'justify', p:1, maxHeight: {xs: 150,  md: 200}}}>
                                    <Typography variant="body1" sx={{width: '100%', mb: 2}}>
                                      {course.description && course.description.substring(0,250)}{course.description && course.description.substring(250).length>0 && '...'}
                                    </Typography>
                                </Box>
                                <Box sx={{py: {xs: 2, md: 4}, display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="h5" sx={{color: 'primary.main'}}>
                                    {course.currency +" "+ course.price}
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
                      <Box sx={{width: {xs: '100%', sm: 'unset'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <MoreMenuVertButton>
                          <MenuItem sx={{color: "primary.main", transition: transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
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
              </>)}
              <StyledSnackbar
                open={error? true: false}
                duration={5000}
                handleClose={()=> setError('')}
                icon={<Error/>}
                heading={"Not Allowed"}
                body={error}
                variant='error'
                />
            </Box>
          </Box>

 )
}