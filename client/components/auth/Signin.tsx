import React, {useState, FormEvent, MouseEvent} from 'react';
import { TextField, Link as MuiLink, Box, Grid, Typography, formControlLabelClasses, formLabelClasses, 
  inputLabelClasses, IconButton, InputAdornment, Container, textFieldClasses, outlinedInputClasses} from '@mui/material';
import {Error, Visibility, VisibilityOff} from '@mui/icons-material'
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons'
import {Link, useHistory} from 'react-router-dom'
import {Redirect} from 'react-router-dom'
import {signin} from './api-auth'
import { scroller } from 'react-scroll'
import { useTheme } from '@mui/material/styles'
import { Parallax } from 'react-parallax';
import image from '../../public/images/workspace/1.png'
import { useAuth } from '.';
import { create } from '../setting/api-setting';
import { useColorMode } from '../../config/theme/MUItheme-hooks';
import { HashLoader } from '../progress';
import { StyledSnackbar } from '../styled-banners';
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
function Copyright(props: any) {
  return (
    <Box component='span' color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <MuiLink color="inherit" href="#">
       GO<Typography component='h1' variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Box>
  );
}

interface Signin{
  email:String,
  password:String,
  error:String,
  redirectToReferrer:boolean,
  disableSubmit: boolean
} 

export default function SignInSide({location}) {
  const theme = useTheme();
  const [values, setValues] = useState<Signin>({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
    disableSubmit: false
  })
  const {isAuthenticated, authenticate} = useAuth();
  const {toggleColorMode, mode} = useColorMode()
  const history = useHistory()
  const handleChange = (name: string) => (event:FormEvent<HTMLFormElement>) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValues({...values, disableSubmit: true})
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, disableSubmit: false})
      } else {
        authenticate(data, () =>{
          if(data.setting){
            toggleColorMode(data.setting.colorMode? data.setting.colorMode: 'system', ()=>{
              setValues({ ...values, error: '', redirectToReferrer: true})
            })
          }else{
             create({userId: data.user && data.user._id}, {token: data && data.token}, {colorMode: mode})
             .then((data) =>{
              if(data.setting){
                toggleColorMode(data.setting.colorMode? data.setting.colorMode: 'system', ()=>{
                  setValues({ ...values, error: '', redirectToReferrer: true})
                })
              }else{
                data.error && console.log('Preferences not be saved: ', data.error)
                setValues({ ...values, redirectToReferrer: true}) 
              }
             })
          }
        })
      }
    })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }
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

  const {from} = location.state || {
    from: {
      pathname: '/'
    }
  }
  const {redirectToReferrer} = values
  if (redirectToReferrer || isAuthenticated().user) {
      return (<Redirect to={from}/>)
  }
  return (
    <Parallax bgImage={image}  strength={50} blur={5}
    renderLayer={percentage=>(
      <WallPaperYGW variant='linear' primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.background.paper} 
      style={{
        opacity: percentage*0.7, position: 'absolute', width: '100%', height: '100%',
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
        sx={{px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
        transform: 'unset',
        maxWidth: 'fit-content !important',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-3px)',
          transition: (theme) => theme.transitions.create(['box-shadow, transform'], {duration: 1000}),
        },
        }}>
        <Grid container>
          <Grid item xs={12} sx={{minHeight: '100vh'}}>
            <Box
              sx={{
                my: 8,
                mx: {xs:1, md:4},
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Logo onClick={()=>goToHomeAndScroll('search')} />
              <Box sx={{ textAlign: 'center'}}>
                <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                  Access Your Student or teacher Account
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit} 
              sx={{ mt: 1,
                [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
                [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
                [`& .${inputLabelClasses.focused}`]: { 
                  color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
                },
                [`& .${textFieldClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
                [`& .${textFieldClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
                [`& .${outlinedInputClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
              }}>
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
                  id="password"
                  autoComplete="current-password"
                  value={values.password} 
                  onChange={handleChange('password')}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{color:'primary.main'}}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>)}}/>
                <StyledSnackbar
                  open={values.error? true: false}
                  duration={3000}
                  handleClose={handleClose}
                  icon={<Error/>}
                  heading={"Error"}
                  body={values.error}
                  variant='error'
                  />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    my:2
                  }}>
                  {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
                  (<StyledButton type='submit' disableHoverEffect={false} variant="outlined">
                    Sign In
                  </StyledButton>)}
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
                          cursor:'pointer'
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
      </Container>
    </Parallax>
  );
}