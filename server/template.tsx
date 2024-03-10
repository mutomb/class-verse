import React from 'react'
import theme from '../client/config/theme'
// inject the initial component HTML and CSS into a template to be rendered on the client-side
import slick from '../node_modules/slick-carousel/slick/slick.css'
import globals from '../client/styles/globals.css'
import reactSlick from '../client/styles/react-slick.css'

export default (component) => {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Funda Gate</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />

          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.background.paper} />

          <meta content="#fbfbfb" name="theme-color" />
          <meta content="#fbfbfb" name="msapplication-navbutton-color" />
          <meta content="#fbfbfb" name="apple-mobile-web-app-status-bar-style" />
          <meta content="yes" name="apple-mobile-web-app-capable" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,700;1,500;1,700&display=swap"
            rel="stylesheet"
          />
          <style id="slick-server-side"> {slick.toString()} </style>
          <style id="globals-server-side"> {globals.toString()} </style>
        </head>
        <body>
          <div id="root">{component}</div>
          <style id="react-slick-server-side"> {reactSlick.toString()} </style> {/*overrides inline SSR generated MUI styles*/}
        </body>
      </html>)
}
