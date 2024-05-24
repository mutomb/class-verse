import React, {FC, useState} from 'react'
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Delete} from '@mui/icons-material'
import {remove} from './api-media'
import {Redirect} from 'react-router-dom'
import { useAuth } from '../auth'
import { StyledButton } from '../styled-buttons'

interface DeleteMediaProps{
  mediaId: string,
  mediaTitle: string,
  courseId?: string,
}

const DeleteMedia: FC<DeleteMediaProps> = ({mediaId, mediaTitle, courseId}) => {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const {transitions} = useTheme()
  const {isAuthenticated} = useAuth()

  const clickButton = () => {
    setOpen(true)
  }
  const deleteMedia = () => {
    remove({
      mediaId: courseId? `${mediaId}/course/${courseId}`: mediaId
    }, {token: isAuthenticated().token}).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
  if (redirect) {
    return <Redirect to='/teach/courses'/>
  }
  return (<>
    <MenuItem aria-label="Delete" onClick={clickButton} sx={{color: 'red', fontSize: '1rem', transition: transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
      <Delete/> Delete Video
    </MenuItem>
    <Dialog transitionDuration={1000} open={open} onClose={handleRequestClose} aria-labelledby="form-dialog-title">
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
            mx: {xs: 'unset', sm: 1},
            my: {xs: 1, sm: 'unset'}}
        }}>
        <StyledButton disableHoverEffect={false} variant="contained" onClick={handleRequestClose}>
          Cancel
        </StyledButton>
        <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteMedia}>
          Confirm
        </StyledButton>
      </DialogActions>
    </Dialog>
  </>)
}
export default DeleteMedia