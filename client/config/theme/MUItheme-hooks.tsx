import React, { FC, ReactNode, useState, useMemo, createContext, useContext, useEffect, useTransition } from 'react'
import { ThemeProvider, responsiveFontSizes} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import {createTheme} from '.'
import { useAuth } from '../../components/auth'


export const ColorModeContext = createContext({
  mode: '',
  toggleColorMode: (value, cb) => {},
  getColorMode: () => {},
  clearPreference: () => {},
  theme:{}
}) 
export const useColorMode = () => useContext(ColorModeContext)

interface Props {
  children: ReactNode,
  setting?: any
}
/** pass colorMode and functionalities deep down components tree without explicitly passing props */
export const MUIProvider: FC<Props> = ({ children, setting}) => {
  const isSystemDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {defaultMatches: true});
  const [mode=setting && setting.colorMode? setting.colorMode: 'system', setMode] = useState<'dark'|'light'|'system'>();
  const {isAuthenticated, hasCookie} = useAuth()
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    let sessionColorMode = JSON.parse(sessionStorage.getItem('jwt')!) && JSON.parse(sessionStorage.getItem('jwt')!).setting && JSON.parse(sessionStorage.getItem('jwt')!).setting.colorMode 
    let localColorMode = JSON.parse(localStorage.getItem('jwt')!) && JSON.parse(localStorage.getItem('jwt')!).setting && JSON.parse(localStorage.getItem('jwt')!).setting.colorMode 
    startTransition(()=>{
      if(sessionColorMode && ['dark', 'light', 'system'].includes(sessionColorMode)) {
        return toggleColorMode(sessionColorMode, ()=>{}) 
      }     
      if(localColorMode && ['dark', 'light', 'system'].includes(localColorMode)) {
        return toggleColorMode(localColorMode, ()=>{}) 
      }
    });
  }, []);

  const toggleColorMode = (value:'dark' | 'light' | 'system', cb) => {
    setMode(()=>{
      if (typeof window !== 'undefined' && isAuthenticated().user && hasCookie()){ /** Only persist color preference accross tabs if user logged and has cookies*/
        let jwt = JSON.parse(localStorage.getItem('jwt')!)
        if(!jwt) return value
        jwt.setting = {...jwt.setting, colorMode: value}
        localStorage.setItem('jwt', JSON.stringify(jwt))
      }
      if (typeof window !== 'undefined' && isAuthenticated().user){ /** Only persist color preference accross tabs if user logged and has cookies*/
        let jwt = JSON.parse(sessionStorage.getItem('jwt')!)
        if(!jwt) return value
        jwt.setting = {...jwt.setting, colorMode: value}
        sessionStorage.setItem('jwt', JSON.stringify(jwt))
      }
      return value
    })    
    cb()
  }
  
  const getColorMode = () => {
    /** During SSR find in context*/      
    if (typeof window === "undefined"){
      if (mode && ['dark', 'light'].includes(mode)) return mode
      if (mode && mode === 'system') return isSystemDarkMode? 'dark': 'light'
    }
    /** if authenticated during CSR*/   
    if(typeof window !== 'undefined'){
      /**find in localStorage/~cookie */
      if(hasCookie()){
        let localColorMode = JSON.parse(localStorage.getItem('jwt')!) && JSON.parse(localStorage.getItem('jwt')!).setting && JSON.parse(localStorage.getItem('jwt')!).setting.colorMode
        if (localColorMode && ['dark', 'light'].includes(localColorMode)) return localColorMode
        if (localColorMode && localColorMode === 'system') return isSystemDarkMode? 'dark': 'light'
      }
      /**find in sessionStorage */
      let sessionColorMode = JSON.parse(sessionStorage.getItem('jwt')!) && JSON.parse(sessionStorage.getItem('jwt')!).setting && JSON.parse(sessionStorage.getItem('jwt')!).setting.colorMode
      if (sessionColorMode && ['dark', 'light'].includes(sessionColorMode)) return sessionColorMode
      if (sessionColorMode && sessionColorMode === 'system') return isSystemDarkMode? 'dark': 'light'
      /**find in context */
      if (mode && ['dark', 'light'].includes(mode)) return mode
      if (mode && mode === 'system') return isSystemDarkMode? 'dark': 'light'
    }
    return isSystemDarkMode? 'dark': 'light'
  }

  const clearPreference = () => {
    setMode('system')
  }

  const theme = useMemo(() =>createTheme(getColorMode()),[mode]); /**create theme */
  const responsiveTheme = responsiveFontSizes(theme);
  return (
    <ColorModeContext.Provider value={{mode, toggleColorMode, getColorMode, theme, clearPreference}}>
      <ThemeProvider theme={responsiveTheme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>)
}
