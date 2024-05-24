import React, { FC } from 'react'
import { IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

interface SearchButton {
    onClick?: () => void
  }
const SearchButton: FC<SearchButton> = (props) => {
  const { onClick } = props
  const {  transitions } = useTheme()
  return (
    <IconButton
      sx={{
        backgroundColor: 'background.paper',
        color: 'primary.main',
        transform: 'unset',
        transition: transitions.create(['transform','background-color']),
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText', 
          transform: 'translateY(-3px)'        
        }
      }}
      disableRipple
      onClick={onClick}
    >
      <Search sx={{ fontSize: 22 }} />
    </IconButton>
  )
}
export default SearchButton