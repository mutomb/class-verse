import React from 'react'
import theme from './client/temp/config/theme'
import slickStyles from './node_modules/slick-carousel/slick/slick.css'
import globalStyles from './client/temp/styles/globals.css'
import reactslickStyles from './client/temp/styles/react-slick.css'
// inject the initial component HTML and CSS into a template to be rendered on the client-side
export default (component) => {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Funda Gate</title>
          <style>{slickStyles}</style>
          <style>{globalStyles}</style>
          <style>{reactslickStyles}</style>
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
        </head>
        <body>
          <div id="root">{component}</div>
        </body>
      </html>)
}
