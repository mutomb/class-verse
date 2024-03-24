import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { ScrollToTop } from '../components/styled-buttons'
import { SideBar } from '../components/sidebar'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <Box component="main" sx={{display:'flex', flexDirection:'column', minHeight:'100vh'}}>
      <Header />
      <SideBar />
        {children}
      <ScrollToTop />
      <Footer />
    </Box>
  )
}

export default MainLayout
