import React, {useState, useEffect, MouseEvent, useRef} from 'react';
import { TextField, Box, Grid, Typography,  IconButton, formControlLabelClasses, formLabelClasses, inputLabelClasses, InputAdornment, 
  MenuItem, iconButtonClasses, Divider, Container, textFieldClasses, outlinedInputClasses,
  formHelperTextClasses} from '@mui/material';
import {Error, Delete, Edit, Visibility, VisibilityOff, CheckOutlined, FileUpload} from '@mui/icons-material'
import { fetchImage, read, update } from './api-user'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import { Link, Redirect, useHistory} from 'react-router-dom'
import {useAuth} from '../auth';
import { useTheme } from '@mui/material/styles'
import { HashLoader } from '../progress';
import { Parallax } from 'react-parallax';
import { StyledSnackbar } from '../styled-banners';
import {ChipsArray} from '../styled-buttons';
import { FormSkeleton } from '../skeletons';
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'
import { Logo } from '../logo';
import { scroller } from 'react-scroll';
import { SnowEditor } from '../forms';

interface SignUpProps{
  id: string,
  photo: any,
  name:string,
  surname: string,
  password:string,
  password1:string,
  email:string,
  open:boolean,
  error:string,
  specialist: boolean,
  qualification: any,
  qualification_status: string,
  resume: any,
  resume_status: string,
  experience: string,
  company:any,
  skill: string,
  skills: { key: number, label: string }[],
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
    password1: '',
    email: '',
    specialist: false,
    qualification: '',
    qualification_status: '',
    resume: '',
    resume_status: '',
    experience: '',
    company: {},
    skill: '',
    skills:[],
    open: false,
    error: '',
    redirectToProfile: false,
    disableSubmit: false
  })
  const {isAuthenticated} = useAuth()
  const theme = useTheme();
  const history = useHistory()
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
  const resumeRef = useRef<HTMLElement>(null);
  const qualificationRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(false)
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [
        '#fbfbfb', "#fff", '#f2f5f5', "#f5f5f5", "#e0e0e0","#9e9e9e", "#212121", '#222128',
        theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark, 
        theme.palette.secondary.light, theme.palette.secondary.main, theme.palette.secondary.dark, 
        theme.palette.error.light, theme.palette.error.main, theme.palette.error.dark 
        ]},
        { background: [
          '#fbfbfb', "#fff", '#f2f5f5', "#f5f5f5", "#e0e0e0","#9e9e9e", "#212121", '#222128',
          theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark, 
          theme.palette.secondary.light, theme.palette.secondary.main, theme.palette.secondary.dark, 
          theme.palette.error.light, theme.palette.error.main, theme.palette.error.dark 
          ]
      }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link"],      
      // ["clean"],
    ],
  };
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    read({
      userId: match.params.userId
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
        setLoading(false)
      } else {
          setValues({...values, ...data, 
            company: (data.company && (data.company.name!=='null' && data.company.name!==null))? {name: data.company.name, id: data.company._id} : {},
            skills: data.skills? data.skills.map((skill, index)=>({key: index, label:skill})): [] 
          })
          setLoading(false)
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
  
    
  const handleChange = (name: string) => (event) => {
    const value = name === 'photo' || name === 'companyLogo' || name === 'resume' || name === 'qualification'
    ? event.target.files[0]: name === 'experience'? event: event.target.value
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
    values.specialist && values.company && values.company.logo && setValues({ ...values, company: {...values.company, logo: ''} })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!(values.name && values.surname && values.email && values.password && values.password1)){
      return setValues({...values, error: 'Please make sure all the Fields are filled in.'})
    };
    if(values.specialist && !values.qualification && !values.resume && ['none', 'rejected'].includes(values.resume_status) && ['none', 'rejected'].includes(values.qualification_status)){
      return setValues({...values, error: 'Please upload resume/qualification.'})
    }
    if(values.password !== values.password1){
      return setValues({...values, error: 'Password and confirmation do not match. Please confirm password again.'})
    }
    let userData = new FormData()
    values.name && userData.append('name', values.name);
    values.surname && userData.append('surname', values.surname);
    values.email && userData.append('email', values.email);
    values.password && userData.append('password', values.password);
    userData.append('specialist', values.specialist); 
    values.photo && userData.append('photo', values.photo);
    if(!values.photo && localPhoto.isDefault){
      userData.append('photo', null)
    }
    (values.specialist && values.experience) ? userData.append('experience', values.experience) : userData.append('experience', '');
    (values.specialist && values.skills) ? userData.append('skills', JSON.stringify(values.skills.map(skill=>skill.label))) : userData.append('skills', JSON.stringify([]));
    values.specialist && values.company && values.company.name && userData.append('company', JSON.stringify({...values.company, logo: ''}));
    values.specialist && values.company && values.company.logo && userData.append('logo', values.company.logo);
    if((values.specialist && values.company && !values.company.logo) && localLogo.isDefault){
      userData.append('logo', null)
    }
    values.specialist && values.qualification && userData.append('qualification', values.qualification);
    values.specialist && values.qualification && userData.append('qualification_status', 'pending');
    values.specialist && values.resume && userData.append('resume', values.resume);
    values.specialist && values.resume && userData.append('resume_status', 'pending');
    setValues({...values, disableSubmit: true})
    update({
        userId: match.params.userId
      }, {
        token: isAuthenticated().token
      }, userData).then((data) => {
        if (data && data.error) {
          setValues({...values, resume: '', qualification: '', error: data.error, disableSubmit: false})
        } else {
          setValues({...values, redirectToProfile: true})
        }
      })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }
  const handleDeleteChip = (chipToDelete) => () => {
    setValues(({skills}) => {
      return {...values, skills: skills.filter((skill) => skill.key !== chipToDelete.key)}
    });
  }
  const handleAddChip = (event) =>{
    if(event.keyCode === 13){
      event.preventDefault()
      if(values.skills && values.skills.filter(skill=>skill.label===event.target.value).length>0){
        return setValues({...values, error: 'Skill already added'})
      }
      let updatedChipData = values.skills
      updatedChipData.push({key: updatedChipData.length, label: event.target.value})
      setValues({...values, skills: updatedChipData, skill: ''})
    }
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

  if (values.redirectToProfile) {
    return (<Redirect to={'/user/' + match.params.userId}/>)
  }
  if(loading){
    return <FormSkeleton />
  }
  
  return (
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
      sx={{px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
      maxWidth: 'fit-content !important',
      }}>
      <Grid container>
        <Grid item xs={12} sx={{minHeight: '100vh'}}>
          <Box sx={{ my: 8, mx: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Logo onClick={()=>goToHomeAndScroll('search')} />
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
               Update your profile
              </Typography>
            </Box>
            <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Upload Profile Picture </Typography>
            <Box sx={{ position: 'relative', mx: 'auto'}}>
              <Box sx={{ overflow: 'hidden', borderRadius: '50%', height: {xs: 100, sm: 200}, mb: 2, boxShadow: 2}}>
                <Box component='img' src={localPhoto.url? localPhoto.url : defaultphotoURL} sx={{width: {xs: 100, sm: 200}, height:'auto'}} alt={'Specialist ' + values.name +" "+ values.surname + ' profile picture'} />
              </Box>
              <Box sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: {xs: 100, sm: 200}, height: {xs: 100, sm: 200}, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        backgroundColor: theme.palette.mode ==='light'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, 
                        opacity: 0,
                         ':hover':{
                          opacity: 1,
                          transition: theme.transitions.create(['opacity'], {duration: 500})
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
                  <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                    <Box component='label' htmlFor="photo-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                      <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/> Edit Image
                    </Box> 
                  </MenuItem>
                  {localPhoto.url && !localPhoto.isDefault && 
                  (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
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
              [`& .${outlinedInputClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
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
                autoComplete="name"
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
                autoComplete="name"
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
              { values.specialist &&
              (<>
              <Box>
                <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Tell Us Your Experience </Typography>
              </Box>
              <SnowEditor modules={modules} value={values.experience} onChange={handleChange('experience')} 
                placeholder={"Example: Worked at Google for 10 years as a DevOps engineer...."}/>
              <ChipsArray handleDelete={handleDeleteChip} chipData={values.skills}  />
              <TextField
                margin="dense"
                required
                fullWidth
                name="skill"
                label="Technical Skill"
                helperText='Please press Enter to add a Skill'
                placeholder='Example: Javascript OR Python OR Vue.js OR AWS'
                id="skills"
                autoComplete="name"
                value={values.skill} 
                onKeyDown={handleAddChip}
                onChange={handleChange('skill')}
              />  
              <Box sx={{ mt: 2}}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                  {values.resume_status !== 'approved' && !values.resume?
                    (<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                      <Typography variant='body1' component='p' sx={{color: 'text.primary'}}>Resume Status: {values.resume_status}</Typography>
                      <Box component='input' type="file" accept="application/pdf" onChange={handleChange('resume')} style={{display: 'none'}} id="resume-upload-button" />
                      <Box ref={resumeRef} component='label' htmlFor="resume-upload-button" sx={{color:"inherit", fontSize: '1rem', '& svg': {fontSize: {xs: 20, sm: 40} }}}>
                        <StyledButton onClick={()=>resumeRef?.current?.click()}  endIcon={<FileUpload />} variant="contained">
                          Upload Resume
                        </StyledButton>
                      </Box>
                    </Box>):
                    (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {values.resume_status === 'approved'&& "Resume was Approved"}
                        <CheckOutlined sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}}}/>
                    </Box>)
                  } 
                  </Grid>
                  <Divider />
                  <Grid item xs={12}>
                  {values.qualification_status !== 'approved' && !values.qualification?
                    (<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                      <Typography variant='body1' component='p' sx={{color: 'text.primary'}}>Qualification Status: {values.qualification_status}</Typography>
                      <Box component='input' type="file" accept="application/pdf" onChange={handleChange('qualification')} style={{display: 'none'}} id="qualification-upload-button" />
                      <Box ref={qualificationRef} component='label' htmlFor="qualification-upload-button" sx={{color:"inherit", fontSize: '1rem', '& svg': {fontSize: {xs: 20, sm: 40} }}}>
                        <StyledButton onClick={()=>qualificationRef?.current?.click()} endIcon={<FileUpload />} variant="contained">
                          Upload Qualification
                        </StyledButton>
                      </Box>
                    </Box>):
                    (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {values.qualification_status === 'approved'&& "Qualification was Approved"}
                        <CheckOutlined sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}}}/>
                      </Box>)
                  }
                  </Grid>
                </Grid>
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                name="companyName"
                label="I work/worked at"
                id="companyName"
                autoComplete="name"
                value={values.company.name} 
                onChange={handleChange('companyName')}
              />
              <Box sx={{ mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Upload Company Logo </Typography>
                <Box sx={{ position: 'relative', mx: 'auto'}}>
                  <Box sx={{ overflow: 'hidden', borderRadius: '50%', height: 100, mb: 2 }}>
                    <Box component='img' src={localLogo.url? localLogo.url : defaultphotoURL } sx={{width: 100, height:'auto'}} />
                  </Box>
                  <Box 
                  sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      backgroundColor: theme.palette.mode ==='light'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, 
                      opacity: 0,
                      ':hover':{
                        opacity: 1,
                        transition: theme.transitions.create(['opacity'], {duration: 500})
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
                      <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                        <Box component='label' htmlFor="logo-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                          <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/> Edit Image
                        </Box>
                      </MenuItem>
                        {localLogo.url && !localLogo.isDefault && 
                        (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                            <Box aria-label="Delete" onClick={deleteLogo} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                              <Delete /> Delete Image
                            </Box>
                          </MenuItem>)}
                     </MoreMenuVertButton>
                  </Box>
                </Box> 
              </Box>
              </>)
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
                  mx: {xs: '0px !important', sm: '8px !important'},
                  my: {xs: 1, sm: 0},
                  width: {xs: '90%', sm: 'initial'},
                  display: 'flex',
                  justifyContent: 'center'
                }
                }}>
                {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
                (<>
                <StyledButton onClick={handleSubmit} type='button' disableHoverEffect={false} variant="contained">
                  Save
                </StyledButton>
                <Link to={ match.params && '/user/' + match.params.userId} style={{textDecoration: 'none'}}>
                  <StyledButton disableHoverEffect={false} variant="outlined">
                    Cancel
                  </StyledButton>
                </Link>
                </>)}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Parallax>
  );
}