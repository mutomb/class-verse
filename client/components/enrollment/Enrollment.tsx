import React, { useState, useEffect, SyntheticEvent } from 'react'
import {
  Card, CardHeader, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider,
  Link as MuiLink, cardHeaderClasses, Box, listItemClasses,
  Accordion, AccordionDetails, AccordionSummary, avatarClasses, listItemTextClasses, accordionSummaryClasses
} from '@mui/material'
import { Group, Info, VerifiedUser, ExpandMore, DonutLarge, CheckCircle, RadioButtonUnchecked, Timer } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { read, complete, enrollmentStats } from './api-enrollment'
import { Link } from 'react-router-dom'
import {useAuth} from '../auth'
import { StyledButton } from '../styled-buttons'
import { StyledBanner } from '../styled-banners'
import CircularPercentage from '../progress/CircularPrecentage'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

interface ValuesState {
  error: string,
}
export default function Enrollment({ match }) {
  const [stats, setStats] = useState({})
  const [values, setValues] = useState<ValuesState>({
    error: ''
  })
  const theme = useTheme()
  const {isAuthenticated} = useAuth()
  const [drawer, setDrawer] = useState<{ expanded: string | boolean, position: number }>({ expanded: false, position: 0 })
  const [enrollment, setEnrollment] = useState({ course: { teacher: [] }, lessonStatus: [] })
  const [totalComplete, setTotalComplete] = useState<number>(0)

  const totalCompleted = (lessons) => {
    let count = lessons.reduce((total, lessonStatus) => { return total + (lessonStatus.complete ? 1 : 0) }, 0)
    setTotalComplete(count)
    return count
  }
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if (!isAuthenticated().user) return function cleanup() { }
    read({ enrollmentId: match && match.params && match.params.enrollmentId }, { token: isAuthenticated().token }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        totalCompleted(data.lessonStatus)
        setEnrollment(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.enrollmentId])

  const markComplete = () => {
    if (!enrollment.lessonStatus[drawer.position].complete) {
      const lessonStatus = enrollment.lessonStatus
      lessonStatus[drawer.position].complete = true
      let count = totalCompleted(lessonStatus)

      let updatedData = {}
      updatedData.lessonStatusId = lessonStatus[drawer.position]._id
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
        }
      })
    }
  }

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if ((!isAuthenticated().user) || !enrollment || !enrollment.course || !enrollment.course._id) return function cleanup() { }
    enrollmentStats({ courseId: enrollment.course._id }, { token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setStats(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [enrollment])

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setDrawer(isExpanded ? { ...drawer, expanded: panel, position: eval(panel) } : { ...drawer, expanded: false });
  };

  const getStatusIcon = () => {
    if (enrollment && enrollment.lessonStatus && enrollment.lessonStatus && totalComplete === enrollment.lessonStatus.length){ 
      return (
        <IconButton aria-label={`course-${enrollment._id}-not-completed`} color="primary"
          sx={{ zIndex: 10, transform: 'unset', color: "secondary.main" }}>
          <DonutLarge />
        </IconButton>
      )
    }
    return (<IconButton aria-label={`course-${enrollment._id}-completed`} color="primary"
      sx={{ zIndex: 10, transform: 'unset', color: "primary.main" }}>
      <VerifiedUser />
    </IconButton>)
  }

  const imageUrl = enrollment && enrollment.course && enrollment.course._id ? `/api/courses/photo/${enrollment.course._id}?${new Date().getTime()}` : '/api/courses/defaultphoto'

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
      <Card sx={{
        px: { xs: 0, sm: 2 }, py: 1.5, '&:hover': { boxShadow: 2 }, borderRadius: 4, display: 'flex',
        flexDirection: 'column', alignItems: 'center', bgcolor: 'unset',
        [`& .${cardHeaderClasses.content}`]: { flex: 1 },
        [`& .${cardHeaderClasses.title}`]: { fontSize: { xs: '1.5rem', sm: '2.5rem' }, textAlign: { xs: 'center', md: 'center' } },
        [`& .${cardHeaderClasses.subheader}`]: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
        [`& .${cardHeaderClasses.action}`]: { flex: 1, width: '100%' }
      }}>
        <CardHeader id="course-description"
          sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'center', width: '100%' }}
          title={enrollment && enrollment.course && enrollment.course.name}
          subheader={<>
            <Link to={enrollment && enrollment.course && enrollment.course.teacher && "/user/" + enrollment.course.teacher._id} style={{ textDecoration: 'none' }}>
              <MuiLink underline="hover" variant='subtitle1' component='span'
                sx={{ display: 'inline-block', color: 'primary', my: 1, mx: 0 }}>
                By {enrollment && enrollment.course && enrollment && enrollment.course.teacher && enrollment.course.teacher.name}
              </MuiLink>
            </Link>
            <Link to={enrollment && enrollment.course && enrollment.course.teacher && "/user/" + enrollment.course.teacher._id} style={{ textDecoration: 'none' }}>
              <MuiLink variant='subtitle1' component='span' underline='none'
                sx={{
                  backgroundColor: 'primary.dark', textAlign: 'center', display: 'inline-block',
                  color: 'primary.contrastText', my: 1, mx: 0, px: 1, borderRadius: 1
                }}>
                {enrollment && enrollment.course && enrollment.course.category}
              </MuiLink>
            </Link>
          </>}
          action={<Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Box sx={{ flex: 1, textAlign: 'center', width: '100%' }}>
              <StyledBanner heading={enrollment && enrollment.lessonStatus && totalComplete === enrollment.lessonStatus.length ? 'Completed' : 'Not Completed'} body={enrollment && enrollment.lessonStatus && totalComplete === enrollment.lessonStatus.length ? "Well Done! You completed all lessons in this courses." : "You have not yet completed all lessons in this courses."} icon={<Info />} />
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
                <Group /> {stats && stats.totalEnrolled} enrolled
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
                <VerifiedUser /> {stats && stats.totalCompleted} completed
              </Box>
            </Box>
          </Box>}
        />
        <Box id="course-cover"
          sx={{ borderRadius: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignContent: 'center', mb: 5 }}>
          <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 4, width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <Box component='img' src={imageUrl} sx={{ width: 'auto', height: 300, borderRadius: 4 }} alt={'Course ' + enrollment._id + ' cover'} />
          </Box>
          <Box sx={{ px: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ witdh: '100%', textAlign: 'justify', color: 'text.secondary' }}>
              {enrollment && enrollment.course && enrollment.course.description}
            </Typography>
            {getStatusIcon()}
          </Box>
        </Box>
        {enrollment && enrollment.lessonStatus && enrollment.lessonStatus && (<CircularPercentage percentage={parseInt(`${totalComplete/enrollment.lessonStatus.length*100}`)}/>)}
        <Divider />
        <Box id="lessons"
          sx={{ px: { xs: 0, sm: 2 }, py: 1.5, '&:hover': { boxShadow: 2 }, width: { xs: '100%', md: '80%' }, mx: 'auto', borderRadius: 4, bgcolor: 'background.default' }}>
          <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'center', md: 'space-between' }, alignItems: 'center', borderRadius: 3 }}>
              <Typography variant="h3" component="h3"
                sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1rem', sm: '1.5rem' }, color: 'text.primary' }}>
                Lessons
              </Typography>
              <Typography variant="body1" sx={{ margin: '10px', display: 'flex', fontWeight: 600 }}>{enrollment && enrollment.course && enrollment.course.lessons && (<Avatar sx={{ borderRadius: '50%', width: { xs: 20, sm: 25 }, height: { xs: 20, sm: 25 }, mr: 1, verticalAlign: 'center' }}>{enrollment.course.lessons.length}</Avatar>)} lessons</Typography>
              <Typography sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', '& > span': { color: 'primary.main', fontWeight: 600 } }}>
                <Box component='span' sx={{ mr: 1 }}>{totalComplete}</Box>out of<Box component='span' sx={{ mx: 1 }}>{enrollment.lessonStatus.length}</Box> completed
              </Typography>
            </Box>
            <List dense sx={{ width: '100%', px: { xs: 1, sm: 5 }, [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
              {enrollment && enrollment.lessonStatus && enrollment.lessonStatus.map((lesson, index) => {
                return (
                  <Accordion key={index} expanded={drawer.expanded === String(index)} onChange={handleChange(String(index))}
                    sx={{
                      p: 0, bgcolor: 'background.paper', borderRadius: 3, ':hover': { boxShadow: 2 },
                      '&:hover': { [`& .${avatarClasses.root}`]: { backgroundColor: 'primary.main', color: 'primary.contrastText', boxShadow: 2 }, [`& .${listItemTextClasses.root}`]: { color: 'primary.main' }, [`& .${accordionSummaryClasses.expandIconWrapper}`]: { color: 'primary.main' } }
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1bh-content"
                      id="panel-header"
                    >
                      <ListItem sx={{ display: 'flex', px: { xs: 0, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center' }}>
                        <ListItemAvatar>
                          <Avatar sx={{ borderRadius: '50%', width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}>
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText sx={{ flex: 1, px: { xs: 1, sm: 'unset' } }}
                          primary={enrollment.course.lessons[index].title}
                        />
                        <ListItemAvatar>
                          {lesson.complete ? <CheckCircle sx={{ color: 'primary.main' }} /> : <RadioButtonUnchecked />}
                        </ListItemAvatar>
                      </ListItem>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CardHeader id="lesson-header"
                        sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        title={enrollment.course.lessons[index].title}
                        action={<Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                          <Box sx={{ flex: 1, textAlign: 'center', width: '100%' }}>
                            <StyledBanner heading={enrollment.lessonStatus[drawer.position].complete ? 'Completed' : 'Not Completed'} body={enrollment.lessonStatus[drawer.position].complete ? "Well Done! You completed this lesson." : "You have not yet completed this lesson. Estimated completion time is 1 hour. Pace yourself study as you wish. Track your progress by clicking Mark As Completed."} icon={<Info />} />
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
                              <Timer /> 1 Hour
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
                                },
                              }}>
                              {enrollment.lessonStatus[drawer.position].complete ? (<><VerifiedUser /> {stats.totalCompleted} "completed"</>) : (<StyledButton variant='outlined' color='secondary' onClick={markComplete}> Mark As Completed </StyledButton>)}
                            </Box>
                          </Box>
                        </Box>}
                      />
                      <ListItem sx={{ display: 'flex', px: { xs: 0, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center' }}>
                        <ListItemText sx={{ flex: 1, px: { xs: 1, sm: 'unset' }, textAlign: 'center' }}
                          primary={enrollment.course.lessons[drawer.position].content}
                          secondary={enrollment.course.lessons[drawer.position].resource_url}
                        />
                      </ListItem>
                    </AccordionDetails>
                  </Accordion>
                )
              }
              )}
            </List>
          </Box>
        </Box>
      </Card>
    </WallPaperYGW>
  )
}
