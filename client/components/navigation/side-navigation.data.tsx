import React from 'react';
import type { Navigation } from '../../interfaces/navigation'
import {People, Person, Stars, Quiz, BarChart, MonetizationOn, School, Dashboard, GpsFixed, WorkHistory, Work, LibraryBooks, ContactSupport} from '@mui/icons-material';
import { Box } from '@mui/material';
import CertificateIcon from "../../public/images/icons/certificate.png"

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

export const clientLinks: Navigation[] = [
  {
    label: 'Overview',
    path: 'overview', // '/user/courses/#overview'
    icon: <Dashboard />,
    auth: true
  },
  {
    label: 'Courses',
    path: 'courses', // '/client/courses/#courses'
    icon: <LibraryBooks />,
  },
  {
    label: 'Consult',
    path: 'chat-course-list', // '/specialist/courses/#chat-course-list'
    icon: <People />,
  },
  {
    label: 'Quizzes',
    path: 'quizzes', // '/client/courses/#quizzes'
    icon: <Quiz />,
  },
  {
    label: 'Exams',
    path: 'exams', // '/client/courses/#exams'
    icon: <School />,
  },
]

export const specialistLinks: Navigation[] = [
  {
    label: 'Overview',
    path: 'overview', // '/specialist/courses/#overiew'
    icon: <BarChart />,
  },
  {
    label: 'Courses',
    path: 'courses', // '/specialist/courses/#course'
    icon: <LibraryBooks />,
  },
  {
    label: 'Consult',
    path: 'consult', // '/specialist/courses/#consult'
    icon: <People />,
  },
]

export const otherLinks: Navigation[] = [
  {
    label: 'Nearby',
    path: 'nearby', // '/client/courses/#nearby'
    icon: <GpsFixed />,
  },
  {
    label: 'Certificates',
    path: 'certificates', // '/client/courses/#certificates'
    icon: <Box sx={{ borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', '& img': { width: 24, height: 'auto' },}}>
            <Box component='img' src={CertificateIcon}  sx={{width:'100%', height:'auto'}} />
          </Box>
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
    icon: <ContactSupport />,
    auth: true
  }
]