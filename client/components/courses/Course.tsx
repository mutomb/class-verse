import React, {useState, useEffect, SyntheticEvent}  from 'react'
import {Card, CardHeader, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Dialog, 
  DialogActions, DialogContent, DialogTitle, Link as MuiLink, cardHeaderClasses, Box, DialogContentText, listItemClasses, 
  Accordion, AccordionDetails, AccordionSummary, iconButtonClasses, avatarClasses, listItemTextClasses, accordionSummaryClasses,
  MenuItem, useMediaQuery} from '@mui/material'
import {Edit, Group, Info, VerifiedUser, ExpandMore, DonutLarge, Lock, AddBox, PlaylistPlay, ViewList} from '@mui/icons-material'
import {read, update} from './api-course'
import {enrollmentStats, listEnrolled} from '../enrollment/api-enrollment'
import {Link, Redirect} from 'react-router-dom'
import { DeleteCourse} from '.'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { StyledBanner } from '../styled-banners'
import { AddToCart } from '../cart'
import { useAuth } from '../auth'
import { LessonsPlayMedia, Media } from '../media'
import logo from '../../public/logo.svg'
import { WallPaperYGW } from '../wallpapers/wallpapers'

interface ValuesState{
  redirect:Boolean,
  error:String
}
export default function Course({match}){
  const theme = useTheme()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [stats, setStats] = useState({})
  const [course, setCourse] = useState({teacher:{}})
  const [values, setValues] = useState<ValuesState>({
      redirect: false,
      error: ''
    })
  const [open, setOpen] = useState<boolean>(false)
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [enrollments, setEnrollments] = useState([])
  const {isAuthenticated} = useAuth()
  const [playMedia, setPlayMedia] = useState({media: '', relatedMedia: []})

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({courseId: match.params.courseId}, signal).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setCourse(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    enrollmentStats({courseId: match.params.courseId}, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setStats(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
  useEffect(() => {
    if (!isAuthenticated().user) return function cleanup(){}
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
        console.log(data.error)
        } else {
        setEnrollments(data)
        }
    })
    return function cleanup(){
        abortController.abort()
    }
  }, [])
  const removeCourse = () => {
    setValues({...values, redirect:true})
  }
  const addLesson = (course) => {
    setCourse(course)
  }
  const clickPublish = () => {
    if(course.lessons.length > 0){    
      setOpen(true)
    }
  }

  const publish = () => {
    let courseData = new FormData()
      courseData.append('published', true)
      update({
          courseId: match.params.courseId
        }, {
          token: isAuthenticated().token
        }, courseData).then((data) => {
          if (data && data.error) {
            setValues({...values, error: data.error})
          } else {
            setCourse({...course, published: true})
            setOpen(false)
          }
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };
  const isEnrolled = (course) => {
    return enrollments.find((enrollment)=>{return enrollment.course._id === course._id})
  }
  const isTeacher = (course) =>{
    return (isAuthenticated().user && isAuthenticated().user._id === course.teacher._id)
  }

  const getAction = (course) =>{
    if(isTeacher(course) || (isAuthenticated().user && isAuthenticated().user.teacher)) return <></>
    if(isEnrolled(course) && isEnrolled(course).completed) return (
      <Link style={{textDecorationLine:'none'}}  to={`/learn/${isEnrolled(course)._id}`}>
        <IconButton aria-label={`course-${course.name}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:"primary.main",
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                boxShadow: 2,
                transform: 'translateY(-3px)',
                transition: theme.transitions.create(['transform'])
          }}}>
          <VerifiedUser />
        </IconButton>
      </Link>
    )
    if(isEnrolled(course) && !isEnrolled(course).completed) return (
      <Link style={{textDecorationLine:'none'}}  to={`/learn/${isEnrolled(course)._id}`}>
        <IconButton aria-label={`course-${course.name}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:"secondary.main",
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'secondary.main',
                boxShadow: 2,
                transform: 'translateY(-3px)',
                transition: theme.transitions.create(['transform'])
          }}}>
          <DonutLarge />
        </IconButton>
      </Link>
    )
    return <AddToCart item={course}/>
  }
  const showPlaylist = (media) =>{
    setPlayMedia({...playMedia, media: media, 
      relatedMedia: course.lessons.map((lesson)=> lesson.media).filter((item)=> item._id !== media._id)})
  }
  const hidePlaylist = () =>{
    setPlayMedia({...playMedia, media: '', relatedMedia: []})
  }

  if (values.redirect) {
    return (<Redirect to={'/teach/courses'}/>)
  }

    const imageUrl = course._id? `/api/courses/photo/${course._id}?${new Date().getTime()}` : '/api/courses/defaultphoto'
    return (
      <WallPaperYGW variant='radial' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
      style={{
        minHeight: '100vh',
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          left: {xs: 'unset', md: '50%'},
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
        <Card sx={{px: {xs: 0, sm:2}, py: 1.5, display: 'flex', 
        flexDirection: 'column', alignItems: 'center', backgroundColor: 'unset',
        [`& .${cardHeaderClasses.content}`]:{flex: 1},
        [`& .${cardHeaderClasses.title}`]:{ color: 'text.primary', fontSize: { xs: '1.5rem', sm: '2.5rem' }, textAlign: {xs: 'center', md: 'center'}}, 
        [`& .${cardHeaderClasses.subheader}`]:{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'},
        [`& .${cardHeaderClasses.action}`]:{flex: 1, width: '100%'}
        }}>
          <CardHeader id="course-description"
            sx={{display: 'flex', flexDirection: {xs:'column', md: 'row'}, justifyContent: 'center', alignItems: 'center', width: '100%'}}
            title={course.name}
            subheader={<>
                  <Link to={"/user/"+course.teacher._id} style={{textDecoration: 'none'}}>
                      <MuiLink  underline="hover" variant='subtitle1' component='span' 
                      sx={{display: 'inline-block', color: 'primary',  my: 1, mx: 0}}>
                        By {course.teacher.name}
                      </MuiLink>     
                  </Link>
                  <Link to={"/user/"+course.teacher._id} style={{textDecoration: 'none' }}>
                      <MuiLink variant='subtitle1' component='span' underline='none'
                        sx={{backgroundColor: 'primary.dark', textAlign: 'center', display: 'inline-block', 
                          color: 'primary.contrastText',  my: 1, mx: 0, px: 1, borderRadius: 1}}>
                        {course.category}
                      </MuiLink>     
                  </Link>
                </>}
            action={
                  <Box sx={{width: '100%', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', justifyContent: {xs: 'center', md: 'flex-end'}}}>
                    {isTeacher(course) && !course.published && 
                      (<Box sx={{flex: 1, textAlign: 'center', width: '100%'}}>
                          {course.lessons.length > 0 ?
                            <StyledButton color="secondary" variant="outlined" onClick={clickPublish}> Publish </StyledButton> 
                          : <StyledBanner heading={'Pending lessons'} icon={<Info />}
                                          body={"The course is not yet publicized. Make sure all lessons are added and ready for publishing. Click add (cross) button below to a lesson."}/>
                          }
                      </Box>)
                        
                    }
                    {course.published && (<Box sx={{flex: 1, textAlign: 'center', width:'100%'}}>
                    {isTeacher(course) && (<StyledBanner heading={'Published'} body={"Course is available to the world. Content can be updated but Lessons cannot be added/removed."} icon={<Info />}/>)}
                        <Box component='span' 
                            sx={{
                              margin: '7px 10px 0 10px',
                              alignItems: 'center',
                              color: '#616161',
                              display: 'inline-flex',
                              '& > svg': {
                                mr: 2,
                                color: '#b6ab9a'
                              }
                        }}>
                          <Group /> {stats.totalEnrolled} enrolled 
                        </Box>
                        <Box component='span' 
                          sx={{
                              margin: '7px 10px 0 10px',
                              alignItems: 'center',
                              color: '#616161',
                              display: 'inline-flex',
                              '& > svg': {
                                mr: 2,
                                color: '#b6ab9a'
                              }
                        }}>
                          <VerifiedUser/> {stats.totalCompleted} completed 
                        </Box>
                      </Box>)}
                      {isTeacher(course) &&
                    (<Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                      <MoreMenuVertButton>
                        <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                          <Link to={"/teach/course/edit/" + course._id} style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                            <Box aria-label="Edit" color="inherit" 
                            sx={{
                                zIndex: 10,
                                transform: 'unset',
                                '&:hover':{
                                  boxShadow: 2,
                                  transform: 'translateY(-3px)',
                                  transition: theme.transitions.create(['transform'])
                                }}}>
                              <Edit sx={{verticalAlign: 'text-top'}}/> Edit Course
                            </Box>
                          </Link>
                        </MenuItem>
                        <DeleteCourse course={course} onRemove={removeCourse} />
                      </MoreMenuVertButton>
                    </Box>)}
                  </Box>}
          />
          <Box id="course-cover-and-description" 
            sx={{borderRadius: 4, display:'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'center', alignContent: 'center', mb: 5,
              '&:hover': {[`& .${iconButtonClasses.root}`]: { color: 'primary.contrastText', backgroundColor: (isEnrolled(course) && !isEnrolled(course).completed)? 'secondary.main': 'primary.main', boxShadow: 2}}
            }}>
            <Box sx={{ flex:1, overflow: 'hidden', borderRadius: 4, width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
              <Box component='img' src={imageUrl} sx={{width: 'auto', height: 300, borderRadius: 4}} alt={'Course ' + course.name + ' cover'} />
            </Box>
            <Box sx={{px: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant="body1" sx={{witdh:'100%', textAlign: 'justify', color: 'text.secondary'}}>
                  {course.description}
              </Typography>
              {course.published && getAction(course)} 
            </Box>
          </Box>
          <Divider/>
          <Box id="lessons"
            sx={{ px: {xs: 0, sm:2}, py: 1.5, width: {xs: '100%', md: '90%'}, mx: 'auto', borderRadius: 4, bgcolor:'background.default'}}>
            <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Box sx={{  width: '100%', display: 'flex', flexDirection: {xs: 'column', md:'row'}, alignItems: 'center', textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                <Typography variant="h3" component="h3" 
                sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1rem', sm: '1.5rem', color: 'text.primary'}}}>
                  Lessons
                </Typography>
                <Box sx={{margin: '10px', display: 'flex', fontWeight: 600}}>{course.lessons && (<Avatar sx={{borderRadius: '50%', width:{xs: 20, sm: 25}, height:{xs: 20, sm: 25}, mr: 1, verticalAlign: 'center'}}>{course.lessons.length}</Avatar>)} lessons</Box>
                <Box sx={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                  {isTeacher(course) && !course.published &&
                  (<Link style={{textDecoration:'none'}} to={`/teach/course/${course._id}/lesson/new`}>
                    <StyledButton type='button' disableHoverEffect={false} variant="contained" color='primary'>
                      <AddBox sx={{verticalAlign: 'text-top'}}/>{ xsMobileView? '': 'Add Lesson'}
                    </StyledButton>
                  </Link>)
                    // (<NewLesson courseId={course._id} addLesson={addLesson}/>)
                  }
                </Box>
              </Box>
              {!playMedia.media?(<List dense sx={{width: '100%', px: {xs: 1, sm:5}, [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
              {course.lessons && course.lessons.map((lesson, index) => {
                  return(
                  <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)} slotProps={{ transition: { unmountOnExit: true } }}
                    sx={{ p:0, bgcolor: 'background.paper', borderRadius: 3, ':hover':{boxShadow: 2}}}
                    disabled={(isEnrolled(course) || isTeacher(course))? false: true}>
                    <AccordionSummary
                      expandIcon={(isEnrolled(course) || isTeacher(course))? <ExpandMore /> : <Lock />}
                      aria-controls="panel1bh-content"
                      id="panel-header"
                      sx={{ [`& .${listItemTextClasses.root}`]: { color: 'text.primary'}, '&:hover':{[`& .${avatarClasses.root}`]: { backgroundColor: 'primary.main', color: 'primary.contrastText', boxShadow: 2}, 
                      [`& .${listItemTextClasses.root}`]: { color: 'primary.main'}, [`& .${accordionSummaryClasses.expandIconWrapper}`]: { color: 'primary.main'}}
                      }}>
                      <ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'}}>
                        <ListItemAvatar sx={{display: 'flex', flexDirection: {xs: 'row', sm: 'column'}}}>
                            <Avatar sx={{borderRadius: '50%', width:{xs: 30, sm: 40}, height:{xs: 30, sm: 40}}}>
                            {index+1}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}}}
                            primary={lesson.title}
                        />
                      </ListItem>
                    </AccordionSummary>
                    <AccordionDetails>
                    <ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'}}>
                      <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}, textAlign: 'center'}}
                          primary={lesson.content}
                          secondary={lesson.resource_url}
                      />
                    </ListItem>
                    {lesson.media && 
                    (<ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'
                        ,'&:hover': {
                          [`& #pl`]: {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                          },
                        },
                      }}>
                        <IconButton id='pl' aria-label='playlist' color="primary" 
                          onClick={()=>showPlaylist(lesson.media)}
                          sx={{
                              zIndex: 10,
                              transform: 'unset',
                              '&:hover':{
                                boxShadow: 2,
                                transform: 'translateY(-3px)',
                                transition: theme.transitions.create(['transform'])
                          }}}>
                            <PlaylistPlay sx={{width: {xs: 16, sm: 24}, height: 'auto'}}/>
                        </IconButton>
                        <Media media={lesson.media} course={course}/>
                      </ListItem>)}

                    </AccordionDetails>
                  </Accordion>)
              }
              )}
              </List>):(<>
                <Box sx={{witdth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' 
                  ,'&:hover': { [`& #pl`]: { backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                }}>
                  <IconButton id='pl' aria-label='playlist' color="primary" 
                    onClick={hidePlaylist}
                    sx={{
                        zIndex: 10,
                        transform: 'unset',
                        '&:hover':{
                          boxShadow: 2,
                          transform: 'translateY(-3px)',
                          transition: theme.transitions.create(['transform'])
                    }}}>
                      <ViewList/>
                  </IconButton>
                </Box>
                <LessonsPlayMedia course={course} showPlaylist={showPlaylist} data={playMedia.media} relatedData={playMedia.relatedMedia}/>
              </>)}
            </Box>
          </Box>
        </Card>
        <Dialog transitionDuration={1000} open={open}  onClose={(event, reason) => {if(reason === 'backdropClick'){handleClose()}}} aria-labelledby="form-dialog-title">
          <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
            <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42}, color: 'text.primary' }}>
                Publish Course
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center'}}>
            <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 }, color: 'text.primary' }}>
              Publishing your course will make it visible to students, who will be able to buy them. 
            </DialogContentText>
            <Typography variant="body1" sx={{color: 'primary.main'}}>
              Therefore, make sure all the course content has been added correctly and ready for publishing (hint: check lesson order, quality and spelling). 
            </Typography>
            <Typography variant="body1" sx={{color: 'secondary.main'}}>
              You will NOT be allowed to add/remove/re-order lessons after publishing the course. 
            </Typography>
            <Typography variant="body1" color='red'>
              If we find inappropriate content in this course, we will remove the entire course!
            </Typography>
          </DialogContent>
          <DialogActions 
          sx={{
              display: 'flex',
              flexDirection: {xs: 'column', sm:'row'},
              alignItems: 'center',
              justifyContent: 'center',
            '& > button':{ 
              mx: {xs: 'unset', sm: 1},
              my: {xs: 1, sm: 'unset'}}
          }}>
              <StyledButton disableHoverEffect={false} variant="contained" onClick={handleClose}>
                Cancel
              </StyledButton>
              <StyledButton disableHoverEffect={false} variant="outlined" onClick={publish}>
                Publish
              </StyledButton>
          </DialogActions>
        </Dialog>
    </WallPaperYGW>)
}
