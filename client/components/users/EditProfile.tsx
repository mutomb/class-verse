import React, {useState, FormEvent, useEffect, ChangeEvent} from 'react';
import { TextField, Link as MuiLink, Paper, Box, Grid, Typography, Button, FormControlLabel,
  Switch } from '@mui/material';
import {Error, FileUpload} from '@mui/icons-material'
import { read, update } from './api-user'
import { StyledButton } from '../styled-buttons'
import { Redirect} from 'react-router-dom'
import auth from '../auth/auth-helper';

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

interface SignUpProps{
  id: string,
  photo: any,
  name:string,
  password:string,
  email:string,
  open:boolean,
  error:string,
  teacher: boolean,
  experience: string,
  company:any,
  category: string,
  redirectToProfile: boolean,
}

export default function EditProfile({ match }) {
  const [values, setValues] = useState<SignUpProps>({
    id: '',
    photo: '',
    name: '',
    password: '',
    email: '',
    teacher: false,
    experience: '',
    company: {},
    // company: {name: '', logo: '', id: ''},
    category: '',
    open: false,
    error: '',
    redirectToProfile: false,
  })
  
  const jwt = auth.isAuthenticated()

  useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal

      read({
        userId: match.params.userId
      }, {t: jwt.token}, signal).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
            setValues({...values, id: data._id, name: data.name, email: data.email, teacher: data.teacher, 
              category: (data.category && data.category!=='null')? data.category:'',  
              experience: (data.experience && data.experience!=='null')? data.experience:'', 
              company: (data.company && data.company!=='null')? {name: data.company.name, id: data.company._id, logo: data.company.logo} : {} })
              console.log(data.category==='null')
        }
      })
      return function cleanup(){
        abortController.abort()
      }
    }, [match.params.userId])
  const userPhotoUrl = values.id? `/api/users/photo/${values.id}?${new Date().getTime()}`: '/api/users/defaultphoto'
  const companyLogoUrl = (values.id && values.company?.id) ? `/api/users/${values.id}/company/photo/${values.company.id}?${new Date().getTime()}`: '/api/users/defaultphoto'
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!(values.name && values.email && values.password)) return;
    let userData = new FormData()
    values.name && userData.append('name', values.name);
    values.email && userData.append('email', values.email);
    values.password && userData.append('password', values.password);
    userData.append('teacher', values.teacher); 
    values.photo && userData.append('photo', values.photo);
    (values.teacher && values.experience) ? userData.append('experience', values.experience) : userData.append('experience', null);
    (values.teacher && values.category) ? userData.append('category', values.category) : userData.append('category', null);
    values.teacher && values.company && userData.append('company', JSON.stringify({...values.company, logo: ''}));
    values.teacher && values.company && values.company.logo && userData.append('logo', values.company.logo);
    update({
        userId: match.params.userId
      }, {
        t: jwt.token
      }, userData).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
          auth.updateUser(data, ()=>{
            setValues({...values, redirectToProfile: true})
          })
        }
      })
  }
    
  const handleChange = (name: string) => (event: FormEvent<HTMLFormElement>) => {
    const value = name === 'photo' || name === 'companyLogo'
    ? event.target.files[0]
    : event.target.value
    name.indexOf('company') > -1 
    ? setValues({ ...values, company:{ ...values.company, [name.slice(7).toLocaleLowerCase()]: value}}) 
    :setValues({ ...values, [name]: value })
  }

  const handleCheck = (event: ChangeEvent<HTMLFormElement>) => {
    setValues({...values, teacher: event.target.checked})
  }

  if (values.redirectToProfile) {
    return (<Redirect to={'/user/' + values.id}/>)
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
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
               Update your profile
              </Typography>
            </Box>
            <Box sx={{overflow: 'hidden', borderRadius: '50%', height: 200, mb: 2 }}>
              <Box component='img' src={userPhotoUrl} sx={{width: 200, height:'auto'}} alt={'Teacher ' + values.name + 'profile picture'} />
            </Box>
            <input accept="image/*" onChange={handleChange('photo')} style={{display: 'none'}} id="photo-upload-button" type="file" />
            <label htmlFor="photo-upload-button">
                <Button variant="outlined" color="primary" component="span">
                  Change Photo
                  <FileUpload/>
                </Button>
            </label> 
            <span style={{marginLeft: '10px'}}>{values.photo ? values.photo.name : ''}</span><br/>    
            <br/> 
            <br />
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              <Typography variant="subtitle1">
                I am a Teacher
              </Typography>
              <FormControlLabel
                control={<Switch checked={values.teacher} color='secondary' onChange={handleCheck} />}
                label={values.teacher? 'Yes' : 'No'}
              />
              { values.teacher?(<><TextField
                margin="dense"
                multiline
                minRows="5"
                type="text"
                // margin="normal"
                required
                fullWidth
                name="experience"
                label="Experience"
                placeholder='Example: Worked at Google for 10 years as a DevOps engineer....'
                id="experience"
                autoComplete="experience"
                value={values.experience} 
                onChange={handleChange('experience')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="category"
                label="I am a professional in"
                placeholder='Example: Backend Development'
                id="category"
                autoComplete="category"
                value={values.category} 
                onChange={handleChange('category')}
              />  
              <TextField
                margin="normal"
                required
                fullWidth
                name="companyName"
                label="I work/worked at"
                id="companyName"
                autoComplete="companyName"
                value={values.company.name} 
                onChange={handleChange('companyName')}
              />
              <Box
                sx={{
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ overflow: 'hidden', borderRadius: 2, height: 100, mb: 2 }}>
                  <Box component='img' src={companyLogoUrl} sx={{width: 100, height:'auto'}} alt={values.company.name + ' logo'} />
                </Box>
                <Box sx={{ color: 'primary.main' }}> Upload company logo </Box> 
                <input accept="image/*" onChange={handleChange('companyLogo')} style={{display: 'none'}} id="logo-upload-button" type="file" />
                <label htmlFor="logo-upload-button">
                    <Button variant="outlined" color="primary" component="span">
                      Upload Logo
                    <FileUpload/>
                    </Button>
                </label>
                <span style={{marginLeft: '10px'}}>{(values.company && values.company.logo)? values.company.logo.name : ''}</span><br/>    
              </Box>
              </>):null
              }
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
                <StyledButton type='submit' disableHoverEffect={false} variant="contained">
                  Save Changes
                </StyledButton>
              </Box>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
}