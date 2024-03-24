import React, { lazy } from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './components/auth/PrivateRoute'
import {Loadable} from './components/loaders'
import '../node_modules/slick-carousel/slick/slick.css'
import './styles/globals.css'
import './styles/react-slick.css'
import Home from './components/home/Home'
const LazyUsers = Loadable(lazy(() => import('./components/users/Users')))
const LazySignup = Loadable(lazy(() => import('./components/users/Signup')))
const LazySignin = Loadable(lazy(() => import('./components/auth/Signin')))
const LazyEditProfile = Loadable(lazy(() => import('./components/users/EditProfile')))
const LazyProfile = Loadable(lazy(() => import('./components/users/Profile')))
const LazyNewCourse = Loadable(lazy(() => import('./components/courses/NewCourse')))
const LazyCourse = Loadable(lazy(() => import('./components/courses/Course')))
const LazyEditCourse = Loadable(lazy(() => import('./components/courses/EditCourse')))
const LazyMyCourses = Loadable(lazy(() => import('./components/courses/MyCourses')))
const LazyEnrollment = Loadable(lazy(() => import('./components/enrollment/Enrollment')))

const MainRouter = () => {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/signup" component={LazySignup}/>
        <Route path="/signin" component={LazySignin}/>
        <Route path="/users" component={LazyUsers}/>
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
