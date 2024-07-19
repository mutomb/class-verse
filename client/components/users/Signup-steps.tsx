import React, {useState, ChangeEvent, MouseEvent, ReactNode, useRef} from 'react';
import { TextField, formLabelClasses, Box, Grid, Typography, Dialog, Checkbox, FormControlLabel, formControlLabelClasses,
   inputLabelClasses,IconButton, InputAdornment, SvgIcon, Container, outlinedInputClasses,
   Stepper, Step, StepLabel, Slide, Divider, Avatar, stepLabelClasses,
   dialogClasses} from '@mui/material';
import {ArrowForward, Error, FileUpload, Check, Visibility, VisibilityOff, ArrowBack, CheckOutlined} from '@mui/icons-material'
import {create} from './api-user'
import { QontoConnector, QontoStepIcon, StyledButton } from '../styled-buttons'
import {Link, Redirect} from 'react-router-dom'
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
  name:string,
  surname: string,
  password:string,
  password1:string,
  password1Strength: string,
  passwordStrength: string,
  password1StrengthColor: string,
  passwordStrengthColor: string,
  email:string,
  qualification: any,
  resume: any,
  open:boolean,
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
    password1: '',
    password1Strength: '',
    passwordStrength: '',
    password1StrengthColor: '',
    passwordStrengthColor: '',
    email: '',
    qualification: '',
    resume: '',
    specialist: false,
    complied: false,
    open: false,
    showTerms: false,
    disableSubmit: false
  })
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const containerRef = useRef<HTMLElement>(null);
  const resumeRef = useRef<HTMLElement>(null);
  const qualificationRef = useRef<HTMLElement>(null);
  const handleChange = (name: string) => (event) => {
    const value = name === 'resume' || name === 'qualification'? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value, 
      ...(!values.specialist && {qualification: '', resume: '', }),
      ...(['password', 'password1'].includes(name) && {[`${name}Strength`]: evaluatePasswordStrength(value, name).strength, [`${name}StrengthColor`]: evaluatePasswordStrength(value, name).color}),
    })
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const evaluatePasswordStrength = (password, name: 'password' | 'password1'): {strength: string, color: string} => {
    let score = 0;
    if (!password) return '';
    // Check password length
    if (password.length > 8) score += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1;
    // Contains numbers
    if (/\d/.test(password)) score += 1;
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    switch (score) {
      case 0:
      case 1:
      case 2:
        return {strength: 'Weak', color: 'error.main'};
      case 3:
        return {strength: 'Medium', color: 'secondary.main'};
      case 4:
      case 5:
        return {strength: 'Strong', color: 'primary.main'};
      default:
        return {strength: '', color: ''};
    }
  }
  const handleCheck = (name: string) => (event: ChangeEvent<HTMLFormElement>) => {
    setValues({...values, [name]: event.target.checked})
  }

  const handleClose = () => {
    setValues({ ...values, open: false, showTerms: false})
  }
  const handleSnackbarClose = () => {
    setError('')
  }
  const setSpecialist = (value: boolean) => {
    setValues({ ...values, specialist: value})
  }
  const handleSubmit = () => {
    if (!(values.name && values.surname && values.email  && values.complied && values.password)){
      return setError('Please make sure all the Fields are filled in on all required steps.')
    };
    if (values.email.search(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)!==0){
      return setError('Please fill in a valid email address.')
    };
    if(values.specialist && !values.qualification && !values.resume){
      return setError('Please upload resume/qualification on step 3.')
    }
    if(values.password!==values.password1){
      return setError('Password and confirmation do not match. Please confirm password again.')
    }
    setValues({ ...values, disableSubmit: true})
    let userData = new FormData()
    values.name && userData.append('name', values.name);
    values.surname && userData.append('surname', values.surname);
    values.email && userData.append('email', values.email);
    values.password && userData.append('password', values.password);
    values.specialist && userData.append('specialist', values.specialist); 
    values.specialist && values.qualification && userData.append('qualification', values.qualification);
    values.specialist && values.qualification && userData.append('qualification_status', 'pending');
    values.specialist && values.resume && userData.append('resume', values.resume);
    values.specialist && values.resume && userData.append('resume_status', 'pending');
    create(userData).then((data) => {
      if (data && data.error) {
         setError(data.error)
        setValues({ ...values, resume: '', qualification: '', disableSubmit: false})
      } else {
          setValues({
            name: '',
            surname: '',
            password: '',
            password1: '',
            password1Strength: '',
            passwordStrength: '',
            password1StrengthColor: '',
            passwordStrengthColor: '',
            email: '',
            open: true,
            specialist: false,
            complied: false,
            qualification: '',
            resume: '',
            showTerms: false,
            disableSubmit: false
          })
          setError('')
          handleNext(steps.length)
      }
    })
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const handleNext = (nextStep: number, skipTo?: number)=>{
    setDirection('left')
    setTimeout(()=>{
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => {
        if(skipTo && !values.specialist) return skipTo 
        return nextStep
      });
      setSkipped(newSkipped);
    }, 500)
  };
  const handleBack = (prevStep: number, skipTo?: number)=> {
    setDirection('right')
    setTimeout(()=>{
      setActiveStep((prevActiveStep) => {
        if(skipTo && !values.specialist) return skipTo 
        return prevStep
      });
    }, 500)
  };
  const updateComplied = () =>{
    setValues({...values, complied:true, showTerms: false})
  }
  const showTerms = () =>{
    setValues({...values, showTerms: true})
  }
  const steps = [{label: '1'}, {label: '2'}, {label: '3'}, {label: '4'}]
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
        component='div'
        ref={containerRef} 
        sx={{ overflow: 'hidden', px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 2, boxShadow: {xs: 2, sm: 4},
        width: {xs:'100%', sm: '90%', md: '70%', lg: '50%'}, borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
        }}>
        <Grid container>
          <Grid item xs={12} sx={{minHeight: '100vh'}}>
            <Box sx={{ minHeight: '90vh', my: 8, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
              <Stepper sx={{ my: 4, width: '100%'}} connector={<QontoConnector />} alternativeLabel={false} activeStep={activeStep} orientation="horizontal">
                {steps.map((step, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: {
                    optional?: ReactNode;
                  } = {};

                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={step.label} {...stepProps} 
                    sx={{display: 'flex', flexDirection: 'row', px: 0,  [`& .${stepLabelClasses.label}`]:{fontSize: '1rem'}}}>
                      <StepLabel sx={{[`& .${stepLabelClasses.root}`]:{color: 'text.primary'}, [`& .${stepLabelClasses.active}`]:{color: 'secondary.main'}, [`& .${stepLabelClasses.completed}`]:{color: 'primary.main'}}} {...labelProps} StepIconComponent={QontoStepIcon}>{step.label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === steps.length ? (
                <Slide container={containerRef.current} timeout={1000} id="step-1" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                  <Box sx={{mx: {xs: 1, md: 8}, textAlign: 'center'}}>
                    <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                      <Check />  Well Done! Account Created
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
                      Please sign into your account now.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, alignItems: 'center', justifyContent: 'center' }}>
                      <Link to="/signin">
                        <StyledButton color="primary" variant='contained' startIcon={<Avatar sx={{ fontSize: 15, backgroundColor: 'inherit', color: 'inherit' }}/>}>
                          Sign in
                        </StyledButton>
                      </Link>
                    </Box>
                  </Box>
                </Slide>
              ) : 
              (<>
              {activeStep ===0 && 
              (
              <Slide container={containerRef.current} timeout={1000} id="step-1" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                <Box sx={{width: '100%'}}>
                  <Box sx={{ textAlign: 'center'}}>
                    <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                      Are you client or specialist?
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 4, with: '100%',}}>
                    <Box sx={{with: '100%', display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, 
                    '& > button':{ 
                      mx: {xs: '0px !important', sm: '8px !important'},
                      my: {xs: 2, sm: 'unset'},
                      width: {xs: '90%', sm: 'initial'},
                      display: 'flex',
                      justifyContent: 'center'
                    }, 
                    alignItems: 'center', justifyContent: 'space-evenly'}}>
                      <StyledButton onClick={()=>{setSpecialist(false); handleNext(1)}} disableHoverEffect={false} {...(!values.specialist && {endIcon:<Check sx={{color: 'secondary.primary'}}/>})} variant={values.specialist? "outlined": "contained"}>
                        Client
                      </StyledButton>
                      <StyledButton onClick={()=>{setSpecialist(true); handleNext(1)}} disableHoverEffect={false} {...(values.specialist && {endIcon:<Check sx={{color: 'secondary.primary'}}/>})} variant={!values.specialist? "outlined": "contained"}>
                        Specialist
                      </StyledButton>
                    </Box>
                  </Box>
                </Box>
              </Slide>
              )}
              {activeStep ===1 && 
              (
              <Slide container={containerRef.current} timeout={1000} id="step-2" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                <Box sx={{width: '100%'}}>
                  <Box sx={{ textAlign: 'center'}}>
                    <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                       Please fill in your details
                    </Typography>
                  </Box>
                  <Box 
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
                        helperText={
                          values.passwordStrength && values.passwordStrengthColor &&
                          (<Box component='small'>
                            Password strength:{' '}
                            <Box component='span' sx={{ fontWeight: 'bold', color: values.passwordStrengthColor}}>
                              {values.passwordStrength}
                            </Box>
                          </Box>)
                          }
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
                    <Grid item xs={12}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password1"
                        label="Confirm Password"
                        id="password1"
                        value={values.password1} 
                        onChange={handleChange('password1')}
                        type={showPassword ? 'text' : 'password'}
                        helperText={
                        values.password1Strength && values.password1StrengthColor &&
                        (<Box component='small'>
                          Password strength:{' '}
                          <Box component='span' sx={{ fontWeight: 'bold', color: values.password1StrengthColor}}>
                            {values.password1Strength}
                          </Box>
                        </Box>)
                        }
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        my:2
                      }}>
                      <Box 
                        sx={{width: '100%',
                            display: 'flex',
                            flexDirection: {xs: 'column', sm:'row'},
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& > button':{ 
                              mx: {xs: '0px !important', sm: '8px !important'},
                              my: {xs: 1, sm: 0},
                              width: {xs: '90%', sm: 'initial'},
                              display: 'flex',
                              justifyContent: 'center'
                            }
                        }}>
                        <StyledButton disableHoverEffect={false} variant="outlined" onClick={()=>handleBack(0)} startIcon={<ArrowBack />}>
                          Back
                        </StyledButton>
                        {values.name && values.surname && values.email && values.password &&  values.password === values.password1 && values.passwordStrength === 'Strong' &&
                        (<StyledButton onClick={()=>handleNext(2, 3)} disableHoverEffect={false} variant="contained" endIcon={<ArrowForward />}>
                          Next
                        </StyledButton>)}
                      </Box>
                      <Divider/>
                      <Box  sx={{mt: 2, textDecoration: 'none'}}>
                        <StyledButton type='button' disableHoverEffect={false} variant="outlined"
                        startIcon={
                          <SvgIcon sx={{verticalAlign: 'text-top', mr: 1}}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                              <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                          </SvgIcon>
                        }>
                          Use Google Account
                        </StyledButton>
                      </Box>
                      <Box  sx={{mt: 2, textDecoration: 'none'}}>
                        <StyledButton type='button'  disableHoverEffect={false} color='dark' variant="contained"
                        startIcon={
                          <SvgIcon sx={{verticalAlign: 'text-top', mr: 1}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fbfbfb" viewBox="0 0 30 30" width="30px" height="30px">    
                              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"/>
                            </svg>
                          </SvgIcon>
                        }>
                          Use GitHub Account
                        </StyledButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Slide>
              )}
              {activeStep ===2 && 
              (
              <Slide container={containerRef.current} timeout={1000} id="step-3" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                <Box sx={{width: '100%'}}>
                  <Box sx={{ textAlign: 'center'}}>
                    <Typography variant="h1" component="h2" sx={{ mb: 1, color: 'text.primary' }}>
                      Please upload your software engineer Resume or/and Qualification (only PDF file allowed)
                    </Typography>
                    <Box sx={{py: 1, textAlign: 'center', bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.7)`:`rgba(255,255,255,0.6)`, 
                    borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, boxShadow: 2}}>
                      <Typography variant="body2" component="p" sx={{ mb: 1,  color: 'text.primary' }}>
                        You can publish and sell a course only if your Resume or/and Qualification is approved.
                      </Typography>
                      <Typography variant="body2" component="p" sx={{ mb: 1, color: 'text.primary' }}>
                        Within 3 working days ( or usually within 24 hrs), we will inform you via email and via our Chatbot (you must be logging) whether your document was approved. 
                        If you do not our response within this period, then please contact our support team via Chatbot.  
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                  sx={{ mt: 2}}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                      {!values.resume?
                        (<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                          <Box component='input' type="file" accept="application/pdf" onChange={handleChange('resume')} style={{display: 'none'}} id="resume-upload-button" />
                          <Box ref={resumeRef} component='label' htmlFor="resume-upload-button" sx={{color:"inherit", fontSize: '1rem', '& svg': {fontSize: {xs: 20, sm: 40} }}}>
                            <StyledButton onClick={()=>resumeRef?.current?.click()}  endIcon={<FileUpload />} variant="contained">
                              Upload Resume
                            </StyledButton>
                          </Box>
                        </Box>):
                        (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <CheckOutlined sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}}}/>
                        </Box>)
                      } 
                      </Grid>
                      <Divider />
                      <Grid item xs={12}>
                      {!values.qualification?
                        (<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                          <Box component='input' type="file" accept="application/pdf" onChange={handleChange('qualification')} style={{display: 'none'}} id="qualification-upload-button" />
                          <Box ref={qualificationRef} component='label' htmlFor="qualification-upload-button" sx={{color:"inherit", fontSize: '1rem', '& svg': {fontSize: {xs: 20, sm: 40} }}}>
                            <StyledButton onClick={()=>qualificationRef?.current?.click()} endIcon={<FileUpload />} variant="contained">
                              Upload Qualification
                            </StyledButton>
                          </Box>
                        </Box>):
                        (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <CheckOutlined sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}}}/>
                          </Box>)
                      }
                      </Grid>
                      <Grid item xs={12}>
                        <Box 
                          sx={{width: '100%',
                              display: 'flex',
                              flexDirection: {xs: 'column', sm:'row'},
                              alignItems: 'center',
                              justifyContent: 'center',
                              '& > button':{ 
                                mx: {xs: '0px !important', sm: '8px !important'},
                                my: {xs: 1, sm: 0},
                                width: {xs: '90%', sm: 'initial'},
                                display: 'flex',
                                justifyContent: 'center'
                              }
                          }}>
                          <StyledButton disableHoverEffect={false} variant="outlined" onClick={()=>handleBack(1)} startIcon={<ArrowBack />}>
                            Back
                          </StyledButton>
                        {(values.resume || values.qualification) &&
                          (<StyledButton onClick={()=>handleNext(3)} endIcon={<ArrowForward />} variant="contained">
                                Next
                            </StyledButton>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Slide>
              )}
              {activeStep ===3 && 
              (
              <Slide container={containerRef.current} timeout={1000} id="step-4" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                <Box sx={{width: '100%'}}>
                  <Box sx={{ textAlign: 'center'}}>
                    <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1rem', md: '2rem' }, color: 'text.primary' }}>
                      Have you read our Terms and Conditions?
                    </Typography>
                    <Box sx={{py: 1, textAlign: 'center', bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.7)`:`rgba(255,255,255,0.6)`, 
                              borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2}, boxShadow: 2}}>
                      <Typography variant="body2" component="p" sx={{ mb: 1,  color: 'text.primary' }}>
                        Please ensure that you fully understand our terms and conditions, and the implications thereof.
                      </Typography>
                      <Typography variant="body2" component="p" sx={{ mb: 1, color: 'text.primary' }}>
                        If you have not yet done so, please familiarize yourself with the terms of use by clicking on the "Terms  & Conditions" link below.
                        Otherwise, please click on the box below to proceed. 
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1}}>
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
                    <Box 
                      sx={{width: '100%',
                          display: 'flex',
                          flexDirection: {xs: 'column', sm:'row'},
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& > button':{ 
                            mx: {xs: '0px !important', sm: '8px !important'},
                            my: {xs: 1, sm: 0},
                            width: {xs: '90%', sm: 'initial'},
                            display: 'flex',
                            justifyContent: 'center'
                          }
                      }}>
                      {values.disableSubmit?
                      (<HashLoader style={{marginTop: '10px'}} size={10}/>):
                      (<>
                          <StyledButton disableHoverEffect={false} variant="outlined" onClick={()=>handleBack(2, 1)} startIcon={<ArrowBack />}>
                            Back
                          </StyledButton>
                        {values.complied &&
                        (<StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                            Sign Up
                          </StyledButton>
                          )}
                      </>)}
                    </Box>
                  </Box>
                </Box>
              </Slide>
              )}
              </>)
              }
            </Box>
            <Box sx={{ my: 8, px: {xs:1, md:4}, display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
              <Copyright />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <StyledSnackbar
      open={error? true: false}
      duration={5000}
      handleClose={handleSnackbarClose}
      icon={<Error/>}
      heading={"Error"}
      body={error}
      variant='error'
      />
      <Dialog PaperComponent={Box} fullWidth maxWidth='lg' transitionDuration={1000} open={values.showTerms}  onClose={handleClose} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, width:'100%'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
          <TermsAndConditions updateComplied={updateComplied} />
      </Dialog>
    </Parallax>
  );
}