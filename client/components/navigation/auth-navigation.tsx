import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { StyledButton } from '../styled-buttons'

const AuthNavigation: FC = () => {
  return (
    <Box sx={{ '& button:first-of-type': { mr: 2 } }}>
      <StyledButton disableHoverEffect={false} variant="outlined">
        Sign In
      </StyledButton>
      <StyledButton disableHoverEffect={false}>Sign Up</StyledButton>
    </Box>
  )
}

export default AuthNavigation
