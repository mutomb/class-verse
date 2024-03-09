import React, {useEffect}from 'react'
import MainRouter from './MainRouter'
import {BrowserRouter} from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'
//import theme from './theme'
import theme from './temp/config/theme'
// import { hot } from 'react-hot-loader'
import { Theme } from '@mui/material/styles'
import createEmotionCache from '../server/createEmotionCache'
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react'

/*
***Augment the DefaultTheme (empty object) in @mui/styles with Theme from the core.
***Prevents Property "palette", "spacing" does not exist on type 'DefaultTheme' Warning
*/
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

// use the same cache configuration as the server-side.
const cache = createEmotionCache();

/* -CssBaseline initialize css properties with simple baseline to build upon. EnableColorScheme applyies color-scheme on <html> using theme.palette.mode value.
-StyleEngineProvider. InjectFrist Inject Emotion before JSS 
*/
const App = () => {
  useEffect(() => {
    const ssrSlick = document.querySelector('#slick-server-side')
    const ssrGlobal = document.querySelector('#globals-server-side')
    const ssrReactSlick = document.querySelector('#react-slick-server-side')
    if (ssrSlick) {
      ssrSlick.parentNode.removeChild(ssrSlick)
    }
    if (ssrGlobal) {
      ssrGlobal.parentNode.removeChild(ssrGlobal)
    }
    if (ssrReactSlick) {
      ssrReactSlick.parentNode.removeChild(ssrReactSlick)
    }
  }, [])
  return (
    <CacheProvider value={cache}>
      {/* <StyledEngineProvider injectFirst={false}> */}
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <BrowserRouter> 
            <MainRouter/>
          </BrowserRouter> 
        </ThemeProvider>
      {/* </StyledEngineProvider> */}
    </CacheProvider>
)}
export default App
// export default hot(module)(App)
