import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'
import { SearchButton } from '../styled-buttons'

interface SearchNavigation{
  onClick?: ()=>void
}

const SearchNavigation: FC<SearchNavigation> = ({onClick}) => {
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
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box
          sx={{
            position: 'relative',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 0, md: 3 },
            mb: { xs: 3, md: 0 },
          }}
        >
          <SearchButton onClick={location===''?()=>scrollToAnchor('search') : ()=>goToHomeAndScroll('search')}/>
        </Box>
    </Box>)
}

export default SearchNavigation
