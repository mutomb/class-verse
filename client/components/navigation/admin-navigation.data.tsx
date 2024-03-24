import React from 'react';
import type { Navigation } from '../../interfaces/navigation'
import auth from '../auth/auth-helper'
import {ShoppingCart, People, Person, Settings, Stars, Quiz, Book, Help, BarChart, MonetizationOn, 
  School, Dashboard, Public, AddCircle, DangerousRounded, PendingActions, GpsFixed, CurrencyExchange
} from '@mui/icons-material';

export const userLinks: Navigation[] = [
  {
    label: 'Profile',
    path: 'user/' + auth.isAuthenticated().user?._id, // '/user/:userId'
    icon: <Person />
  },
  {
    label: 'Edit Profile',
    path: 'user/edit/'+ auth.isAuthenticated().user?._id, // '/user/edit/:userId'
    icon: <Settings />
  },
]

export const studentLinks: Navigation[] = [
  {
    label: 'Overview',
    path: 'user/dashboard/' + auth.isAuthenticated().user?._id, // '/user/dashboard/:userId'
    icon: <Dashboard />
  },
  {
    label: 'Courses',
    path: 'learn/courses/'+ auth.isAuthenticated().user?._id, // '/learn/courses/:userId'
    icon: <Book />
  },
  {
    label: 'Quizzes',
    path: 'learn/quizzes/'+ auth.isAuthenticated().user?._id, // '/learn/quizzes/:userId'
    icon: <Quiz />
  },
  {
    label: 'Exams',
    path: 'learn/exams/'+ auth.isAuthenticated().user?._id , // '/learn/exams/:userId'
    icon: <School />
  },
  {
    label: 'Certificates',
    path: 'learn/certificates/'+ auth.isAuthenticated().user?._id, // '/learn/certificates/:userId'
    icon: <Stars />
  },
  {
    label: 'Nearby',
    path: 'learn/nearby/'+ auth.isAuthenticated().user?._id , // '/learn/nearby/:userId'
    icon: <GpsFixed />
  },
  {
    label: 'Forums',
    path: 'learn/ask', // '/learn/ask/:userId'
    icon: <Help />
  },
  {
    label: 'Transactions',
    path: 'learn/transactions/'+ auth.isAuthenticated().user?._id , // '/learn/transactions/:userId'
    icon: <CurrencyExchange />
  }
]

export const teacherLinks: Navigation[] = [
  {
    label: 'Statics',
    path: 'teach/dashboard/' + auth.isAuthenticated().user?._id, // '/teach/dashboard/:userId'
    icon: <BarChart />
  },
  {
    label: 'New Course',
    path: 'teach/course/new', // '/teach/course/new'
    icon: <AddCircle />
  },
  {
    label: 'Published',
    path: 'teach/courses/published/'+ auth.isAuthenticated().user?._id, // '/teach/courses/published/:userId'
    icon: <Public />
  },
  {
    label: 'Private',
    path: 'teach/courses/private/'+ auth.isAuthenticated().user?._id, // '/teach/courses/private/:userId'
    icon: <PendingActions />
  },
  {
    label: 'Respond',
    path: 'teach/respond' , // '/teach/respond',
    icon: <People />
  },
  {
    label: 'Bids',
    path: 'teach/bids/'+ auth.isAuthenticated().user?._id , // '/teach/bids/'
    icon: <ShoppingCart />
  },
  {
    label: 'Transactions',
    path: 'teach/transactions/'+ auth.isAuthenticated().user?._id , // '/teach/transactions/'
    icon: <MonetizationOn />
  }
]

export const reportLinks: Navigation[] = [
  {
    label: 'Help Center',
    path: 'report/', // '/report/'
    icon: <DangerousRounded />
  }
]