import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { ScrollToTop } from '../components/styled-buttons'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <Box component="main">
      <Header  />
      {children}
      <ScrollToTop />
      <Footer />
    </Box>
  )
}

export default MainLayout
