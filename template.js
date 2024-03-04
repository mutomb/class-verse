import theme from './client/temp/config/theme'

export default ({markup, css}) => {
    return `<!doctype html>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charset="utf-8">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          >
          <title>Funda Gate</title>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />

          <!-- PWA primary color -->
          <meta name="theme-color" content=${theme.palette.background.paper} />

          <meta content="#fbfbfb" name="theme-color" />
          <meta content="#fbfbfb" name="msapplication-navbutton-color" />
          <meta content="#fbfbfb" name="apple-mobile-web-app-status-bar-style" />
          <meta content="yes" name="apple-mobile-web-app-capable" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,700;1,500;1,700&display=swap"
            rel="stylesheet"
          />
          <style>
              a{
                text-decoration: none;
                color: #bb4d00
              }
          </style>
        </head>
        <body style="margin:0">
          <div id="root">${markup}</div>
          <style id="jss-server-side">${css}</style>
          <script type="text/javascript" src="/dist/bundle.js"></script>
        </body>
      </html>`
}
