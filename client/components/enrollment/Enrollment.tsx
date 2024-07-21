import React, {useState, useEffect, SyntheticEvent}  from 'react'
import {Card, CardHeader, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, 
  Link as MuiLink, cardHeaderClasses, Box, listItemClasses, 
  Accordion, AccordionDetails, AccordionSummary, iconButtonClasses, avatarClasses, listItemTextClasses, accordionSummaryClasses,
  useMediaQuery, svgIconClasses, Grid, Container} from '@mui/material'
import {Group, Info, VerifiedUser, ExpandMore, ViewList, Error, ArtTrack, PublishedWithChanges, VideoFile, Star, StarBorder, Language, Person, Article, MobileFriendly, Grade, Check, QuestionMark, People, PlayArrow, FileDownload, ExpandLess, PlayLesson, CheckOutlined} from '@mui/icons-material'
import {read as readSpecialist} from '../users/api-user'
import {enrollmentStats, read, complete} from './api-enrollment'
import {Link} from 'react-router-dom'
import { useCourse} from '../courses'
import { useTheme } from '@mui/material/styles'
import { ChipsArray, StyledButton, StyledRating } from '../styled-buttons'
import { StyledBanner, StyledSnackbar } from '../styled-banners'
import { useAuth } from '../auth'
import { LessonsPlayMedia, Media, MediaPlayer } from '../media'
import logo from '../../public/logo.svg'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { MediaSkeleton } from '../skeletons'
import CertificateIcon from "../../public/images/icons/certificate.png"
import { scroller } from 'react-scroll'
import SpecialistCardItem from '../home/specialist-card-item'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
// import renderHTML from "react-render-html";
import CircularPercentage from '../progress/CircularPrecentage'
import { SnowEditor } from '../forms'

