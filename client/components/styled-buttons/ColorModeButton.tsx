import React, { FC, useState } from 'react'
import { Box, IconButton, Menu, MenuItem, avatarClasses } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useAuth } from '../auth'
import { update } from '../setting'
import { useColorMode } from '../../config/theme/MUItheme-hooks'
import { SettingsBrightnessTwoTone } from '@mui/icons-material'

interface ColorModeButton{
  onClick?: ()=>void
}
const ColorModeButton: FC<ColorModeButton> = ({onClick}) => {
  const {isAuthenticated} = useAuth()
  const {toggleColorMode, getColorMode} = useColorMode()
  const theme = useTheme();
  const [error, setError] = useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onToggleColorMode = (value) => {
    toggleColorMode(value, ()=>{
      if(isAuthenticated().user){ 
        update({
          userId: isAuthenticated().user._id
        }, {
          token: isAuthenticated().token
        }, {colorMode: value}).then((data) => {
          if (data && data.error) {
            setError(error)
          } else {
           setError('')
          }
        })
      }
      onClick && onClick()
    })
    handleClose()
  }
  return (<>
      <IconButton
        aria-controls={open ? 'more-color-mode-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          bgcolor: 'background.paper', 
          color: 'text.primary',
          ml: 1,
          zIndex: 10,
          display: 'inline-flex',
          alignItems: 'center',
          userSelect: 'none',
          transform: 'unset',
          position: 'relative',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          WebkitTapHighlightColor: 'transparent',
          verticalAlign: 'middle', 
          ':hover':{
            boxShadow: 2,
            transform: 'translateY(-3px)',
            transition: theme.transitions.create(['transform'], {duration: 500})
          } }}
        onClick={handleClick}
        disableRipple={true}
      > 
        {getColorMode() === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
      <Menu
      id="color-mode-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'color-mode-menu-button',
      }}
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
          },
        }
      }}>
      { ['dark', 'light', 'system'].map((value, index)=>{
        return(
          <MenuItem key ={index} onClick={()=>onToggleColorMode(value)} sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
            <Box component='label' style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
              {value==='dark' && (<><Brightness7Icon sx={{ml: 1, verticalAlign: 'text-top'}} />Dark Mode</>) }
              {value==='light' && (<><Brightness4Icon sx={{ml: 1, verticalAlign: 'text-top'}} />Light Mode</>) }
              {value==='system' && (<><SettingsBrightnessTwoTone sx={{ml: 1, verticalAlign: 'text-top'}} />System Default</>)}
            </Box> 
          </MenuItem>
        )
      })
        }
      </Menu>
  </>);
}
export default ColorModeButton