import React, { useContext } from 'react'
import { IconButton, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ColorModeContext from '../../config/theme/color-context';

export default function ColorModeButton() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
      <IconButton
        sx={{ ml: 1, 
          ':hover':{
            transform: 'translateY(-3px)',
            transition: theme.transitions.create(['transform'])
          } }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
        disableRipple={true}
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
  );
}