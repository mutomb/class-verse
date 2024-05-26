import React, {useState, FormEvent, useEffect, MouseEvent} from 'react';
import { TextField, Paper, Box, Grid, Typography, 
  IconButton, formControlLabelClasses, formLabelClasses, inputLabelClasses, InputAdornment, 
  MenuItem,
  iconButtonClasses} from '@mui/material';
import {Error, Delete, Edit, Visibility, VisibilityOff} from '@mui/icons-material'
import { fetchImage, read, update } from './api-user'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { Link, Redirect} from 'react-router-dom'
import {useAuth} from '../auth';
import { useTheme } from '@mui/material/styles'
import { HashLoader } from '../progress';
import image from '../../public/images/workspace/1.png'
import { Parallax } from 'react-parallax';
import { StyledSnackbar } from '../styled-banners';

interface SignUpProps{
  id: string,
  photo: any,
  name:string,
  surname: string,
  password:string,
  email:string,
  open:boolean,
  error:string,
  teacher: boolean,
  experience: string,
  company:any,
  category: string,
  redirectToProfile: boolean,
  disableSubmit: boolean
}

export default function EditProfile({ match }) {
  const [values, setValues] = useState<SignUpProps>({
    id: '',
    photo: '',
    name: '',
    surname: '',
    password: '',
    email: '',
    teacher: false,
    experience: '',
    company: {},
    category: '',
    open: false,
    error: '',
    redirectToProfile: false,
    disableSubmit: false
  })
  
  const {isAuthenticated, updateUser} = useAuth()
  const theme = useTheme();
  const defaultphotoURL ='/api/users/defaultphoto'
  const [localPhoto, setLocalPhoto] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const [localLogo, setLocalLogo] = useState({
    data: '',
    url: '',
    isDefault: false
  });

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    read({
      userId: match.params.userId
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
          setValues({...values, id: data._id, name: data.name, surname: data.surname, email: data.email, teacher: data.teacher,
            category: (data.category && data.category!=='null')? data.category:'',  
            experience: (data.experience && data.experience!=='null')? data.experience:'', 
            company: (data.company && data.company!=='null')? {name: data.company.name, id: data.company._id} : {} })
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params && match.params.userId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if (match.params.userId) {
      const userPhotoUrl = `/api/users/photo/${match.params.userId}?${new Date().getTime()}`
      fetchImage(userPhotoUrl, {token: isAuthenticated().token}, signal).then(({data, isDefault}) => {
        if(data) setLocalPhoto({ data: data, url: URL.createObjectURL(data), isDefault: isDefault });
      })
    }
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params && match.params.userId])

  useEffect(() => {
    setValues({...values, photo: localPhoto.data})
  }, [localPhoto.data])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(match.params && match.params.userId && values.company && values.company.id){
      const companyLogoUrl = `/api/users/${match.params.userId}/company/photo/${values.company.id}?${new Date().getTime()}`
      fetchImage(companyLogoUrl, {token: isAuthenticated().token}, signal).then(({data, isDefault}) => {
        if(data)  setLocalLogo({ data: data, url: URL.createObjectURL(data), isDefault: isDefault })  
      })
    }
    return function cleanup(){
      abortController.abort()
    }
  }, [values.company && values.company.id])

  useEffect(() => {
    setValues({...values, company: {...values.company, logo: localLogo.data}})
  }, [localLogo.data])
  
    
  const handleChange = (name: string) => (event: FormEvent<HTMLFormElement>) => {
    const value = name === 'photo' || name === 'companyLogo'
    ? event.target.files[0]
    : event.target.value
    name.indexOf('company') > -1 
    ? setValues({ ...values, company:{ ...values.company, [name.slice(7).toLocaleLowerCase()]: value}}) 
    :setValues({ ...values, [name]: value })
    name === 'photo' && setLocalPhoto({...localPhoto, url: URL.createObjectURL(value), isDefault: false})
    name === 'companyLogo' && setLocalLogo({ ...localLogo, url: URL.createObjectURL(value), isDefault: false })
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const deletePhoto = () => {
    setLocalPhoto({ data: '', url: '', isDefault: true });
    values.photo && setValues({ ...values, photo: '' })
  }

  const deleteLogo = () => {
    setLocalLogo({ data: '', url: '', isDefault: true });
    values.teacher && values.company && values.company.logo && setValues({ ...values, company: {...values.company, logo: ''} })
  }

  const handleSubmit = () => {
    setValues({...values, disableSubmit: true})
    if (!(values.name && values.email && values.password)) return;
    let userData = new FormData()
    values.name && userData.append('name', values.name);
    values.surname && userData.append('surname', values.surname);
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
        token: isAuthenticated().token
      }, userData).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error, disableSubmit: false})
        } else {
          updateUser(data, ()=>{})
          setValues({...values, redirectToProfile: true})
        }
      })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }

  if (values.redirectToProfile) {
    return (<Redirect to={'/user/' + match.params.userId}/>)
  }

  return (
    <Parallax bgImage={image}  strength={50} blur={5}
    renderLayer={()=>(<Box  sx={{ position: 'absolute', opacity: 0.7, bgcolor: 'background.paper', width: '100%', height: '100%'}} />)}
    >
      <Grid container sx={{minHeight: '100vh'}} spacing={2}>
        <Grid item xs={12} sm={8} md={5} component={Paper} sx={{minHeight: '100vh', borderRadius: 4}} elevation={2}>
          <Box
            sx={{
              my: 8,
              mx: {xs:1, md:4},
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
               Update your profile
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', mx: 'auto'}}>
              <Box sx={{ overflow: 'hidden', borderRadius: '50%', height: {xs: 100, sm: 200}, mb: 2 }}>
                <Box component='img' src={localPhoto.url? localPhoto.url : defaultphotoURL} sx={{width: {xs: 100, sm: 200}, height:'auto'}} alt={'Teacher ' + values.name +" "+ values.surname + ' profile picture'} />
              </Box>
              <Box sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: {xs: 100, sm: 200}, height: {xs: 100, sm: 200}, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        backgroundColor: 'secondary.main', opacity: 0,
                         ':hover':{
                          opacity: 0.7,
                          transition: 'opacity 0.5s ease'
                        },
                        '&:hover': {
                          boxShadow: 2,
                          [`& .${iconButtonClasses.root}`]: {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            boxShadow: 2,
                          },
                        }
                      }}>
                <input accept="image/*" onChange={handleChange('photo')} style={{display: 'none'}} id="photo-upload-button" type="file" />
                <MoreMenuVertButton style={{mx: 0}}>
                  <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                    <Box component='label' htmlFor="photo-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                      <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/> Edit Image
                    </Box> 
                  </MenuItem>
                  {localPhoto.url && !localPhoto.isDefault && 
                  (<MenuItem sx={{color: 'red', transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                    <Box aria-label="Delete" onClick={deletePhoto} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                      <Delete /> Delete Image
                    </Box>
                  </MenuItem>)}
                </MoreMenuVertButton>
              </Box>
            </Box>   
            <Box 
            sx={{ mt: 1,
              [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${inputLabelClasses.focused}`]: { 
                color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
              },
            }}>
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
                id="surname"
                label="Surname"
                name="surname"
                autoComplete="surname"
                value={values.surname} 
                onChange={handleChange('surname')}
              />
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
              { values.teacher?(<><TextField
                margin="dense"
                multiline
                minRows="5"
                maxRows='7'
                inputProps={{ maxLength: 300 }}
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
                <Box sx={{ position: 'relative', mx: 'auto'}}>
                  <Box sx={{ overflow: 'hidden', borderRadius: '50%', height: 100, mb: 2 }}>
                    <Box component='img' src={localLogo.url? localLogo.url : defaultphotoURL } sx={{width: 100, height:'auto'}} alt={values.company? values.company.name + ' logo': ''} />
                  </Box>
                  <Box sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: 2,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            backgroundColor: 'secondary.main', opacity: 0,
                            ':hover':{
                              opacity: 0.7,
                              transition: 'opacity 0.5s ease'
                            },
                            '&:hover': {
                              boxShadow: 2,
                              [`& .${iconButtonClasses.root}`]: {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                boxShadow: 2,
                              },
                            }
                          }}>
                    <input accept="image/*" onChange={handleChange('companyLogo')} style={{display: 'none'}} id="logo-upload-button" type="file" />
                    <MoreMenuVertButton>
                      <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                        <Box component='label' htmlFor="logo-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                          <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/> Edit Image
                        </Box>
                      </MenuItem>
                        {localLogo.url && !localLogo.isDefault && 
                        (<MenuItem sx={{color: 'red', transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                            <Box aria-label="Delete" onClick={deleteLogo} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                              <Delete /> Delete Image
                            </Box>
                          </MenuItem>)}
                     </MoreMenuVertButton>
                  </Box>
                </Box> 

              </Box>
              </>):null
              }
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
                flexDirection: {xs: 'column', sm:'row'},
                alignItems: 'center',
                justifyContent: 'center',
                '& > button':{ 
                mx: {xs: 'unset', sm: 1},
                my: {xs: 1, sm: 'unset'}}
                }}>
                {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
                (<StyledButton onClick={handleSubmit} type='button' disableHoverEffect={false} variant="contained">
                  Save
                </StyledButton>)}
                <Link to={ match.params && '/user/' + match.params.userId} style={{textDecoration: 'none'}}>
                  <StyledButton disableHoverEffect={false} variant="outlined">
                    Cancel
                  </StyledButton>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Parallax>
  );
}