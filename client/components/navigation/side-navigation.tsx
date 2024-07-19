import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Divider, ListItem, ListItemButton, ListItemText, ListSubheader, Link as MuiLink, typographyClasses } from '@mui/material'
import { userLinks, clientLinks, specialistLinks, otherLinks } from './side-navigation.data'
import { useHistory, useLocation } from 'react-router-dom'
import { scroller } from 'react-scroll'
import {useAuth} from '../auth'

interface Props{
  userID:string
}
const DashboardNavigation: FC<Props> = ({userID}) => {
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

  const goToUserDashboardAndScroll = (destination:string) => {
    history.push(`/user/${userID}`)
    scrollToAnchor(destination)
  }
  
  const goToClientDashboardAndScroll = (destination:string) => {
    history.push('/client/courses')
    scrollToAnchor(destination)
  }

  const goToSpecialistDashboardAndScroll = (destination:string) => {
    history.push('/specialist/courses')
    scrollToAnchor(destination)
  }
  
  return (<>
        <ListSubheader component="div" inset>
          User
        </ListSubheader>
        {userLinks.map(({ path: destination, label, icon })=>{
              if(['experience', 'company'].includes(destination) && isAuthenticated().user && isAuthenticated().user.specialist === false) return <></>
              return(<ListItemButton key={destination}
                onClick={location==='user'?()=>scrollToAnchor(destination) : ()=>goToUserDashboardAndScroll(destination)}
                sx={{
                  mb: 1,
                  textDecoration: 'none',
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.secondary',
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
        {isAuthenticated().user && isAuthenticated().user.specialist===false && (<>
        <Divider sx={{ my: 1 }} />  
        <ListSubheader component="div" inset>
          Learn
        </ListSubheader>
        {clientLinks.map(({ path: destination, label, icon })=>(
              <ListItemButton
              onClick={location==='client'?()=>scrollToAnchor(destination) : ()=>goToClientDashboardAndScroll(destination)}
              sx={{
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
        {isAuthenticated().user && isAuthenticated().user.specialist && (<>
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Teach
        </ListSubheader>
        {specialistLinks.map(({ path: destination, label, icon })=>(
              <ListItemButton
              onClick={location==='specialist'?()=>scrollToAnchor(destination) : ()=>goToSpecialistDashboardAndScroll(destination)}
              sx={{
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

export default DashboardNavigation