import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import nocache from './helpers/nocache'
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import courseRoutes from './routes/course.routes'
import enrollmentRoutes from './routes/enrollment.routes'

// modules for server side rendering
import React from 'react'
//import ReactDOMServer from 'react-dom/server'
import {renderToPipeableStream} from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import { StaticRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { ServerStyleSheets } from '@mui/styles'
import { StyledEngineProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from './createEmotionCache'
// const slick = require('slick-carousel/slick/slick')
// import theme from './../client/theme'
import theme from '../client/temp/config/theme'

//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
devBundle.compile(app)

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())
// sets some HTTP response headers to try to disable client-side caching
app.use(nocache())
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)

app.get('*', (req, res) => {
     // Emotion cache instance to extract the critical MUI emotion styles for the html.
    const cache = createEmotionCache();
    // const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    
    // Context to extract the critical url for the redirect route.
    const context = {}
    // const App =() =>(
    //   <CacheProvider value={cache}>
    //     {/* <StyledEngineProvider injectFirst={false}> */}
    //       <ThemeProvider theme={theme}>
    //         <CssBaseline enableColorScheme />
    //         <StaticRouter location={req.url} context={context}>
    //           <MainRouter />
    //         </StaticRouter>
    //       </ThemeProvider>
    //     {/* </StyledEngineProvider> */}
    //   </CacheProvider>
    // )
    // Render the component to a Node.js stream
    const {pipe} = renderToPipeableStream(
      Template(<CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <StaticRouter location={req.url} context={context}>
            <MainRouter />
          </StaticRouter>
        </ThemeProvider>
      </CacheProvider>), {
      bootstrapScripts: ['/dist/bundle.js'],
      onShellReady() {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        pipe(res);
      },
      onError(error) {
        console.error(error);
        // logServerCrashReport(error);
      }
    });
    
    // Grab the critical CSS from emotion styles
    // const emotionChunks = extractCriticalToChunks(html);
    // const emotionCss = constructStyleTagsFromChunks(emotionChunks);
    
    // If redirect request then redirect without SSR
    if (context.url) {
      return res.redirect(303, context.url)
    }
    
    // const css = sheets.toString()
    // Send the rendered page back to the client
    // res.status(200).send(Template({
    //   markup: html,
    //   css: emotionCss
    // }))

})

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
  }
})

export default app
