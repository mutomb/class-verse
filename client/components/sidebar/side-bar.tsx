import React, { FC, ReactNode, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Toolbar, IconButton, List, buttonBaseClasses, svgIconClasses, listSubheaderClasses, ListItem, 
  ListItemButton, typographyClasses, ListItemText, Link as MuiLink, Fade, useScrollTrigger, Box, ListSubheader} from '@mui/material';
import {ChevronLeftRounded, ChevronRightRounded, Lock} from '@mui/icons-material';
import {useAuth} from '../auth'
import { useTheme } from '@mui/material/styles'
import NavigationSide from '../navigation/side-navigation';
import { Link } from 'react-router-dom'
import logo from '../../public/logo.svg'

interface SideBarProps{
  children?: ReactNode[],
  open: boolean,
  toggleDrawer: () => void
}
const SideBar: FC<SideBarProps> = ({children, open, toggleDrawer}) => {
  const theme = useTheme();
  const trigger = useScrollTrigger();
  const {isAuthenticated} = useAuth()
  
  return (<>
        <Fade in={trigger}>
          <Box>
            <Toolbar
              sx={{
                display: !open? 'relative':'none',
                zIndex: 1100,
                alignItems: 'center',
                justifyContent: 'center',
                height: 64,
                width: {xs: 50, sm: 70, md: 90 },
                boxShadow: theme.shadows[3],
                p:0,
                alignSelf: 'center',
                position: 'fixed',
                bottom: {xs: '20%', md:'50%'},
                top: {xs: '80%', md:'50%'},
                right: -20,
                transform: 'unset',
                ':hover': {
                    transform: 'translateX(-5px) scale(1.1)',  
                    backgroundColor: 'secondary.main',
                    right: 0,
                    transition: theme.transitions.create(['transform', 'right','background-color'], {duration: 500}),                 
                },
                border: '1px solid',
                borderColor:'primary.contrastText',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&::before': {
                  content: '""',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  opacity: 0.5,
                },
                '& > div':{
                  position: 'relative'
                }
              }}>
              <IconButton onClick={toggleDrawer} 
                  sx={{ border: open? '1px solid': 'none',
                    backgroundColor: open? 'primary.main': 'unset',
                    borderColor: 'primary.contrastText',
                    color: 'primary.contrastText',
                    ':hover': { backgroundColor: open? 'secondary.main': 'unset'}
                  }}>
                {!open? <ChevronLeftRounded /> : <ChevronRightRounded />}
              </IconButton>
            </Toolbar>
          </Box>
        </Fade>
        <Drawer anchor='right' elevation={2} open={open} onClose={toggleDrawer} transitionDuration={1000} 
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: 'background.paper',
              border: 'none',
              display: 'flex', 
              flexDirection:'row-reverse',
              justifyContent:'flex-end',
              width: {xs: '100%', sm: '50%', md: '40%', lg: '25%', xl: '20%'},
              borderTopLeftRadius: {xs: 100, sm: 150, md: 200, lg: 150, xl:  150},
              boxSizing: 'border-box',
              '&::before': {
                content: '""',
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundImage:  `url(${logo})`,
                backgroundRepeat: 'repeat-y',
                backgroundSize: 'auto',
                opacity: 0.3,
              },
              '& > ul':{
                position: 'relative',
              }
            },
          }}
        >
          <List component="nav" sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: 'initial',
            py: 10,
            textWrap: 'nowrap',
            [`.${buttonBaseClasses.root}`]:{ 
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            },
            [`.${buttonBaseClasses.root}:hover`]:{ 
              backgroundColor: 'secondary.main',
            },
            [`.${svgIconClasses.root}`]:{ 
              color: 'primary.main',
            },
            [`.${listSubheaderClasses.root}`]:{ 
              backgroundColor: 'background.default',
              width: '100%', 
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }
            }}>
              {!isAuthenticated().user && (
                <Link to={'/signin'} style={{textDecoration: 'none'}} onClick={toggleDrawer}>
                  <MuiLink
                    component='span'
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      mb: 1,
                      fontSize: { xs: '1rem', md: 'inherit' },
                      [`& .${typographyClasses.root}`]:{fontWeight: 600},
                      color: 'text.disabled',
                      cursor:'pointer',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'none'
                      }}}>
                  <ListItemButton>
                    <ListItem sx={{width: 40}}>
                      <Lock />
                    </ListItem>
                    <ListItemText sx={{color: 'text.primary'}} primary={'Login for more options'}/>
                  </ListItemButton>
                </MuiLink>
                </Link>)
              }                
              {isAuthenticated().user && (<NavigationSide userID={isAuthenticated().user._id}/>)}
              {children}
          </List>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'initial',
              p:0,
            }}
          >
            <IconButton onClick={toggleDrawer} 
            sx={{ border: '1px solid',
                  backgroundColor: 'primary.main',
                  borderColor: 'primary.contrastText',
                  color: 'primary.contrastText',
                  ':hover': { backgroundColor: 'secondary.main',
                  transition: theme.transitions.create(['transform'], {duration: 500}),
                  transform: 'translateX(-3px) scale(1.1)' 
                }
                }}>
              {!open? <ChevronLeftRounded /> : <ChevronRightRounded />}
            </IconButton>
          </Toolbar>
        </Drawer>
        </>);
}

export default SideBar