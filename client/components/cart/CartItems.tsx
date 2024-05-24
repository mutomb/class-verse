import React, {useState, FC} from 'react'
import {TextField, Typography, Divider, Box, List, listItemClasses, ListItem, ListItemAvatar, Avatar, ListItemText, MenuItem, IconButton, Zoom} from '@mui/material'
import cart from './cart-helper'
import {Link} from 'react-router-dom'
import { StyledBanner } from '../styled-banners'
import { Delete, Info, Lock, ReadMore } from '@mui/icons-material'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { useTheme } from '@mui/material/styles'
import { useAuth } from '../auth'

interface CartItemsProps{
  checkout: boolean,
  setCheckout: (arg0: boolean)=>void
}

const CartItems: FC<CartItemsProps> = ({checkout, setCheckout}) => {
  const [cartItems, setCartItems] = useState(cart.getCart())
  const { transitions } = useTheme()
  const {isAuthenticated} = useAuth()
  const handleChange = index => event => {
    let updatedCartItems = cartItems
    if(event.target.value == 0){
      updatedCartItems[index].quantity = 1
    }else{
      updatedCartItems[index].quantity = event.target.value
    }
    setCartItems([...updatedCartItems])
    cart.updateCart(index, event.target.value)
  }

  const getTotal = () => {
    return cartItems.reduce((a, b) => {
        return a + (b.quantity*b.course.price)
    }, 0)
  }

  const removeItem = index => () =>{
    let updatedCartItems = cart.removeItem(index)
    if(updatedCartItems.length == 0){
      setCheckout(false)
    }
    setCartItems(updatedCartItems)
  }

  const openCheckout = () => {
    setCheckout(true)
  }

    return (
    <Box sx={{ px: {xs: 0, sm:2}, py: 1.5, borderRadius: 4, display: 'flex', flexDirection: {xs:'column', md:'row'}, alignItems: 'center', bgcolor:'background.default'}}>
      <Box sx={{ mt: 1, width: '100%'}}>
        <Box sx={{  width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
        textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
          <Box sx={{flex: {xs:0, sm: 1}}} /> {/*magic box*/}
          <Typography variant="h1" component="h1" 
            sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary'}}>
            Shopping Cart
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'text.disabled',
                  textAlign: {xs: 'start', md: 'center'}, bgcolor: 'background.default', borderRadius: 3}}>
          <StyledBanner variant={cartItems.length>0?'success': 'info'} icon={<Info/>} heading={cartItems.length>0?  "Wishlist Ready":"Wish list Empty"} 
          body={ cartItems.length<1? "You have not yet added any courses your wishlist. Continue browsing on the home page, click cart button on the course and it will be added.":
            "The following courses will be purchased."} />
        </Box>
        {cartItems.length> 0 &&
        (<List dense sx={{width: '100%', [`.${listItemClasses.root}`]: { px: {xs:0, sm: 3}},
          [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
        {cartItems.map((item, i) => {
            return(
            <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
              <ListItem key={i} sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center', boxShadow: 1, '&:hover':{boxShadow: 2},
                             my: {xs:1, sm:2}, borderRadius: 3, bgcolor: 'background.paper'}}>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                  <ListItemAvatar 
                    sx={{ flex: 0.5,
                      lineHeight: 0,
                      overflow: 'hidden',
                      borderRadius: 3,
                      height: 200,
                      mb: 2,
                      }}>
                    <Avatar src={'/api/courses/photo/'+item.course._id+"?" + new Date().getTime()} 
                    sx={{
                      borderRadius: 3,
                      width:{xs: '100%', sm: '100%'},
                      height: {xs: 'auto', md: 'auto'},
                    }}
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    sx={{flex: 1.5, ml: {xs: 0, sm: 1, textAlign: 'center'}}}
                    primary={
                      <Typography component='h2' variant="h2" sx={{ mb: 2, height: 56, overflow: 'hidden', fontSize: '1.4rem', fontWeight: 600, color: 'text.primary' }}>
                        {item.course.name}
                      </Typography>
                    } 
                    secondaryTypographyProps={{component: 'div'}}
                    secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                          <Box sx={{display: {xs: 'hidden', md: 'unset'}, overflow: "hidden", textOverflow: "ellipsis",textAlign: 'justify', p:1}}>
                                <Typography variant="body1" sx={{ mb: 2, maxHeight: {xs: 150,  md: 200}}}>{item.course.description}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{color: 'primary.main'}}>
                              {'$' + item.course.price}
                            </Typography>
                            <Typography variant="h6" sx={{color: 'text.primary'}}>/ course</Typography>
                          </Box>
                          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                            Quantity: 
                            <TextField
                              value={item.quantity}
                              onChange={handleChange(i)}
                              type="number"
                              inputProps={{
                                  min:1,
                                  max: 1
                              }}
                              sx={{display: 'inline-flex', mx: 2, my: 2, width: 100}}/>
                          </Box>
                        </Box>
                    }/>
                </Box>
                <Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <MoreMenuVertButton>
                    <MenuItem sx={{color: "primary.main", transition: transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                      <Link style={{textDecoration:'none', color: 'inherit'}} to={"/course/"+item.course._id}> 
                        <IconButton aria-label="Edit" color="inherit" sx={{fontSize: '1rem'}}>
                          <ReadMore sx={{mr: 1, verticalAlign: 'text-top'}}/> View More  
                        </IconButton>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{color: "primary.main", transition: transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                        <IconButton aria-label="Edit" color='error' sx={{fontSize: '1rem'}} onClick={removeItem(i)}>
                          <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/> Remove  
                        </IconButton>
                    </MenuItem>
                  </MoreMenuVertButton>
                </Box>
              </ListItem>
            </Zoom>
              )})}
          <Divider sx={{boxShadow: 2}}/>
          <ListItem sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', justifyContent: 'center', boxShadow: 2,
                             my: {xs:1, sm:2},  borderBottomRightRadius: 3, borderBottomLeftRadius: 3, bgcolor: 'background.paper'}}>
              <Box component='span' sx={{my: 4, fontSize: '1.2.rem', mr: 2, fontWeight: 600, verticalAlign: 'bottom', color: 'text.primary'}}>
                Total: <Typography variant="h5" sx={{color: 'primary.main', display: 'inline'}}>${getTotal()}</Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', sm:'row'},
                alignItems: 'center',
                justifyContent: 'center',
                '& > button':{ 
                mx: {xs: 'unset', sm: 1},
                my: {xs: 1, sm: 'unset'}},
                '& > a':{ 
                  mx: {xs: 'unset', sm: 1},
                  my: {xs: 1, sm: 'unset'}}
              }}>
                {(!checkout && isAuthenticated().user) &&
                  (<StyledButton onClick={openCheckout} type='button' disableHoverEffect={false} variant="contained" color='primary'> 
                    Checkout
                  </StyledButton>)
                }
                {!checkout && !isAuthenticated().user &&
                  (<Link to="/signin" style={{textDecoration: 'none'}}>
                  <StyledButton type='button' disableHoverEffect={false} variant="contained"> <Lock sx={{verticalAlign: 'text-top'}}/> Checkout</StyledButton>
                </Link>)
                }
                <Link to='/' style={{textDecoration: 'none'}}>
                  <StyledButton variant="outlined">Shop More</StyledButton>
                </Link>
              </Box>
          </ListItem>
        </List>)}
      </Box>
    </Box>
    )
}
export default CartItems