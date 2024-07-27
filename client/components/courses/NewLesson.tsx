import React, {FC, useState, ReactNode, ChangeEvent, useRef, FormEvent, useEffect} from 'react'
import {TextField, Typography, Box, Stepper, Step, StepLabel, formControlLabelClasses, inputLabelClasses, 
  formLabelClasses, useMediaQuery, Grid, Slide, FormControlLabel, Switch, Container, FormControl, svgIconClasses} from '@mui/material'
import {newLesson} from './api-course'
import {useAuth} from '../auth'
import { StepIconConnector, StepIcon, StyledButton, SelectButton } from '../styled-buttons'
import { useTheme } from '@mui/material/styles'
import { NewMedia } from '../media'
import { StyledSnackbar } from '../styled-banners'
import { CheckOutlined, Error, FileUpload} from '@mui/icons-material'
import { Link, Redirect } from 'react-router-dom'
import { HashLoader } from '../progress'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { Parallax } from 'react-parallax'
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'
import { useCourse } from './Course-hooks'
import { create } from '../article/api-article'
import { SnowEditor } from '../forms'

interface NewLessonProps{
  courseId:string,
}
interface ValuesProps{
  _id: string,
  title:string,
  section: string,
  aim:string,
  content: string,
  media: any,
  article: any,
  free: boolean,
  error: string,
  success: string,
  disableSubmit: boolean,
  redirect: boolean
}

const NewLesson: FC<NewLessonProps>= ({match}) => {
  const theme = useTheme()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const {isAuthenticated} = useAuth()
  const [values, setValues] = useState<ValuesProps>({
    _id: '',
    title: '',
    section: '',
    aim: '',
    content: '',
    media: '',
    article: '',
    free: false,
    error: '',
    success: '',
    disableSubmit: false,
    redirect: false,
  })
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const articleRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const {course, setCourse} = useCourse()

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
  const handleClose = () =>{
    setValues({...values, error: '', success: ''})
  }
 
  const handleChange = (name: string) => (event) => {
    const value = name === 'content'? event : name === 'article'? event.target.files[0] : event.target.value
    setValues((prev_values)=>{
      console.log(prev_values)
      return {...prev_values, [name]: value, error: ''}
    })
  }

  const handleCheck = (name: string) => (event: ChangeEvent<HTMLFormElement>) => {
    setValues({...values, [name]: event.target.checked})
  }

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = (nextStep: number, skipTo?: number)=>{
    setDirection('left')
    setTimeout(()=>{
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => {
        if(skipTo) return skipTo 
        return nextStep
      });
      setSkipped(newSkipped);
    }, 500)
  };

