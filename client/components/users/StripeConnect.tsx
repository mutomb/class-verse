import React, {useState, useEffect} from 'react'
import {Paper, Typography} from '@mui/material'
import queryString from 'querystring';
import {stripeUpdate} from './api-user'
import {useAuth} from '../auth'

export default function StripeConnect(props){
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false
  })
  const {isAuthenticated} = useAuth()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const parsed = queryString.parse(props.location.search)
    if(parsed.error){
      setValues({...values, error: true})
    }
    if(parsed.code){
      setValues({...values, connecting: true, error: false})
      //post call to stripe, get credentials and update user data
      stripeUpdate({
        userId: isAuthenticated().user && isAuthenticated().user._id
      }, {
        token: isAuthenticated().token
      }, parsed.code, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: true, connected: false, connecting: false})
        } else {
          setValues({...values, connected: true, connecting: false, error: false})
        }
      })
    }
    return function cleanup(){
      abortController.abort()
    }

  }, [])

    return (
        <Paper elevation={4} sx={{ maxWidth: 600, m: 'auto', p: 3, mt: 5 }}>
          <Typography variant='h2' component='h2'sx={{m: 2, fontSize: '1.1rem'}}>
            Connect your Stripe Account
          </Typography>
          {values.error && (<Typography variant='subtitle1' sx={{ml:2}}>
              Could not connect your Stripe account. Try again later.
            </Typography>)}
          {values.connecting && (<Typography variant='subtitle1' sx={{ml:2}}>
              Connecting your Stripe account ...
            </Typography>)}
          {values.connected && (<Typography variant='subtitle1' sx={{ml:2}}>
              Your Stripe account successfully connected!
            </Typography>)}
        </Paper>
    )
}
