import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Avatar, IconButton} from '@mui/material'

export default function ( { user }) {

    const userPhotoUrl = user? 
    `/api/users/photo/${user._id}?${new Date().getTime()}`:'/api/users/defaultphoto'
    const theme = useTheme();

    return (<IconButton
      sx={{ mr: 1,
        zIndex: 10,
        boxShadow: 3, 
        color: 'primary.main',
        backgroundColor: 'background.paper',
        border: '2px solid',
        borderColor: 'primary.main',
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        transform: 'unset',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        WebkitTapHighlightColor: 'transparent',
        verticalAlign: 'middle',
        p:0,
        ':hover':{
          transform: 'translateY(-3px)',
          transition: theme.transitions.create(['transform'])
        }
       }}
      disableRipple={true}
    >
        <Avatar
        component='span' 
        src={userPhotoUrl}
        alt={user.name?  user.name[0]: ''} 
        sx={{
          fontSize: 15,
          fontWeight: 500,
          backgroundColor: 'inherit',
          color: 'inherit',
          textAlign: 'center'
        }}/>
    </IconButton>)
}