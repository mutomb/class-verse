import React, { FC, useContext, useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
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
            transition: theme.transitions.create(['transform'])
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
      }}>
      { ['dark', 'light', 'system'].map((value, index)=>{
        return(
          <MenuItem key ={index} onClick={()=>onToggleColorMode(value)} sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
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