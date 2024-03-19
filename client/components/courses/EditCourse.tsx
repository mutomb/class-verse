import React, {useState, useEffect}  from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import FileUpload from '@mui/icons-material/AddPhotoAlternate'
import ArrowUp from '@mui/icons-material/ArrowUpward'
import Button from '@mui/material/Button'
import {makeStyles} from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import {read, update} from './api-course'
import {Link, Redirect} from 'react-router-dom'
import auth from '../auth/auth-helper'
import Divider from '@mui/material/Divider'

const useStyles = makeStyles(theme => ({
    root:{
      maxWidth: 800,
      margin: 'auto',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      marginTop: theme.spacing(12)
    },
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  upArrow: {
      border: '2px solid #f57c00',
      marginLeft: 3,
      marginTop: 10,
      padding:4
 },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 250,
    display: 'inline-block',
    width: '50%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  textfield:{
    width: 350
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  },  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  },
  list: {
    backgroundColor: '#f3f3f3'
  }
}))

interface CourseState{
  name:String,
  description:String,
  cover:any,
  category:String,
  teacher:String,
  lessons:Array<any>
}
interface ValuesState{
  redirect:Boolean,
  error:String
}

export default function EditCourse({match}){
  const classes = useStyles()
  const [course, setCourse] = useState<CourseState>({
      name: '',
      description: '',
      cover:'',
      category:'',
      teacher:{},
      lessons: []
    })
  const [values, setValues] = useState<ValuesState>({
      redirect: false,
      error: ''
    })
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
  const jwt = auth.isAuthenticated()
  const handleChange = (name: string) => event => {
    const value = name === 'cover'
    ? event.target.files[0]
    : event.target.value
    setCourse({ ...course, [name]: value })
  }
  const handleLessonChange = (name: string, index: number) => event => {
    const lessons = course.lessons
    lessons[index][name] =  event.target.value
    setCourse({ ...course, lessons: lessons })
  }
  const deleteLesson = index => event => {
    const lessons = course.lessons
    lessons.splice(index, 1)
    setCourse({...course, lessons:lessons})
 }
  const moveUp = index => event => {
      const lessons = course.lessons
      const moveUp = lessons[index]
      lessons[index] = lessons[index-1]
      lessons[index-1] = moveUp
      setCourse({ ...course, lessons: lessons })
  }
  const clickSubmit = () => {
    let courseData = new FormData()
    course.name && courseData.append('name', course.name)
    course.description && courseData.append('description', course.description)
    course.cover && courseData.append('cover', course.cover)
    course.category && courseData.append('category', course.category)
    courseData.append('lessons', JSON.stringify(course.lessons))
    update({
        courseId: match.params.courseId
      }, {
        t: jwt.token
      }, courseData).then((data) => {
        if (data && data.error) {
            console.log(data.error)
          setValues({...values, error: data.error})
        } else {
          setValues({...values, redirect: true})
        }
      })
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/course/'+course._id}/>)
  }
    const imageUrl = course._id
          ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
          : '/api/courses/defaultphoto'
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={<TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={course.name} onChange={handleChange('name')}
                  />}
                  subheader={<div>
                        <Link underline="hover" to={"/user/"+course.teacher._id} className={classes.sub}>By {course.teacher.name}</Link>
                        {<TextField
                    margin="dense"
                    label="Category"
                    type="text"
                    fullWidth
                    value={course.category} onChange={handleChange('category')}
                  />}
                      </div>
                    }
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == course.teacher._id &&
                (<span className={classes.action}><Button variant="contained" color="secondary" onClick={clickSubmit}>Save</Button>
                    </span>)
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={course.name}
                  />
                  <div className={classes.details}>
                  <TextField
                    margin="dense"
                    multiline
                    minRows="5"
                    label="Description"
                    type="text"
                    className={classes.textfield}
                    value={course.description} onChange={handleChange('description')}
                  /><br/><br/>
                  <input accept="image/*" onChange={handleChange('cover')} className={classes.input} id="icon-button-file" type="file" />
                  <label htmlFor="icon-button-file">
                    <Button variant="outlined" color="secondary" component="span">
                    Change Photo
                    <FileUpload/>
                    </Button>
                  </label> <span className={classes.filename}>{course.cover ? course.cover.name : ''}</span><br/>
                  </div>
                

          </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Lessons - Edit and Rearrange</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{course.lessons && course.lessons.length} lessons</Typography>}
                />
                <List>
                {course.lessons && course.lessons.map((lesson, index) => {
                    return(<span key={index}>
                    <ListItem className={classes.list}>
                    <ListItemAvatar>
                        <>
                        <Avatar>
                        {index+1}
                        </Avatar>
                     { index != 0 &&     
                      <IconButton aria-label="up" color="primary" onClick={moveUp(index)} className={classes.upArrow}>
                        <ArrowUp />
                      </IconButton>
                     }
                    </>
                    </ListItemAvatar>
                    <ListItemText
                        primary={<><TextField
                            margin="dense"
                            label="Title"
                            type="text"
                            fullWidth
                            value={lesson.title} onChange={handleLessonChange('title', index)}
                          /><br/>
                          <TextField
                          margin="dense"
                          multiline
                          minRows="5"
                          label="Content"
                          type="text"
                          fullWidth
                          value={lesson.content} onChange={handleLessonChange('content', index)}
                        /><br/>
                        <TextField
            margin="dense"
            label="Resource link"
            type="text"
            fullWidth
            value={lesson.resource_url} onChange={handleLessonChange('resource_url', index)}
          /><br/></>}
                    />
                    {!course.published && <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="up" color="primary" onClick={deleteLesson(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>}
                    </ListItem>
                    <Divider style={{borderColor:'rgb(106, 106, 106)'}} component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
              </Card>
        </div>)
}