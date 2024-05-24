import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Footer } from '../footer'
import { Header } from '../header'
import { ScrollToTop } from '../styled-buttons'
import { SideBar } from '../sidebar'
import {LoadableVisibility } from '../progress'
// const Footer = LoadableVisibility(import('../footer/footer'));

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (<>
      <Header />
      <SideBar />
        <Box component="main" sx={{display:'flex', flexDirection:'column', minHeight:'100vh', backgroundColor: 'inherit'}}> {/*Ensures both atleast 100% viewport given to main (even on empty contain) and sticky footer (hence invisible on page load)*/}
        {children}
        </Box>
      <ScrollToTop />
      <Footer />
      </>)
}

export default MainLayout
