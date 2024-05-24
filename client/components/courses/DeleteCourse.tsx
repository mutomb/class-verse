import React, {FC, useState} from 'react'
import {MenuItem, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import { Delete } from '@mui/icons-material'
import {useAuth} from '../auth'
import {remove} from './api-course'
import { StyledButton } from '../styled-buttons'
import { useTheme } from '@mui/material/styles'
import { removeBulk } from '../media/api-media'

interface DeleteCourseProps{
  course:any,
  onRemove:Function
}

const DeleteCourse: FC<DeleteCourseProps> = ({course, onRemove}) => {
  const {isAuthenticated} = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const {transitions} = useTheme()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteCourse = () => {
    let deleteMediaIds= course.lessons && course.lessons.map(lesson=>lesson.media && lesson.media._id).filter(mediaId=> mediaId)
    if(deleteMediaIds){
      removeBulk({deleteMediaIds: deleteMediaIds}, {token: isAuthenticated().token}).then((results) => {
        console.log(results)    
        //TODO: Multi-error handling
        remove({
          courseId: course._id
        }, {token: isAuthenticated().token}).then((data) => {
          if (data.error) {
            console.log(data.error)
          } else {
            setOpen(false)
            onRemove()
          }
        })
      }).catch(e=>console.log(e))
    }else{
      remove({
        courseId: course._id
      }, {token: isAuthenticated().token}).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setOpen(false)
          onRemove()
        }
      })
    }
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
    return (<>
      <MenuItem aria-label="Delete" onClick={clickButton} sx={{color: 'red', fontSize: '1rem', transition: transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
        <Delete/> Delete Course
      </MenuItem>
      <Dialog transitionDuration={1000} open={open} onClose={handleRequestClose} aria-labelledby="form-dialog-title">
        <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 }, color: 'text.primary' }}>
          {"Delete "+course.name}
          </Typography>        
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center'}}>
          <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
            Confirm to delete your course {course.name}. Course will be deleted permanently.
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
          <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteCourse}>
            Confirm
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>)
}
export default DeleteCourse;