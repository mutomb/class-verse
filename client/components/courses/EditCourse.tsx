import React, {useState, useEffect, ChangeEvent, MouseEventHandler}  from 'react'
import {Typography, IconButton, List, TextField, ListItem, ListItemAvatar, Avatar, 
ListItemText, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, listItemClasses, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, 
MenuItem, FormControl, svgIconClasses, iconButtonClasses, useMediaQuery, dialogClasses, FormControlLabel, Switch, Container, outlinedInputClasses, Grid} from '@mui/material'
import {Delete, ArrowUpward, Edit, Error, AddBox, DeleteForever } from '@mui/icons-material'
import {read, update, fetchImage, listCurrencies} from './api-course'
import {Link, Redirect} from 'react-router-dom'
import {useAuth} from '../auth'
import { useTheme } from '@mui/material/styles'
import { ChipsArray, MoreMenuVertButton, SelectButton, StyledButton } from '../styled-buttons'
import { removeBulk as removeBulkMedia } from '../media/api-media'
import { removeBulk as removeBulkArticles, remove as removeArticle } from '../article/api-article'
import { NewMedia } from '../media'
import { FormSkeleton } from '../skeletons'
import { Parallax } from 'react-parallax'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'
import { StyledSnackbar } from '../styled-banners'
import { NewArticle } from '../article'
import { HashLoader } from '../progress'
import { SnowEditor } from '../forms'

interface CourseState{
  _id: string,
  cover:any,
  media: any,
  title:string,
  subtitle: string,
  category:string,
  language: string,
  programming_languages: { key: number, label: string }[],
  programming_language: string,
  technologies: { key: number, label: string }[],
  technology: string,
  sections: { key: number, label: string }[],
  section: string,
  requirements: { key: number, label: string }[],
  requirement: string,
  level: string,
  audiences: { key: number, label: string }[],
  audience: string,
  description: string,
  price: number,
  currency: string,
  specialist:any,
  lessons:Array<any>,
  published: boolean,
}
interface ValuesState{
  redirect:boolean,
  error:string,
  disableSubmit: boolean
}

