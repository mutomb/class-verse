import React, { Suspense, lazy } from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import {TransitionLoader} from './components/loaders'
import {Loadable} from './components/loaders'
import '../node_modules/slick-carousel/slick/slick.css'
import './styles/globals.css'
import './styles/react-slick.css'
const LazyHome = Loadable(lazy(() => import('./core/Home')))
const LazyUsers = Loadable(lazy(() => import('./user/Users')))
const LazySignup = Loadable(lazy(() => import('./user/Signup')))
const LazySignin = Loadable(lazy(() => import('./auth/Signin')))
const LazyEditProfile = Loadable(lazy(() => import('./user/EditProfile')))
const LazyProfile = Loadable(lazy(() => import('./user/Profile')))
const LazyNewCourse = Loadable(lazy(() => import('./course/NewCourse')))
const LazyCourse = Loadable(lazy(() => import('./course/Course')))
const LazyEditCourse = Loadable(lazy(() => import('./course/EditCourse')))
const LazyMyCourses = Loadable(lazy(() => import('./course/MyCourses')))
const LazyEnrollment = Loadable(lazy(() => import('./enrollment/Enrollment')))

const MainRouter = () => {
    return (
      <Switch>
        <Route exact path="/" component={LazyHome}/>
        <Route path="/users" component={LazyUsers}/>
        <Route path="/signup" component={LazySignup}/>
        <Route path="/signin" component={LazySignin}/>
        <PrivateRoute path="/user/edit/:userId" component={LazyEditProfile}/>        
        <Route path="/user/:userId" component={LazyProfile}/>       
        <Route path="/course/:courseId" component={LazyCourse}/>
        <PrivateRoute path="/teach/courses" component={LazyMyCourses}/>
        <PrivateRoute path="/teach/course/new" component={LazyNewCourse}/>
        <PrivateRoute path="/teach/course/edit/:courseId" component={LazyEditCourse}/>
        <PrivateRoute path="/teach/course/:courseId" component={LazyCourse}/>
        <PrivateRoute path="/learn/:enrollmentId" component={LazyEnrollment}/>
      </Switch>
    )
}

export default MainRouter
