import React, {useState} from 'react'
import { scroller } from 'react-scroll'
import {useTheme} from '@mui/material/styles'
import {Box, Container, Grid} from '@mui/material'
import {StripeProvider} from 'react-stripe-elements'
import {CartItems, Checkout} from './'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

export default function Cart () {
  const stripe_test_api_key  = process.env.STRIPE_TEST_PUBLISHABLE
  const [checkout, setCheckout] = useState(false)
  const theme = useTheme()

  const showCheckout = val => {
    setCheckout(val)
    let scrollToCheckout= setTimeout(()=>{
      scroller.scrollTo('order', {
        duration: 1500,
        delay: 100,
        smooth: true,
        offset: -10
      }); clearTimeout(scrollToCheckout)
    }, 1000)
  }

    return (
    <WallPaperYGW variant='radial' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
      minHeight: '100vh',
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        left: {xs: 'unset', md: '50%'},
        position: 'absolute',
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}>
      <Box id="shopping-cart" sx={{pt: {xs: 6, md: 8}, pb: 14, }}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item id='items' xs={ 12} md={6} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>  
              <CartItems checkout={checkout} setCheckout={showCheckout}/>
            </Grid>
            {checkout && 
            (<Grid item id='checkout' xs={ 12} md={6} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              {/**  <StripeProvider stripe={null} > */} {/** Stripe context provider, all stripe UI elments must be used within `StripeProvider` and `Elements` to have access to the Stripe object */}
              <StripeProvider apiKey={stripe_test_api_key}> 
                <Checkout/>
              </StripeProvider>                
            </Grid>)}
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>)
}
