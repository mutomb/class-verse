import React, { useEffect, useState } from 'react'
import {Grid, Box, Zoom, Container, ListItem, ListItemAvatar, Avatar, Typography, ListItemText} from '@mui/material'
import {useHistory} from 'react-router-dom'
import { listEnrolled } from '../../enrollment/api-enrollment';
import { listBySpecialist, list } from '../../courses/api-course';
import { useAuth } from '../../auth';
import { Error, Group } from '@mui/icons-material';
import { StyledSnackbar } from '../../styled-banners';

const ChatCourseList = () => {
    const [courses, setCourses] = useState([])
    const {isAuthenticated} = useAuth()
    const [error, setError] = useState('')
    /** Fetch enrolled in courses */
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        if(isAuthenticated().user && !isAuthenticated().user.specialist){
            listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
                if (data && data.error) {
                    setError(data.error)
                } else {
                    Array.isArray(data) && data.length>0 && setCourses(data.map(enrollment=>enrollment.course))
                }
            })
        }
        if(isAuthenticated().user && isAuthenticated().user.specialist && isAuthenticated().user.role!=='admin'){
            listBySpecialist({
                userId: isAuthenticated().user && isAuthenticated().user._id 
            },{
                token: isAuthenticated().token
            }, signal).then((data) => {
                if (data && data.error) {
                    setError(data.error)
                } else {
                    setCourses(data)
                }
            })
        }     
        if(isAuthenticated().user && isAuthenticated().user.specialist && isAuthenticated().user.role!=='admin'){
            listBySpecialist({
                userId: isAuthenticated().user && isAuthenticated().user._id 
            },{
                token: isAuthenticated().token
            }, signal).then((data) => {
                if (data && data.error) {
                    setError(data.error)
                } else {
                    setCourses(data)
                }
            })
        } 
        if(isAuthenticated().user && isAuthenticated().user.specialist && isAuthenticated().user.role==='admin'){
            list({},signal).then((data) => {
                if (data && data.error) {
                    setError(data.error)
                } else {
                    setCourses(data)
                }
            })
        } 
        return function cleanup(){
            abortController.abort()
        }
    }, [])
    const history = useHistory()
    const toChatCourse = (courseId) =>{
        courseId && history.push(`/consult/${courseId}`)
    }
    return (
        <Container id='chat-course-list' maxWidth="lg" sx={{px:{xs:0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            {Array.isArray(courses) && courses.map((course, index) => {
            return (
            <Grid item xs={12} sm={6} md={4} key={String(course._id)}>
                <Zoom key={index} timeout={1000} id="zoom-course-chat" appear={true} in={true} color='inherit' unmountOnExit={true}>
                    <ListItem onClick={()=>toChatCourse(course?._id)} 
                        sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center', '&:hover':{boxShadow: 2}, cursor: 'pointer', my: {xs:1, sm:2}, borderRadius: 3, bgcolor: 'background.paper'}}>
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <ListItemAvatar 
                            sx={{ flex: 0.5,
                                lineHeight: 0,
                                overflow: 'hidden',
                                width: {xs: 30, sm: 40, md: 50},
                                height: {xs: 30, sm: 40, md: 50},
                                mb: 2,
                                }}>
                                <Avatar src={'/api/courses/photo/'+course?._id+"?" + new Date().getTime()} alt={course? course.title[0]: ''}/>
                            </ListItemAvatar>
                            <ListItemText 
                            sx={{flex: 1.5, ml: {xs: 0, sm: 1, textAlign: 'center', color: 'text.primary'}}}
                            primary={
                                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                                    <Typography variant='body2' sx={{mr:{xs: 0, sm: 1}, mb: 2, color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem', alignItems: 'center'}}}>
                                        {course?.title && course.title.substring(0,15)}{course.title &&course.title.substring(15).length>0 && '...'}
                                    </Typography>
                                    <Typography variant='body1' sx={{fontWeight: 600, mb: 2, color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem', alignItems: 'center'}}}>
                                        {course?.subtitle && course.subtitle.substring(0,30)}{course.subtitle &&course.subtitle.substring(30).length>0 && '...'}
                                    </Typography>
                                </Box>
                            } 
                            secondaryTypographyProps={{component: 'div'}}
                            secondary={
                                <Box sx={{ display: 'flex',     alignItems: 'center', justifyContent: 'flex-end'}}>
                                    <Box component='span' sx={{m: 1, alignItems: 'center', color: course.totalEnrolled >0? 'primary.main': 'text.secondary', display: 'flex'}}>
                                        <Group sx={{mr: 1, color: course.totalEnrolled >0? 'primary.main': 'text.secondary', width: '1rem', height: '1rem'}} /> {course.totalEnrolled}
                                    </Box>
                                </Box>
                            }/>
                        </Box>
                    </ListItem>
                </Zoom>
            </Grid>
            )})}
            <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
          </Grid>
        </Container>)
};

export default ChatCourseList;
