import React, { FC, ReactNode, useState, useEffect, useMemo, useTransition } from 'react'
import {
  ThemeProvider,
  responsiveFontSizes,
} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import ColorModeContext from '../config/theme/color-context';
import theme from '../config/theme'

interface Props {
  children: ReactNode
}

const MUIProvider: FC<Props> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'dark'|'light'>('dark');
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    startTransition(()=>setMode(prefersDarkMode ? 'dark' : 'light'));
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  let getTheme = useMemo(
    () =>
      theme(mode),
    [mode]
  );
  
  let responsiveTheme = responsiveFontSizes(getTheme);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={responsiveTheme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>)
}

export default MUIProvider
