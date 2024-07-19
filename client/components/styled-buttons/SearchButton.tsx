import React, { FC } from 'react'
import { Box, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

interface SearchButton {
    onClick?: () => void,
    children: ReactNode,
  }
const SearchButton: FC<SearchButton> = ({onClick, children}) => {
  const {  transitions } = useTheme()
  return (
  <Box component='span' onClick={onClick} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', m: 0, p:0}}>
    <IconButton
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        transform: 'unset',
        transition: transitions.create(['transform','background-color'], {duration: 500}),
        borderRadius: '50% !important',
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText', 
          transform: 'translateY(-3px) scale(1.1)'        
        }
      }}
      disableRipple
      onClick={onClick}
    >
      <Search sx={{ fontSize: 22 }} />
    </IconButton>
      {children}
    </Box>
  )
}
export default SearchButton