import React, {useMemo, useState} from 'react'
import {TextField, Typography, Grid, Box, formLabelClasses, inputLabelClasses, formControlLabelClasses, Divider, Zoom, Container, outlinedInputClasses} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {cart} from '.'
import PlaceOrder from './PlaceOrder'
import { useAuth } from '../auth'
import {StripeProvider, Elements} from 'react-stripe-elements' 
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { Parallax } from 'react-parallax'
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'
import { Logo } from '../logo'
import {useHistory} from 'react-router-dom'
import { scroller } from 'react-scroll'

export default function Checkout (){
  const stripe_test_api_key  = process.env.STRIPE_TEST_PUBLISHABLE
  const {isAuthenticated} = useAuth()
  const user = isAuthenticated().user
  const theme = useTheme()
  const history = useHistory()
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
  const scrollToAnchor = (destination:string) => {
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -10
    })
  }
  const goToHomeAndScroll = (destination:string) => {
    history.push('/')
    let delayedScroll=setTimeout(()=>{scrollToAnchor(destination), clearTimeout(delayedScroll)},1000)
  }
  {/** Stripe context provider, all stripe UI elments must be used within `StripeProvider` and `Elements` to have access to the Stripe object */}
    return (
    <StripeProvider /**apiKey={stripe_test_api_key}*/ stripe={null}>
      <Parallax bgImage={image}  strength={50} blur={5}
        renderLayer={percentage=>(
          <WallPaperYGW variant='linear' primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.background.paper} 
          style={{
            opacity: percentage*0.7, position: 'fixed', width: '100%', height: '100%',
            '&::before': {
              content: '""',
              width: '100%',
              height: '100%',
              left: '50%',
              position: 'absolute',
              backgroundImage: `url(${logo})`,
              backgroundRepeat: 'space',
              backgroundSize: 'contain',
              opacity: percentage*0.5
            },
            '& > div':{
              position: 'relative'
            }
          }}/>
      )}>
        <Container 
          sx={{px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: {xs: 2, sm: 4}, boxShadow: 4,
          maxWidth: 'fit-content !important', borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
          }}> 
          <Grid container spacing={2}>
            <Grid id='checkout-form' item xs={12} sx={{minHeight: '100vh'}}>
              <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
                <Box
                sx={{
                  my: 8,
                  mx: {xs:1, md:4},
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <Logo onClick={()=>goToHomeAndScroll('search')} />
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
                    },
                    [`& .${outlinedInputClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
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
                          autoComplete="name"
                          value={values.checkoutDetails.customer_email} 
                          onChange={handleCustomerChange('email')}
                          helperText="Change if recipient email is different from yours"
                        />
                      </Grid>
                    </Grid>
                    <Divider sx={{my: 1}}/>
                    <Typography variant='h3' component="h3" sx={{ mb: 1, fontSize: { xs: '1rem', md: '1.5rem' }, color: 'text.primary' }}>
                        Delivery Address
                    </Typography>
                    {!deliverable && <Typography component='span' sx={{color: 'primary.main'}}>{' (Not Applicable)'}</Typography>}
                    <Grid item xs={12}>
                      <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="street"
                          label="Street Address"
                          name="street"
                          autoComplete="name"
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
                          autoComplete="name"
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
                          autoComplete="name"
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
                          autoComplete="name"
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
                          autoComplete="name"
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
          </Grid>
        </Container>
      </Parallax>
    </StripeProvider>)
}