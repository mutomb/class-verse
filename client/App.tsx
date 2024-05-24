import React, { useEffect }from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import {MUIProvider} from './config/theme/MUItheme-hooks'
import CssBaseline from '@mui/material/CssBaseline';
import CacheProvider from './config/theme/CacheProvider'
import { createEmotionCache } from '../server/helpers';
import { MainLayout } from './components/layout';
// import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './components/auth';
import { LoadingProvider } from './components/progress';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()
/* -CssBaseline initialize css properties with simple baseline to build upon. EnableColorScheme applyies color-scheme on <html> using theme.palette.mode value.
-StyleEngineProvider. InjectFrist Inject Emotion before JSS 
*/
const App = () => {
  /*ummount custom CSS from SSR*/
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
    <AuthProvider>
      {/* <Auth0Provider
      domain="your_ISSUERBASEURL_without_http://"
      clientId="your_client_ID"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}> */}
      <CacheProvider value={clientSideEmotionCache}>
          <MUIProvider>
            <CssBaseline enableColorScheme={true} />
            <BrowserRouter> 
              <MainLayout>
                <LoadingProvider>
                  <MainRouter/>
                </LoadingProvider>
              </MainLayout>
            </BrowserRouter> 
          </MUIProvider>
      </CacheProvider>
    {/* </Auth0Provider> */}
  </AuthProvider>
)}
export default App