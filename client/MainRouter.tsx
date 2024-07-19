import React, { FC } from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './components/auth/PrivateRoute'
import {Loadable} from './components/progress'
import '../node_modules/slick-carousel/slick/slick.css'
import './styles/globals.css'
import './styles/react-slick.css'
import {Cart, Checkout} from './components/cart'

const LazyHome = Loadable(import('./components/home/Home'))

const LazySignup = Loadable(import('./components/users/Signup-steps'))
const LazySignin = Loadable(import('./components/auth/Signin'))
const LazyEditProfile = Loadable(import('./components/users/EditProfile'))
const LazyUserDashboard = Loadable(import('./components/user-dashboard/UserDashboard'))

const LazyNewCourse = Loadable(import('./components/courses/NewCourse'))
const LazyNewLesson = Loadable(import('./components/courses/NewLesson'))
const LazyCourse = Loadable(import('./components/courses/Course'))
const LazyEditCourse = Loadable(import('./components/courses/EditCourse'))
const LazySpecialistDashboard = Loadable(import('./components/specialist-dashboard/SpecialistDashboard'))
const LazyAdminDashboard = Loadable(import('./components/admin-dashboard/AdminDashboard'))
const LazyClientDashboard = Loadable(import('./components/client-dashboard/ClientDashboard'))
const LazyEnrollment= Loadable(import('./components/enrollment/Enrollment'))

const LazyNewMedia = Loadable(import('./components/media/NewMedia'))
const LazyEditMedia = Loadable(import('./components/media/EditMedia'))
const LazyPlayMedia = Loadable(import('./components/media/PlayMedia'))
const LazyChatCourse = Loadable(import('./components/chat/chatcourse/ChatCourse'))
const LazyChatCourseList = Loadable(import('./components/chat/chatcourse/ChatCourseList'))
const LazyCall = Loadable(import('./components/call/Call'))

// const LazyCart = Loadable(import('./components/cart/Cart'))
const LazyOrder = Loadable(import('./components/order/Order'))
const LazyOrders = Loadable(import('./components/order/Orders'))
// const LazyClientOrders = Loadable(import('./components/order/ClientOrders'))
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
        <PrivateRoute path="/user/edit/:userId" component={LazyEditProfile}/>        
        <Route path="/user/:userId" component={LazyUserDashboard}/>

        <Route path="/course/:courseId" component={LazyCourse}/>
        
        <PrivateRoute path="/specialist/courses" component={LazySpecialistDashboard}/>
        <PrivateRoute path="/specialist/course/new" component={LazyNewCourse}/>
        <PrivateRoute path="/specialist/course/:courseId/lesson/new" component={LazyNewLesson}/>
        <PrivateRoute path="/specialist/course/edit/:courseId" component={LazyEditCourse}/>
        <PrivateRoute path="/specialist/course/:courseId" component={LazyCourse}/>
        
        <PrivateRoute path="/client/courses" component={LazyClientDashboard}/>
        <PrivateRoute path="/client/:enrollmentId" component={LazyEnrollment}/>

        <PrivateRoute path="/admin" component={LazyAdminDashboard}/>

        <PrivateRoute path="/media/new" component={LazyNewMedia}/>
        <PrivateRoute path="/media/edit/:mediaId/course/:courseId" component={LazyEditMedia}/>
        <PrivateRoute path="/media/edit/:mediaId" component={LazyEditMedia}/>
        <Route path="/media/:mediaId" render={(props) => (<LazyPlayMedia {...props} data={data} />)} />
        
        {/* <PrivateRoute path="/chat" component={LazyChatCourseList} /> */}
        <PrivateRoute path="/consult/:courseId" component={LazyChatCourse} />
        <PrivateRoute path="/call" component={LazyCall} />

        <Route path="/cart" component={Cart}/>
        <PrivateRoute path="/checkout" component={Checkout}/>

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
