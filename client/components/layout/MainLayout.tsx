import React, { FC, ReactNode } from 'react'
import {Container} from '@mui/material'
import { Footer } from '../footer'
import { Header } from '../header'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <Container component="main" >
    <Header />
      {children}
      <Footer />
    </Container>
  )
}

export default MainLayout
