import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import { Link as ScrollLink, scroller } from 'react-scroll'
import { navigations } from './navigation.data'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import { Link, useHistory, useLocation } from 'react-router-dom'
import {useAuth} from '../auth'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import Library from '@mui/icons-material/LocalLibrary'
import { Collapse, Divider, Menu, MenuItem, avatarClasses } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import MoreMenuVert from '../styled-buttons/more-menu-vert'

interface Navigation{
  onClick?: ()=> void
}

const Navigation: FC<Navigation> = ({onClick}) => {
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const {isAuthenticated} = useAuth()
  const [openMore, setOpenMore] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const goToAbout = (destination:string) => {
    history.push('/about')
  }
  const scrollToAnchor = (destination:string) => {
    onClick && onClick()
    if(destination==='about') return goToAbout(destination)
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 0,
      smooth: true,
      offset: -10,
    })
  }
  const goToHomeAndScroll = (destination:string) => {
    if(destination==='about') return goToAbout(destination)
    history.push('/')
    let delayedScroll=setTimeout(()=>{scrollToAnchor(destination), clearTimeout(delayedScroll)},1000)
  }
  const showMore = (destination: string) => event => {
    setOpenMore(destination)
    setAnchorEl(event.currentTarget);
  }
  const hideMore = () => {
    setOpenMore('')
    setAnchorEl(null);
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {navigations.map(({ path: destination, label }) => {
        if (isAuthenticated().user && ['hero', 'testimonial', 'about'].includes(destination)) return null
        else{
          return(<Box
          component={ScrollLink}
          key={destination}
          activeClass="current"
          onClick={location===''?()=>scrollToAnchor(destination) : ()=>goToHomeAndScroll(destination)}
          // onMouseEnter={showMore(destination)}
          // onMouseLeave={hideMore}
          to= {destination}
          spy={true}
          smooth={true}
          duration={350}
          sx={{
            textWrap: 'nowrap',
            whiteSpace: 'nowrap',
            position: 'relative',
            color: 'text.disabled',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 0, md: 3 },
            mb: { xs: 3, md: 0 },
            fontSize: { xs: '1.2rem', md: 'inherit' },
            ...(destination === '/' && {
              color: 'primary.main',
            }),
            '& > span': { display: 'none' },
            '&.current>span': { display: 'block' },
            '&.current': { color: 'primary.main' },
            '&:hover': {
              color: 'primary.main',
              '&>span': {
                display: 'block',
              },
              [`& .${avatarClasses.root}`]: {color: 'primary.main'}
            },
          }}
        >
          <Box
            component='span'
            sx={{
              position: 'absolute',
              top: 15,
              transform: 'rotate(3deg)',
              '& img': { width: 44, height: 'auto' },
            }}
          >
            {/* eslint-disable-next-line */}
            <img src={HeadLineCurve} alt="Headline curve" />
          </Box>
          {label} {openMore === destination ? <ExpandLess /> : <ExpandMore />}
          {/* <Menu
            id="more-vert-menu"
            anchorEl={anchorEl}
            open={openMore === destination}
            onClose={hideMore}
            MenuListProps={{
              'aria-labelledby': 'more-vert-menu-button',
              component: 'div'
            }}
            anchorOrigin={{
              vertical: 0,
              horizontal: 0,
            }}
            transformOrigin={
              {vertical: 'bottom', horizontal: 'center'}
            }>
            <Divider/>
            <MenuItem sx={{color: "primary.main", transition: (theme)=> theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
              More options
            </MenuItem>
          </Menu>           */}
        </Box>)}
      })}
      { isAuthenticated().user && (<>
        {isAuthenticated().user.teacher && (
          <Link onClick={()=> onClick && onClick()} to="/teach/courses">
            <StyledButton disableHoverEffect={false} color='secondary' variant="outlined">
              <Library/> Teach 
            </StyledButton>
          </Link>)
          }
        {!isAuthenticated().user.teacher && (
          <Link onClick={()=> onClick && onClick()} to="/learn/courses">
            <StyledButton disableHoverEffect={false} color='secondary' variant="outlined">
              <Library/> Learn 
            </StyledButton>
          </Link>)
        }
      </>)}
    </Box>)
}

export default Navigation
