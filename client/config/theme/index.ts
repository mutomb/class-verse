import { createTheme as createMuiTheme, Theme } from '@mui/material/styles'

import typography from './typography'
import paletteBase from './palette-base'
import paletteLight from './palette-light'
import paletteDark from './palette-dark'
import shadows from './shadows'

/*
***Augment the DefaultTheme (empty object) in @mui/styles with Theme from the core.
***Prevents Property "palette", "spacing" does not exist on type 'DefaultTheme' Warning
*/
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

// default
const createTheme = (darkMode?: boolean): Theme => {
  const palette = darkMode ? { ...paletteBase, ...paletteDark } : { ...paletteBase, ...paletteLight }
  return createMuiTheme({
    palette,
    typography,
    shadows,
  })
}

const theme = createTheme(false)

export { paletteBase, paletteLight, paletteDark, typography, shadows }
export default theme
