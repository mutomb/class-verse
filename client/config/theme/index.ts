import { createTheme as createMuiTheme, Theme } from '@mui/material/styles'

import typography from './typography'
import paletteBase from './palette-base'
import paletteLight from './palette-light'
import paletteDark from './palette-dark'
import {DarkShadows, LightShadows} from './shadows'

/*
***Augment the DefaultTheme (empty object) in @mui/styles with Theme from the core.
***Prevents Property "palette", "spacing" does not exist on type 'DefaultTheme' Warning
*/
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

// default
let shadows = DarkShadows;
const createTheme = (mode?: 'dark' | 'light'): Theme => {
  const palette = mode !== 'light' ? { ...paletteBase, ...paletteDark } : { ...paletteBase, ...paletteLight }
  shadows = mode === 'light' ? DarkShadows : LightShadows; 
  return createMuiTheme({
    palette,
    typography,
    shadows,
  })
}

const theme = createTheme

export { paletteBase, paletteLight, paletteDark, typography, shadows }
export default theme
