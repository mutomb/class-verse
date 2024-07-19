import React, {useState, useEffect, SyntheticEvent}  from 'react'
import {Card, CardHeader, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Dialog, 
  DialogActions, DialogContent, DialogTitle, Link as MuiLink, cardHeaderClasses, Box, DialogContentText, listItemClasses, 
  Accordion, AccordionDetails, AccordionSummary, iconButtonClasses, avatarClasses, listItemTextClasses, accordionSummaryClasses,
  MenuItem, useMediaQuery, FormControl, selectClasses, dialogClasses, svgIconClasses, Grid, Fab, Fade, useScrollTrigger, Container} from '@mui/material'
import {Edit, Group, Info, VerifiedUser, ExpandMore, DonutLarge, Lock, AddBox, ViewList, Approval, Error, Pending, ArtTrack, PublishedWithChanges, VideoFile, Star, StarBorder, Language, Person, Article, MobileFriendly, Grade, Check, QuestionMark, People, PlayArrow, FileDownload, ExpandLess, PlayLesson} from '@mui/icons-material'
import {read, update} from './api-course'
import {read as readSpecialist} from '../users/api-user'
import {enrollmentStats, listEnrolled} from '../enrollment/api-enrollment'
import {Link, Redirect, useHistory} from 'react-router-dom'
import { DeleteCourse, useCourse} from '.'
import { useTheme } from '@mui/material/styles'
import { ChipsArray, MoreMenuVertButton, SelectButton, StyledButton, StyledRating } from '../styled-buttons'
import { StyledBanner, StyledSnackbar } from '../styled-banners'
import { AddToCart } from '../cart'
import { useAuth } from '../auth'
import { LessonsPlayMedia, Media, MediaPlayer } from '../media'
import logo from '../../public/logo.svg'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { MediaSkeleton } from '../skeletons'
import CertificateIcon from "../../public/images/icons/certificate.png"
import cart from '../cart/cart-helper'
import { scroller } from 'react-scroll'
import SpecialistCardItem from '../home/specialist-card-item'
import Enroll from '../enrollment/Enroll'
// import renderHTML from "react-render-html";
import {SnowEditor } from '../forms'

