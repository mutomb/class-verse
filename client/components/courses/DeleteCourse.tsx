import React, {FC, useState} from 'react'
import {MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, dialogClasses, Box} from '@mui/material'
import { Delete, Error } from '@mui/icons-material'
import {useAuth} from '../auth'
import {remove} from './api-course'
import { StyledButton } from '../styled-buttons'
import { useTheme } from '@mui/material/styles'
import { removeBulk as removeBulkMedia } from '../media/api-media'
import { removeBulk as removeBulkArticles } from '../article/api-article'
import { StyledSnackbar } from '../styled-banners'

interface DeleteCourseProps{
  course:any,
  onRemove:Function
}

const DeleteCourse: FC<DeleteCourseProps> = ({course, onRemove}) => {
  const {isAuthenticated} = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const {transitions, palette} = useTheme()
  const [deleted, setDeleted] = useState({media: false, articles: false})
  const [error, setError] = useState('')
  const clickButton = () => {
    setOpen(true)
  }
  const deleteCourse = () => {
    let deleteMediaIds= course.lessons && course.lessons.map(lesson=>lesson.media && lesson.media._id).filter(mediaId=> mediaId)
    let deleteArticleIds= course.lessons && course.lessons.map(lesson=>lesson.article && lesson.article._id).filter(articleId=> articleId)
    if(course.media && course.media._id){
      if(deleteMediaIds  && deleteMediaIds.length>0){
        deleteMediaIds.push()
      }else{
        deleteMediaIds= [course.media._id]
      }
    }
    if(deleteMediaIds && deleteArticleIds.length>0){
      removeBulkMedia({deleteMediaIds: deleteMediaIds}, {token: isAuthenticated().token}).then((results) => {
        //TODO: Multi-error handling
        setDeleted({...deleted, media: true})
      }).catch(e=>console.log(e))
    }
    if(deleteArticleIds && deleteArticleIds.length>0){
      removeBulkArticles({deleteArticleIds: deleteArticleIds}, {token: isAuthenticated().token}).then((results) => {
        //TODO: Multi-error handling
        setDeleted({...deleted, articles: true})
      }).catch(e=>console.log(e))
    }
    if((!deleteArticleIds || deleteArticleIds===0) && (!deleteArticleIds || deleteArticleIds===0)){
      remove({
        courseId: course._id
      }, {token: isAuthenticated().token}).then((data) => {
        if (data && data.error) {
           setError(data.error)
        } else {
          setDeleted({articles: true, media: true})
        }
      })
    }
  }
  if(deleted.articles && deleted.media){
    remove({
      courseId: course._id
    }, {token: isAuthenticated().token}).then((data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setOpen(false)
        onRemove()
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
    return (<>
      <MenuItem aria-label="Delete" onClick={clickButton} sx={{color: 'error.main', fontSize: '1rem', transition: transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
        <Delete/> Delete Course
      </MenuItem>
      <Dialog PaperComponent={Box} transitionDuration={1000} open={open} onClose={handleRequestClose} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{borderRadius: 4, mx: {xs: 0, md: 'unset'}, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
        <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 }, color: 'text.primary' }}>
          {"Delete "+course.title}
          </Typography>        
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center'}}>
          <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
            Confirm to delete your course {course.title}. Course will be deleted permanently.
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
          <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteCourse}>
            Confirm
          </StyledButton>
        </DialogActions>
        <StyledSnackbar
        open={error? true: false}
        duration={3000}
        handleClose={()=> setError('')}
        icon={<Error/>}
        heading={"Error"}
        body={error}
        variant='error'
        />
      </Dialog>
    </>)
}
export default DeleteCourse;