import React from 'react'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
// import {auth} from 'express-openid-connect'
// import {oidcConfig} from './config'
import {nocache} from './helpers'
import Template from './template'
import {userRoutes, authRoutes, courseRoutes, enrollmentRoutes, settingRoutes, defaultRoutes, mediaRoutes, orderRoutes} from './routes'
// modules for SSR
import {renderToPipeableStream} from 'react-dom/server'
import MainRouter from '../client/MainRouter'
import { MainLayout } from '../client/components/layout'
import { StaticRouter } from 'react-router-dom'
import {MUIProvider} from '../client/config/theme/MUItheme-hooks'
import { AuthProvider } from '../client/components/auth'
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react'
import {createEmotionCache} from './helpers'
//For SSR with data
import { matchRoutes } from 'react-router-config'
import routes from './../client/routeConfig'
import 'isomorphic-fetch'

//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()
//comment out before building for production
devBundle.compile(app)

//For SSR with data
const loadBranchData = (location) => {
  const branch = matchRoutes(routes, location)
  const promises = branch.map(({ route, match }) => {
    return route.loadData
      ? route.loadData(branch[0].match.params)
      : Promise.resolve(null)
  })
  return Promise.all(promises)
}

// parse body params and attache them to req.body
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true, limit: '50mb'}))

app.use(cookieParser())
app.use(compress())
// secure apps from XSS by setting various HTTP headers and remove X-POWERED-BY header
app.use(helmet())
app.use(helmet.contentSecurityPolicy({ //Set CSP to ensure no one can inject malicious code
  directives: { 
    defaultSrc: ["'self'"], //sets default source for all types of resources to same origin
    scriptSrc: ["'self'", "*.stripe.com", "'unsafe-inline'", "'unsafe-eval'"], //source for JS scripts to same origin or inline scripts or .stripe.com
    styleSrc: ["'self'","*.googleapis.com", "'unsafe-inline'", "'unsafe-eval'"], //source for styles to same origin or inline styles
    fontSrc: ["'self'","*.googleapis.com", "*.gstatic.com"], //source for fonts to same origin or inline styles
    imgSrc: ["'self'", "data:","blob:", "*.amazonaws.com"], //source for images to same origin, blob:*, data:*, and .amazonawz.com
    mediaSrc: ["'self'", "data:","blob:", "*.amazonaws.com"], //source for video to same origin, blob:*, data:*, and .amazonawz.com
    frameSrc: ["'self'", "*.stripe.com"], //source for JS scripts to same origin or inline scripts or .stripe.com
  } }));  
    
app.use(helmet.referrerPolicy({ policy: 'same-origin' })); //set referrer header (URL user is coming from) only when making requests on same host. Stop publishing of internal routing
// enable CORS, setting Access-Control-Allow-Origin to *, which allows any domain/client to use this API. Sets OPTIONS preflight request, to ensure server trust client
app.use(cors())
// sets some HTTP response headers to try to disable client-side caching
app.use(nocache())
// auth router attaches /login, /logout, and / routes to the baseURL
// app.use(auth(oidcConfig));
// assest routes
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist'), {index:false}))
// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)
app.use('/', orderRoutes)
app.use('/', settingRoutes)
app.use('/', mediaRoutes)
//catches all GET requests
app.get('*', defaultRoutes,  async(req, res) => {
    //React Router can fill context after render with urls, which can be used to manually initiate a redirect.
    const context = {}
    // Server-side cache, shared for every request to the same page view.
    const serverSideEmotionCache = createEmotionCache()

    loadBranchData(req.url).then(data => {
      const {pipe} = renderToPipeableStream(
        Template(
          <AuthProvider auth={req.jwt}>
            <CacheProvider value={serverSideEmotionCache}>
              <MUIProvider setting = {req.setting}>
                  <CssBaseline enableColorScheme={true} />
                  <StaticRouter location={req.url} context={context}>
                    <MainLayout> 
                    <MainRouter data={data}/>
                    </MainLayout>
                  </StaticRouter>
              </MUIProvider>
            </CacheProvider>
          </AuthProvider>
        ), {
        bootstrapScripts: ['/dist/js/bundle.js'],
        onShellReady() {
          if (context.url) {  //If redirect request then manually first redirect to correct route, since StaticRouter cannot redirect
            return res.redirect(303, context.url)
          }
          else{
            res.statusCode = 200;
            res.setHeader('content-type', 'text/html');
            pipe(res);
          }
        },
        onError(error) {
          console.error(error);
          // logServerCrashReport(error);
        }
      });
      
    }).catch(err => {
      res.status(500).send({"error": "Could not load React view with data"})
  })
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
