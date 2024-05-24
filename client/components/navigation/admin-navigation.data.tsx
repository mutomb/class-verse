import React from 'react';
import type { Navigation } from '../../interfaces/navigation'
import {People, Person, Stars, Quiz, BarChart, MonetizationOn, School, Dashboard, DangerousRounded, GpsFixed, WorkHistory, Work, LibraryBooks} from '@mui/icons-material';

export let userLinks: Navigation[] = [
  {
    label: 'Personal',
    path: 'personal', // '/user/:userId/#personal'
    icon: <Person />,
    auth: true
  },
  {
    label: 'Experience',
    path: 'experience', // '/user/:userId/#experience'
    icon: <WorkHistory />,
    auth: true
  },
  {
    label: 'Company',
    path: 'company', // '/user/:userId/#company'
    icon: <Work />,
    auth: true
  }
]

export const studentLinks: Navigation[] = [
  {
    label: 'Overview',
    path: 'overview', // '/user/courses/#overview'
    icon: <Dashboard />,
    auth: true
  },
  {
    label: 'Courses',
    path: 'courses', // '/learn/courses/#courses'
    icon: <LibraryBooks />,
  },
  {
    label: 'Quizzes',
    path: 'quizzes', // '/learn/courses/#quizzes'
    icon: <Quiz />,
  },
  {
    label: 'Exams',
    path: 'exams', // '/learn/courses/#exams'
    icon: <School />,
  },
]

export const teacherLinks: Navigation[] = [
  {
    label: 'Overview',
    path: 'overview', // '/teach/courses/#overiew'
    icon: <BarChart />,
  },
  {
    label: 'Courses',
    path: 'courses', // '/teach/courses/#course'
    icon: <LibraryBooks />,
  },
]

export const otherLinks: Navigation[] = [
  {
    label: 'Nearby',
    path: 'nearby', // '/learn/courses/#nearby'
    icon: <GpsFixed />,
  },
  {
    label: 'Forums',
    path: 'forums', // '/forums'
    icon: <People />,
    auth: true
  },
  {
    label: 'Certificates',
    path: 'certificates', // '/learn/courses/#certificates'
    icon: <Stars />,
  },
  {
    label: 'Orders',
    path: 'orders', // '/orders'
    icon: <MonetizationOn />,
    auth: true
  },
  {
    label: 'Help Center',
    path: 'report', // '/reports'
    icon: <DangerousRounded />,
    auth: true
  }
]