interface ValuesState{
  redirect:Boolean,
  error:String
}
export default function Course({match}){
  const theme = useTheme()
  const history = useHistory()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [stats, setStats] = useState({})
  // const [course, setCourse] = useState({specialist:{}})
  const {course, setCourse} = useCourse()
  const [specialist, setSpecialist] = useState()
  const [values, setValues] = useState<ValuesState>({
      redirect: false,
      error: ''
    })
  const [open, setOpen] = useState<boolean>(false)
  const [sectionExpanded, setSectionExpanded] = React.useState<string | false>(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [enrollments, setEnrollments] = useState([])
  const {isAuthenticated} = useAuth()
  const [playMedia, setPlayMedia] = useState({media: '', relatedMedia: []})
  const [loading, setLoading] = useState(false)
  const trigger = useScrollTrigger();
  const [expandObjectives, setExpandObjectives] = useState(false)
  const [expandDescription, setExpandDescription] = useState(false)
  const [expandRequirements, setExpandRequirements] = useState(false)
  const [expandAudiences, setExpandAudiences] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    read({courseId: match.params.courseId}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
        setLoading(false)
      } else {
        setCourse(data)
        setLoading(false)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(isAuthenticated().user){
    setLoading(true)
    enrollmentStats({courseId: match.params.courseId}, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
        setLoading(false)
      } else {
        setStats(data)
        setLoading(false)
      }
    })
    }
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(isAuthenticated().user){
      setLoading(true)
      listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
          if (data && data.error) {
            setValues({...values, error: data.error})
            setLoading(false)
          } else {
            setEnrollments(data)
            setLoading(false)
          }
      })
    }
    return function cleanup(){
        abortController.abort()
    }
  }, [])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    course && course.specialist && readSpecialist({
      userId: course.specialist._id
    }, {
      token: isAuthenticated().token
    }, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
        setLoading(false)
      } else {
        setSpecialist(data)
        setLoading(false)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [course])

  const removeCourse = () => {
    setValues({...values, redirect:true})
  }
  // const addLesson = (course) => {
  //   setCourse(course)
  // }
  const clickPublish = () => {
    if(course.lessons && course.lessons.length > 0){    
      setOpen(true)
    }
  }

  const publish = () => {
    let courseData = new FormData()
    courseData.append('published', true)
    courseData.append('status', 'Pending approval')
    update({
        courseId: match.params.courseId
      }, {
        token: isAuthenticated().token
      }, courseData).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
          setCourse({...course, ...data})
          setOpen(false)
        }
    })
  }
  const updateStatus = (event)=> {
    let courseData = new FormData()
    if(!['Not published', 'Pending approval', 'Approved', 'Not approved'].includes(event.target.value)){
      return setValues({...values, error: 'New status was not validated. Try again.'})
    } 
    courseData.append('status', event.target.value)
    switch (event.target.value) {
      case 'Not published':
        courseData.append('published', false)
        break;
      case 'Pending approval':
        courseData.append('published', true)
        break;
      case 'Approved':
        courseData.append('published', true)
        break; 
      case 'Not approved':
        courseData.append('published', false)
        break;     
      default:
        setValues({...values, error: 'New status was not validated. Try again.'})
        break;
    }
      
    update({
        courseId: match.params.courseId
      }, {
        token: isAuthenticated().token
      }, courseData).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
          setCourse({...course, ...data})
        }
    })
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };
  const handleChangeSection = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setSectionExpanded(isExpanded ? panel : false);
    !isExpanded && setExpanded(false)
};
  const isEnrolled = (course) => {
    return enrollments.find((enrollment)=>{return enrollment.course._id === course._id})
  }
  const isSpecialist = (course) =>{
    return (isAuthenticated().user && isAuthenticated().user._id === course.specialist._id)
  }

  const format = (seconds) => {
    const date = new Date(seconds *1000)
    const hh = date.getUTCHours()
    let mm = date.getUTCMinutes()
    const ss = ('0' + date.getUTCSeconds()).slice(-2)
    if (hh) {
      mm = ('0' + date.getUTCMinutes()).slice(-2)
      return `${hh}:${mm}:${ss}`
    }
    return `${mm}:${ss}`
  }
  const getAction = (course) =>{
    if((isAuthenticated().user && isAuthenticated().user.specialist)) return <></>
    if(isEnrolled(course)) return (
      <Link style={{textDecorationLine:'none'}}  to={`/client/${isEnrolled(course)._id}`}>
        <IconButton id='cart-action-button' aria-label={`course-${course.title}`} color="primary" 
          sx={{
              zIndex: 10,
              transform: 'unset',
              color: isEnrolled(course).completed? "primary.main": 'secondary.main',
              '&:hover':{
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                boxShadow: 2,
                transform: 'translateY(-3px) scale(1.1)',
                transition: theme.transitions.create(['transform'], {duration: 500})
          }}}>
          <DonutLarge />
        </IconButton>
      </Link>
    )
    // return <AddToCart item={course}/>
    if(isAuthenticated().user) return <Enroll courseId={course._id}/>
  }
  const getStatus = (course) =>{
    if(course && course.status){
      switch (course.status) {
        case 'Not published':
          return (
            <StyledBanner variant='info' heading={course.status} body={"The course is not yet published. Make sure all lessons are added (by clicking Add Lesson/cross button below) and ready for publishing."} icon={<Info />}/>
          )
        case 'Pending approval':
          return (
            <StyledBanner variant='info' heading={course.status} body={"We are reviewing your course and it is not yet available to world. We should update this status within 24 hours. Should the status not change within 24 hours, please contact support for assistance."} icon={<Pending />}/>
          )
        case 'Approved':
          return (
            <StyledBanner variant='success' heading={course.status} body={"Course is available to the world. Its content can be updated but it cannot be removed without special permission from support. To delete it, please contact support."} icon={<Approval />}/>
          )
        case 'Not approved':
          return (
          <StyledBanner variant='error' heading={course.status} body={"Course content was not approved and therefore not allowed to be published. Please validate and fix the content according to our terms and conditions. Should the issue persist, please contact support for assistance."} icon={<Error />}/>
          )
        default:
          return (
          <StyledBanner variant='error' heading={'Error'} body={"Course status could not be retrieved. Please refesh the page. Should the issue persist please contact support for assistance."} icon={<Error />}/>
          )
      }
    }
  }

  const showPlaylist = (media) =>{
    setPlayMedia({...playMedia, media: media, 
      relatedMedia: course.lessons.map((lesson)=> lesson.media).filter((item)=> item._id !== media._id)})
  }
  const hidePlaylist = () =>{
    setPlayMedia({...playMedia, media: '', relatedMedia: []})
  }
  const toCheckOut = () => {
    cart.addItem(course)
    history.push("/cart")
  }
  
  useEffect(() => {
    scroller.scrollTo('course', {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -50
    })
    
  }, [])
  if (values.redirect) {
    return (<Redirect to={'/specialist/courses'}/>)
  }
  if(loading){
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
      <MediaSkeleton />
    </WallPaperYGW>)
  }

    const imageUrl = (course && course._id)? `/api/courses/photo/${course._id}?${new Date().getTime()}` : '/api/courses/defaultphoto'
    return (
      <WallPaperYGW variant='radial' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
      style={{
        minHeight: '100vh',
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
      }} overlayStyle={{bgcolor: theme.palette.mode === 'dark'? 'rgba(0,0,0,0.9)': 'rgba(255,255,255,0.9)',}}>
        {!loading && course._id &&
        (<Card id='course' sx={{px: {xs: 0, sm: 2, md: 4}, py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center',
        [`& .${cardHeaderClasses.content}`]:{width: '100%', flex: {xs: 1, md: 0.7}},
        [`& .${cardHeaderClasses.root}`]:{px: 0},
        [`& .${cardHeaderClasses.title}`]:{ color: 'text.primary', textAlign: {xs: 'center', md: 'center'}}, 
        [`& .${cardHeaderClasses.subheader}`]:{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'},
        [`& .${cardHeaderClasses.action}`]:{flex: {xs: 1, md: 0.3}, width: '100%'}
        }}>
          <CardHeader id="course-description"
            sx={{display: 'flex', flexDirection: {xs:'column', md: 'row'}, justifyContent: 'center', alignItems: 'center', width: '100%', boxShadow: 2, borderRadius: {xs: 2, sm: 4}, 
                '&:hover': { [`& .${iconButtonClasses.root}`]: {transitions: theme.transitions.create(['box-shadow','color']), boxShadow: 2, backgroundColor: 'primary.main', color: 'primary.contrastText'}}
                }}
            title={
              <Typography component='h1' variant='h1' sx={{width: '100%', textAlign: 'start', fontSize: { xs: 30, md: 48 }, color: 'text.primary'}}>
                    {course.title}
              </Typography>
            }
            subheader={
                <Box component='span' sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Typography variant='body2' sx={{textAlign: 'start', py: {xs: 1, sm: 2, md: 4}, width: '100%', color: 'text.primary', fontSize: {xs: '1rem', sm: '1.2rem', md: '1.5rem'}}}>
                      {course.subtitle}
                    </Typography>
                    <Typography variant='subtitle1' sx={{color: 'text.primary', display: 'flex', alignItems: 'center'}}>
                      <Person sx={{mr: 1, color: 'primary.main', width: '1rem', height: '1rem'}} />
                      <Link to={"/user/"+course.specialist._id} style={{textDecoration: 'none'}}>
                        <MuiLink  underline="hover" variant='subtitle1' component='span' sx={{display: 'inline-block', color: 'primary.main',  my: 1, mx: 0}}>
                          {course.specialist.name}
                        </MuiLink>     
                      </Link>
                    </Typography>
                    <Box component='span' sx={{width: '100%', display: 'flex', flexDirection:{xs: 'column', sm: 'row'}, alignItems: {xs: 'flex-start', sm: 'center'}, justifyContent: {xs: 'center', sm: 'flex-start'}, flexWrap: 'wrap'}}>
                        {course.rating &&
                        (<Box sx={{width: '100%', display: 'flex', alignItems: {xs: 'center', sm: 'center'}, justifyContent: {xs: 'center', sm: 'flex-start'}, flexWrap: 'wrap'}}>
                          <Typography variant='subtitle1' sx={{color: 'text.primary', mr: 1}}>
                            ({course.rating.avg_rating})
                          </Typography>
                          <StyledRating readOnly={true}
                            icon={<Star fontSize="inherit" sx={{color: 'secondary.main', mr: 1, width: '1rem', height: '1rem'}}/>} 
                            emptyIcon={<StarBorder fontSize="inherit" sx={{color: 'secondary.main', mr: 1, width: '1rem', height: '1rem'}}/>} 
                            defaultValue={0} value={course.rating.avg_rating} max={5} 
                          />
                          <Typography variant='subtitle1' sx={{color: 'text.primary'}}>
                            ({course.rating.count} ratings)
                          </Typography>
                        </Box>)}
                      <Box component='span' sx={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: {xs: 'flex-start', sm: 'center'}, justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                        <Link to={"/user/"+course.specialist._id} style={{textDecoration: 'none', marginRight: '8px' }}>
                            <MuiLink variant='subtitle1' component='span' underline='none'
                              sx={{backgroundColor: 'rgba(18, 124, 113, 0.7)', textAlign: 'center', display: 'inline-block', 
                                color: 'primary.contrastText',  my: 1, mx: 0, px: 1, borderRadius: 1}}>
                              {course.category}
                            </MuiLink>     
                        </Link>
                        <Typography variant='subtitle1' sx={{color: 'text.primary', display: 'flex', alignItems: 'center', bgColor: 'primary.light'}}>
                          <Grade sx={{mr: 1, color: 'primary.main', width: '1rem', height: '1rem'}} /> {course.level} Level
                        </Typography>
                      </Box>
                      <Box component='span' sx={{width: '100%', display: 'flex', flexDirection:{ xs: 'column', sm: 'row'}, alignItems: {xs: 'flex-start', sm: 'center'}, justifyContent: {xs: 'center', sm: 'flex-start'}, flexWrap: 'wrap'}}>
                        <Typography variant='subtitle1' sx={{color: 'text.primary', display: 'flex', alignItems: 'center', mr: 1}}>
                          <Language sx={{width: '1rem', height: '1rem', color: 'primary.main'}}/> Presented in {course.language} 
                        </Typography>
                        <Typography variant='subtitle1' sx={{color: 'text.primary', display: 'flex', alignItems: 'center'}} noWrap>
                          <PublishedWithChanges sx={{width: '1rem', height: '1rem', color: 'primary.main'}}/> Updated on {new Date(course.updated? course.updated: course.created).toDateString()} 
                        </Typography>
                      </Box>
                    </Box>
                    <ChipsArray chipData={course.programming_languages? course.programming_languages.map((pl, index)=>({key: index, label:pl})):[]} style={{justifyContent: 'flex-start' }}/>
                    <ChipsArray chipData={course.technologies? course.technologies.map((technology, index)=>({key: index, label:technology})):[]} style={{justifyContent: 'flex-start'}}/>
                </Box>}
            action={
                  <Box sx={{width: '100%', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', justifyContent: {xs: 'center', md: 'flex-end'}}}>
                    {isSpecialist(course) && !course.published && 
                      (<Box sx={{flex: 1, textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                          {course.lessons.length > 0 && isAuthenticated().user && isAuthenticated().user.stripe_seller &&
                          (<StyledButton color="secondary" variant="outlined" onClick={clickPublish}> Publish </StyledButton>)}
                          <StyledButton color="secondary" variant="outlined" onClick={clickPublish}> Publish </StyledButton>
                          {getStatus(course)}
                      </Box>)  
                    }
                    {isSpecialist(course) && course.published && 
                    (<Box sx={{flex: 1, textAlign: 'center', width:'100%'}}>
                        {getStatus(course)}
                        {course.status === 'Approved' &&
                        (<>
                        <Box component='span' sx={{color: 'text.secondary'}}>
                          <Group sx={{color: stats.totalEnrolled>0? 'primary.main': 'text.secondary', width: '1rem', height: '1rem'}} /> {stats.totalEnrolled} enrolled 
                        </Box>
                        <Box component='span'sx={{color: 'text.secondary'}}>
                          <VerifiedUser sx={{color: stats.totalCompleted>0? 'primary.main': 'text.secondary', width: '1rem', height: '1rem'}}/> {stats.totalCompleted} completed 
                        </Box>
                        </>)}
                    </Box>)}
                    {isAuthenticated().user && isAuthenticated().user.role === 'admin' && course.status &&
                    (
                      <FormControl
                        aria-label="status"
                        sx={{
                          minWidth: 80, maxWidth: 200,
                          borderTopRightRadius: 3,
                          borderBottomRightRadius: 3,
                          borderTopLeftRadius: {xs: 3, md: 0},
                          borderBottomLeftRadius: {xs: 3, md: 0},
                          my: {xs: 2, md: 0},
                          mr: { xs: 0, md: 0 },
                          [`& .${selectClasses.icon}`]: {color: 'primary.contrastText'}
                        }}>
                        <SelectButton options={['Not published', 'Pending approval', 'Approved', 'Not approved']} value={course.status} handleChange={updateStatus} label='Status' 
                        styles={{
                          borderTopRightRadius: 3,
                          borderBottomRightRadius: 3,
                          borderTopLeftRadius: {xs: 3, md: 0},
                          borderBottomLeftRadius: {xs: 3, md: 0},
                          bgcolor: course.status === 'Approved'?'primary.dark': course.status === 'Not approved'? 'error.main': course.status === 'Not published'? 'text.disabled': 'secondary.dark'
                        }}
                        />
                      </FormControl>
                    )
                    }
                    {isSpecialist(course) &&
                    (<Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                      <MoreMenuVertButton>
                        <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                          <Link to={"/specialist/course/edit/" + course._id} style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                            <Box aria-label="Edit" color="inherit" 
                            sx={{
                                zIndex: 10,
                                transform: 'unset',
                                '&:hover':{
                                  boxShadow: 2,
                                  transform: 'translateY(-3px) scale(1.1)',
                                  transition: theme.transitions.create(['transform'], {duration: 500})
                                }}}>
                              <Edit sx={{verticalAlign: 'text-top'}}/> Edit Course
                            </Box>
                          </Link>
                        </MenuItem>
                        {course.status!== 'Approved' && <DeleteCourse course={course} onRemove={removeCourse} />}
                      </MoreMenuVertButton>
                    </Box>)}
                  </Box>}
          />
          <Container maxWidth={false} sx={{boxShadow: 2, borderRadius: {xs: 2, sm: 4}, px: {xs: 0, md: 2}, py: {xs: 1, sm: 2, md: 4}}}>
            <Box id="course-cover-and-description" 
              sx={{ width: '100%', display:'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'center', alignContent: 'center', mb: 5,
                '&:hover': {[`& .${iconButtonClasses.root}#cart-action-button`]: { color: 'primary.contrastText', backgroundColor: (isEnrolled(course) && !isEnrolled(course).completed)? 'secondary.main': 'primary.main'}}
              }}>
              <Box sx={{flex:1 }}>
              {(course && course.media)? (<MediaPlayer srcUrl={`/api/media/video/${course.media._id}`} coverImageUrl={imageUrl==='/api/courses/defaultphoto'? undefined: imageUrl}/>):
              (<Box sx={{flex:1, position: 'relative', mx: 'auto', width: '100%', height: {xs: 300, md: 400}, boxShadow: 2, borderRadius: {xs: 2, sm: 4},
                    '&:hover': {
                      boxShadow: 2,
                      [`& .${svgIconClasses.root}`]: {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        boxShadow: 2,
                        transition: theme.transitions.create(['background-color', 'color', 'box-shadow'], {duration: 500})
                      },
                    } 
                  }}>
                <Box sx={{ overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                  <Box component='img' src={imageUrl} sx={{width: 'auto', height: {xs: 300, md: 400}, borderRadius: {xs: 2, sm: 4}}} />
                </Box>
                <Box id="course-image-overlay" 
                    sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', 
                        backgroundColor: 'rgba(0,0,0,0)', borderRadius: {xs: 2, sm: 4},
                  }}>
                  <PlayArrow sx={{color:'rgba(18,124,113,0.7)', bgcolor: 'rgba(255,255,255, 0.7)', borderRadius: '50%', width: {xs: 80, sm: 100, md: 200}, height: {xs: 80, sm: 100, md: 200}, boxShadow: 4}}/>
                  <Typography component='h2' variant='h2' sx={{textAlign: 'center', color: 'primary.contrastText', bgcolor:'rgba(18,124,113,0.7)', fontSize: {xs: '1rem', sm: '1.2rem', md: '1.5rem'}}}>
                    Preview not available
                  </Typography>
                </Box>
              </Box>)}
              </Box>
              <Box sx={{px: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant="body1" sx={{witdh:'100%', textAlign: 'justify', color: 'text.secondary'}}>
                    {expandDescription?
                    (<>
                      { course.description}{course.description && course.description.substring(xsMobileView? 250: 500).length>0 && <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setExpandDescription(false)}} underline="hover" sx={{ml: 1, color: 'primary.main', cursor: 'pointer'}}>Hide</MuiLink>}
                    </>):
                    (<>
                    {course.description && course.description.substring(0, xsMobileView? 250: 500)}{course.description && course.description.substring(xsMobileView? 250: 500).length>0 && <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setExpandDescription(true)}} underline="hover" sx={{ml: 1, color: 'primary.main', cursor: 'pointer'}}>Read more</MuiLink>}
                    </>)}
                </Typography>
                {course.published && course.status === 'Approved' && getAction(course)}
              </Box>
            </Box>
            <Box sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <Typography component='h1' variant='h1' sx={{ color: 'primary.main', fontSize: { xs: 30, md: 48 }}}>
                ${course.price}
              </Typography>
              <Typography variant='body2' sx={{color: 'text.primary', fontSize: {xs: '1rem', sm: '1.2rem', md: '1.5rem'}}}>
                /Course
              </Typography>
            </Box>
            <Grid id='objectives' container spacing={2}>
              {course.lessons && course.lessons.length>0 && 
              (<>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Typography component='h2' variant='h2' sx={{ py: {xs: 2, sm: 4}, color: 'secondary.main'}}>
                  Objectives
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Grid container spacing={2} sx={{position: 'relative', boxShadow: 2, borderRadius: {xs: 2, md: 4}, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}}}>
                {expandObjectives?
                (<>
                {course.lessons.map((lesson, index)=>{
                if(lesson && lesson.aim){
                  return (
                  <Grid key={index} item xs={12} sm={6} md={4} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1}}>
                      <Check sx={{color:'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/>
                      <Typography variant="subtitle1" align="left">
                        {lesson.aim}
                      </Typography>
                    </Box>
                  </Grid>)
                }
                })}
                {course.lessons && course.lessons.length>3 && 
                (<Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandLess/>} onClick={()=>{setExpandObjectives(false)}}>Show Less</StyledButton>
                </Grid>)}
                </>):
                (<>
                {course.lessons && course.lessons.slice(0, course.lessons.length>3? 3: course.lessons.length).map((lesson, index)=>{
                if(lesson && lesson.aim){
                  return (
                  <Grid key={index} item xs={12} sm={6} md={4} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1}}>
                      <Check sx={{color:'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}}/>
                      <Typography variant="subtitle1" align="left">
                        {lesson.aim}
                      </Typography>
                    </Box>
                  </Grid>)
                }
                })}
                {course.lessons && course.lessons.length>3 && 
                (
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 40}}>
                  <Box sx={{position: 'absolute', width: '100%', borderRadius: {xs: 2, md: 4}, ml: -2,   bottom: 0, minHeight: '100%', background: theme.palette.mode === 'dark'?'linear-gradient(rgba(34, 33, 40, 0.1) 0%, rgba(34, 33, 40, 1) 90%, rgba(34, 33, 40, 1) 100%)':'linear-gradient(rgba(245, 245, 245, 0.1) 0%, rgba(245, 245, 245, 1) 90%, rgba(245, 245, 245, 1) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent:'center'}}>
                    <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandMore/>} onClick={()=>{setExpandObjectives(true)}}>Show More</StyledButton>
                  </Box>
                </Grid>)}
                </>)}
                </Grid>
              </Grid>
              </>)}
            </Grid>
            <Grid id='course-includes' container spacing={2}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Typography component='h2' variant='h2' sx={{ py: {xs: 2, sm: 4}, color: 'secondary.main'}}>
                  This Course includes
                </Typography>
              </Grid>
              {course.lessons && course.sections &&
              (<Grid item xs={12} sm={6} md={3} sx={{display: 'flex', alignItems: 'center', pl: {xs: 0, sm: 'inherit'}, py: {xs: 1, sm: 2}, boxShadow: 2, borderRadius: {xs: 2, sm: 4}}}>
                <PlayLesson  sx={{mr: 1, color: 'primary.main', width: '1rem', height: '1rem'}}/> 
                {course.sections.length} sections with {course.lessons.length} lessons ({course.lessons.reduce((value, lesson)=>{ if(!lesson.free) return 0+value; return 1+value }, 0)} free)  
              </Grid>)}
              <Grid item xs={12} sm={6} md={3} sx={{display: 'flex', alignItems: 'center', pl: {xs: 0, sm: 'inherit'}, py: {xs: 1, sm: 2}, boxShadow: 2, borderRadius: {xs: 2, sm: 4}}}>
                <VideoFile sx={{mr: 1, color: 'primary.main', width: '1rem', height: '1rem'}}/> 
                {course.lessons && course.lessons.reduce((value, lesson)=>{ 
                      if(!lesson.media) return 0+value
                      return 1+value
                }, 0)} high-quality videos
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: 'flex', alignItems: 'center', pl: {xs: 0, sm: 'inherit'}, py: {xs: 1, sm: 2}, boxShadow: 2, borderRadius: {xs: 2, sm: 4}}}>
                <Article sx={{mr: 1, color: 'primary.main', width: '1rem', height: '1rem'}}/>
                {course.lessons && course.lessons.reduce((value, lesson)=>{ 
                      if(!lesson.article) return 0+value
                      return 1+value
                }, 0)} articles
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: 'flex', alignItems: 'center', pl: {xs: 0, sm: 'inherit'}, py: {xs: 1, sm: 2}, boxShadow: 2, borderRadius: {xs: 2, sm: 4}}}>
                <MobileFriendly sx={{mr: 1, color: 'primary.main', width: '1rem', height: '1rem'}}/> Mobile, Laptop and TV compatible
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: 'flex', alignItems: 'center', pl: {xs: 0, sm: 'inherit'}, py: {xs: 1, sm: 2}, boxShadow: 2, borderRadius: {xs: 2, sm: 4}}}>
                <Box sx={{mr: 1, backgroundColor: 'unset', borderRadius: '50%', height: {xs: 30, md: 36}, width: {xs: 30, md: 36}, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'primary.contrastText','& svg': { fontSize: {xs: 24, md: 30}, }}}>
                  <Box component='img' src={CertificateIcon} alt="Certificate icon" sx={{width: '1rem', height: '1rem'}} /> 
                </Box>
                Certificate of completion
              </Grid>
            </Grid>
            <Typography component='h2' variant='h2' sx={{display: 'flex', alignItems: 'center', textAlign: {xs: 'center', sm: 'start'}, py: 4, color: 'secondary.main'}}>
                Course Content
            </Typography>
            <Box id="lessons"
              sx={{boxShadow: 2, borderRadius: {xs: 2, sm: 4}, px: {xs: 0, sm:2}, py: 1.5, width: {xs: '100%', md: '90%'}, mx: 'auto', bgcolor:'background.default'}}>
              <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Box sx={{  width: '100%', display: 'flex', flexDirection: {xs: 'column', md:'row'}, alignItems: 'center', textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                  <Typography variant="h3" component="h3" 
                  sx={{ flex: {xs: 1, md: 'unset'}, textAlign: 'center', mb: 1, fontSize: { xs: '1rem', sm: '1.5rem', color: 'text.primary'}}}>
                    Lessons
                  </Typography>
                  <Box sx={{flex: 1, display: 'flex', flexDirection: {xs: 'column', md:'row'}, justifyContent: 'center'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                      <Box sx={{margin: '10px', display: 'flex', fontWeight: 600}}>
                        {course.sections && (
                        <Avatar sx={{boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, color: 'primary.contrastText', bgcolor: 'rgba(0,0,0,1)', borderRadius: '50%', width:{xs: 25, sm: 30}, height:{xs: 25, sm: 30}, fontSize: {xs: '0.7rem', sm: '1rem'}, mr: 1, verticalAlign: 'center'}}>
                        {course.sections.length}
                        </Avatar>)} sections
                      </Box>
                      <Divider component='span' sx={{display: {xs: 'none', md: 'flex'}, height: 28, m: 0.5,}} orientation="vertical" />
                      <Box sx={{margin: '10px', display: 'flex', fontWeight: 600}}>
                        {course.lessons && (
                        <Avatar sx={{boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, color: 'primary.contrastText', bgcolor: 'rgba(0,0,0,1)', borderRadius: '50%', width:{xs: 25, sm: 30}, height:{xs: 25, sm: 30}, fontSize: {xs: '0.7rem', sm: '1rem'}, mr: 1, verticalAlign: 'center'}}>
                        {course.lessons && course.lessons.length}
                        </Avatar>)} lessons
                      </Box>
                      <Divider component='span' sx={{display: {xs: 'none', md: 'flex'}, height: 28, m: 0.5,}} orientation="vertical" />
                    </Box>
                    <Box sx={{margin: '10px', display: 'flex', fontWeight: 600}}>
                      {course.lessons && format(course.lessons.reduce((value, lesson)=>{ 
                        if(!lesson.media) return 0+value
                        return lesson.media.duration+value
                      }, 0))
                      } total video length
                    </Box>
                  </Box>
                  <Box sx={{alignSelf: {xs: 'center', md: 'flex-end'}, display: 'flex', justifyContent: 'center'}}>
                    {isSpecialist(course) && course.status !=='Approved' &&
                    (<Link style={{textDecoration:'none'}} to={`/specialist/course/${course._id}/lesson/new`}>
                      <StyledButton type='button' disableHoverEffect={false} variant="contained" color='primary'>
                        <AddBox sx={{verticalAlign: 'text-top'}}/> Add Lesson
                      </StyledButton>
                    </Link>)
                      // (<NewLesson courseId={course._id} addLesson={addLesson}/>)
                    }
                  </Box>
                </Box>
                {!playMedia.media?(
                <List dense sx={{width: '100%', px: {xs: 0, sm: 2, md:4}, [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
                {course.sections && course.sections.map((section, sectionIndex) => {
                  let lastIndex = [0]
                  return(
                  <Accordion  key={sectionIndex} expanded={sectionExpanded === sectionIndex} onChange={handleChangeSection(sectionIndex)}  sx={{ p:0, bgcolor: 'background.paper', borderRadius: 3, ':hover':{boxShadow: 2}}} slotProps={{ transition: { unmountOnExit: true } }}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1bh-content"
                      id="panel-header"
                      sx={{ [`& .${listItemTextClasses.root}`]: { color: 'text.primary'}, '&:hover':{[`& .${avatarClasses.root}`]: { boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, color: 'primary.contrastText', bgcolor: 'rgba(0,0,0,1)', borderRadius: '50%',}, 
                      [`& .${listItemTextClasses.root}`]: { color: 'primary.main'}, [`& .${accordionSummaryClasses.expandIconWrapper}`]: { color: 'primary.main'}, [`& .${svgIconClasses.root}`]: { color: 'primary.main'}},
                      px: '0px !important'
                      }}>
                      <ListItem sx={{display: 'flex', px: {xs:0, sm: 1, md: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'}}>
                        <ListItemAvatar sx={{display: 'flex', flexDirection: {xs: 'row', sm: 'column'}}}>
                            <Avatar sx={{borderRadius: '50%', width:{xs: 30, sm: 40}, height:{xs: 30, sm: 40}}}>
                            {sectionIndex+1}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}}}
                            primary={
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                              {<Typography variant="inherit">{section}</Typography>}                              
                            </Box>}
                        />
                      </ListItem>
                    </AccordionSummary>
                    <AccordionDetails sx={{p: {xs: '0px !important', md: 2}}}>
                    {course.lessons && course.lessons.map((lesson, index) => {
                      if(lesson.section === section){
                        lastIndex.push(lastIndex[lastIndex.length-1]+1)
                        return(
                          <Accordion  key={index} expanded={expanded === index} onChange={handleChange(index)} slotProps={{ transition: { unmountOnExit: true } }}
                            sx={{ p:0, bgcolor: 'background.paper', borderRadius: 3, ':hover':{boxShadow: 2}}}
                            disabled={(isEnrolled(course) || isSpecialist(course)  || lesson.free)? false: true}>
                            <AccordionSummary
                              expandIcon={(isEnrolled(course) || isSpecialist(course) || lesson.free)? <ExpandMore /> : <Lock />}
                              aria-controls="panel1bh-content"
                              id="panel-header"
                              sx={{ [`& .${listItemTextClasses.root}`]: { color: 'text.primary'}, '&:hover':{[`& .${avatarClasses.root}`]: { boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, color: 'primary.contrastText', bgcolor: 'rgba(0,0,0,1)', borderRadius: '50%'}, 
                              [`& .${listItemTextClasses.root}`]: { color: 'primary.main'}, [`& .${accordionSummaryClasses.expandIconWrapper}`]: { color: 'primary.main'}, [`& .${svgIconClasses.root}`]: { color: 'primary.main'}},
                              px: {xs: 1, md: 2}
                              }}>
                              <ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'}}>
                                <ListItemAvatar sx={{display: 'flex', flexDirection: {xs: 'row', sm: 'column'}}}>
                                    <Avatar sx={{borderRadius: '50%', width:{xs: 30, sm: 40}, height:{xs: 30, sm: 40}}}>
                                    {sectionIndex+1}.{lastIndex[lastIndex.length-1]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}}}
                                    primary={
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                                      {<Typography variant="inherit">{lesson.title}</Typography>}
                                      {lesson.media && lesson.media.duration && 
                                      (<Box component='span' 
                                        sx={{
                                          margin: '7px 10px 0 10px',
                                          alignItems: 'center',
                                          color: '#616161',
                                          display: 'inline-flex',
                                          '& > svg': {
                                            mr: 1,
                                            color: '#b6ab9a'
                                          }
                                      }}>
                                        <VideoFile sx={{width: '1rem', height: '1rem'}} /> {format(lesson.media.duration)}
                                      </Box>)}
                                      {lesson.article &&
                                      (<Box component='span' 
                                        sx={{
                                          margin: '7px 10px 0 10px',
                                          alignItems: 'center',
                                          color: '#616161',
                                          display: 'inline-flex',
                                          '& > svg': {
                                            mr: 1,
                                            color: '#b6ab9a'
                                          }
                                      }}>
                                        <Article sx={{width: '1rem', height: '1rem'}}/> 1 article
                                      </Box>)}
                                      
                                    </Box>}
                                />
                              </ListItem>
                            </AccordionSummary>
                            <AccordionDetails sx={{p: {xs: '0px !important', md: 2}}}>
                              <ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'}}>
                                <SnowEditor readOnly={true} modules={{ toolbar: []}} value={lesson.content} onChange={()=>{}}
                                  sx={{
                                    ['& .ql-editor.ql-blank']: {
                                      bgcolor: 'background.paper', height: {xs: '100vh', sm: '90vh', md: '80vh'},
                                    },
                                    ['& .ql-editor']: {
                                      bgcolor: 'background.paper', height: {xs: '100vh', sm: '90vh', md: '80vh'},
                                    },
                                  }}/>
                              </ListItem>
                              {lesson.article &&
                              (<ListItem component='a' href={'/api/article/file/'+lesson.article._id} sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', color: 'primary.main', '&:hover':{textDecorationLine: 'underline'}}}>
                                <Typography component="h3" variant="body1" sx={{fontSize: {xs:'0.8rem', sm: '1rem', md:'1.2rem'}, display: 'flex', alignItems: 'center'}}>
                                  <FileDownload
                                  sx={{color:'primary.main', verticalAlign: 'text-top', display: {xs: 'none', sm: 'inline-block'}}}/> 
                                  Article 
                                </Typography>
                              </ListItem>)}
                              {lesson.media && 
                              (<ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'
                                ,'&:hover': {
                                  [`& #pl`]: {
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                  },
                                },
                              }}>
                                {(isEnrolled(course) || isSpecialist(course)) && 
                                (<IconButton id='pl' aria-label='playlist' color="primary" 
                                  onClick={()=>showPlaylist(lesson.media)}
                                  sx={{
                                      zIndex: 10,
                                      transform: 'unset',
                                      '&:hover':{
                                        boxShadow: 2,
                                        transform: 'translateY(-3px) scale(1.1)',
                                        transition: theme.transitions.create(['transform'], {duration: 500})
                                  }}}>
                                    <ArtTrack sx={{width: {xs: 16, sm: 24}, height: 'auto'}}/>
                                </IconButton>)}
                                <Media media={lesson.media} courseId={course._id}/>
                              </ListItem>)}
                            </AccordionDetails>
                          </Accordion>)
                      }else{
                        lastIndex.push(0)
                      }
                    })}
                    </AccordionDetails>
                  </Accordion>
                  )
                })}
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
                            transform: 'translateY(-3px) scale(1.1)',
                            transition: theme.transitions.create(['transform'], {duration: 500})
                      }}}>
                        <ViewList/>
                    </IconButton>
                  </Box>
                  <LessonsPlayMedia courseId={course._id} showPlaylist={showPlaylist} data={playMedia.media} relatedData={playMedia.relatedMedia}/>
                </>)}
              </Box>
            </Box>
            <Grid id='requirements' container spacing={2}>
            {course.requirements && course.requirements.length>0 && 
             (<>
             <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Typography component='h2' variant='h2' sx={{ py: {xs: 2, sm: 4}, color: 'secondary.main'}}>
                  Requirements
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Box component='ul' sx={{ position: 'relative', m: 0, p: 0, listStyle: 'none', position: 'relative', boxShadow: 2, borderRadius: {xs: 2, md: 4}, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}}}>
                {expandRequirements?
                (<>
                {course.requirements && course.requirements.map((requirement, index) => (
                  <Box key={index} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1}}>
                    <QuestionMark sx={{color:'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}} />
                    <Typography component="li" variant="subtitle1" align="left">
                      {requirement}
                    </Typography>
                  </Box>
                ))}
                {course.requirements && course.requirements.length>3 && 
                (<Box component='li' xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandLess/>} onClick={()=>{setExpandRequirements(false)}}>Show Less</StyledButton>
                </Box>)}
                </>):
                (<>
                {course.requirements && course.requirements.slice(0, course.requirements.length>3? 3: course.requirements.length).map((requirement, index)=>(
                  <Box key={index} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1}}>
                    <QuestionMark sx={{color:'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}} />
                    <Typography component="li" variant="subtitle1" align="left">
                      {requirement}
                    </Typography>
                  </Box>
                ))}
                {course.requirements && course.requirements.length>3 && 
                (<Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 40}}>
                  <Box sx={{position: 'absolute', width: '100%', borderRadius: {xs: 2, md: 4}, bottom: 0, minHeight: '100%', background: theme.palette.mode === 'dark'?'linear-gradient(rgba(34, 33, 40, 0.1) 0%, rgba(34, 33, 40, 1) 90%, rgba(34, 33, 40, 1) 100%)':'linear-gradient(rgba(245, 245, 245, 0.1) 0%, rgba(245, 245, 245, 1) 90%, rgba(245, 245, 245, 1) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent:'center'}}>
                    <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandMore/>} onClick={()=>{setExpandRequirements(true)}}>Show More</StyledButton>
                  </Box>
                </Grid>)}
                  </>)}
                </Box>
              </Grid>
              </>)}
            </Grid>
            <Grid id='who' container spacing={2}>
            {course.audiences && course.audiences.length>0 &&  
              (<>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Typography component='h2' variant='h2' sx={{ py: {xs: 2, sm: 4}, color: 'secondary.main'}}>
                  Who is this course for
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Box component='ul' sx={{ position: 'relative', m: 0, p: 0, listStyle: 'none', position: 'relative', boxShadow: 2, borderRadius: {xs: 2, md: 4}, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}}}>
                {expandAudiences?
                (<>
                {course.audiences && course.audiences.map((audience, index) => (
                  <Box key={index} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1}}>
                    <People sx={{color:'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}} />
                    <Typography component="li" variant="subtitle1" align="left">
                      {audience}
                    </Typography>
                  </Box>
                ))}
                {course.audiences && course.audiences.length>3 && 
                (<Box component='li' xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                  <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandLess/>} onClick={()=>{setExpandAudiences(false)}}>Show Less</StyledButton>
                </Box>)}
                </>):
                (<>
                {course.audiences && course.audiences.slice(0, course.audiences.length>3? 3: course.audiences.length).map((audience, index) => (
                  <Box key={index} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1}}>
                    <People sx={{color:'primary.main', verticalAlign: 'text-top', width: '1rem', height: '1rem'}} />
                    <Typography component="li" variant="subtitle1" align="left">
                      {audience}
                    </Typography>
                  </Box>
                ))}
                {course.audiences && course.audiences.length>3 && 
                (<Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 40}}>
                  <Box sx={{position: 'absolute', width: '100%', borderRadius: {xs: 2, md: 4}, bottom: 0, minHeight: '100%', background: theme.palette.mode === 'dark'?'linear-gradient(rgba(34, 33, 40, 0.1) 0%, rgba(34, 33, 40, 1) 90%, rgba(34, 33, 40, 1) 100%)':'linear-gradient(rgba(245, 245, 245, 0.1) 0%, rgba(245, 245, 245, 1) 90%, rgba(245, 245, 245, 1) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent:'center'}}>
                    <StyledButton style={{border: 'none !important'}} color='secondary' variant='outlined' endIcon={<ExpandMore/>} onClick={()=>{setExpandAudiences(true)}}>Show More</StyledButton>
                  </Box>
                </Grid>)}
                </>)}
                </Box>
              </Grid>
              </>)}
            </Grid>
            <Grid id='specialist' container spacing={2}>
              <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent:{xs: 'center', sm: 'flex-start'}, textAlign: 'start', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
                <Typography component='h2' variant='h2' sx={{ pt: {xs: 2, sm: 4}, color: 'secondary.main'}}>
                  Specialist
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              {specialist && (<SpecialistCardItem item={specialist} />)}
              </Grid>
            </Grid>
          </Container>
          {!(isSpecialist(course) || (isAuthenticated().user && isAuthenticated().user.specialist) || isEnrolled(course)) &&
          (<Fade in={trigger}>
            <Box role="presentation" sx={{width: '100%', position: 'fixed', bottom: 5, zIndex: 1099 }} >
              <Box onClick={toCheckOut}  sx={{width: '100%'}}>
                <Fab size="medium" aria-label="buy course button" variant='extended' 
                  sx={{
                    width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color:'primary.contrastText', 
                    borderRadius:1,
                    border:'1px solid',
                    borderColor:'primary.contrastText',
                    textTransform: 'initial',
                    ':hover':{
                      backgroundColor:'rgba(255, 175, 53, 0.8)',
                      transition: theme.transitions.create(['transform'], {duration: 500}),
                      transform: 'translateY(-3px) scale(1.01)',
                    }
                    }}>
                  <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: {xs: 'column', sm: 'row'}}}>
                    <Box sx={{width: '100%', textAlign: 'start', display: 'flex', flex: {xs: 1, sm: 0.7}, flexDirection:'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                      <Typography component='h6' variant='h5' sx={{width: '100%', textOverflow: 'ellipsis', color:'primary.contrastText',  fontSize: {xs: '1rem', sm: '1.2rem', md: '1.5rem'}}} noWrap>
                        {course.title}
                      </Typography>
                      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Box component='span' sx={{color: 'secondary.main', display: 'flex', alignItems: 'center',}}>
                          {course.rating &&
                          (<Box sx={{width: '100%', display: 'flex', alignItems: {xs: 'center', sm: 'center'}, justifyContent: {xs: 'center', sm: 'flex-start'}, flexWrap: 'wrap'}}>
                            <Typography variant='subtitle1' sx={{color: 'secondary.main', mr: 1}}>
                              ({course.rating.avg_rating})
                            </Typography>
                            <StyledRating readOnly={true}
                              icon={<Star fontSize="inherit" sx={{color: 'secondary.main', mr: 1, width: '1rem', height: '1rem'}}/>} 
                              emptyIcon={<StarBorder fontSize="inherit" sx={{color: 'secondary.main', mr: 1, width: '1rem', height: '1rem'}}/>} 
                              defaultValue={0} value={course.rating.avg_rating} max={1} 
                            />
                            <Typography variant='subtitle1' sx={{color: 'primary.contrastText'}}>
                              ({course.rating.count} ratings)
                            </Typography>
                          </Box>)}
                        </Box>
                      </Box>
                      <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Box component='span' sx={{color: 'primary.contrastText', display: 'flex', alignItems: 'center'}}>
                          <Group sx={{color: 'primary.contrastText', width: '1rem', height: '1rem' }} /> {stats.totalEnrolled} enrolled 
                        </Box>
                        <Box component='span'sx={{color: 'primary.contrastText', display: 'flex', alignItems: 'center'}}>
                          <VerifiedUser sx={{color: 'primary.contrastText', width: '1rem', height: '1rem'}}/> {stats.totalCompleted} completed 
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{width: '100%', display: {xs: 'none', sm: 'flex'}, flex: {xs: 1, sm: 0.3}, alignItems: 'center', justifyContent: 'flex-end'}}>
                      <Typography component='h2' variant='h2' sx={{ color: 'primary.contrastText', fontSize: {xs: '1rem', sm: '1.2rem', md: '1.5rem'}, mr: 1}}>
                        ${course.price}
                      </Typography>
                        <StyledButton color='primary' variant='contained'>
                          Buy now
                        </StyledButton>
                    </Box>
                    <Box sx={{width: '100%', display: {xs: 'flex', sm: 'none'}, flex: {xs: 1, sm: 0.3}, alignItems: 'center', justifyContent:'center'}}>
                        <StyledButton color='primary' variant='contained'>
                          ${course.price} Buy now
                        </StyledButton>
                    </Box>
                  </Box>
                </Fab>
              </Box>
            </Box>
          </Fade>)}
        </Card>)}
        <Dialog PaperComponent={Box} transitionDuration={1000} open={open}  onClose={handleClose} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, borderRadius: 4, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: theme.palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
          <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
            <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42}, color: 'text.primary' }}>
                Publish Course
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center'}}>
            <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 }, color: 'text.primary' }}>
              Publishing your course will make it visible to clients, who will be able to buy them. 
            </DialogContentText>
            <Typography variant="body1" sx={{color: 'primary.main'}}>
              Therefore, make sure all the course content has been added correctly and ready for publishing (hint: check lesson order, quality and spelling). 
            </Typography>
            <Typography variant="body1" sx={{color: 'secondary.main'}}>
              You will NOT be allowed to add/remove/re-order lessons after publishing the course. 
            </Typography>
            <Typography variant="body1" sx={{color: 'error.main'}}>
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
                mx: {xs: '0px !important', sm: '8px !important'},
                my: {xs: 1, sm: 0},
                width: {xs: '90%', sm: 'initial'},
                display: 'flex',
                justifyContent: 'center'
              }
          }}>
              <StyledButton disableHoverEffect={false} variant="contained" onClick={handleClose}>
                Cancel
              </StyledButton>
              <StyledButton disableHoverEffect={false} variant="outlined" onClick={publish}>
                Publish
              </StyledButton>
          </DialogActions>
        </Dialog>
        <StyledSnackbar
          open={values.error? true: false}
          duration={3000}
          handleClose={()=>setValues({...values, error: ''})}
          icon={<Error/>}
          heading={"Error"}
          body={values.error}
          variant='error'
          />
    </WallPaperYGW>)
}
