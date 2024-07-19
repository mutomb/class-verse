import React, {useState, FormEvent, ChangeEvent, MouseEvent} from 'react';
import { TextField, formLabelClasses, Box, Grid, Typography, Dialog, 
  DialogActions, DialogContent, DialogTitle, DialogContentText, Checkbox, FormControlLabel, formControlLabelClasses, 
   inputLabelClasses,IconButton, InputAdornment, Switch,
   SvgIcon,
   Container,
   outlinedInputClasses,
   dialogClasses} from '@mui/material';
import {Error, Visibility, VisibilityOff} from '@mui/icons-material'
import {create} from './api-user'
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons'
import {Link, Redirect} from 'react-router-dom'
import { scroller } from 'react-scroll'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { Parallax } from 'react-parallax';
import image from '../../public/images/workspace/1.png'
import { HashLoader } from '../progress';
import { StyledSnackbar } from '../styled-banners';
import { Copyright, TermsAndConditions } from '../about';
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
import { useAuth } from '../auth';

interface SignUpProps{
  name:String,
  surname: String,
  password:String,
  email:String,
  open:boolean,
  error:String,
  specialist: boolean,
  complied: boolean,
  showTerms: boolean,
  disableSubmit: boolean
}

export default function SignUp() {
  const theme = useTheme();
  const {isAuthenticated} = useAuth()
  const [values, setValues] = useState<SignUpProps>({
    name: '',
    surname: '',
    password: '',
    email: '',
    open: false,
    error: '',
    specialist: false,
    complied: false,
    showTerms: false,
    disableSubmit: false
  })
  
  const handleChange = (name: string) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: '' })
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleCheck = (name: string) => (event: ChangeEvent<HTMLFormElement>) => {
    setValues({...values, [name]: event.target.checked})
  }

  const handleClose = () => {
    setValues({ ...values, open: false, showTerms: false})
  }
  const handleSnackbarClose = () => {
    setValues({ ...values, error: ''})
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = {
      name: values.name,
      surname: values.surname, 
      email: values.email,
      password: values.password,
      specialist: values.specialist,
      complied: values.complied,
    }
    if (!(values.name && values.surname && values.email && values.complied)){return setValues({...values, error: 'Please fill in all fields'})};
    if (values.email && values.email.search(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) !== 0){return setValues({...values, error: 'Please fill in a valid email address'})};
    create(user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error, disableSubmit: false})
      } else {
        setValues({
          name: '',
          surname: '',
          password: '',
          email: '',
          open: true,
          error: '',
          specialist: false,
          complied: false,
          showTerms: false,
          disableSubmit: false
        })
      }
    })
  }

  const history = useHistory()
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
  const updateComplied = () =>{setValues({...values, complied:true, showTerms: false})}
  const showTerms = () =>{setValues({...values, showTerms: true})}
  if(isAuthenticated().user){
    return <Redirect to='/'/>
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
        sx={{px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: {xs: 2, sm: 4}, boxShadow: 4,
        transform: 'unset',
        maxWidth: 'fit-content !important', borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-3px) scale(1.03)',
          transition: (theme) => theme.transitions.create(['box-shadow, transform'], {duration: 500}),
        },
        }}>
        <Grid container>
          <Grid item xs={12} sx={{minHeight: '100vh'}}>
            <Box
              sx={{
                my: 8,
                px: {xs:1, md:4},
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Logo onClick={()=>goToHomeAndScroll('search')} />
              <Box sx={{ textAlign: 'center'}}>
                <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                Create your Client or Specialist account
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit} 
              sx={{ mt: 1,
                [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
                [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
                [`& .${inputLabelClasses.focused}`]: { 
                  color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
                },
                [`& .${outlinedInputClasses.root}`]: {bgcolor: 'background.paper', borderRadius: {xs: 2, sm: 4}},
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={values.name} 
                        onChange={handleChange('name')}
                      />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="surname"
                      label="Surname"
                      name="surname"
                      autoComplete="name"
                      value={values.surname} 
                      onChange={handleChange('surname')}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={values.email} 
                    onChange={handleChange('email')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    id="password"
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
                </Grid>
                <br/> 
                <StyledSnackbar
                  open={values.error? true: false}
                  duration={3000}
                  handleClose={handleSnackbarClose}
                  icon={<Error/>}
                  heading={"Error"}
                  body={values.error}
                  variant='error'
                  />
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Typography sx={{mr: 2}} variant="body1">
                    I am a Specialist?
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={values.specialist} color='secondary' onChange={handleCheck('specialist')} />}
                    label={values.specialist? 'Yes' : 'No'}
                  />
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center'}}>
                  <FormControlLabel
                    sx={{textAlign: 'center', [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'}, [`& .${formLabelClasses.asterisk}`]: {display: 'none'}, mr: 1}}
                    required
                    control={<Checkbox checked={values.complied} onClick={handleCheck('complied')} color="secondary" />}
                    label={<Typography variant='body1' sx={{color: 'text.primary'}}>
                                Tick this box to confirm your compliance with our
                            </Typography>
                          }/>
                    <Typography onClick={showTerms} variant='h5' sx={{color: 'secondary.main', cursor: 'pointer', '&:hover':{textDecorationLine: 'underline'}}}>
                      Terms & Conditions.
                    </Typography>
                </Grid>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    my:2
                  }}>
                  {!values.status && 
                  (<>
                  <Box>
                  {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
                    (<StyledButton type='submit' disableHoverEffect={false} variant="contained">
                      Sign Up
                    </StyledButton>)}
                  </Box>
                  <Box  sx={{mt: 2, textDecoration: 'none'}} component='a' href='/login'>
                    <StyledButton type='button'  disableHoverEffect={false} variant="outlined">
                      <SvgIcon sx={{verticalAlign: 'text-top', mr: 1}}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                          <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                      </SvgIcon>
                      Use Google Account
                    </StyledButton>
                  </Box>
                  </>)}
                  {values.status && 
                  (<><StyledButton type='submit' disableHoverEffect={false} variant="contained">
                        CONFIRM DETAILS
                      </StyledButton>
                  </>)}
                </Box>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialog PaperComponent={Box} transitionDuration={1000} open={values.open}  onClose={handleClose} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, borderRadius: {xs: 2, sm: 4}, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: theme.palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
        <DialogTitle sx={{ textAlign: 'center', borderRadius:1}}>
          <Logo />
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 }, color: 'text.primary' }}>
            New account created.
          </Typography>        
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center'}}>
          <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
            Sign in to proceed to your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            my:2
        }}>
          <Link to="/signin">
            <StyledButton disableHoverEffect={false} variant="outlined">
              Sign in
            </StyledButton>
          </Link>
        </DialogActions>
      </Dialog>
      <Dialog PaperComponent={Box} fullWidth maxWidth='lg' transitionDuration={1000} open={values.showTerms}  onClose={handleClose} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, width:'100%'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
          <TermsAndConditions updateComplied={updateComplied} />
      </Dialog>
    </Parallax>
  );
}