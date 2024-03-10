import React from 'react'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import nocache from './helpers/nocache'
import Template from './template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import courseRoutes from './routes/course.routes'
import enrollmentRoutes from './routes/enrollment.routes'
// modules for server side rendering
import {renderToPipeableStream} from 'react-dom/server'
import MainRouter from '../client/MainRouter'
import { MainLayout } from '../client/layout'
import { StaticRouter } from 'react-router-dom'
import { MUIProvider } from '../client/providers'
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react'
import {createEmotionCache} from './helpers'
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
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist'), {index:false}))
app.use('/favicon.ico', express.static(path.join(CURRENT_WORKING_DIR, '../public/'), {index:false}))
// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)
//catches all GET requests
app.get('*', (req, res) => {
    // Context to extract the critical url for the redirect route.
    const context = {}
    // Server-side cache, shared for every request to the same page view.
    const serverSideEmotionCache = createEmotionCache()
    const {pipe} = renderToPipeableStream(
      Template(<CacheProvider value={serverSideEmotionCache}>
        <MUIProvider>
          <CssBaseline enableColorScheme={true} />
          <StaticRouter location={req.url} context={context}>
            <MainLayout> 
             <MainRouter/>
            </MainLayout>
          </StaticRouter>
        </MUIProvider>
      </CacheProvider>), {
      bootstrapScripts: ['/dist/js/bundle.js'],
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
    // If redirect request then redirect without SSR
    if (context.url) {
      return res.redirect(303, context.url)
    }
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
