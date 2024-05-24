import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import { ProfilePicButton } from '../styled-buttons'
import {useAuth} from '../auth'

interface ProfileNavigation{
  onClick?: ()=>void
}

const ProfileNavigation: FC<ProfileNavigation> = ({onClick}) => {
  const {isAuthenticated} = useAuth()
  if(!isAuthenticated().user) return <></>
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
            px: { xs: 0, md: 3 },
            mb: { xs: 3, md: 0 },
          }}
        >
        <Link onClick={()=> onClick && onClick()} to={"/user/" + isAuthenticated().user._id}>
            <ProfilePicButton user={isAuthenticated().user}/>
          </Link>
        </Box>
    </Box>)
}

export default ProfileNavigation
