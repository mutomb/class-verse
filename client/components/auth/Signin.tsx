import React, {useState, FormEvent} from 'react';
import { TextField, Link as MuiLink, Paper, Box, Grid, Typography} from '@mui/material';
import {Error} from '@mui/icons-material'
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons'
import {Link} from 'react-router-dom'
import auth from './auth-helper'
import {Redirect} from 'react-router-dom'
import {signin} from './api-auth'
import { scroller } from 'react-scroll'
import { useHistory, useLocation } from 'react-router-dom'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <MuiLink color="inherit" href="#">
        Funda Gate
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface Signin{
  email:String,
  password:String,
  error:String,
  redirectToReferrer:boolean,
} 

export default function SignInSide({location}) {
  const [values, setValues] = useState<Signin>({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  })
  const handleChange = (name: string) => (event:FormEvent<HTMLFormElement>) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error})
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true})
        })
      }
    })
  }
  const path = useLocation().pathname
  const history = useHistory()
  const scrollToAnchor = (destination:string) => {
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -10
    })
  }
  const goToHomeAndScroll = async (destination:string) => {
    await history.push('/')
    await scrollToAnchor(destination)
  }

  const {from} = location.state || {
    from: {
      pathname: '/'
    }
  }
  const {redirectToReferrer} = values
  if (redirectToReferrer) {
      return (<Redirect to={from}/>)
  }
  return (
      <Grid container>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?online-school-learning)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Logo onClick={()=>goToHomeAndScroll('hero')} />
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' } }}>
                Sign in to manage your course teaching or enrollment.
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email} 
                onChange={handleChange('email')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password} 
                onChange={handleChange('password')}
              />
              <br/> 
              {
                values.error && (<Typography component="p" color="error">
                  <Error color="error" sx={{verticalAlign: 'middle'}}/>
                  Error: {values.error} Retry.</Typography>)
              }
              <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  my:2
                }}>
                <StyledButton type='submit' disableHoverEffect={false} variant="outlined">
                  Sign In
                </StyledButton>
              </Box>
              <Grid container>
                <Grid item xs>
                    <MuiLink
                      component='span'
                      underline="hover"
                      sx={{
                        display: 'block',
                        mb: 1,
                        color: 'primary',
                      }}
                    >
                      {"Forgot password?"}
                    </MuiLink>
                </Grid>
                <Grid item>
                  <Link style={{textDecorationLine:'none'}}  to="/signup">
                    <MuiLink
                      component='span'
                      underline="hover"
                      variant='body2'
                      sx={{
                        display: 'block',
                        mb: 1,
                        color: 'primary',
                      }}
                    >
                      {"Don't have an account? Sign Up"}
                    </MuiLink>
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
}