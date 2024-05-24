import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Divider, ListItem, ListItemButton, ListItemText, ListSubheader, Link as MuiLink, typographyClasses } from '@mui/material'
import { userLinks, studentLinks, teacherLinks, otherLinks } from './admin-navigation.data'
import { useHistory, useLocation } from 'react-router-dom'
import { scroller } from 'react-scroll'
import {useAuth} from '../auth'

interface Props{
  userID:string
}
const NavigationSide: FC<Props> = ({userID}) => {
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const {isAuthenticated} = useAuth()

  const scrollToAnchor = (destination:string) => {
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 0,
      smooth: true,
      offset: -10,
    })
  }

  const goToUserDashboardAndScroll = async (destination:string) => {
    await history.push(`/user/${userID}`)
    await scrollToAnchor(destination)
  }
  
  const goToStudentDashboardAndScroll = async (destination:string) => {
    await history.push('/learn/courses')
    await scrollToAnchor(destination)
  }

  const goToTeacherDashboardAndScroll = async (destination:string) => {
    await history.push('/teach/courses')
    await scrollToAnchor(destination)
  }

  return (<>
        <ListSubheader component="div" inset>
          User
        </ListSubheader>
        {userLinks.map(({ path: destination, label, icon })=>{
              if(['experience', 'company'].includes(destination) && isAuthenticated().user && isAuthenticated().user.teacher === false) return <></>
              return(<ListItemButton key={destination}
                onClick={location==='/user'?()=>scrollToAnchor(destination) : ()=>goToUserDashboardAndScroll(destination)}
                sx={{
                  width: '100%',
                  mb: 1,
                  textDecoration: 'none',
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.disabled',
                  cursor:'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none'
                  }
                }}>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText sx={{color: 'text.secondary'}} primary={label} />
              </ListItemButton>)
        })}
        {isAuthenticated().user && isAuthenticated().user.teacher===false && (<>
        <Divider sx={{ my: 1 }} />  
        <ListSubheader component="div" inset>
          Learn
        </ListSubheader>
        {studentLinks.map(({ path: destination, label, icon })=>(
              <ListItemButton
              onClick={location==='/learn'?()=>scrollToAnchor(destination) : ()=>goToStudentDashboardAndScroll(destination)}
              sx={{
                width: '100%',
                mb: 1,
                textDecoration: 'none',
                fontSize: { xs: '1rem', md: 'inherit' },
                [`& .${typographyClasses.root}`]:{fontWeight: 600},
                color: 'text.disabled',
                cursor:'pointer',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'none'
                }}}>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText sx={{color: 'text.secondary'}} primary={label} />
              </ListItemButton>
        ))}</>)}
        {isAuthenticated().user && isAuthenticated().user.teacher && (<>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Teach
        </ListSubheader>
        {teacherLinks.map(({ path: destination, label, icon })=>(
              <ListItemButton
              onClick={location==='/teach'?()=>scrollToAnchor(destination) : ()=>goToTeacherDashboardAndScroll(destination)}
              sx={{
                width: '100%',
                mb: 1,
                textDecoration: 'none',
                fontSize: { xs: '1rem', md: 'inherit' },
                [`& .${typographyClasses.root}`]:{fontWeight: 600},
                color: 'text.disabled',
                cursor:'pointer',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'none'
                }}}>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText primary={label} sx={{color: 'text.secondary'}} />
              </ListItemButton>
        ))}</>)}
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Other
        </ListSubheader>
        {otherLinks.map(({ path: destination, label, icon, auth })=>(
          <Link to={auth?`/${destination}/${userID}`: `/${destination}`} style={{textDecoration: 'none'}} key={destination}>
            <MuiLink
                component='span'
                sx={{
                  display: 'block',
                  mb: 1,
                  textDecoration: 'none',
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.disabled',
                  cursor:'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none'
                  }
            }}>
              <ListItemButton>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText sx={{color: 'text.secondary'}} primary={label} />
              </ListItemButton>
            </MuiLink>
          </Link>
        ))}                
        </>);
}

export default NavigationSide