import React, {useState, FormEvent} from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Link as MuiLink, Paper, Box, Grid, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Icon} from '@mui/material';
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons'
import {Link} from 'react-router-dom'
import auth from './auth-helper'
import {Redirect} from 'react-router-dom'
import {signin} from './api-auth'

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
    event.preventDefault();
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
            <Logo />
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 } }}>
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
                onChange={()=>handleChange('email')}
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
                onChange={()=>handleChange('password')}
              />
              <br/> 
              {
                values.error && (<Typography component="p" color="error">
                  <Icon color="error" sx={{verticalAlign: 'middle'}}>{"Error:"}</Icon>
                  {values.error}<br/>. {"Retry."}</Typography>)
              }
              <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Link to="/signin">
                  <StyledButton type='submit' disableHoverEffect={false} variant="outlined">
                    Sign In
                  </StyledButton>
                </Link>
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