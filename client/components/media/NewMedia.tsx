import React, {FC, useState} from 'react'
import {Typography, TextField, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, MenuItem, iconButtonClasses, Slide, outlinedInputClasses} from '@mui/material'
import {Error, Delete, Edit} from '@mui/icons-material'
import {Link, Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import {create} from './api-media'
import { useAuth } from '../auth'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'
import {MediaPlayer} from '.'

interface NewMediaProps{
  lessonId?: string,
  courseId?: string,
  handleNext?: ()=>void,
  direction?: 'left' | 'right',
  containerRef?: Element | ((element: Element) => Element) | null | undefined,
  heading?: string
}
const NewMedia:FC<NewMediaProps> = ({lessonId, courseId, handleNext, direction='left', containerRef, heading='Add Video and Cover Image'}) => {
  const [values, setValues] = useState({
      title: '',
      video: '',
      cover: '',
      description: '',
      genre: '',
      duration: 0,
      error: '',
      mediaId: '',
      disableSubmit: false,
      redirectToHome: false,
  })

  const {isAuthenticated} = useAuth()
  
  const theme = useTheme();

  const [localVideo, setLocalVideo] = useState({
    data: '',
    url: ''
  });
  const [localCover, setLocalCover] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const defaultCoverURL ='/api/courses/defaultphoto'

  const handleSubmit = () => {
    setValues({...values, disableSubmit: true})
    if(!values.video){
      return setValues({...values, disableSubmit: false, error: 'Upload video to proceed.'})
    }
    let mediaData = new FormData()
    values.title && mediaData.append('title', values.title)
    values.video && mediaData.append('video', values.video)
    values.description && mediaData.append('description', values.description)
    values.genre && mediaData.append('genre', values.genre)
    values.duration && mediaData.append('duration', values.duration)
    lessonId && mediaData.append('lesson', lessonId)
    courseId && mediaData.append('course', courseId)
    values.cover && mediaData.append('cover', values.cover)
    if(!values.cover || localCover.isDefault){
      mediaData.append('cover', null)
    }
    create({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {
      token: isAuthenticated().token
    }, mediaData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error, disableSubmit: false})
      } else {
        setValues({...values, error: '', mediaId: data._id, disableSubmit: false, redirectToHome: true})
        handleNext && handleNext()
      }
    })
  }
  const handleChange = name => event => {
    const value = name === 'video' || name==='cover'? event.target.files[0]: event.target.value
    setValues({...values, [name]: value})
    name === 'video' && setLocalVideo({...localVideo, url: URL.createObjectURL(value)})
    name === 'cover' && setLocalCover({...localCover, url: URL.createObjectURL(value), isDefault: false})
  }
  const deleteCover = () => {
    setLocalCover({ data: '', url: '', isDefault: true });
    values.cover && setValues({ ...values, cover: '' })
  }
  const deleteVideo = () => {
    setLocalVideo({ data: '', url: ''});
    values.video && setValues({ ...values, video: '' })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }
  const onDurationChange = (duration: number) => {
    setValues({...values, duration: duration})
  }

  if(values.redirectToHome && !courseId){
    return(<Redirect to={'/'} />)
  }

  return (
    <Slide {...(containerRef && {container:containerRef.current})} timeout={1000} appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <Box sx={{ textAlign: 'center'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
            {heading}
          </Typography>
        </Box>
        <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Upload Video</Typography>
        <Box sx={{ position: 'relative', mx: 'auto', bgColor: 'primary.main', borderRadius: {xs: 2, sm: 4}, boxShadow: 2}}>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', mb: 2 }}>
            <MediaPlayer getDuration={onDurationChange} srcUrl={localVideo.url}/>
          </Box>
          <MoreMenuVertButton style={{position: 'absolute', top: 0, right: 0, color: "primary.main", bgcolor: 'primary.contrastText', boxShadow: 4,  transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
            <Box component='input' accept="video/*" onChange={handleChange('video')} sx={{display: 'none'}} id="video-upload-button" type="file" />
            <MenuItem sx={{color: 'text.primary', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
              <Box component='label' htmlFor="video-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/>{!localVideo.url? "Add Video": "Edit Video"}
              </Box>
            </MenuItem>
            {localVideo.url && 
            (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
              <Box aria-label="Delete" onClick={deleteVideo} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Video
              </Box>
            </MenuItem>)}
          </MoreMenuVertButton>
        </Box>
        <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Upload Cover Image </Typography>
        <Box sx={{ position: 'relative', mx: 'auto'}}>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:300}, mb: 2 }}>
            <Box component='img' src={localCover.url? localCover.url : defaultCoverURL} sx={{width: {xs: 150, sm:300}, height:'auto'}} />
          </Box>
          <MoreMenuVertButton style={{position: 'absolute', top: 0, right: 0, color: "primary.main", bgcolor: 'primary.contrastText', boxShadow: 4,  transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
            <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
              <Box component='input' accept="image/*" onChange={handleChange('cover')} style={{display: 'none'}} id="cover-upload-button" type="file" />
              <Box component='label' htmlFor="cover-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/>Edit Image
              </Box>
            </MenuItem>
            {localCover.url && !localCover.isDefault && 
            (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
              <Box aria-label="Delete" onClick={deleteCover} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
              <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Image
              </Box>
            </MenuItem>)}
          </MoreMenuVertButton>
        </Box>
        <Box 
          sx={{ mt: 1, width: '100%',
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
            id="media-title"
            label="Title"
            placeholder='Example: Building profile details feature...'
            name="media-title"
            autoComplete="name"
            autoFocus
            value={values.title} 
            onChange={handleChange('title')}
          />
          <TextField
              margin="dense"
              multiline
              minRows="5"
              maxRows='7'
              inputProps={{ maxLength: 1000 }}
              type="text"
              // margin="normal"
              required
              fullWidth
              name="description"
              label="Description"
              placeholder='Example: This Video teaches you how to add user profile details with React MERN...'
              id="description"
              autoComplete="name"
              value={values.description} 
              onChange={handleChange('description')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="genre"
              label="Genre"
              placeholder='Example: Frontend'
              id="genre"
              autoComplete="name"
              value={values.genre} 
              onChange={handleChange('genre')}
            />
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
                py: 4,
                '& > button':{ 
                  mx: {xs: '0px !important', sm: '8px !important'},
                  my: {xs: 1, sm: 0},
                  width: {xs: '90%', sm: 'initial'},
                  display: 'flex',
                  justifyContent: 'center'
                }
              }}>
              {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
              (<><StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                Submit
              </StyledButton>
              <Link to={'/specialist/courses'} style={{textDecoration: 'none'}}>
                <StyledButton disableHoverEffect={false} variant="outlined">
                  Cancel
                </StyledButton>
              </Link></>)}
            </Box>
        </Box>
      </Box>
    </Slide>
    )
  }
export default NewMedia;



