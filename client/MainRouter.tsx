import React, { FC } from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './components/auth/PrivateRoute'
import {Loadable} from './components/progress'
import '../node_modules/slick-carousel/slick/slick.css'
import './styles/globals.css'
import './styles/react-slick.css'
import {Cart} from './components/cart'
const LazyHome = Loadable(import('./components/home/Home'))

const LazyUsers = Loadable(import('./components/users/Users'))
const LazySignup = Loadable(import('./components/users/Signup'))
const LazySignin = Loadable(import('./components/auth/Signin'))
const LazyEditProfile = Loadable(import('./components/users/EditProfile'))
const LazyUserDashboard = Loadable(import('./components/user-dashboard/UserDashboard'))

const LazyNewCourse = Loadable(import('./components/courses/NewCourse'))
const LazyNewLesson = Loadable(import('./components/courses/NewLesson'))
const LazyCourse = Loadable(import('./components/courses/Course'))
const LazyEditCourse = Loadable(import('./components/courses/EditCourse'))
const LazyTeacherDashboard = Loadable(import('./components/teacher-dashboard/TeacherDashboard'))
const LazyStudentDashboard = Loadable(import('./components/student-dashboard/StudentDashboard'))
const LazyEnrollment= Loadable(import('./components/enrollment/Enrollment'))

const LazyNewMedia = Loadable(import('./components/media/NewMedia'))
const LazyEditMedia = Loadable(import('./components/media/EditMedia'))
const LazyPlayMedia = Loadable(import('./components/media/PlayMedia'))

// const LazyCart = Loadable(import('./components/cart/Cart'))
const LazyOrder = Loadable(import('./components/order/Order'))
const LazyOrders = Loadable(import('./components/order/Orders'))
// const LazyStudentOrders = Loadable(import('./components/order/StudentOrders'))
const LazyStripeConnect = Loadable(import('./components/users/StripeConnect'))

const LazyAbout = Loadable(import('./components/about/About'))


const LazyError400 = Loadable(import('./components/errors/400'))
const LazyError403 = Loadable(import('./components/errors/403'))


interface MainRouterProps{
  data?: any
}
const MainRouter: FC<MainRouterProps> = ({data}) => {
    return (
      <Switch>
        <Route exact path="/" component={LazyHome}/>
        <Route path="/signup" component={LazySignup}/>
        <Route path="/signin" component={LazySignin}/>
        <Route path="/users" component={LazyUsers}/>
        <PrivateRoute path="/user/edit/:userId" component={LazyEditProfile}/>        
        <Route path="/user/:userId" component={LazyUserDashboard}/>

        <Route path="/course/:courseId" component={LazyCourse}/>
        
        <PrivateRoute path="/teach/courses" component={LazyTeacherDashboard}/>
        <PrivateRoute path="/teach/course/new" component={LazyNewCourse}/>
        <PrivateRoute path="/teach/course/:courseId/lesson/new" component={LazyNewLesson}/>
        <PrivateRoute path="/teach/course/edit/:courseId" component={LazyEditCourse}/>
        <PrivateRoute path="/teach/course/:courseId" component={LazyCourse}/>
        
        <PrivateRoute path="/learn/courses" component={LazyStudentDashboard}/>
        <PrivateRoute path="/learn/:enrollmentId" component={LazyEnrollment}/>

        <PrivateRoute path="/media/new" component={LazyNewMedia}/>
        <PrivateRoute path="/media/edit/:mediaId/course/:courseId" component={LazyEditMedia}/>
        <PrivateRoute path="/media/edit/:mediaId" component={LazyEditMedia}/>
        <Route path="/media/:mediaId" render={(props) => (<LazyPlayMedia {...props} data={data} />)} />
        
        <Route path="/cart" component={Cart}/>

        <Route path="/order/:orderId" component={LazyOrder}/>
        <PrivateRoute path="/orders/:userId" component={LazyOrders}/>
        <Route path="/seller/stripe/connect" component={LazyStripeConnect}/> {/** Redirect route set in Stripe dashboard's Connect settings*/}
        
        <Route path="/about" component={LazyAbout}/>

        <Route path="/error/403" component={LazyError403}/>
        <Route path='*' component={LazyError400}/>
      </Switch>
    )
}

export default MainRouter
