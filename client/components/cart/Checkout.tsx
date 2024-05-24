import React, {useMemo, useState} from 'react'
import {TextField, Typography, Grid, Box, formLabelClasses, inputLabelClasses, formControlLabelClasses, Divider, Zoom} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {cart} from '.'
import PlaceOrder from './PlaceOrder'
import { useAuth } from '../auth'
import {Elements} from 'react-stripe-elements' 

export default function Checkout (){
  const {isAuthenticated} = useAuth()
  const user = isAuthenticated().user
  const theme = useTheme()
  const [values, setValues] = useState({
    checkoutDetails: {
      products: cart.getCart(),
      customer_name: user.name,
      customer_email:user.email,
      delivery_address: { street: '', city: '', state: '', zipcode: '', country:''}
    },
    error: ''
  })

  const handleCustomerChange = name => event => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails[name] = event.target.value || undefined
    setValues({...values, checkoutDetails: checkoutDetails})
  }

  const handleAddressChange = name => event => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails.delivery_address[name] = event.target.value || undefined
    setValues({...values, checkoutDetails: checkoutDetails})
  }
  const hasDeliverableType = () => {
      let products = values.checkoutDetails.products
      for(let i=0; i<products.length; i++){
        if(products[i].type && !['course'].includes(products[i].type)) {
          return true
        }
      }
      return false
    }
    const deliverable = useMemo(() =>hasDeliverableType(),[values.checkoutDetails.products]);
    return (
    <Grid container spacing={2}>
      <Grid id='checkout-form' item xs={12}>
        <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
          <Box
            sx={{
              mx: {xs: 0, md: 4},
              px: 1,
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 2,
              textAlign: 'center',
            }}>
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                Checkout
              </Typography>
            </Box>
            <Box 
            sx={{ mt: 1,
              [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${inputLabelClasses.focused}`]: { 
                color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
              }, textAlign: 'center',
              }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={values.checkoutDetails.customer_name} 
                    onChange={handleCustomerChange('name')}
                    helperText="Change if recipient name is different from yours"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={values.checkoutDetails.customer_email} 
                    onChange={handleCustomerChange('email')}
                    helperText="Change if recipient email is different from yours"
                  />
                </Grid>
              </Grid>
              <Typography variant='h3' component="h3" sx={{ mb: 1, fontSize: { xs: '1rem', md: '1.5rem' }, color: 'text.primary' }}>
                  Delivery Address 
                  {!deliverable && <Typography component='span' sx={{color: 'primary.main'}}>{' (Not Applicable)'}</Typography>}
              </Typography>
              <Grid item xs={12}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="street"
                    label="Street Address"
                    name="street"
                    autoComplete="street"
                    value={values.checkoutDetails.delivery_address.street} 
                    onChange={handleAddressChange('street')}
                    disabled={!deliverable}
                  />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="city"
                    label="City"
                    name="city"
                    autoComplete="city"
                    value={values.checkoutDetails.delivery_address.city} 
                    onChange={handleAddressChange('city')}
                    disabled={!deliverable}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="state"
                    label="State"
                    id="state"
                    autoComplete="state"
                    value={values.checkoutDetails.delivery_address.state} 
                    onChange={handleAddressChange('state')}
                    disabled={!deliverable}
                    />    
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="zipcode"
                    label="Zip Code"
                    id="zipcode"
                    autoComplete="zipcode"
                    value={values.checkoutDetails.delivery_address.zipcode} 
                    onChange={handleAddressChange('zipcode')}
                    disabled={!deliverable}
                    />    
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="country"
                    label="Country"
                    id="country"
                    autoComplete="country"
                    value={values.checkoutDetails.delivery_address.country} 
                    onChange={handleAddressChange('country')}
                    disabled={!deliverable}
                    />    
                </Grid>
              </Grid>
              <Divider sx={{my: 1}}/> 
              <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  my:2
                }}>
              {/**stripe UI elments must be used within `StripeProvider` and `Elements`. Elements groups stripe UI elments together to pull data from them when tokenizing. */}
              <Elements>              
                <PlaceOrder checkoutDetails={values.checkoutDetails} />
              </Elements>
              </Box>
            </Box>
          </Box>
        </Zoom>
      </Grid>
    </Grid>)
}