import React, { FC, useState } from 'react'
import { Logo } from '../../components/logo'
import { Navigation, AuthNavigation } from '../../components/navigation'
import { Menu, Close } from '@mui/icons-material'
import { ColorModeButton } from '../styled-buttons'
import { AppBar, Toolbar, Box, Slide, Container, IconButton,useMediaQuery, useTheme, 
  useScrollTrigger} from '@mui/material'

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  const { breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))
  const trigger = useScrollTrigger();
  return (
    <>
    <Slide id="app-bar" appear={false} direction="down" in={!trigger} color='inherit'>
      <AppBar position="fixed" color='inherit' enableColorOnDark={true}>
       <Toolbar sx={{ backgroundColor: 'inherit', width:'100%' }}>
          <Box sx={{ backgroundColor: 'inherit', width:'100%', mx:0 }}>
            <Container sx={{ py: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Logo />
                <Box sx={{ ml: 'auto', display: { xs: 'inline-flex', md: 'none' } }}>
                  <IconButton onClick={() => setVisibleMenu(!visibleMenu)}>
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
                  <Navigation />
                  <AuthNavigation />
                  <ColorModeButton/>
                  {visibleMenu && matchMobileView && (
                    <IconButton
                      sx={{
                        position: 'fixed',
                        top: 10,
                        right: 10,
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
    </Slide>
    <Toolbar />
  </>
  )
}

export default Header
