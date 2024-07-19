import React, {FC, useState} from 'react'
import {Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Typography, dialogClasses} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Delete, Error} from '@mui/icons-material'
import {remove} from './api-media'
import {Redirect} from 'react-router-dom'
import { useAuth } from '../auth'
import { StyledButton } from '../styled-buttons'
import { StyledSnackbar } from '../styled-banners'

interface DeleteMediaProps{
  mediaId: string,
  mediaTitle: string,
  courseId?: string,
}

const DeleteMedia: FC<DeleteMediaProps> = ({mediaId, mediaTitle, courseId}) => {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const {palette,transitions} = useTheme()
  const {isAuthenticated} = useAuth()
  const [error, setError]= useState('')
  const clickButton = () => {
    setOpen(true)
  }
  const deleteMedia = () => {
    remove({
      mediaId: courseId? `${mediaId}/course/${courseId}`: mediaId
    }, {token: isAuthenticated().token}).then((data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
  if (redirect) {
    return <Redirect to='/specialist/courses'/>
  }
  return (<>
    <MenuItem aria-label="Delete" onClick={clickButton} sx={{color: 'error.main', fontSize: '1rem', transition: transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
      <Delete/> Delete Video
    </MenuItem>
    <Dialog PaperComponent={Box} transitionDuration={1000} open={open} onClose={handleRequestClose} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, borderRadius: 4, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
      <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
        <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 }, color: 'text.primary' }}>
        {"Delete "+mediaTitle}
        </Typography>        
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center'}}>
          <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
          {"The video, "+mediaTitle+", will be permanently deleted, along with its meta data (title, description and genre)."}
        </DialogContentText>
      </DialogContent>
      <DialogActions
          sx={{
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
        <StyledButton disableHoverEffect={false} variant="contained" onClick={handleRequestClose}>
          Cancel
        </StyledButton>
        <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteMedia}>
          Confirm
        </StyledButton>
      </DialogActions>
    </Dialog>
    <StyledSnackbar
    open={error? true: false}
    duration={3000}
    handleClose={()=>setError('')}
    icon={<Error/>}
    heading={"Error"}
    body={error}
    variant='error'
    />
  </>)
}
export default DeleteMedia