import React, { FC, useState } from 'react'
import { Logo } from '../logo'
import { Navigation, AuthNavigation, SearchNavigation, CartNavigation} from '../navigation'
import { Menu, Close } from '@mui/icons-material'
import { ColorModeButton } from '../styled-buttons'
import { AppBar, Toolbar, Box, Slide, Container, IconButton,useMediaQuery, useScrollTrigger, boxClasses, ListSubheader, buttonBaseClasses} from '@mui/material'
import { useTheme} from '@mui/material/styles'
import { scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'
import { cart } from '../cart'
import { SideBar } from '../sidebar'
import { useAuth } from '../auth'
import { useColorMode } from '../../config/theme/MUItheme-hooks'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  const { breakpoints } = useTheme()
  const xsMobileView = useMediaQuery(breakpoints.down('sm'), {defaultMatches: true}) /**enables SSR defaultMatches */
  const smMobileView = useMediaQuery(breakpoints.between('sm', 1073), {defaultMatches: true})
  const trigger = useScrollTrigger();
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const {isAuthenticated} = useAuth()
  
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
  const toggleVisibleMenu = () => {
    setVisibleMenu(!visibleMenu)
  }
  

  return (<>
    <Slide id="app-bar" color='inherit' appear={true} direction="down" in={!trigger}>
      <AppBar position={(cart.itemTotal()>0 || isActive('chat'))?'static': "sticky"} enableColorOnDark={true} sx={{boxShadow: 2}}>
       <Toolbar sx={{ width:'100%', px: {xs: 0, sm: 'unset'} }}>
          <Box sx={{ width:'100%', mx:0,bgcolor: 'background.paper', zIndex: 1099 }}>
            <Container maxWidth={false} sx={{ py: { xs: 2, md: 2 }, px: {xs: 0, sm: 'unset'}}}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Logo onClick={onClickLogo}/>
                <Box sx={{display: { xs: 'inline-flex', sm: 'none' }}} /> {/* Magic space */}
                <Box sx={{ mx: 'auto', display: { xs: 'flex', sm: 'none' } }}>
                  <CartNavigation />
                </Box>
                <Box
                  sx={{
                    width: {xs: 'unset', sm:'100%'}, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', ...(smMobileView && {[`& a.${boxClasses.root}`]: {fontSize: '1rem' }}) }}>
                  <Box /> {/* Magic space */}
                  {!xsMobileView  && 
                  (<>
                  <Navigation />
                  <SearchNavigation />
                  <CartNavigation />
                  {!smMobileView  && !(isAuthenticated().user && isAuthenticated().user.role==='admin') &&
                    (<>
                    <AuthNavigation />
                    <ColorModeButton />
                    </>)}
                  </>)}
                  {(smMobileView || xsMobileView || isAuthenticated().user) && 
                  (visibleMenu?
                    (<IconButton onClick={toggleVisibleMenu}>
                      <Close sx={{color: 'primary.main'}} />
                    </IconButton>
                    ):
                    (<Box sx={{ml: {md: 4}, display: 'inline-flex' }}>
                      <IconButton onClick={toggleVisibleMenu}>
                        <Menu sx={{color: 'primary.main'}} />
                      </IconButton>
                    </Box>))}
                </Box>
              </Box>
            </Container>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
    {(smMobileView || xsMobileView || isAuthenticated().user) &&
    (<SideBar open={visibleMenu} toggleDrawer={toggleVisibleMenu}>
        <ListSubheader component="div" inset>
          Navigation
        </ListSubheader>
        <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1, 
        [`.${buttonBaseClasses.root}`]:{ borderRadius: '50% !important'}, [`.${buttonBaseClasses.root}:hover`]:{ backgroundColor: 'transparent !important'},}}>
          <ColorModeButton />
        </Box>
        <Box sx={{[`.${buttonBaseClasses.root}`]:{ borderRadius: '50% !important'}, [`.${buttonBaseClasses.root}:hover`]:{ backgroundColor: 'background.paper'},}}>
         <AuthNavigation orientation='column' onClick={()=>setVisibleMenu(false)} />
        </Box>
        {xsMobileView &&
        (<>
        <SearchNavigation onClick={()=>setVisibleMenu(false)} variant='column'/>
        <Navigation orientation='column' onClick={()=>setVisibleMenu(false)} />
        </>)}
    </SideBar>)}
    </>)
}

export default Header
