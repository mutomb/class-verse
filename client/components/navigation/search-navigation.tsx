import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'
import { SearchButton } from '../styled-buttons'
import { Typography, typographyClasses } from '@mui/material'

interface SearchNavigation{
  onClick?: ()=>void, 
  variant?: 'column' | 'row'
}

const SearchNavigation: FC<SearchNavigation> = ({onClick, variant}) => {
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const scrollToAnchor = (destination:string) => {
    onClick && onClick()
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 0,
      smooth: true,
      offset: -10,
    })
  }
  const goToHomeAndScroll = (destination:string) => {
    history.push('/')
    let delayedScroll=setTimeout(()=>{scrollToAnchor(destination), clearTimeout(delayedScroll)},1000)
  }
  return (
        <Box
          sx={{position: 'relative', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', px: { xs: 0, md: 1 }, mb: 0,
            ...(variant==='column' && {
              justifyContent: 'flex-start', textDecoration: 'none',
              [`& .${typographyClasses.root}`]:{fontWeight: 600, fontSize: '1rem', color: 'text.disabled'}, cursor:'pointer',
              '&:hover': {textDecoration: 'none', bgcolor: 'secondary.main' }, py: 1, my:1, px: { xs: 1, md: 3 }, borderTopRightRadius: 10, borderBottomRightRadius: 10,
            })
          }}>
          <SearchButton onClick={location===''?()=>scrollToAnchor('search') : ()=>goToHomeAndScroll('search')}> 
          {variant ==='column' && <Typography>Search</Typography>}
          </SearchButton>
        </Box>)
}

export default SearchNavigation
