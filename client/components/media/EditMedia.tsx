import React, {FormEvent, useState, useEffect} from 'react'
import {Typography, TextField, Box, Paper, formControlLabelClasses, formLabelClasses, inputLabelClasses, MenuItem, iconButtonClasses} from '@mui/material'
import {Error, Edit} from '@mui/icons-material'
import {Link, Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import {read, update} from './api-media'
import { useAuth } from '../auth'
import {DeleteMedia} from '.'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'

export default function EditMedia({ match }) {
  console.log(match.params)
  const [media, setMedia] = useState({title: '', description:'', genre:'', video: ''})
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const {isAuthenticated} = useAuth()
  const [localVideo, setLocalVideo] = useState({
    data: '',
    url: '/api/media/video/'+match.params.mediaId
  });
  const theme = useTheme();

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({mediaId: match.params.mediaId}, signal).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setMedia(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match && match.params && match.params.mediaId])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableSubmit(true)
    if(!media.video) {setError('Uploaded Video.'); return}
    let mediaData = new FormData()
    media.title && mediaData.append('title', media.title)
    media.video && mediaData.append('video', media.video)
    media.description && mediaData.append('description', media.description)
    media.genre && mediaData.append('genre', media.genre)
    update({
      mediaId: match.params && match.params.mediaId
    }, {
      token: isAuthenticated().token
    }, mediaData).then((data) => {
      if (data.error) {
        setError(data.error)
        setDisableSubmit(false)
      } else {
        setRedirect(true)
        setDisableSubmit(false)
      }
    })
  }

  const handleChange = name => event => {
    const value = name === 'video'
    ? event.target.files[0]
    : event.target.value
    setMedia({...media, [name]: value })
    name === 'video' && setLocalVideo({...localVideo, url: URL.createObjectURL(value)})
    setError('')
  }

  const handleClose = () => {
    setError('')
  }

  if (redirect) {
    return (<Redirect to={match.params && '/media/' + match.params.mediaId}/>)
  }
  return (<>
    <Paper sx={{ width: {xs: '100%', md: 800}, m: 'auto', mx: { xs: 0, md: 'auto'}, backgroundColor: 'background.paper', borderRadius: 4 }} elevation={2}>
      <Box sx={{ my: 8, mx: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', }} >
        <Box sx={{ textAlign: 'center'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
            Edit Video Details
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', mx: 'auto'}}>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:300}, mb: 2 }}>
            <Box component='video' controls src={localVideo.url} sx={{width: {xs: 150, sm:300}, height:'auto'}}>
              Video not supported on this browser.
            </Box>
          </Box>
          <Box id="video-inputs" 
            sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: {xs: 150, sm: 300}, height: {xs: 150, sm: 300}, borderRadius: 10,
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
                <Box aria-label="Delete" color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                  <DeleteMedia mediaId={match.params.mediaId} courseId={match.params.courseId} mediaTitle={media.title}/>
                </Box>
              </MenuItem>)}
            </MoreMenuVertButton>
          </Box>
        </Box>
        <Box component="form" onSubmit={handleSubmit} 
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
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            autoFocus
            value={media.title} 
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
              value={media.description} 
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
              value={media.genre} 
              onChange={handleChange('genre')}
            />
            <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={handleClose}
            icon={<Error/>}
            heading={"Error"}
            body={error}
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
              {disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
              (<StyledButton type='submit' disableHoverEffect={false} variant="contained">
                Save
              </StyledButton>)}
              <Link to={'/teach/courses'} style={{textDecoration: 'none'}}>
                <StyledButton disableHoverEffect={false} variant="outlined">
                  Cancel
                </StyledButton>
              </Link>
            </Box>
        </Box>
      </Box>
    </Paper>
</>)
  }
