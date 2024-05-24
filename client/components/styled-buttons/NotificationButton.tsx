import React, { FC } from 'react'
import { IconButton, Badge, badgeClasses } from '@mui/material'
import { Notifications, NotificationAdd, NotificationsOff} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

interface NotifyButtonProps {
    onClick?: () => void
    className?: 'string'
    variant: 'disabled' | 'badge' | 'add'
  }

const NotifyButton: FC<NotifyButtonProps> = ({ onClick, className, variant }) => {
  const { transitions } = useTheme()

  return (
    <IconButton
      disabled={variant === 'disabled'? true: false}
      size='small'
      sx={{
        backgroundColor: 'background.paper', color: 'primary.main', transition: transitions.create(['background-color']),
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' }, [`& .${badgeClasses.badge}`]:{bgcolor: 'secondary.main'},
        zIndex: 10,
        boxShadow: 1,
      }}
      disableRipple
      onClick={onClick}
      className={className}
    >
      {variant === 'badge' &&
      (<Badge invisible={false} badgeContent={5}>
        <Notifications/>
      </Badge>)
      }
      {variant ==='add' && (<NotificationAdd/>)}
      {variant ==='disabled' &&(<NotificationsOff />)}
    </IconButton>
  )
}
  export default NotifyButton