import React, { Suspense, lazy } from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import {Footer} from './temp/components/footer'
import { Box } from '@mui/material'
import {TransitionLoader} from './temp/components/loaders'
import '../node_modules/slick-carousel/slick/slick.css'
import './temp/styles/globals.css'
import './temp/styles/react-slick.css'
// const LazyMenu = lazy(() => import('./core/Menu'))
// const LazyFooter = lazy(() => import('./temp/components/footer/footer'))
const LazyHome = lazy(() => import('./core/Home'))
const LazyUsers = lazy(() => import('./user/Users'))
const LazySignup = lazy(() => import('./user/Signup'))
const LazySignin = lazy(() => import('./auth/Signin'))
const LazyEditProfile = lazy(() => import('./user/EditProfile'))
const LazyProfile = lazy(() => import('./user/Profile'))
const LazyNewCourse = lazy(() => import('./course/NewCourse'))
const LazyCourse = lazy(() => import('./course/Course'))
const LazyEditCourse = lazy(() => import('./course/EditCourse'))
const LazyMyCourses = lazy(() => import('./course/MyCourses'))
const LazyEnrollment = lazy(() => import('./enrollment/Enrollment'))

const MainRouter = () => {
    return (
    <Box component="main">
      <Menu/>
      <Switch>
        <Suspense fallback={<TransitionLoader />}>
          <Route exact path="/" component={LazyHome}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <Route path="/users" component={LazyUsers}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <Route path="/signup" component={LazySignup}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>  
          <Route path="/signin" component={LazySignin}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <PrivateRoute path="/user/edit/:userId" component={LazyEditProfile}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>          
          <Route path="/user/:userId" component={LazyProfile}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>        
          <Route path="/course/:courseId" component={LazyCourse}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <PrivateRoute path="/teach/courses" component={LazyMyCourses}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <PrivateRoute path="/teach/course/new" component={LazyNewCourse}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <PrivateRoute path="/teach/course/edit/:courseId" component={LazyEditCourse}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <PrivateRoute path="/teach/course/:courseId" component={LazyCourse}/>
        </Suspense>
        <Suspense fallback={<TransitionLoader />}>
          <PrivateRoute path="/learn/:enrollmentId" component={LazyEnrollment}/>
        </Suspense>
      </Switch>
      <Footer/>
    </Box>
    )
}

export default MainRouter