interface ValuesState{
  error:string
}
export default function Enrollment({match}){
  const [stats, setStats] = useState({})
  const [values, setValues] = useState<ValuesState>({
    error: ''
  })
  const theme = useTheme()
  const {isAuthenticated} = useAuth()
  const [enrollment, setEnrollment] = useState({ course: { specialist: [] }, lessonStatus: [] })
  const [totalComplete, setTotalComplete] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const {course, setCourse} = useCourse()
  const [specialist, setSpecialist] = useState()
  const [sectionExpanded, setSectionExpanded] = React.useState<string | false>(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [playMedia, setPlayMedia] = useState({media: '', relatedMedia: []})
  const [expandObjectives, setExpandObjectives] = useState(false)
  const [expandDescription, setExpandDescription] = useState(false)
  const [expandRequirements, setExpandRequirements] = useState(false)
  const [expandAudiences, setExpandAudiences] = useState(false)
  const imageUrl = enrollment && course && course._id ? `/api/courses/photo/${course._id}?${new Date().getTime()}` : '/api/courses/defaultphoto'

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
};
  const handleChangeSection = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setSectionExpanded(isExpanded ? panel : false);
    !isExpanded && setExpanded(false)
  };
  const totalCompleted = (lessons) => {
    let count = lessons.reduce((total, lessonStatus) => { return total + (lessonStatus.complete ? 1 : 0) }, 0)
    setTotalComplete(count)
    return count
  }
  const markComplete = (index) => {
    if (!enrollment.lessonStatus[index].complete) {
      const lessonStatus = enrollment.lessonStatus
      lessonStatus[index].complete = true
      let count = totalCompleted(lessonStatus)

      let updatedData = {}
      updatedData.lessonStatusId = lessonStatus[index]._id
      updatedData.complete = true

      if (count == lessonStatus.length) {
        updatedData.courseCompleted = Date.now()
      }

      complete({
        enrollmentId: match && match.params && match.params.enrollmentId
      }, {
        token: isAuthenticated().token
      }, updatedData).then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error })
        } else {
          setEnrollment({ ...enrollment, lessonStatus: lessonStatus })
          count !== lessonStatus.length? 
          setSuccess('Your progress has been saved. Move on to the next lesson.'):
          setSuccess("You have completed all the lessons! I hope you enjoyed the course and don't forget to rate it.")
        }
      })
    }
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

  const showPlaylist = (media) =>{
    setPlayMedia({...playMedia, media: media, 
      relatedMedia: course.lessons.map((lesson)=> lesson.media).filter((item)=> item._id !== media._id)})
  }
  const hidePlaylist = () =>{
    setPlayMedia({...playMedia, media: '', relatedMedia: []})
  }
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if (!isAuthenticated().user) return function cleanup() { }
    setLoading(true)
    read({ enrollmentId: match && match.params && match.params.enrollmentId }, { token: isAuthenticated().token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
        setLoading(false)
      } else {
        totalCompleted(data.lessonStatus)
        setEnrollment(data)
        setCourse(data.course)
        setLoading(false)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.enrollmentId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if ((!isAuthenticated().user) || !enrollment || !course || !course._id) return function cleanup() { }
    setLoading(true)
    enrollmentStats({ courseId: course._id }, { token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
        setLoading(false)
      } else {
        setStats(data)
        setLoading(false)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [enrollment])

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

  useEffect(() => {
    scroller.scrollTo('enrollment', {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -50
    })
    
  }, [])
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
        {!loading && enrollment && course && course._id &&
        (<Card id='enrollment' sx={{px: {xs: 0, sm: 2, md: 4}, py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center',
        [`& .${cardHeaderClasses.content}`]:{width: '100%', flex: {xs: 1, md: 0.7}},
        [`& .${cardHeaderClasses.root}`]:{px: 0},
        [`& .${cardHeaderClasses.title}`]:{ color: 'text.primary', textAlign: {xs: 'center', md: 'center'}}, 
        [`& .${cardHeaderClasses.subheader}`]:{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'},
        [`& .${cardHeaderClasses.action}`]:{flex: {xs: 1, md: 0.3}, width: '100%'}
        }}>
          <CardHeader id="enrollment-description"
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
                  <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: {xs: 'center', md: 'flex-end'}}}>
                    <Box sx={{ textAlign: 'center', width:'100%'}}>
                        <Box component='span' sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', mr:1}}>
                          <Group sx={{color: stats.totalEnrolled>0? 'primary.main': 'text.secondary', width: '1rem', height: '1rem'}} /> {stats.totalEnrolled} enrolled 
                        </Box>
                        <Box component='span'sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary'}}>
                          <VerifiedUser sx={{color: stats.totalCompleted>0? 'primary.main': 'text.secondary', width: '1rem', height: '1rem'}}/> {stats.totalCompleted} completed 
                        </Box>
                    </Box>
                    <Divider sx={{my: 0.5}}/>
                    <Box sx={{ textAlign: 'center', width:'100%'}}>
                      {enrollment && enrollment.lessonStatus && enrollment.lessonStatus && 
                      (<CircularPercentage
                        percentage={parseInt(`${totalComplete/enrollment.lessonStatus.length*100}`)} 
                        heading={
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, mb: 1, color: 'inherit'}}>
                          Your Progress
                        </Typography>}
                      />)}
                    </Box>
                  </Box>}
          />
          <Container maxWidth={false} sx={{boxShadow: 2, borderRadius: {xs: 2, sm: 4}, px: {xs: 0, md: 2}, py: {xs: 1, sm: 2, md: 4}}}>
            <Box id="course-cover-and-description" 
              sx={{ width: '100%', display:'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'center', alignContent: 'center', mb: 5 }}>
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
                  <Box sx={{alignSelf: {xs: 'center', md: 'flex-end'}, display: 'flex', justifyContent: 'center', fontWeight: 600}}>
                    <Typography sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', '& > span': { color: 'primary.main', fontWeight: 600 } }}>
                      <Avatar sx={{mr: 1, boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, color: 'primary.contrastText', bgcolor: 'rgba(0,0,0,1)', borderRadius: '50%', width:{xs: 25, sm: 30}, height:{xs: 25, sm: 30}, fontSize: {xs: '0.7rem', sm: '1rem'}, verticalAlign: 'center'}}>
                        {totalComplete}
                      </Avatar>out of
                      <Avatar sx={{mx: 1, boxShadow: 2, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, color: 'primary.contrastText', bgcolor: 'rgba(0,0,0,1)', borderRadius: '50%', width:{xs: 25, sm: 30}, height:{xs: 25, sm: 30}, fontSize: {xs: '0.7rem', sm: '1rem'}, verticalAlign: 'center'}}>
                        {enrollment.lessonStatus.length}
                      </Avatar>
                      completed
                    </Typography>
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
                    {enrollment._id && course.lessons && course.lessons.map((lesson, index) => {
                      if(lesson.section === section){
                        lastIndex.push(lastIndex[lastIndex.length-1]+1)
                        return(
                          <Accordion  key={index} expanded={expanded === index} onChange={handleChange(index)} slotProps={{ transition: { unmountOnExit: true } }}
                            sx={{ p:0, bgcolor: 'background.paper', borderRadius: 3, ':hover':{boxShadow: 2}}}>
                            <AccordionSummary
                              expandIcon={<ExpandMore />}
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
                                <ListItemAvatar>
                                  {enrollment.lessonStatus[index].complete ? <CheckCircle sx={{ color: 'primary.main' }} /> : <RadioButtonUnchecked />}
                                </ListItemAvatar>
                              </ListItem>
                            </AccordionSummary>
                            <AccordionDetails sx={{p: {xs: '0px !important', md: 2}}}>
                              <CardHeader id="lesson-header"  sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                action={<Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                                  <Box sx={{ flex: 1, textAlign: 'center', width: '100%' }}>
                                    <Box component='span'
                                      sx={{
                                        margin: '7px 10px 0 10px',
                                        alignItems: 'center',
                                        color: '#616161',
                                        display: 'inline-flex',
                                        '& > svg': {
                                          mr: 2,
                                          color: '#b6ab9a'
                                        },
                                      }}>
                                      {enrollment.lessonStatus[index].complete ? (<><VerifiedUser /> {stats.totalCompleted} "completed"</>) : (<StyledButton variant='outlined' color='secondary' onClick={()=>markComplete(index)}> Mark As Completed </StyledButton>)}
                                    </Box>
                                  </Box>
                                </Box>}
                              />
                              <ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center'}}>
                                {/* <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}, textAlign: 'center'}}
                                    primary={renderHTML(lesson.content)}
                                /> */}
                                <SnowEditor readOnly={true} value={lesson.content}
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
                                <IconButton id='pl' aria-label='playlist' color="primary" 
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
                                </IconButton>
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
                <Box component='ul' sx={{ position: 'relative', m: 0, p: 0, listStyle: 'none', boxShadow: 2, borderRadius: {xs: 2, md: 4}, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}}}>
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
                (<Box component='li' sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
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
                <Box component='ul' sx={{ position: 'relative', m: 0, p: 0, listStyle: 'none', boxShadow: 2, borderRadius: {xs: 2, md: 4}, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}}}>
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
                (<Box component='li' sx={{display: 'flex', alignItems: 'center', justifyContent:'center', pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
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
        </Card>)}
        <StyledSnackbar
          open={values.error? true: false}
          duration={3000}
          handleClose={()=>setValues({...values, error: ''})}
          icon={<Error/>}
          heading={"Error"}
          body={values.error}
          variant='error'
          />
        <StyledSnackbar
          open={success? true: false}
          duration={3000}
          handleClose={()=>setSuccess('')}
          icon={<CheckOutlined/>}
          heading={"Well Done!"}
          body={success}
          variant='success'
          />
    </WallPaperYGW>)
}
