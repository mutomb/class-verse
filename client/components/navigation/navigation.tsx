import React, { FC, useState, MouseEvent } from 'react'
import Box from '@mui/material/Box'
import { Link as ScrollLink, scroller } from 'react-scroll'
import { navigations } from './navigation.data'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import { Link, useHistory, useLocation } from 'react-router-dom'
import {useAuth} from '../auth'
import { StyledButton } from '../styled-buttons'
import { Menu, MenuItem, avatarClasses, iconButtonClasses, menuItemClasses, typographyClasses } from '@mui/material'
import { AdminPanelSettings, ExpandLess, ExpandMore, LocalLibrary } from '@mui/icons-material'
import type { Navigation } from '../../interfaces/navigation'
interface NavigationProps{
  onClick?: ()=> void,
  orientation?: 'row' | 'column'
}

const Navigation: FC<NavigationProps> = ({onClick, orientation}) => {
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const {isAuthenticated} = useAuth()
  const [anchor, setAnchor] = useState<{anchorEl: null | HTMLElement, path: string, subpaths: Navigation[]}>({anchorEl:null, path: '', subpaths: []});
  const open = Boolean(anchor.anchorEl);
  const showMore = (path: string, subpaths: Navigation[])=>(event: MouseEvent<HTMLElement>) => {
    setAnchor({...anchor, anchorEl: event.currentTarget, path: path, subpaths: subpaths});
  };

  const hideMore = () => {
    setAnchor({...anchor, anchorEl: null, path: '', subpaths: []});
  }

  const scrollToAnchor = (anchor:string) => {
    onClick && onClick()
    scroller.scrollTo(anchor, {
      duration: 1500,
      delay: 0,
      smooth: true,
      offset: -10,
    })
  }
  const goToAndScrollToAnchor = (path:string, anchor: string) => {
    history.push(`/${path}`)
    let delayedScroll=setTimeout(()=>{scrollToAnchor(anchor), clearTimeout(delayedScroll)},1000)
  }
  
  return (
    <Box sx={{display: 'flex', flexDirection: { xs: 'column-reverse', sm: orientation? `${orientation}-reverse`:'row' }, alignItems: 'center', justifyContent: 'center'}}>
      {navigations.map(({path, subpaths, label }, index) => {
        if (isAuthenticated().user && ['hero', 'testimonial', 'about'].includes(path)) return null
        else{
          return(<>
          <Box component='span' key={path} {...((subpaths && subpaths.length>0) && {onClick:showMore(path, subpaths)})}>
            <Box
              {...((!subpaths || subpaths.length<1) && 
              {onClick:location===''?()=>scrollToAnchor(path) :()=>goToAndScrollToAnchor('', path),
              component:ScrollLink, activeClass:"current", spy: true, smooth: true, duration: 350
              })}
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
                px: { xs: 1, md: 3 },
                fontSize: { xs: '1.2rem !important', md: '1.3rem !important' },
                ...(path === '/' && {
                  color: 'primary.main',
                }),
                '& > span': { display: 'none' },
                '&.current>span': { display: 'block' },
                '&.current': { color: 'primary.main' },
                '&:hover': {
                  color: 'primary.main',
                  '&>span': {
                    display: orientation ==='column' ?'none':'block',
                  },
                  [`& .${avatarClasses.root}`]: {color: 'primary.main'}
                },
                ...(orientation==='column' && {
                  justifyContent: 'flex-start', py: 3, width: '100%', textDecoration: 'none', fontSize: { xs: '1rem !important', md: 'inherit' }, [`& .${typographyClasses.root}`]:{fontWeight: 600}, color: 'text.disabled', cursor:'pointer', 
                  borderTopRightRadius: 10, borderBottomRightRadius: 10, '&:hover': { color: 'primary.main', textDecoration: 'none', bgcolor: 'secondary.main' }
                })
              }}>
              <Box
                component='span'
                sx={{
                  position: 'absolute',
                  top: 15,
                  transform: 'rotate(3deg) scale(1.1)',
                  '& img': { width: 44, height: 'auto' },
                }}
              >
                {/* eslint-disable-next-line */}
                <img src={HeadLineCurve} alt="Headline curve" />
              </Box>
              {label} {subpaths && subpaths.length>0 && (anchor.path === path ? <ExpandLess /> : <ExpandMore />)}
            </Box>
          </Box>
          </>)
        }
      })}
      <Menu
        anchorEl={anchor.anchorEl}
        id="naviation-menu"
        open={open}
        onClose={hideMore}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: -3, horizontal: 'center'}}
        slotProps={{
          paper:{
            elevation: 0,
            sx: {
              overflow: 'visible',
              // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
              bgcolor: (theme)=> theme.palette.mode ==='dark'?`rgba(0,0,0,0.7)`:`rgba(255,255,255,0.7)`, 
              [`& .${avatarClasses.root}`]: {
                width: 32,
                height: 32,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }
        }}
        sx={{
          [`& .${iconButtonClasses.root}`]:{
            backgroundColor: 'background.paper',
            color: 'primary.main',
            transform: 'unset',
          },
          [`& .${menuItemClasses.root}`]:{
            transform: 'unset',
            ':hover':{
              backgroundColor: 'primary.main', color: 'primary.contrastText', 
              transition: (theme) => theme.transitions.create(['transform','background-color'], {duration: 500}),
              [`& .${iconButtonClasses.root}`]:{
                transition: (theme) => theme.transitions.create(['transform','background-color'], {duration: 500}),
                backgroundColor: 'primary.main', color: 'primary.contrastText', 
                transform: 'translateY(-3px) scale(1.2)',
                border: 'none !important',
              }
            }, 
        }
        }}>
          {anchor && anchor.anchorEl && anchor.subpaths && anchor.subpaths.map(({path, subpaths, label }, index)=>{
            return(
              <MenuItem key={label+index}>
                <Box sx={{width: '100%', height: '100%'}}
                {...((!subpaths || subpaths.length<1) && 
                {onClick:location === anchor.path?()=>scrollToAnchor(path) : ()=>goToAndScrollToAnchor(anchor.path, path),
                component:ScrollLink, activeClass:"current", spy: true, smooth: true, duration: 350
                })}>
                  {label}
                </Box>
              </MenuItem>)
          })}
      </Menu>
      { isAuthenticated().user && (
      <Box sx={{with: '100%', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', justifyContent: 'space-between', '& > a':{ py: {xs: 2, sm: 1, md: 0}} }}>
        {isAuthenticated().user.specialist && (
          <Link onClick={()=> onClick && onClick()} to="/specialist/courses">
            <StyledButton disableHoverEffect={false} color='secondary' variant="outlined">
              <LocalLibrary sx={{verticalAlign: 'text-top'}}/> Teach
            </StyledButton>
          </Link>)
          }
          {isAuthenticated().user.role === 'admin' && 
          (<Link onClick={()=> onClick && onClick()} to="/admin" style={{marginLeft: 4}}>
            <StyledButton disableHoverEffect={false} color='secondary' variant="outlined">
              <AdminPanelSettings sx={{verticalAlign: 'text-top'}}/> Admin
            </StyledButton>
          </Link>)
          }
        {!isAuthenticated().user.specialist && (
          <Link onClick={()=> onClick && onClick()} to="/client/courses">
            <StyledButton disableHoverEffect={false} color='secondary' variant="outlined">
              <LocalLibrary sx={{verticalAlign: 'text-top'}}/> Learn 
            </StyledButton>
          </Link>)
        }
      </Box>)}
    </Box>)
}

export default Navigation
