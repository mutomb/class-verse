import React, { FC, useState } from 'react'
import { Logo } from '../logo'
import { Navigation, AuthNavigation, ProfileNavigation, SearchNavigation, CartNavigation} from '../navigation'
import { Menu, Close } from '@mui/icons-material'
import { ColorModeButton } from '../styled-buttons'
import { AppBar, Toolbar, Box, Slide, Container, IconButton,useMediaQuery, useTheme, useScrollTrigger} from '@mui/material'
import { scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'
import { cart } from '../cart'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'), {defaultMatches: true}) /**enables SSR defaultMatches */
  const trigger = useScrollTrigger();
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()

  const isActive = (path: string) => {
    return location === path
  }

  const scrollToAnchor = (destination:string) => {
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -10
    })
  }
  const goToHomeAndScroll = (destination:string) => {
    history.push('/')
    let delayedScroll=setTimeout(()=>{scrollToAnchor(destination), clearTimeout(delayedScroll)},1000) 
  }

  const onClickLogo = () => {
      isActive("")? scrollToAnchor('search') : goToHomeAndScroll('search')
  }

  return (
    <Slide id="app-bar" appear={true} direction="down" in={!trigger || cart.itemTotal()>0} color='inherit'>
      <AppBar position="sticky" color='inherit' enableColorOnDark={true} sx={{boxShadow: 2}}>
       <Toolbar sx={{ backgroundColor: 'inherit', width:'100%', px: {xs: 0, sm: 'unset'} }}>
          <Box sx={{ backgroundColor: 'inherit', width:'100%', mx:0 }}>
            <Container sx={{ py: { xs: 2, md: 2 }, px: {xs: 0, sm: 'unset'}}}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'visible' }}>
                <Logo onClick={onClickLogo}/>
                <Box sx={{ mx: 'auto', display: { xs: 'inline-flex', md: 'none' } }}>
                  <CartNavigation />
                </Box>
                <Box sx={{ ml: 'auto', display: { xs: 'inline-flex', md: 'none' } }}>
                  <IconButton 
                  sx={{
                    position: 'fixed',
                    top: 20,
                    right: {xs: 10, sm: 20},
                  }}
                  onClick={() => setVisibleMenu(!visibleMenu)}>
                    <Menu sx={{color: 'primary.main'}} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', md: 'row' },

                    transition: (theme) => theme.transitions.create(['top']),
                    ...(matchMobileView && {
                      py: 6,
                      backgroundColor: 'background.paper',
                      zIndex: 'appBar',
                      position: 'fixed',
                      height: { xs: '100vh', md: 'auto' },
                      top: visibleMenu ? 0 : '-120vh',
                      left: 0,
                    }),
                  }}
                >
                  <Box /> {/* Magic space */}
                  <Navigation {...( matchMobileView && {onClick: () => setVisibleMenu(false)})} />
                  <SearchNavigation {...( matchMobileView && {onClick: () => setVisibleMenu(false)})} />
                  <ProfileNavigation {...( matchMobileView && {onClick: () => setVisibleMenu(false)})} />
                  <CartNavigation {...( matchMobileView && {onClick: () => setVisibleMenu(false)})} />
                  <AuthNavigation {...( matchMobileView && {onClick: () => setVisibleMenu(false)})} />
                  <ColorModeButton {...( matchMobileView && {onClick: () => setVisibleMenu(false)})} />
                  {visibleMenu && matchMobileView && (
                    <IconButton
                      sx={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                      }}
                      onClick={() => setVisibleMenu(!visibleMenu)}
                    >
                      <Close sx={{color: 'primary.main'}} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Container>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>)
}

export default Header
