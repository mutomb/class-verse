import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import { CartButton, NotificationButton} from '../styled-buttons'
import {useAuth} from '../auth'

interface ProfileNavigation{
  onClick?: ()=>void
}

const CartNavigation: FC<ProfileNavigation> = ({onClick}) => {
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
            px: { xs: 0, md: 1 },
            mb: 0,
          }}
        >
        {isAuthenticated().user && isAuthenticated().user.specialist?
          (<Link style={{textDecoration: 'none'}} onClick={()=> onClick && onClick()} to={`/orders/${isAuthenticated().user._id}`}>
              <NotificationButton variant='badge'/>
            </Link>):
            (<Link style={{textDecoration: 'none'}} onClick={()=> onClick && onClick()} to="/cart">
            <CartButton variant='badge'/>
          </Link>)
        }
        </Box>
    </Box>)
}

export default CartNavigation