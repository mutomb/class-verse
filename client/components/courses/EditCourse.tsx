import React, {useState, useEffect, FormEvent}  from 'react'
import {Typography, IconButton, List, TextField, ListItem, ListItemAvatar, Avatar, 
ListItemText, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, listItemClasses, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Grid,
MenuItem, FormControl, svgIconClasses, iconButtonClasses, useMediaQuery} from '@mui/material'
import {Delete, ArrowUpward, Edit, Error, AddBox } from '@mui/icons-material'
import {read, update, fetchImage, listCurrencies} from './api-course'
import {Link, Redirect} from 'react-router-dom'
import {useAuth} from '../auth'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, SelectButton, StyledButton } from '../styled-buttons'
import { removeBulk } from '../media/api-media'
import { NewMedia } from '../media'
// import { NewLesson } from '.'

interface CourseState{
  _id: string
  name:string,
  description:string,
  cover:any,
  category:string,
  currency: string,
  teacher:any,
  lessons:Array<any>,
  price: number,
  published: boolean,
}
interface ValuesState{
  redirect:boolean,
  error:string
}

export default function EditCourse({match}){
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [course, setCourse] = useState<CourseState>({
      _id: '',
      cover:'',
      name: '',
      category:'',
      currency: 'USD',
      description: '',
      published: false,
      price: 0,
      teacher:{},
      lessons: []
    })
  const defaultphotoURL ='/api/courses/defaultphoto'
  const [localCover, setLocalCover] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const [values, setValues] = useState<ValuesState>({
      redirect: false,
      error: ''
    })
  const [currencies, setCurrencies] = useState([])
  const [open, setOpen] = useState<boolean>(false)
  const [openAddMedia, setOpenAddMedia] = useState({lessonId:'', courseId: ''})
  const [lessonToDelete, setLessonToDelete] = useState({index: -1, title: ''})
  const [deleteMediaIds, setDeleteMediaIds] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({courseId: match.params.courseId}, signal).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        data.cover = ''
        setCourse(data)
      }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.courseId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if (course._id) {
      const courseCoverUrl = `/api/courses/photo/${course._id}?${new Date().getTime()}`
      fetchImage(courseCoverUrl, {token: isAuthenticated().token}, signal).then(({data, isDefault}) => {
        if(data) setLocalCover({ data: data, url: URL.createObjectURL(data), isDefault: isDefault });
      })
    }
    return function cleanup(){
      abortController.abort()
    }
  }, [course._id])

  useEffect(() => {
    setCourse({...course, cover: localCover.data})
  }, [localCover.data])

  /** Fetch price currencies */
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listCurrencies(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
        setValues({...values, error: "Could not get currencies"})
      } else {
        setCurrencies(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const handleChange = (name: string) => event => {
    const value = name === 'cover'
    ? event.target.files[0]
    : event.target.value
    setCourse({ ...course, [name]: value })
    name === 'cover' && setLocalCover({...localCover, url: URL.createObjectURL(value), isDefault: false})
  }
  const deleteCover = () => {
    setLocalCover({ data: '', url: '', isDefault: true });
    course.cover && setCourse({ ...course, cover: '' })
  }
  const handleLessonChange = (name: string, index: number) => event => {
    const lessons = course.lessons
    lessons[index][name] =  event.target.value
    setCourse({ ...course, lessons: lessons })
  }
  const openDeleteDialogue = (index, lesson) => {
    setLessonToDelete({...lessonToDelete, title: `${index+1}. ${lesson.title}`, index: index})
    setOpen(true)
  }

  const deleteLesson = index => () => {
    const lessons = course.lessons
    setDeleteMediaIds((prevState) => {
      if(lessons[index].media){
        return [...deleteMediaIds, lessons[index].media._id] 
      }
      return [...deleteMediaIds]
    })
    lessons.splice(index, 1)
    setCourse({...course, lessons:lessons})
    setLessonToDelete({...lessonToDelete, title: "", index: -1})
    handleClose()
 }

  const moveUp = index => () => {
      const lessons = course.lessons
      const moveUp = lessons[index]
      lessons[index] = lessons[index-1]
      lessons[index-1] = moveUp
      setCourse({ ...course, lessons: lessons })
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let courseData = new FormData()
    course.name && courseData.append('name', course.name)
    course.description && courseData.append('description', course.description)
    course.cover && courseData.append('cover', course.cover)
    course.category && courseData.append('category', course.category)
    course.price && courseData.append('price', course.price)
    course.currency && courseData.append('currency', course.currency)
    courseData.append('lessons', JSON.stringify(course.lessons))
    removeBulk({deleteMediaIds: deleteMediaIds}, {token: isAuthenticated().token}).then((results) => {    
      //TODO: Multi-error handling
      update({
        courseId: match.params.courseId
        }, {
          token: isAuthenticated().token
        }, courseData).then((data) => {
          if (data && data.error) {
            console.log(data.error)
            setValues({...values, error: data.error})
          } else {
            setValues({...values, redirect: true})
          }
        }).catch(e=>setValues({...values, error: e}))
      }).catch(e=>setValues({...values, error: e}))
  }
  const handleClose = () => {
    setOpen(false)
    setLessonToDelete({...lessonToDelete, title: "", index: -1})
  }
  const showAddMedia = (lessonId) => {
    setOpenAddMedia({...openAddMedia, lessonId: lessonId, courseId: course._id})
  }
  const hideAddMedia = () => {
    setOpenAddMedia({...openAddMedia, lessonId: '', courseId: ''})
  }
  // const addLesson = (course) => {
  //   setCourse(course)
  // }
  const isTeacher = (course) =>{
    return isAuthenticated().user && isAuthenticated().user._id === course.teacher._id
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/course/'+course._id}/>)
  }

  return (<>
      <Box
        sx={{
          width: '100%',
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor:'background.paper'
        }}
      >
        <Box sx={{ textAlign: 'center', with: '100%'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
            Edit Course
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', mx: 'auto'}}>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:300}}}>
           <Box component='img' src={localCover.url? localCover.url : defaultphotoURL} sx={{width: {xs: 150, sm:300}, height:'auto'}} alt={'Course ' + course.name +" "+ ' picture'} />
          </Box>
          <Box id="course-image-inputs" 
              sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: {xs: 150, sm: 300}, height: {xs: 150, sm: 300}, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    backgroundColor: 'secondary.main', opacity: 0,
                    ':hover':{
                    opacity: 0.7,
                    transition: 'opacity 0.5s ease'
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
            <MoreMenuVertButton style={{mx: 0}}>
              <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                <input accept="image/*" onChange={handleChange('cover')} style={{display: 'none'}} id="cover-upload-button" type="file" />
                <Box component='label' htmlFor="cover-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                  <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/> Edit Image
                </Box>
              </MenuItem>
            {localCover.url && !localCover.isDefault && 
            (<MenuItem sx={{color: 'red', transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                <Box aria-label="Delete" onClick={deleteCover} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                  <Delete /> Delete Image
                </Box>
              </MenuItem>)}
            </MoreMenuVertButton>  
          </Box>
        </Box>
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',}} component="form" onSubmit={handleSubmit}> 
          <Box id="course-text-inputs"
            sx={{ mt: 1, width: {xs: '100%', md: '80%'}, mx: 'auto',
              [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${inputLabelClasses.focused}`]: { 
                color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
              },
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}> 
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={course.name} 
                  onChange={handleChange('name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="category"
                    label="Category"
                    placeholder='Example: Machine Learning'
                    id="category"
                    autoComplete="category"
                    value={course.category} 
                    onChange={handleChange('category')}
                  />
                </Grid>
              </Grid>
              <TextField
                multiline
                minRows="5"
                maxRows='7'
                inputProps={{ maxLength: 1000 }}
                type="text"
                margin="normal"
                required
                fullWidth
                name="description"
                label="Description"
                placeholder='Example: This Course teaches you how to design rockets in no time flat...'
                id="description"
                autoComplete="experience"
                value={course.description} 
                onChange={handleChange('description')}
              />
              <TextField
                margin="normal"
                required
                name="price"
                label="Price"
                id="price"
                autoComplete="price"
                value={course.price} 
                onChange={handleChange('price')}
                helperText='Choose currency and Enter price'
                InputProps={{
                  startAdornment: <InputAdornment position="start"> 
                                      <FormControl
                                        aria-label="currencies"
                                        sx={{
                                          minWidth: 80, maxWidth: 200,
                                          my: {xs: 2, md: 0},
                                          mr: { xs: 0, md: 0 },
                                        }}>
                                        <SelectButton 
                                        options={currencies} value={course.currency} handleChange={handleChange('currency')} label='Currencies' 
                                        styles={{
                                          borderTopLeftRadius: 3,
                                          borderBottomLeftRadius: 3,
                                          borderTopRightRadius: {xs: 3, md: 0},
                                          borderBottomRightRadius: {xs: 3, md: 0},
                                          bgcolor: 'background.paper',
                                          color: 'primary.main',
                                          [`& .${svgIconClasses.root}`]: {color: 'primary.main'},
                                          ':hover':{
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            [`& .${svgIconClasses.root}`]: {color: 'primary.contrastText'},
                                          },
                                        }}
                                        />
                                      </FormControl>
                                  </InputAdornment>,
                }}
              /> 
          </Box>
          <Box id="lessons" 
            sx={{ px: {xs: 0, sm:2}, py: 1.5, width: {xs: '100%', md: '80%'}, mx: 'auto', borderRadius: 4, bgcolor:'background.default'}}>
            <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <Box sx={{  width: '100%', display: 'flex', flexDirection: {xs: 'column', md:'row'}, alignItems: 'center', textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                <Typography variant="h3" component="h3" 
                sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1rem', sm: '1.5rem' }, color: 'text.primary'}}>
                  Lessons - Edit and Rearrange
                </Typography>
                <Typography variant="body1" sx={{margin: '10px', display: 'flex', fontWeight: 600}}>{course.lessons && (<Avatar sx={{borderRadius: '50%', width:{xs: 20, sm: 25}, height:{xs: 20, sm: 25}, mr: 1, verticalAlign: 'center'}}>{course.lessons.length}</Avatar>)} lessons</Typography>
                <Box sx={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                {
                  isTeacher(course) && !course.published &&
                  (<Link style={{textDecoration:'none'}} to={`/teach/course/${course._id}/lesson/new`}>
                    <StyledButton type='button' disableHoverEffect={false} variant="contained" color='primary'>
                      <AddBox sx={{verticalAlign: 'text-top'}}/>{ xsMobileView? '': 'Add Lesson'}
                    </StyledButton>
                  </Link>)
                      // (<NewLesson courseId={course._id} addLesson={addLesson}/>)
                }
                </Box>
              </Box>
              <List dense sx={{width: '100%', px: {xs: 1, sm:5}, [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
              {course.lessons && course.lessons.map((lesson, index) => {
                return(<>
                  <Box component='span' key={index+lesson._id}>
                    <ListItem sx={{display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', '&:hover':{boxShadow: 2},
                                    mx: {xs:0, sm:2}, my: 2, borderRadius: 3, bgcolor: 'background.paper'}}>
                      <ListItemAvatar sx={{display: 'flex', flexDirection: {xs: 'row', sm: 'column'}}}>
                        { index != 0 &&     
                          <IconButton aria-label="up" onClick={moveUp(index)} color="inherit"
                            sx={{
                              backgroundColor: 'background.paper',
                              color: 'primary.main',
                              '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText', boxShadow: 2 },
                              zIndex: 10,
                              mb:{xs:'unset', sm: 1},
                              mr:{xs:1, sm: 'unset'},
                              width:{xs: 30, sm: 40}, height:{xs: 30, sm: 40},
                              transform: 'unset',
                              ':hover':{
                                transform: 'translateY(-3px)',
                                transition: (theme) => theme.transitions.create(['transform'])
                              }
                              }}>
                            <ArrowUpward sx={{ fontSize: 22 }} />
                          </IconButton>
                        }
                        <Avatar sx={{borderRadius: '50%', width:{xs: 30, sm: 40}, height:{xs: 30, sm: 40}}}>{index+1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}}}
                          primary={<><TextField
                              margin="normal"
                              required
                              name='title'
                              label="Title"
                              type="text"
                              fullWidth
                              value={lesson.title} 
                              onChange={handleLessonChange('title', index)}/>
                            <TextField
                              margin="normal"
                              required
                              name='content'
                              multiline
                              minRows="5"
                              maxRows="7"
                              label="Content"
                              type="text"
                              fullWidth
                              value={lesson.content} 
                              onChange={handleLessonChange('content', index)}/>
                            <TextField
                              margin="normal"
                              required
                              name='resource-link'
                              label="Resource link"
                              type="text"
                              fullWidth
                              value={lesson.resource_url} 
                              onChange={handleLessonChange('resource_url', index)}/>
                        </>}/>
                      {!course.published && 
                    <MoreMenuVertButton>
                      {lesson.media?
                     (<MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                        <Link to={`/media/edit/${lesson.media._id}/course/${course._id}`} style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                          <Box aria-label="Edit" color="inherit" 
                          sx={{
                              zIndex: 10,
                              transform: 'unset',
                              '&:hover':{
                                boxShadow: 2,
                                transform: 'translateY(-3px)',
                                transition: theme.transitions.create(['transform'])
                              }}}>
                            <Edit sx={{verticalAlign: 'text-top'}}/> Edit Video
                          </Box>
                        </Link>
                      </MenuItem>):
                      (<MenuItem onClick={()=>showAddMedia(lesson._id)} sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                          <Box aria-label="Edit" color="inherit" 
                          sx={{
                              zIndex: 10,
                              transform: 'unset',
                              '&:hover':{
                                boxShadow: 2,
                                transform: 'translateY(-3px)',
                                transition: theme.transitions.create(['transform'])
                              }}}>
                            <Edit sx={{verticalAlign: 'text-top'}}/> Add Video
                          </Box>
                      </MenuItem>)}
                      <MenuItem aria-label="Delete Label" onClick={()=>openDeleteDialogue(index, lesson)} sx={{color: 'red', fontSize: '1rem', transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                        <Delete/> Delete Lesson
                      </MenuItem>
                    </MoreMenuVertButton>
                      }
                    </ListItem>
                  </Box>
                  </>)
              })}
              </List>
            </Box>
          </Box>
          {isTeacher(course) &&
          (<Box id="course-buttons" sx={{
            width: {xs: '100%', sm: '50%'},
            display: 'flex',
            flexDirection: {xs: 'column', sm:'row'},
            alignItems: 'center',
            justifyContent: 'space-around',
            my: 5,
            '& > button':{ 
              mx: {xs: 'unset', sm: 1},
              my: {xs: 1, sm: 'unset'}}
          }}>
            <StyledButton type='submit' disableHoverEffect={false} variant="contained">
              Save
            </StyledButton>
            <Link to={`/teach/course/${course._id}`} style={{textDecoration: 'none'}}>
              <StyledButton disableHoverEffect={false} variant="outlined">
                Cancel
              </StyledButton>
            </Link>
          </Box>)}
        </Box>
      </Box>
      <Dialog transitionDuration={1000} open={open}  onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
              <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 } }}>
                  Delete Lesson
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center'}}>
              <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
                Are you sure you want to delete: {<br/>}
                <Typography sx={{ color: 'primary.main' }}>{lessonToDelete.title}</Typography> 
              </DialogContentText>
              <Typography variant="body1">
                This lesson will be permanently deleted once this course update is saved.
              </Typography>
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
                <StyledButton disableHoverEffect={false} variant="contained" onClick={handleClose}>
                  Cancel
                </StyledButton>
                <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteLesson(lessonToDelete.index)}>
                  Delete
                </StyledButton>
            </DialogActions>
      </Dialog>
      <Dialog transitionDuration={1000} open={openAddMedia.lessonId? true: false}  onClose={hideAddMedia} aria-labelledby="form-dialog-title">
          <NewMedia lessonId={openAddMedia.lessonId} courseId={course._id}/>
      </Dialog>
      </>)
}


