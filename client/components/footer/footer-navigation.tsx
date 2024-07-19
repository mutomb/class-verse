import React, { FC } from 'react'
import Grid from '@mui/material/Grid'
import MuiLink from '@mui/material/Link'
import { navigations as pageMenu, courseMenu, companyMenu } from '../navigation/navigation.data'
import { FooterSectionTitle } from '.'
import Box from '@mui/material/Box'
import { Link as ScrollLink, scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'
import {useAuth} from '../auth'

const FooterNavigation: FC = () => {
  const {isAuthenticated} = useAuth()
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
  const goToHomeAndScroll = (destination:string) => {
    history.push('/')
    let delayedScroll=setTimeout(()=>{scrollToAnchor(destination), clearTimeout(delayedScroll)},1000)
  }
  const goToAboutAndScroll = (destination:string) => {
    history.push('/about')
    let delayedScroll=setTimeout(()=>{scrollToAnchor(destination), clearTimeout(delayedScroll)},1000)
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FooterSectionTitle title="Categories" />
        {courseMenu.map(({ label, path }, index) => (
        <Box
          component={ScrollLink}
          key={index + path}
          to={path}
          spy={true}
          smooth={true}
          duration={350}
          // onClick={location===''?()=>scrollToAnchor(destination) : ()=>goToHomeAndScroll(destination)}
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
        </Box>
        ))}
      </Grid>
      <Grid item xs={12} sm={4}>
        <FooterSectionTitle title="Menu" />
        {pageMenu.map(({ label, path:destination }, index) => {
          if (!isAuthenticated().user && ['enrolled-in-courses'].includes(destination)) return null
          if (isAuthenticated().user && ['hero', 'testimonial'].includes(destination)) return null
          if(label === 'About') return null
          else{
            return(<Box
                component={ScrollLink}
                key={index + path}
                to={path}
                spy={true}
                smooth={true}
                duration={350}
                onClick={location===''?()=>scrollToAnchor(destination) : ()=>goToHomeAndScroll(destination)}
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
      <Grid item xs={12} sm={4}>
        <FooterSectionTitle title="About" />
        {companyMenu.map(({ label, path:destination }, index) => (
        <Box
          component={ScrollLink}
          key={index + path}
          to={path}
          spy={true}
          smooth={true}
          duration={350}
          onClick={location==='about'?()=>scrollToAnchor(destination) : ()=>goToAboutAndScroll(destination)}
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
        </Box>
        ))}
      </Grid>
    </Grid>
  )
}

export default FooterNavigation
