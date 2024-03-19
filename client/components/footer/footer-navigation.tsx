import React, { FC } from 'react'
import {Link} from 'react-router-dom'
//import Link from 'next/link'
import Grid from '@mui/material/Grid'
import MuiLink from '@mui/material/Link'
import type { Navigation } from '../../interfaces/navigation'
import { navigations as headerNavigations } from '../../components/navigation/navigation.data'
import { FooterSectionTitle } from '../../components/footer'
import Box from '@mui/material/Box'
import { Link as ScrollLink, scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'
import auth from '../auth/auth-helper'

const courseMenu: Array<Navigation> = [
  {
    label: 'UI/UX Design',
    path: '#',
  },
  {
    label: 'Mobile Development',
    path: '#',
  },
  {
    label: 'Machine Learning',
    path: '#',
  },
  {
    label: 'Web Development',
    path: '#',
  },
]

const pageMenu = headerNavigations

const companyMenu: Array<Navigation> = [
  { label: 'Contact Us', path: '#' },
  { label: 'Privacy & Policy', path: '#' },
  { label: 'Term & Condition', path: '#' },
  { label: 'FAQ', path: '#' },
]

interface NavigationItemProps {
  label: string
  path: string
}

const NavigationItem: FC<NavigationItemProps> = ({ label, path }) => {
  return (
    <Link style={{textDecorationLine:'none'}}  to={path}>
      <MuiLink
        component='span'
        underline="hover"
        sx={{
          display: 'block',
          mb: 1,
          color: 'primary.contrastText',
        }}
      >
        {label}
      </MuiLink>
    </Link>
  )
}

const FooterNavigation: FC = () => {
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const scrollToAnchor = (destination:string) => {
  scroller.scrollTo(destination, {
    duration: 1500,
    delay: 0,
    smooth: true,
    offset: -10,
  })
}
const goToHomeAndScroll = async (destination:string) => {
await history.push('/')
await scrollToAnchor(destination)
}
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="Courses" />
        {courseMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={/* path */ '#'} />
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="Menu" />
        {pageMenu.map(({ label, path:destination }, index) => {
          if (!auth.isAuthenticated().user && ['enrolled-in-courses'].includes(destination)) return null
          if (auth.isAuthenticated().user && ['hero', 'testimonial'].includes(destination)) return null
          else{
            return(<Box
                component={ScrollLink}
                key={index + path}
                to={path}
                spy={true}
                smooth={true}
                duration={350}
                onClick={location==='/'?()=>scrollToAnchor(destination) : ()=>goToHomeAndScroll(destination)}
              >
                <MuiLink
                underline="hover"
                component='span'
                sx={{
                  display: 'block',
                  mb: 1,
                  color: 'primary.contrastText',
                  cursor:'pointer'
                }}
                >
                  {label}
                </MuiLink>
              </Box>)}
        })}
      </Grid>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="About" />
        {companyMenu.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} path={path} />
        ))}
      </Grid>
    </Grid>
  )
}

export default FooterNavigation
