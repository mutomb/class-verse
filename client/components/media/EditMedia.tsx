import React, {useState, useEffect} from 'react'
import {Typography, TextField, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, MenuItem, iconButtonClasses, Container, Grid, outlinedInputClasses} from '@mui/material'
import {Error, Edit, Delete} from '@mui/icons-material'
import {Link, Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import {read, update} from './api-media'
import { useAuth } from '../auth'
import {DeleteMedia, MediaPlayer} from '.'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'
import { FormSkeleton } from '../skeletons'
import { Parallax } from 'react-parallax'
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'
import { WallPaperYGW } from '../wallpapers/wallpapers'

interface MediaProps{
  title: string,
  video: any,
  cover?: any,
  description: string,
  genre:string,
  duration: number,
  mediaId: string
}
export default function EditMedia({ match }) {
  const [media, setMedia] = useState<MediaProps>({
    title: '',
    video: '',
    cover: '',
    description: '',
    genre: '',
    duration: 0,
    mediaId: '',
  })
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState('')
  const [disableSubmit, setDisableSubmit] = useState(false)
  const {isAuthenticated} = useAuth()
  const [localVideo, setLocalVideo] = useState({
    data: '',
    url: '/api/media/video/'+match.params.mediaId
  });
  const [localCover, setLocalCover] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const defaultCoverURL ='/api/courses/defaultphoto'
  const theme = useTheme();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    match.params && match.params.mediaId && read({mediaId: match.params.mediaId}, signal).then((data) => {
      if (data && data.error) {
         setError(data.error)
        setLoading(false)
      } else {
        setMedia(data)
        setLoading(false)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match && match.params && match.params.mediaId])

  const handleSubmit = () => {
    if(!localVideo.url) {setError('Please upload Video.'); return}
    setDisableSubmit(true)
    let mediaData = new FormData()
    media.title && mediaData.append('title', media.title)
    media.video && mediaData.append('video', media.video)
    media.description && mediaData.append('description', media.description)
    media.genre && mediaData.append('genre', media.genre)
    media.duration && mediaData.append('duration', media.duration)
    media.cover && mediaData.append('cover', media.cover)
    if(!media.cover && localCover.isDefault){
      mediaData.append('cover', null)
    }
    update({
      mediaId: match.params && match.params.mediaId
    }, {
      token: isAuthenticated().token
    }, mediaData).then((data) => {
      if (data && data.error) {
         setError(data.error)
        setDisableSubmit(false)
      } else {
        setRedirect(true)
        setDisableSubmit(false)
      }
    })
  }

  const handleChange = name => event => {
    const value = name === 'video' || name === 'cover'
    ? event.target.files[0]
    : event.target.value
    setMedia({...media, [name]: value })
    name === 'video' && setLocalVideo({...localVideo, url: URL.createObjectURL(value)})
    name === 'cover' && setLocalCover({...localCover, url: URL.createObjectURL(value), isDefault: false})
  }
  const handleClose = () => {
    setError('')
  }
  const deleteCover = () => {
    setLocalCover({ data: '', url: '', isDefault: true });
    media.cover && setMedia({ ...media, cover: '' })
  }
  const onDurationChange = (duration: number) => {
    setMedia({...media, duration: duration})
  }

  if (redirect && match.params && (match.params.mediaId || match.params.courseId)) {
    return match.params.courseId? <Redirect to={'/specialist/course/'+match.params.courseId}/>:<Redirect to={'/media/' + match.params.mediaId}/>
  }
  if(loading || !media){
    return(<FormSkeleton />)
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
      sx={{overflow: 'hidden', px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
      width: '100%', borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
      }}>
      <Grid container>
        <Grid item xs={12} sx={{minHeight: '100vh'}}>
          <Box sx={{ my: 8, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} >
            <Box sx={{ textAlign: 'center'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                Edit Video Details
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
                {localVideo.url && media && media.title &&
                (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                  <Box aria-label="Delete" color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                    <DeleteMedia mediaId={match.params.mediaId} courseId={match.params.courseId} mediaTitle={media.title}/>
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
                    placeholder='Example: This Video teaches you how to add user profile details with React MERN...'
                    id="description"
                    autoComplete="name"
                    value={media.description} 
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
                    py: 4,
                    '& > button':{ 
                      mx: {xs: '0px !important', sm: '8px !important'},
                      my: {xs: 1, sm: 0},
                      width: {xs: '90%', sm: 'initial'},
                      display: 'flex',
                      justifyContent: 'center'
                    }
                  }}>
                  {disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
                  (<StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                    Save
                  </StyledButton>)}
                  <Link to={'/specialist/courses'} style={{textDecoration: 'none'}}>
                    <StyledButton disableHoverEffect={false} variant="outlined">
                      Cancel
                    </StyledButton>
                  </Link>
                </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Parallax>)
  }
