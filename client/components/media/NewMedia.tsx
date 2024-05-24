import React, {FC, useState} from 'react'
import {Typography, TextField, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, MenuItem, iconButtonClasses, Slide} from '@mui/material'
import {Error, Delete, Edit} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import {create} from './api-media'
import { useAuth } from '../auth'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'
interface NewMediaProps{
  lessonId?: string,
  courseId?: string,
  handleNext?: ()=>void
}
const NewMedia:FC<NewMediaProps> = ({lessonId, courseId, handleNext}) => {
  const [values, setValues] = useState({
      title: '',
      video: '',
      description: '',
      genre: '',
      error: '',
      mediaId: '',
      disableSubmit: false
  })

  const {isAuthenticated} = useAuth()
  
  const theme = useTheme();

  const [localVideo, setLocalVideo] = useState({
    data: '',
    url: ''
  });

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
    lessonId && mediaData.append('lesson', lessonId)
    courseId && mediaData.append('course', courseId)
    create({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {
      token: isAuthenticated().token
    }, mediaData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error, disableSubmit: false})
      } else {
        setValues({...values, error: '', mediaId: data._id, disableSubmit: true})
        handleNext && handleNext()
      }
    })
  }
  const handleChange = name => event => {
    const value = name === 'video'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
    name === 'video' && setLocalVideo({...localVideo, url: URL.createObjectURL(value)})
  }

  const deleteVideo = () => {
    setLocalVideo({ data: '', url: ''});
    values.video && setValues({ ...values, video: '' })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }

  return (
    <Slide timeout={1000} id="step-2" appear={true} direction="right" in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mx: {xs: 1, md: 8}}} >
        <Box sx={{ textAlign: 'center'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
            New Video
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', mx: 'auto'}}>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:200}, mb: 2 }}>
            <Box component='video' controls src={localVideo.url} sx={{width: {xs: 150, sm:300}, height:'auto'}}>
              Video not supported on this browser.
            </Box>
          </Box>
          <Box id="video-inputs" 
              sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: {xs: 150, sm: 300}, height: {xs: 100, sm: 100}, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    backgroundColor: 'secondary.main', opacity: 0,
                    ':hover':{
                      opacity: 0.7,
                      transition: 'opacity 0.5s ease',
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
            <MoreMenuVertButton>
              <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                <Box component='input' accept="video/*" onChange={handleChange('video')} sx={{display: 'none'}} id="video-upload-button" type="file" />
                <Box component='label' htmlFor="video-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                  <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/>Edit Video
                </Box>
              </MenuItem>
              {localVideo.url && 
              (<MenuItem sx={{color: 'red', transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                <Box aria-label="Delete" onClick={deleteVideo} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                  <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Video
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
            id="media-title"
            label="Title"
            name="media-title"
            autoComplete="media-title"
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
              placeholder='Example: This Video teaches you how to design rockets in no time flat...'
              id="description"
              autoComplete="experience"
              value={values.description} 
              onChange={handleChange('description')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="genre"
              label="Genre"
              placeholder='Example: Machine Learning'
              id="genre"
              autoComplete="genre"
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
              '& > button':{ 
                mx: {xs: 'unset', sm: 1},
                my: {xs: 1, sm: 'unset'}}
              }}>
              {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
              (<><StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                Submit
              </StyledButton>
              <Link to={'/teach/courses'} style={{textDecoration: 'none'}}>
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



