import React, { FC, ReactNode, useEffect, useTransition} from 'react'
import Box from '@mui/material/Box'
import { Footer } from '../footer'
import { Header } from '../header'
import { ScrollToTop } from '../styled-buttons'
import { ChatBot } from '../chat/chatbot'
import { useColorMode } from '../../config/theme/MUItheme-hooks'
import { LoadingProvider } from '../progress'

interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
 
  const {toggleColorMode, getColorMode} = useColorMode()
  const [isPending, startTransition] = useTransition()

  useEffect(()=>{
    let toDark: any; 
    /** Trick to force non-lazy-loaded components (including header) background color to update in light-mode SSR*/
    if(getColorMode()==='light'){ 
      toggleColorMode('dark', ()=>{})
      toDark = setTimeout(()=>toggleColorMode('light', ()=>{}), 500)
    }
    if(getColorMode()==='dark'){ 
      toggleColorMode('light', ()=>{})
      toDark = setTimeout(()=>toggleColorMode('dark', ()=>{}), 500)
    }
    return function cleanup(){ toDark && clearTimeout(toDark)}
  }, [])

  return (
    <Box sx={{backgroundColor: 'background.paper'}}>
      <Header />
      <LoadingProvider>
        <Box component="main" sx={{display:'flex', flexDirection:'column', minHeight:'88vh', backgroundColor: 'inherit'}}> {/*Ensures both atleast 88% viewport given to main (even on empty contain) and sticky footer (including on page load)*/}
        {children}
        </Box>
      </LoadingProvider>
      <ChatBot />
      <ScrollToTop />
      <Footer />
    </Box>)
}

export default MainLayout
