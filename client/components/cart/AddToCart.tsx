import React, {FC, useState} from 'react'
import cart from './cart-helper'
import { CartButton } from '../styled-buttons'
import { StyledSnackbar } from '../styled-banners'
import { ShoppingCartCheckout } from '@mui/icons-material'

interface AddToCartProps{
  item: any,
}
const AddToCart: FC<AddToCartProps> = ({item}) =>{
  const [open, setOpen] = useState(false)
  const addToCart = () => {
    cart.addItem(item)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
    return (<>
      {item.quantity >= 0 ? <CartButton variant='add' onClick={addToCart}/>: <CartButton variant='disabled'/>}
      <StyledSnackbar
        open={open}
        duration={100000}
        handleClose={handleClose}
        icon={<ShoppingCartCheckout/>}
        action={<></>}
        heading={"Added"}
        body={item.name}
        variant='success'/>
      </>)
}
export default AddToCart