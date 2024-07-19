import React, { FC } from 'react'
import { IconButton, Badge, badgeClasses } from '@mui/material'
import { ShoppingCart, RemoveShoppingCart, AddShoppingCart} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import cart from '../cart/cart-helper'

interface CartButtonProps {
    onClick?: () => void
    className?: 'string'
    variant: 'disabled' | 'add' | 'badge'
  }

const CartButton: FC<CartButtonProps> = (props) => {
  const { onClick, className, variant } = props
  const { transitions } = useTheme()

  return (
    <IconButton
      disabled={variant === 'disabled'? true: false}
      size='small'
      sx={{
        backgroundColor: 'background.paper', color: 'primary.main',
        '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText', transform: 'translateY(-3px) scale(1.1)' },
        [`& .${badgeClasses.badge}`]:{bgcolor: 'secondary.main'}, zIndex: 10, boxShadow: 1,
        transform: 'unset',
        transition: transitions.create(['transform','background-color'], {duration: 500}),
      }}
      disableRipple
      onClick={onClick}
      className={className}
    >
      {variant ==='badge' &&
      (<Badge invisible={false} badgeContent={cart.itemTotal()}>
        <ShoppingCart/>
      </Badge>)}
      {variant ==='add' && (<AddShoppingCart />)}
      {variant ==='disabled' &&(<RemoveShoppingCart />)}
    </IconButton>
  )
}
  export default CartButton