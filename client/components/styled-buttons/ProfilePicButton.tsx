import React, {FC, ReactNode} from 'react'
import { Avatar, Box, IconButton, avatarClasses} from '@mui/material'
interface Props{
user: any,
onClick?: (arg?: any) => void,
children?: ReactNode
}
const ProfilePicButton: FC<Props> = ({user, onClick, children }) => {

    const userPhotoUrl = user? 
    `/api/users/photo/${user._id}?${new Date().getTime()}`:'/api/users/defaultphoto'

    return (<Box component='span' onClick={onClick} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', m: 0, p:0}}>
    <IconButton
      sx={{ mr: 1,
        zIndex: 10,
        boxShadow: 3, 
        color: 'primary.main',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'primary.main',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        transform: 'unset',
        position: 'relative',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        WebkitTapHighlightColor: 'transparent',
        verticalAlign: 'middle',
        [`& .${avatarClasses.root}`]:{mx: 0},
        p:0,
        ':hover':{
          transform: 'translateY(-3px) scale(1.2)',
          transition: (theme)=> theme.transitions.create(['transform'], {duration: 500})
        },
        ...(!user &&{
          backgroundColor: 'background.paper',
          color: 'primary.main',
          transform: 'unset',
          transition: (theme) => theme.transitions.create(['transform','background-color'], {duration: 500}),
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText', 
            transform: 'translateY(-3px) scale(1.2)'        
          }
        })
       }}
      disableRipple={true}>
        {user?
        (<>
        <Avatar
        component='span' 
        src={userPhotoUrl}
        sx={{
          fontSize: 15,
          fontWeight: 500,
          backgroundColor: 'inherit',
          color: 'inherit',
        }}/>
        </>):
        (<>
          <Avatar
            component='span' 
            sx={{
              fontSize: 15,
              fontWeight: 500,
              backgroundColor: 'inherit',
              color: 'inherit'
            }}/>
        </>)}
    </IconButton>
    {children}
    </Box>)
}
export default ProfilePicButton