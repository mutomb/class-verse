import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { ProfilePicButton } from '../styled-buttons'
import {useAuth} from '../auth'

interface ProfileNavigation{
  onClick?: (event?: any)=>void,
  children?: ReactNode
}

const ProfileNavigation: FC<ProfileNavigation> = ({onClick, children}) => {
  const {isAuthenticated} = useAuth()
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box
          sx={{
            position: 'relative',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <ProfilePicButton onClick={(event)=> onClick && onClick(event)} user={isAuthenticated().user}>
          {children}
        </ProfilePicButton>
        </Box>
    </Box>)
}

export default ProfileNavigation