// To guard against someone actively trying to skip steps.
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      return setValues({...values, error: "You can't skip a step that isn't optional."})
    }
    setActiveStep((prevActiveStep) => { return prevActiveStep + 1});
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleRedirect = () => {
    setValues({...values, redirect: true})
  };

  const clickSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let lessonData = new FormData()
    if (!(values.title && values.section && values.aim && values.content)){
      return setValues({...values, error: 'Section, aim and content field are required. Please fill them out.'})
    };
    values.title && lessonData.append('title', values.title);
    values.section && lessonData.append('section', values.section);
    values.aim && lessonData.append('aim', values.aim);
    values.content && lessonData.append('content', values.content);
    values.free && lessonData.append('free', values.free);
    setValues({...values, disableSubmit: true})
    newLesson({
      courseId: match.params && match.params.courseId
    }, {
      token: isAuthenticated().token
    }, lessonData).then((course) => {
      if (course && course.error) {
        setValues({...values, error: course.error, disableSubmit: false, article: ''})
      } else {
          if(!course.lessons){
            setValues({...values, error: 'Lesson could not be saved. try again', disableSubmit: false, article: ''})
          }else{
            if(values.article){
              let articleData = new FormData()
              articleData.append('article', values.article);
              articleData.append('course', course._id);
              articleData.append('lesson', course.lessons[course.lessons && course.lessons.length-1]._id);
              console.log('course', course._id)
              console.log('lesson', course.lessons[course.lessons && course.lessons.length-1]._id)
              create({
                userId: isAuthenticated().user && isAuthenticated().user._id
              },{
                token: isAuthenticated().token
              }, articleData).then((data)=>{
                if (data && data.error) {
                  setValues({...values, error: data.error, disableSubmit: false, article: ''})
                }else{
                  setValues({...values, _id: course.lessons[course.lessons && course.lessons.length-1]._id, disableSubmit: false, success: 'Lesson description saved. Click Next to proceed.'})   
                  handleNext(1);
                }
              })
            }else{
              setValues({...values, _id: course.lessons[course.lessons && course.lessons.length-1]._id, disableSubmit: false, success: 'Lesson description saved. Click Next to proceed.'})   
              handleNext(1);
            } 
          }
      }
    })
  }

  const steps = [{label: 'Describe Lesson'},{label: 'Attach Video'}]
  
  if (values.redirect) {
    return <Redirect to={match.params && '/specialist/course/'+match.params.courseId}/>
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
        component='div' ref={containerRef} 
        sx={{overflow: 'hidden', px: {xs: 0, sm: 'unset'}, bgcolor: theme.palette.mode ==='dark'?`rgba(0,0,0,0.4)`:`rgba(255,255,255,0.4)`, borderRadius: 4, boxShadow: 4,
        width: '100%', borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
        }}>
        <Grid container>
          <Grid item xs={12} sx={{minHeight: '100vh'}}>
            <Box sx={{ my: 8, mx: 0, px: {xs:1, md:4}, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}} >
              <Stepper sx={{width: '100%', mx: {xs: 1, md: 8}, mt: 4}} connector={<StepIconConnector />} alternativeLabel={xsMobileView} activeStep={activeStep} orientation="horizontal">
                {steps.map((step, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: {
                    optional?: ReactNode;
                  } = {};
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption">Optional</Typography>
                    );
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={step.label} {...stepProps} sx={{display: 'flex', flexDirection: 'row'}}>
                      <StepLabel StepIconComponent={StepIcon} {...labelProps} >{step.label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            {activeStep === steps.length ? (
              <Slide container={containerRef.current} timeout={1000} id="step-0" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                <Box sx={{width: '100%', mx: {xs: 1, md: 8}, textAlign: 'center'}}>
                  <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                    Well done! Lesson created
                  </Typography>
                  <Box sx={{ textAlign: 'center'}}>
                    <Typography variant='body1' sx={{textAlign: 'center', py: {xs: 1, sm: 2, md: 4}, width: '100%', color: 'text.primary', fontSize: {xs: '0.8rem', sm: '1rem', md: '1.2rem'}}}>
                    Proceed to View the course and add more lessons.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 2 }}>
                    <StyledButton color="primary" variant='contained' onClick={handleRedirect}>View Course</StyledButton>
                  </Box>
                </Box>
              </Slide>
            ) : 
            (<>
              {activeStep ===0 && (
                <Slide container={containerRef.current} timeout={1000} id="step-1" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                  <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mx: {xs: 1, md: 8}}} >
                    <Box sx={{ textAlign: 'center', width: '100%'}}>
                      <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                        Add New Lesson
                      </Typography>
                      <Box sx={{ textAlign: 'center'}}>
                        <Typography variant='body1' sx={{textAlign: 'center', py: {xs: 1, sm: 2, md: 4}, width: '100%', color: 'text.primary', fontSize: {xs: '0.8rem', sm: '1rem', md: '1.2rem'}}}>
                          Please ensure that this Lesson is added in sequence per Section, as Client will complete and unlock Lessons in the sequence they appear in the course. 
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                        sx={{ mt: 1, width: '100%',
                          [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
                          [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
                          [`& .${inputLabelClasses.focused}`]: { 
                            color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
                          },
                        }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography component='p' variant='subtitle1' sx={{fontSize: '1rem', color: 'text.primary'}}> 
                          {course && course.sections && course.sections.length>0? 
                          "Select the course section this lesson belongs to": "No sections found. Please go back to the course edit page and add atleast one section."}
                          </Typography>
                          <FormControl
                            aria-label="section"
                            disabled={course && course.sections && course.sections.length>0? false: true}
                            sx={{
                              width: '100%',
                              my: {xs: 2, md: 0},
                              mr: { xs: 0, md: 0 },
                            }}>
                            <SelectButton options={course && course.sections? course.sections: []} value={values.section} handleChange={handleChange('section')} variant='outlined' label='Course Section' 
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
                            menuStyle={{width: '100%'}}/>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            autoFocus
                            name="title"
                            placeholder='Example: Updating the user profile'
                            autoComplete="name"
                            label="Title"
                            id="title"
                            value={values.title} 
                            onChange={handleChange('title')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            autoFocus
                            name="aim"
                            placeholder='Example: Adding an about description, uploading a profile photo and retrieving a profile photo'
                            autoComplete="name"
                            label="Aim(s)"
                            id="aim"
                            value={values.aim} 
                            onChange={handleChange('aim')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Content </Typography>
                          <SnowEditor modules={modules} value={values.content} onChange={handleChange('content')} 
                          placeholder={"Here, you may add the lesson's text, diagrams, code, links, and formats etc... The lesson video can attached on the step if you have an active paid plan."}/>
                        </Grid>
                        <Grid item xs={12}>
                        {!values.article?
                          (<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <Box component='input' type="file" accept="application/pdf" onChange={handleChange('article')} style={{display: 'none'}} id="article-upload-button" />
                            <Box ref={articleRef} component='label' htmlFor="article-upload-button" sx={{color:"inherit", fontSize: '1rem', '& svg': {fontSize: {xs: 20, sm: 40} }}}>
                              <StyledButton onClick={()=>articleRef?.current?.click()} endIcon={<FileUpload />} variant="contained">
                                Upload Note (only PDF file allowed)
                              </StyledButton>
                            </Box>
                          </Box>):
                          (<Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <CheckOutlined sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 30, sm: 40, md: 50}, height: {xs: 30, sm: 40, md: 50}}}/>
                            </Box>)
                        }
                        </Grid>
                        <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <FormControlLabel
                            control={<Switch checked={values.free} color='secondary' onClick={handleCheck('free')} />}
                            label={
                              <Typography variant='body1' sx={{color: 'text.primary'}}>
                                  {values.free? 'Free (Lesson Accessible without buying the course)' : 'Paid (Only accessible after buying the course.)'}
                              </Typography>
                              }
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Box 
                    sx={{width: '100%',
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
                    {values.disableSubmit?(<HashLoader style={{marginTop: '10px'}} size={10}/>):
                    (<>
                      <Link to={'/specialist/courses'} style={{textDecoration: 'none'}}>
                        <StyledButton disableHoverEffect={false} variant="outlined">
                          Cancel
                        </StyledButton>
                      </Link>
                        <StyledButton disableHoverEffect={false} variant="contained" onClick={clickSubmit}>
                          Save
                        </StyledButton>
                      </>)}
                    </Box>
                  </Box>
                </Slide>
              )}
              {activeStep === 1 && values._id && match.params.courseId && 
                <NewMedia lessonId={values._id} courseId={match.params.courseId} handleNext={()=>handleNext(2)} containerRef={containerRef} direction={direction} heading='Attach video to this lesson'/>
              }
            </>)}
            <StyledSnackbar
              open={values.error? true: false}
              duration={3000}
              handleClose={handleClose}
              icon={<Error/>}
              heading={"Error"}
              body={values.error}
              variant='error'/>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Parallax>)
}
export default NewLesson;
