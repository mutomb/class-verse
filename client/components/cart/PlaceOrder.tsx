import React, {useState, FC} from 'react'
import {Typography, Box, Grid} from '@mui/material'
import {Error} from '@mui/icons-material'
import cart from './cart-helper'
import {CardElement, injectStripe} from 'react-stripe-elements'
import {create} from '../order/api-order'
import {Redirect} from 'react-router-dom'
import { useAuth } from '../auth'
import { StyledButton } from '../styled-buttons'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'
import { PaymentForm } from '../order'

interface PlaceOrderProps{
  checkoutDetails: any,
  stripe?: any /**props.stripe injected with injectStripe(PlaceOrder)*/
}
const PlaceOrder: FC<PlaceOrderProps> = ({checkoutDetails, stripe}) => {
  const [values, setValues] = useState({
    order: {},
    error: '',
    redirect: false,
    orderId: '',
    disableSubmit: false
  })
  const {isAuthenticated} = useAuth()

  const placeOrder = () => {
    setValues({...values, disableSubmit: true})
    create({userId:isAuthenticated().user._id}, {
      token: isAuthenticated().token
    }, checkoutDetails, 'payload.token.id').then((data) => {
      if (data.error) {
        setValues({...values, error: data.error, disableSubmit: false})
      } else {
        cart.emptyCart(()=> {
          setValues({...values, orderId: data._id, redirect: true})
        })
      }
    })
  //   stripe && stripe.createToken().then(payload => { /**Automatically infers reference to CardElement, submit card details to Stripe and get back the card token. */
  //     if(payload.error){
  //       setValues({...values, error: payload.error.message, disableSubmit: false})
  //     }else{
  //       create({userId:isAuthenticated().user._id}, {
  //         token: isAuthenticated().token
  //       }, checkoutDetails, payload.token.id).then((data) => {
  //         if (data.error) {
  //           setValues({...values, error: data.error, disableSubmit: false})
  //         } else {
  //           cart.emptyCart(()=> {
  //             setValues({...values, orderId: data._id, redirect: true})
  //           })
  //         }
  //       })
  //     }
  // })
}
const handleClose = () => {
  setValues({...values, error: ''})
}

    if (values.redirect) {
      return (<Redirect to={'/order/' + values.orderId}/>)
    }
    return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant='h3' component="h3" sx={{ mb: 1, fontSize: { xs: '1rem', md: '1.5rem' }, color: 'text.primary' }}>
          Card details
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        {/** collects payment and address information using Stripe instance. */}
        <CardElement 
          {...{style: { display: 'block', margin: 2, height: '250px', maxWidth: '400px', padding: 1, boxShadow: 2, borderRadius: 1, bgColor: 'background.paper',
                        base: {
                          color: '#424770',
                          letterSpacing: '0.025em',
                          fontFamily: 'Source Code Pro, Menlo, monospace',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      }
          }}/>
        <PaymentForm />
      </Grid>
      <Grid item xs={12} md={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my:2, width: '100%' }}>
          {values.disableSubmit?
          (<HashLoader style={{marginTop: '10px'}} size={10}/>):
          (<StyledButton type='button' onClick={placeOrder} disableHoverEffect={false} color='secondary' variant="contained">
            Place Order
          </StyledButton>)}
        </Box>
      </Grid>
      <StyledSnackbar
        open={values.error? true: false}
        duration={3000}
        handleClose={handleClose}
        icon={<Error/>}
        heading={"Error"}
        body={values.error}
        variant='error'
        />
    </Grid>)

}
// export default PlaceOrder
export default injectStripe(PlaceOrder) /**injects props.stripe, for interacting with `Stripe.js` to create sources or tokens. */
