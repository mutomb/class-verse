import React, { FC, MouseEvent, useState } from 'react'
import {Box, Menu, MenuItem, ListItemIcon, Divider, Tooltip, IconButton, iconButtonClasses, menuItemClasses, avatarClasses, typographyClasses, Typography } from '@mui/material'
import {PersonAdd, Logout} from '@mui/icons-material';
import { useHistory} from 'react-router-dom'
import {useAuth} from '../auth'
import { useColorMode } from '../../config/theme/MUItheme-hooks'
import {ProfileNavigation} from '.';

interface AuthNavigation{
  onClick?: ()=> void
  orientation?: 'column' | 'row'
}
const AuthNavigation: FC<AuthNavigation> =  ({onClick, orientation}) => {
  const {clearJWT, isAuthenticated} = useAuth()
  const {clearPreference} = useColorMode()
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const showMore = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = async () => {
    clearJWT(() => {clearPreference(); history.push('/'); onClick && onClick()})
    handleClose()    
  }
  const signIn = async () => {
    history.push('/signin'); onClick && onClick()  
    handleClose()  
  }
  const signUp = async () => {
    history.push('/signup'); onClick && onClick() 
    handleClose()   
  }
  const profile = async () => {
    isAuthenticated().user && history.push("/user/" + isAuthenticated().user._id); 
    onClick && onClick()  
    handleClose()  
  }
  return (<>
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%', 
              ...(orientation==='column' && {
                justifyContent: 'flex-start', width: '100%', textDecoration: 'none',
                [`& .${typographyClasses.root}`]:{fontWeight: 600, fontSize: '1rem', color: 'text.disabled'}, cursor:'pointer',
                '&:hover': {textDecoration: 'none', bgcolor: 'secondary.main' }, py: 1, my:1, px: { xs: 1, md: 3 }, borderTopRightRadius: 10, borderBottomRightRadius: 10,
              })}}>
        <ProfileNavigation onClick={showMore}> 
          {orientation === 'column' && <Typography>Profile</Typography>} 
        </ProfileNavigation>
    </Box>
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      transformOrigin={{vertical: -3, horizontal: 'center'}}
      slotProps={{
        paper:{
          elevation: 0,
          sx: {
            overflow: 'visible',
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
      {isAuthenticated().user?
      (<>
      <MenuItem onClick={profile}>
          <ListItemIcon>
            <ProfileNavigation /> 
          </ListItemIcon>
          Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={signOut}>
        <ListItemIcon>
          <IconButton size='small'>
            <Logout fontSize="small"/>
          </IconButton>
        </ListItemIcon>
        Logout
      </MenuItem>
      </>):
      (<>
      <MenuItem onClick={signIn}>
          <ListItemIcon>
              <ProfileNavigation/>
          </ListItemIcon>
          Sign In
      </MenuItem>
      <MenuItem onClick={signUp}>
          <ListItemIcon>
            <IconButton size='small'>
              <PersonAdd fontSize="small"/>
            </IconButton>
          </ListItemIcon>
          Sign Up
      </MenuItem>
      </>)}
    </Menu>
    </>
)}

export default AuthNavigation