export default function EditCourse({match}){
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [course, setCourse] = useState<CourseState>({
      _id: '',
      cover: '',
      media: '',
      title: '',
      subtitle: '',
      category: '',
      language: '',
      programming_languages: [],
      programming_language: '',
      technologies: [],
      technology: '',
      sections: [],
      section: '',
      requirements: [],
      requirement: '',
      level: '',
      audiences: [],
      audience: '',
      description: '',
      price: 0,
      currency: '$',
      published: false,
      specialist:{},
      lessons: [],
    })
  const defaultphotoURL ='/api/courses/defaultphoto'
  const [localCover, setLocalCover] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const [values, setValues] = useState<ValuesState>({
      redirect: false,
      error: '',
      disableSubmit: false
    })
  const [currencies, setCurrencies] = useState([])
  const [open, setOpen] = useState<boolean>(false)
  const [openAddMedia, setOpenAddMedia] = useState({lessonId:'', courseId: ''})
  const [openAddArticle, setOpenAddArticle] = useState({lessonId:'', courseId: ''})
  const [openDeleteArticle, setOpenDeleteArticle] = useState({articleId: '', lessonId:'', courseId: '', index: -1})
  const [lessonToDelete, setLessonToDelete] = useState({index: -1, title: ''})
  const [deleteIds, setDeleteIds] = useState({deleteMediaIds: [], deleteArticleIds: []})
  const [loading, setLoading] = useState(false)
  const [deletedMedia, setDeletedMedia] = useState(false)
  const [deletedArticles, setDeletedArticles] = useState(false)
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [
        '#fbfbfb', "#fff", '#f2f5f5', "#f5f5f5", "#e0e0e0","#9e9e9e", "#212121", '#222128',
        theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark, 
        theme.palette.secondary.light, theme.palette.secondary.main, theme.palette.secondary.dark, 
        theme.palette.error.light, theme.palette.error.main, theme.palette.error.dark 
        ]},
        { background: [
          '#fbfbfb', "#fff", '#f2f5f5', "#f5f5f5", "#e0e0e0","#9e9e9e", "#212121", '#222128',
          theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark, 
          theme.palette.secondary.light, theme.palette.secondary.main, theme.palette.secondary.dark, 
          theme.palette.error.light, theme.palette.error.main, theme.palette.error.dark 
          ]
      }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["link", "image"],      
      // ["clean"],
    ],
  };
  
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    read({courseId: match.params.courseId}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
        setLoading(false)
      } else {
        data.cover = ''
        setCourse({...course, ...data,
          programming_languages: data.programming_languages? data.programming_languages.map((pl, index)=>({key: index, label:pl})): [],
          technologies: data.technologies? data.technologies.map((technology, index)=>({key: index, label:technology})): [], 
          sections: data.sections? data.sections.map((section, index)=>({key: index, label:section})): [], 
          requirements: data.requirements? data.requirements.map((requirement, index)=>({key: index, label:requirement})): [], 
          audiences: data.audiences? data.audiences.map((audience, index)=>({key: index, label:audience})): [], 
        })
        setLoading(false)
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
    setCourse((prev_values)=>{
      console.log(prev_values)
      return {...prev_values, [name]: value}
    })
    name === 'cover' && setLocalCover({...localCover, url: URL.createObjectURL(value), isDefault: false})
  }
  const handleChangePrice = event => {
    if(event.target.value <=0){
      return setCourse({...course, price: 0 })
    }
    if(event.target.value >=10){
      return setCourse({...course, price: 10 })
    }
      return setCourse({...course, price: event.target.value })
  }
  const handleAddChip = (group_name: string, item_name: string) => (event) =>{
    if(event.keyCode === 13){
      event.preventDefault()
      if(course[group_name] && course[group_name].filter(item=>item.label===event.target.value).length>0){
        return setValues({...values, error: 'Skill already added'})
      }
      let updatedChipData = course[group_name]
      updatedChipData.push({key: updatedChipData.length, label: event.target.value})
      setCourse({...course, [group_name]: updatedChipData, [item_name]: ''})
    }
  }
  const handleDeleteChipProgrammingLanguage = (chipToDelete) => () => {
    setCourse(({programming_languages}) => {
      return {...course, programming_languages: programming_languages.filter((programming_language) => programming_language.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipTechnology= (chipToDelete) => () => {
    setCourse(({technologies}) => {
      return {...course, technologies: technologies.filter((technology) => technology.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipSection = (chipToDelete) => () => {
    setCourse(({sections}) => {
      return {...course, sections: sections.filter((section) => section.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipAudience = (chipToDelete) => () => {
    setCourse(({audiences}) => {
      return {...course, audiences: audiences.filter((audience) => audience.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipRequirement = (chipToDelete) => () => {
    setCourse(({requirements}) => {
      return {...course, requirements: requirements.filter((requirement) => requirement.key !== chipToDelete.key)}
    });
  }
  const deleteCover = () => {
    setLocalCover({ data: '', url: '', isDefault: true });
    course.cover && setCourse({ ...course, cover: '' })
  }
  const handleLessonChange = (name: string, index: number) => event => {
    const value = name === 'article'? event.target.files[0] : name === 'content'? event: event.target.value
    const lessons = course.lessons
    lessons[index][name] = value
    setCourse({ ...course, lessons: lessons })
  }
  const handleCheck = (name: string, index: number) => (event: ChangeEvent<HTMLFormElement>) => {
    const lessons = course.lessons
    lessons[index][name] =  event.target.checked
    setCourse({ ...course, lessons: lessons })
  }
  const openDeleteDialogue = (index, lesson) => {
    setLessonToDelete({...lessonToDelete, title: `${index+1}. ${lesson.title}`, index: index})
    setOpen(true)
  }

  const toDeleteLesson = index => () => {
    const lessons = course.lessons
    setDeleteIds((prevState) => {
      let deleteMediaIds = prevState.deleteMediaIds
      let deleteArticleIds = prevState.deleteArticleIds 
      if(lessons[index] && lessons[index].media){
        deleteMediaIds.push(lessons[index].media._id) 
      }
      if(lessons[index] && lessons[index].article){
        deleteArticleIds.push(lessons[index].article._id)
      }
      return {deleteMediaIds, deleteArticleIds}
    })
    lessons.splice(index, 1)
    setCourse({...course, lessons:lessons})
    setLessonToDelete({...lessonToDelete, title: "", index: -1})
    handleClose()
 }
  const deleteArticle = () => {
    if(!(openDeleteArticle.index>-1 && openDeleteArticle.articleId && openDeleteArticle.courseId)){
      setValues({...values, error: 'CS: Unable to delete Article. Please contact support if this issue persists'})
    }
    removeArticle({
      articleId: `${openDeleteArticle.articleId}/course/${openDeleteArticle.courseId}`
    }, {token: isAuthenticated().token}).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        let updatedLessons = course.lessons
        updatedLessons[openDeleteArticle.index].article=undefined
        setCourse({...course, lessons: updatedLessons})
        setOpenDeleteArticle({...openDeleteArticle, articleId: '', lessonId: '', courseId: '', index: -1})
      }
    })
  }
  const moveUp = index => () => {
      const lessons = course.lessons
      const moveUp = lessons[index]
      lessons[index] = lessons[index-1]
      lessons[index-1] = moveUp
      setCourse({ ...course, lessons: lessons })
  }
  const handleSubmit = () => { 
    if (!(course.title && course.subtitle && course.category && course.language && course.programming_languages && course.programming_languages.length>=1 && 
      course.technologies && course.technologies.length>=1 && course.sections && course.sections.length>1 && course.requirements && course.requirements.length>1 &&
      course.level && course.audiences && course.audiences.length>=1 && course.description && course.price && course.currency)){
      return setValues({...values, error: 'Please make sure all the Fields are filled in.'})
    };
    if (!(course.price>=0 && course.price<=10)){
      return setValues({...values, error: 'Price may not exceed $10. Please enter a price between $1 and $10.'})
    };
    setValues({...values, disableSubmit: true})
    if((deleteIds.deleteMediaIds && deleteIds.deleteMediaIds.length>0) || (deleteIds.deleteArticleIds && deleteIds.deleteArticleIds.length>0)){
      console.log('passed1')
      if(deleteIds.deleteMediaIds && deleteIds.deleteMediaIds.length>0){  
        console.log('passed2')
        removeBulkMedia({deleteMediaIds: deleteIds.deleteMediaIds}, {token: isAuthenticated().token}).then((results) => {    
          //TODO: Multi-error handling
          console.log('passed3')
          setDeletedMedia(true)
          }).catch(e=>setValues({...values, error: e, disableSubmit: false}))
      }else{
        console.log('passed4')
        setDeletedMedia(true) 
      }
      if(deleteIds.deleteArticleIds && deleteIds.deleteArticleIds.length>0){
        console.log('passed5')
        console.log(deleteIds.deleteArticleIds)  
        removeBulkArticles({deleteArticleIds: deleteIds.deleteArticleIds}, {token: isAuthenticated().token}).then((results) => {    
          //TODO: Multi-error handling
          console.log('passed6')
          setDeletedArticles(true)
          }).catch(e=>setValues({...values, error: e, disableSubmit: false}))
      }else{
        console.log('passed7')
        setDeletedArticles(true) 
      }
    }else{
      console.log('passed8')
      setDeletedArticles(true)
      setDeletedMedia(true)
    }
  }
  console.log('deletedArticle && deletedMedia', deletedArticles, deletedMedia)
  console.log('deleteArticleIds && deleteMediaIds', deleteIds.deleteArticleIds, deleteIds.deleteMediaIds)
  useEffect(()=>{
    if(deletedArticles && deletedMedia){
      console.log('passed9')
      let courseData = new FormData()
      course.title && courseData.append('title', course.title)
      course.subtitle && courseData.append('subtitle', course.subtitle)
      course.category && courseData.append('category', course.category)
      course.language && courseData.append('language', course.language)
      course.level && courseData.append('level', course.level)
      course.description && courseData.append('description', course.description)
      course.price && courseData.append('price', course.price)
      // values.currency && courseData.append('currency', values.currency)
      course.currency && courseData.append('currency', course.currency)
      course.programming_languages ? courseData.append('programming_languages', JSON.stringify(course.programming_languages.map(item=>item.label))) : courseData.append('programming_languages', JSON.stringify([]));
      course.technologies ? courseData.append('technologies', JSON.stringify(course.technologies.map(item=>item.label))) : courseData.append('technologies', JSON.stringify([]));
      course.sections ? courseData.append('sections', JSON.stringify(course.sections.map(item=>item.label))) : courseData.append('sections', JSON.stringify([]));
      course.requirements ? courseData.append('requirements', JSON.stringify(course.requirements.map(item=>item.label))) : courseData.append('requirements', JSON.stringify([]));
      course.audiences ? courseData.append('audiences', JSON.stringify(course.audiences.map(item=>item.label))) : courseData.append('audiences', JSON.stringify([]));
      courseData.append('lessons', JSON.stringify(course.lessons))
      course.cover && courseData.append('cover', course.cover)
      if(!course.cover && localCover.isDefault){
        courseData.append('cover', null)
      }
      setValues({...values, disableSubmit: true})
      update({
        courseId: match.params.courseId
        }, {
          token: isAuthenticated().token
        }, courseData).then((data) => {
          if (data && data.error) {
            setValues({...values, error: data.error, disableSubmit: false})
          } else {
            console.log('passed10')
            setValues({...values, redirect: true, disableSubmit: false})
          }
        }).catch(e=>setValues({...values, error: e, disableSubmit: false}))
    }
  }, [deletedMedia, deletedArticles])

  const handleClose = () => {
    setOpen(false)
    setLessonToDelete({...lessonToDelete, title: "", index: -1})
  }
  const handleErrorClose = () =>{
    setValues({...values, error: ''})
  }
  const handleCloseDeleteArticle = () => {
    setOpenDeleteArticle({...openDeleteArticle, articleId: '', lessonId: '', courseId: '', index: -1})
  }
  const showAddMedia = (lessonId='') => {
    setOpenAddMedia({...openAddMedia, lessonId: lessonId, courseId: course._id})
  }
  const hideAddMedia = () => {
    setOpenAddMedia({...openAddMedia, lessonId: '', courseId: ''})
  }
  const showAddArticle = (lessonId) => {
    setOpenAddArticle({...openAddArticle, lessonId: lessonId, courseId: course._id})
  }
  const hideAddArticle = () => {
    setOpenAddArticle({...openAddArticle, lessonId: '', courseId: ''})
  }
  const showDeleteArticle = (index) => {
    setOpenDeleteArticle({...openDeleteArticle, articleId: course.lessons[index].article, lessonId: course.lessons[index]._id, courseId: course._id, index: index})
  }
  const isSpecialist = (course) =>{
    return isAuthenticated().user && isAuthenticated().user._id === course.specialist._id
  }
  if (values.redirect) {
    return (<Redirect to={'/specialist/course/'+course._id}/>)
  }
  if(loading){
    return <FormSkeleton />
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
            <Box sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
              <Box sx={{ textAlign: 'center', with: '100%'}}>
                <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                  Edit the course
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', mx: 'auto'}}>
                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:300}}}>
                  <Box component='img' src={localCover.url? localCover.url : defaultphotoURL} sx={{width: {xs: 150, sm:300}, height:'auto'}}/>
                </Box>
                <Box id="course-image-inputs" 
                    sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: {xs: 150, sm: 300}, height: {xs: 150, sm: 300}, borderRadius: 10,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          backgroundColor: theme.palette.mode ==='light'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, 
                          opacity: 0,
                          ':hover':{
                          opacity: 1,
                          transition: theme.transitions.create(['opacity'], {duration: 500})
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
                    <Box component='input' accept="image/*" onChange={handleChange('cover')} style={{display: 'none'}} id="cover-upload-button" type="file" />
                    <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                      <Box component='label' htmlFor="cover-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                        <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/> Edit Cover Image
                      </Box>
                    </MenuItem>
                  {localCover.url && !localCover.isDefault && 
                  (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                      <Box aria-label="Delete" onClick={deleteCover} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                        <Delete /> Delete Cover Image
                      </Box>
                    </MenuItem>)}
                    { course.media?
                    (<MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                      <Link to={`/media/edit/${course.media._id}/course/${course._id}`} style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                        <Box aria-label="Edit" color="inherit" 
                        sx={{
                            zIndex: 10,
                            transform: 'unset',
                            '&:hover':{
                              boxShadow: 2,
                              transform: 'translateY(-3px) scale(1.1)',
                              transition: theme.transitions.create(['transform'], {duration: 500})
                            }}}>
                          <Edit sx={{verticalAlign: 'text-top'}}/> Edit Preview Video
                        </Box>
                      </Link>
                    </MenuItem>):
                    (<MenuItem onClick={()=>showAddMedia()} sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                        <Box aria-label="Add" color="inherit" 
                        sx={{
                            zIndex: 10,
                            transform: 'unset',
                            '&:hover':{
                              boxShadow: 2,
                              transform: 'translateY(-3px) scale(1.1)',
                              transition: theme.transitions.create(['transform'], {duration: 500})
                            }}}>
                          <Edit sx={{verticalAlign: 'text-top'}}/> Add Preview Video
                        </Box>
                    </MenuItem>)}
                  </MoreMenuVertButton>  
                </Box>
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
                  id="title"
                  label="Title"
                  placeholder='Example: Build a Social Media App with NodeJS, React & MongoDB'
                  name="title"
                  autoComplete="name"
                  autoFocus
                  value={course.title} 
                  onChange={handleChange('title')}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="subtitle"
                  label="Subtitle"
                  placeholder='Example: Bring Your Dream Social Media App to Life with NodeJS, MongoDB and React and a whole lot of CSS Frameworks'
                  name="subtitle"
                  autoComplete="name"
                  autoFocus
                  value={course.subtitle} 
                  onChange={handleChange('subtitle')}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="category"
                  label="Category"
                  placeholder='Example: Full-stack Web Development'
                  id="category"
                  autoComplete="name"
                  value={course.category} 
                  onChange={handleChange('category')}
                />
                <Typography component='p' variant='subtitle1' sx={{fontSize: '1rem', color: 'text.primary'}}> Spoken Language </Typography>
                <FormControl
                  aria-label="language"
                  sx={{
                    width: '100%',
                    my: {xs: 2, md: 0},
                    mr: { xs: 0, md: 0 },
                  }}>
                  <SelectButton options={['English','French']} value={course.language} handleChange={handleChange('language')} variant='outlined' label='Spoken Language' 
                  styles={{
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    [`& .${svgIconClasses.root}`]: {color: 'primary.main'},
                    ':hover':{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      [`& .${svgIconClasses.root}`]: {color: 'primary.contrastText'},
                    },
                    '&::before':{
                      bgcolor: 'unset',
                    }
                  }}
                  menuStyle={{width: '100%'}} />
                </FormControl>
                <ChipsArray handleDelete={handleDeleteChipProgrammingLanguage} chipData={course.programming_languages}/>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="programming_language"
                  label="Programming Language"
                  placeholder='Example: Javascript'
                  helperText='Please press Enter to add a Language'
                  id="programming_language"
                  autoComplete="name"
                  value={course.programming_language} 
                  onKeyDown={handleAddChip('programming_languages', 'programming_language')}
                  onChange={handleChange('programming_language')}
                />
                <ChipsArray handleDelete={handleDeleteChipTechnology} chipData={course.technologies}/>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="technology"
                  label="Technology"
                  placeholder='Example: ReactJS OR MongoDB OR NodeJS'
                  helperText='Please press Enter to add a Technology'
                  id="technology"
                  autoComplete="name"
                  value={course.technology} 
                  onKeyDown={handleAddChip('technologies','technology')}
                  onChange={handleChange('technology')}
                />
                <ChipsArray handleDelete={handleDeleteChipSection} chipData={course.sections}/>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="section"
                  label="Section"
                  placeholder='Example: Introduction OR User Profile OR Following Users OR Posting OR Interacting with Posts '
                  helperText='Please press Enter to add a Section. Sections will be used to group Lessons'
                  id="section"
                  autoComplete="name"
                  value={course.section} 
                  onKeyDown={handleAddChip('sections', 'section')}
                  onChange={handleChange('section')}
                />
                <ChipsArray handleDelete={handleDeleteChipRequirement} chipData={course.requirements}/>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="requirement"
                  label="Requirement"
                  placeholder='Example: Beginner Level of Javascript, OR NodeJS, HTML, CSS and MongoDB Experience is plus'
                  helperText='Please press Enter to add a Requirement.'
                  id="requirement"
                  autoComplete="name"
                  value={course.requirement} 
                  onKeyDown={handleAddChip('requirements', 'requirement')}
                  onChange={handleChange('requirement')}
                />
                <Typography component='p' variant='subtitle1' sx={{fontSize: '1rem', color: 'text.primary'}}> Difficulty Level </Typography>
                <FormControl
                  aria-label="level"
                  sx={{
                    width: '100%',
                    my: {xs: 2, md: 0},
                    mr: { xs: 0, md: 0 },
                  }}>
                  <SelectButton options={['Beginner', 'Intermediate', 'Advanced']} value={course.level} handleChange={handleChange('level')} label='Difficulty Level' 
                  styles={{
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    [`& .${svgIconClasses.root}`]: {color: 'primary.main'},
                    ':hover':{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      [`& .${svgIconClasses.root}`]: {color: 'primary.contrastText'},
                    },
                    '&::before':{
                      bgcolor: 'unset'
                    }
                  }}
                  menuStyle={{width: '100%'}} />
                </FormControl>
                <ChipsArray handleDelete={handleDeleteChipAudience} chipData={course.audiences}/>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="audience"
                  label="Audience"
                  placeholder='Example: People interested in React, NodeJS and MongoDB OR Anyone interested in social media application development '
                  helperText='Please press Enter to add a Requirement.'
                  id="audience"
                  autoComplete="name"
                  value={course.audience} 
                  onKeyDown={handleAddChip('audiences', 'audience')}
                  onChange={handleChange('audience')}
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
                  placeholder='Example: This Course teaches you how to design rockets in no time flat...'
                  id="description"
                  autoComplete="name"
                  value={course.description} 
                  onChange={handleChange('description')}
                />
                <TextField
                  margin="normal"
                  required
                  name="price"
                  label="Price"
                  placeholder='Example: R50'
                  id="price"
                  type='number'
                  autoComplete="name"
                  value={course.price} 
                  onChange={handleChangePrice}
                  helperText='Choose currency and Enter price'
                  inputProps={{
                    min:0,
                    max: 10
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"> 
                                      <FormControl
                                        aria-label="currencies"
                                        sx={{
                                          minWidth: 60, maxWidth: 200,
                                          my: {xs: 2, md: 0},
                                          mr: { xs: 0, md: 0 },
                                        }}>
                                        <SelectButton /*options={currencies}*/ options={['$']} value={course.currency} handleChange={handleChange('currency')} label='Currencies' 
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
                                          '&::before':{
                                            bgcolor: 'unset'
                                          }
                                        }} />
                                      </FormControl>
                                    </InputAdornment>,
                  }}
                />  
              </Box>
              <Box id="lessons" 
                sx={{ px: {xs: 0, sm:2}, py: 1.5, width: '100%', mx: 'auto', borderRadius: 4, bgcolor:'background.default'}}>
                <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Box sx={{  width: '100%', display: 'flex', flexDirection: {xs: 'column', md:'row'}, alignItems: 'center', textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                    <Typography variant="h3" component="h3" 
                    sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1rem', sm: '1.5rem' }, color: 'text.primary'}}>
                      Lessons - Edit and Rearrange
                    </Typography>
                    <Typography variant="body1" sx={{margin: '10px', display: 'flex', fontWeight: 600}}>{course.lessons && (<Avatar sx={{borderRadius: '50%', width:{xs: 20, sm: 25}, height:{xs: 20, sm: 25}, mr: 1, verticalAlign: 'center'}}>{course.lessons.length}</Avatar>)} lessons</Typography>
                    <Box sx={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                    {
                      isSpecialist(course) && !course.published &&
                      (<Link style={{textDecoration:'none'}} to={`/specialist/course/${course._id}/lesson/new`}>
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
                                    transform: 'translateY(-3px) scale(1.1)',
                                    transition: (theme) => theme.transitions.create(['transform'], {duration: 500})
                                  }
                                  }}>
                                <ArrowUpward sx={{ fontSize: 22 }} />
                              </IconButton>
                            }
                            <Avatar sx={{borderRadius: '50%', width:{xs: 30, sm: 40}, height:{xs: 30, sm: 40}}}>{index+1}</Avatar>
                          </ListItemAvatar>
                          <ListItemText sx={{ flex: 1, px: {xs:1, sm: 'unset'}}}
                              primary={<>
                                <TextField
                                  margin="normal"
                                  required
                                  name='title'
                                  label="Title"
                                  type="text"
                                  fullWidth
                                  value={lesson.title} 
                                  onChange={handleLessonChange('title', index)}/>
                                <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Content </Typography>
                                <SnowEditor modules={modules} value={lesson.content} onChange={handleLessonChange('content', index)}/>
                                <FormControlLabel
                                  control={<Switch checked={lesson.free} color='secondary' onClick={handleCheck('free', index)} />}
                                  label={
                                    <Typography variant='body1' sx={{color: 'text.primary'}}>
                                        {lesson.free? 'Free (Lesson Accessible without buying the course)' : 'Paid (Only accessible after buying the course.)'}
                                    </Typography>
                                    }
                                />
                            </>}/>
                          {!course.published && 
                        <MoreMenuVertButton>
                        { lesson.media?
                          (<MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                            <Link to={`/media/edit/${lesson.media._id}/course/${course._id}`} style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                              <Box aria-label="Edit" color="inherit" 
                              sx={{
                                  zIndex: 10,
                                  transform: 'unset',
                                  '&:hover':{
                                    boxShadow: 2,
                                    transform: 'translateY(-3px) scale(1.1)',
                                    transition: theme.transitions.create(['transform'], {duration: 500})
                                  }}}>
                                <Edit sx={{verticalAlign: 'text-top'}}/> Edit Video
                              </Box>
                            </Link>
                          </MenuItem>):
                          (<MenuItem onClick={()=>showAddMedia(lesson._id)} sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                              <Box aria-label="Add" color="inherit" 
                              sx={{
                                  zIndex: 10,
                                  transform: 'unset',
                                  '&:hover':{
                                    boxShadow: 2,
                                    transform: 'translateY(-3px) scale(1.1)',
                                    transition: theme.transitions.create(['transform'], {duration: 500})
                                  }}}>
                                <Edit sx={{verticalAlign: 'text-top'}}/> Add Video
                              </Box>
                          </MenuItem>)}
                        {lesson.article?
                          (<MenuItem onClick={()=>showDeleteArticle(index)} sx={{color: "error.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                              <Box aria-label="Edit" color="inherit" 
                              sx={{
                                  zIndex: 10,
                                  transform: 'unset',
                                  '&:hover':{
                                    boxShadow: 2,
                                    transform: 'translateY(-3px) scale(1.1)',
                                    transition: theme.transitions.create(['transform'], {duration: 500})
                                  }}}>
                                <DeleteForever sx={{verticalAlign: 'text-top'}}/> Delete Article
                              </Box>
                          </MenuItem>):
                          (<MenuItem onClick={()=>showAddArticle(lesson._id)} sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                              <Box aria-label="Add" color="inherit" 
                              sx={{
                                  zIndex: 10,
                                  transform: 'unset',
                                  '&:hover':{
                                    boxShadow: 2,
                                    transform: 'translateY(-3px) scale(1.1)',
                                    transition: theme.transitions.create(['transform'], {duration: 500})
                                  }}}>
                                <AddBox sx={{verticalAlign: 'text-top'}}/> Add Article
                              </Box>
                          </MenuItem>)}
                          <MenuItem aria-label="Delete Label" onClick={()=>openDeleteDialogue(index, lesson)} sx={{color: 'error.main', fontSize: '1rem', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
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
              {isSpecialist(course) &&
              (<Box id="course-buttons" sx={{
                width: {xs: '100%', sm: '50%'},
                display: 'flex',
                flexDirection: {xs: 'column', sm:'row'},
                alignItems: 'center',
                justifyContent: 'space-around',
                my: 5,
                '& > button':{ 
                  mx: {xs: '0px !important', sm: '8px !important'},
                  my: {xs: 1, sm: 0},
                  width: {xs: '90%', sm: 'initial'},
                  display: 'flex',
                  justifyContent: 'center'
                }
              }}>
                {values.disableSubmit?
                (<HashLoader style={{marginTop: '10px'}} size={10}/>):
                (<>
                <StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                  Save
                </StyledButton>
                <Link to={`/specialist/course/${course._id}`} style={{textDecoration: 'none'}}>
                  <StyledButton disableHoverEffect={false} variant="outlined">
                    Cancel
                  </StyledButton>
                </Link>
                </>)}
              </Box>)}
            </Box>
            <StyledSnackbar
              open={values.error? true: false}
              duration={3000}
              handleClose={handleErrorClose}
              icon={<Error/>}
              heading={"Error"}
              body={values.error}
              variant='error'
              />
          </Grid>
        </Grid>
      </Container>
      <Dialog PaperComponent={Box}  transitionDuration={1000} open={open}  onClose={handleClose} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{ mx: {xs: 0, md: 'unset'}, borderRadius: 4, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: theme.palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
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
                <StyledButton disableHoverEffect={false} variant="outlined" onClick={toDeleteLesson(lessonToDelete.index)}>
                  Delete
                </StyledButton>
            </DialogActions>
      </Dialog>
      <Dialog PaperComponent={Box} fullWidth={true} transitionDuration={1000} open={(openAddMedia.lessonId || openAddMedia.courseId)? true: false}  onClose={hideAddMedia} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
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
                <NewMedia lessonId={openAddMedia.lessonId} courseId={course._id}/>
              </Grid>
            </Grid>
          </Container>
        </Parallax>
      </Dialog>
      <Dialog PaperComponent={Box} fullWidth={true} transitionDuration={1000} open={openAddArticle.lessonId? true: false}  onClose={hideAddArticle} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
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
                <NewArticle lessonId={openAddArticle.lessonId} courseId={course._id}/>
              </Grid>
            </Grid>
          </Container>
        </Parallax>
      </Dialog>
      <Dialog PaperComponent={Box} transitionDuration={1000} open={(openDeleteArticle.index>-1 && openDeleteArticle.articleId && openDeleteArticle.courseId)? true: false}  onClose={handleCloseDeleteArticle} aria-labelledby="form-dialog-title" 
        sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, borderRadius: 4, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: theme.palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, 
              background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
        <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 } }}>
          Immediately delete the Article?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center'}}>
          {course && course.lessons && course.lessons.length>0 && course.lessons[openDeleteArticle.index] && course.lessons[openDeleteArticle.index].title &&
          (<DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
            The Article associated with Lesson {openDeleteArticle.index+1} {course.lessons[openDeleteArticle.index].title}, will be deleted immediately. 
          </DialogContentText>)}
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
            <StyledButton disableHoverEffect={false} variant="contained" onClick={handleCloseDeleteArticle}>
              Cancel
            </StyledButton>
            <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteArticle}>
              Delete
            </StyledButton>
        </DialogActions>
      </Dialog>
    </Parallax>)
}


