import React, {FC, useRef, useState} from 'react'
import {Typography, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, Slide, outlinedInputClasses, MenuItem} from '@mui/material'
import {Error, FileUpload, CheckOutlined, Delete, Edit} from '@mui/icons-material'
import {Link, Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, StyledButton } from '../styled-buttons'
import {create} from './api-article'
import { useAuth } from '../auth'
import { HashLoader } from '../progress'
import { StyledSnackbar } from '../styled-banners'

interface NewArticleProps{
  lessonId?: string,
  courseId?: string,
  handleNext?: ()=>void,
  direction?: 'left' | 'right',
  containerRef?: Element | ((element: Element) => Element) | null | undefined,
  heading?: string
}
const NewArticle:FC<NewArticleProps> = ({lessonId, courseId, handleNext, direction='left', containerRef, heading='Add Article'}) => {
  const [values, setValues] = useState({
      article: '',
      articleId: '',
      error: '',
      disableSubmit: false,
      redirectToEditCourse: false,
  })

  const {isAuthenticated} = useAuth()
  
  const theme = useTheme();

  const [localArticle, setLocalArticle] = useState({
    data: '',
    url: ''
  });
  const articleRef = useRef<HTMLElement>(null);

  const handleSubmit = () => {
    setValues({...values, disableSubmit: true})
    if(!values.article){
      return setValues({...values, disableSubmit: false, error: 'Upload article to proceed.'})
    }
    let articleData = new FormData()
    values.article && articleData.append('article', values.article)
    lessonId && articleData.append('lesson', lessonId)
    courseId && articleData.append('course', courseId)
    create({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {
      token: isAuthenticated().token
    }, articleData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error, disableSubmit: false})
      } else {
        setValues({...values, error: '', articleId: data._id, disableSubmit: false, redirectToEditCourse: true})
        handleNext && handleNext()
      }
    })
  }
  const handleChange = name => event => {
    const value = name === 'article'? event.target.files[0]: event.target.value
    setValues({...values, [name]: value})
    name === 'article' && setLocalArticle({...localArticle, url: URL.createObjectURL(value)})
    console.log(values)
  }
  const deleteArticle = () => {
    setLocalArticle({ data: '', url: ''});
    values.article && setValues({ ...values, article: '' })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }

  if(values.redirectToEditCourse && courseId){
    return(<Redirect to={'/specialist/course/edit/'+courseId} />)
  }

  return (
    <Slide {...(containerRef && {container:containerRef.current})} timeout={1000} appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <Box sx={{ textAlign: 'center'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
            {heading}
          </Typography>
        </Box>
        <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Upload Article</Typography>
        {!values.article?
          (<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <Box component='input' type="file" accept="application/pdf" onChange={handleChange('article')} style={{display: 'none'}} id="article-upload-button" />
            <Box ref={articleRef} component='label' htmlFor="article-upload-button" sx={{color:"inherit", fontSize: '1rem', '& svg': {fontSize: {xs: 20, sm: 40} }}}>
              <StyledButton onClick={()=>articleRef?.current?.click()} endIcon={<FileUpload />} variant="contained">
                Upload Note (only PDF file allowed)
              </StyledButton>
            </Box>
          </Box>):
          (<Box sx={{position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <CheckOutlined sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}}}/>
              {!values.disableSubmit &&
              (<MoreMenuVertButton style={{position: 'absolute', top: 0, right: 0, color: "primary.main", bgcolor: 'primary.contrastText', boxShadow: 4,  transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                <MenuItem sx={{color: 'text.primary', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                  <Box component='label' htmlFor="article-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                    <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/>{!localArticle.url? "Add Article": "Edit Article"}
                  </Box>
                </MenuItem>
                {localArticle.url && 
                (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                  <Box aria-label="Delete" onClick={deleteArticle} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                    <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Article
                  </Box>
                </MenuItem>)}
              </MoreMenuVertButton>)}
            </Box>)
        }
        <Box 
          sx={{ mt: 1, width: '100%',
          [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
          [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
          [`& .${inputLabelClasses.focused}`]: { 
            color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
          },
          [`& .${outlinedInputClasses.root}`]: {bgcolor: 'background.paper', borderRadius: 4},
          }}>
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
              (<>
              {values.article && 
              (<StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                Submit
              </StyledButton>)}
              {courseId &&
              (<Link to={'/specialist/course/edit/'+courseId} style={{textDecoration: 'none'}}>
                <StyledButton disableHoverEffect={false} variant="outlined">
                  Cancel
                </StyledButton>
              </Link>)}
              </>)}
            </Box>
        </Box>
      </Box>
    </Slide>
    )
  }
export default NewArticle;



