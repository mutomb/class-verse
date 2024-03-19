import React, {useState, useEffect} from 'react'
import {Box, Container, Grid, Typography} from '@mui/material'
import auth from '../auth/auth-helper'
import {listEnrolled} from '../enrollment/api-enrollment'
import Enrollments from '../enrollment/Enrollments'
import {Info} from '@mui/icons-material'
export default function EnrolledInCourses(){
    const jwt = auth.isAuthenticated()
    const [enrolled, setEnrolled] = useState([])
    /** Fetch enrolled in courses */
    useEffect(() => {
        if (!jwt.user) return function cleanup(){}
        const abortController = new AbortController()
        const signal = abortController.signal
        listEnrolled({t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
            console.log(data.error)
            } else {
            setEnrolled(data)
            }
        })
        return function cleanup(){
            abortController.abort()
        }
    }, [])
    return (<>
    {auth.isAuthenticated().user && (
        <Box
        id="enrolled-in-courses"
        sx={{
        pt: {
            xs: 6,
            md: 8,
        },
        pb: 14,
        backgroundColor: 'background.paper',
        }}
    >
        <Container maxWidth="lg">
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
            <Box
                sx={{
                height: '100%',
                width: { xs: '100%', md: '90%' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                }}
            >
                <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 } }}>
                Courses you are enrolled in
                </Typography>
            </Box>
            </Grid>
            <Grid item xs={12} md={9}>
            {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>): 
            (<Box sx={{ px: 2, py: 1.5, boxShadow: 1, 
                        borderRadius: 4, display: 'flex',
                        flexDirection: {xs:'column', md:'row'},
                        alignItems: 'center' }}>
                            <Box
                            sx={{
                                mr: 1,
                                backgroundColor: 'background.paper',
                                borderRadius: '50%',
                                height: 36,
                                width: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'primary.contrastText',
                                '& svg': {
                                color: 'secondary.main',
                                fontSize: 40
                                },
                            }}
                            >
                                <Info/>
                            </Box>
                        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1, color: 'secondary.main' }}>
                                No courses found
                            </Typography>
                        <Typography
                        variant='subtitle1' 
                        sx={{ lineHeight: 1.3, color: 'text.secondary', fontSize: '1rem' }}
                        >
                            You are not yet enrolled in any courses. Choose from popular courses listed below or 
                            use the search box to find other courses.
                        </Typography>
                        </Box>
                    </Box>) 
            }
            </Grid>
        </Grid>
        </Container>
        </Box>)}
    </>)
}