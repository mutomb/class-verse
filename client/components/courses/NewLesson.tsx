import React, {FC, useState, ReactNode, useTransition, FormEvent} from 'react'
import {TextField, Typography, Box, Stepper, Step, StepLabel, Paper, formControlLabelClasses, inputLabelClasses, 
  formLabelClasses, useMediaQuery, Grid,
  Slide} from '@mui/material'
import {newLesson} from './api-course'
import {useAuth} from '../auth'
import { StepIconConnector, StepIcon, StyledButton } from '../styled-buttons'
import { useTheme } from '@mui/material/styles'
import { NewMedia } from '../media'
import { StyledSnackbar } from '../styled-banners'
import { Error, Verified } from '@mui/icons-material'
import { Redirect } from 'react-router-dom'
interface NewLessonProps{
  courseId:String,
}
interface ValuesProps{
  _id: String,
  title:String,
  content:String,
  media: any,
  resource_url:String,
  error: String,
  success: String,
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
    content: '',
    media: '',
    resource_url: '',
    error: '',
    success: '',
    disableSubmit: false,
    redirect: false,
  })

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  let slidePlayer = null;
 
  const handleClose = () =>{
    setValues({...values, error: '', success: ''})
  }
 
  const handleChange = (name: string) => (event: FormEvent<HTMLFormElement>) => {
    setValues({ ...values, [name]: event.target.value, error: '' })
  }

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => { slidePlayer?.slickGoTo(prevActiveStep + 1); return prevActiveStep + 1});
    setSkipped(newSkipped);
  };

// To guard against someone actively trying to skip steps.
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      return setValues({...values, error: "You can't skip a step that isn't optional."})
    }
    setActiveStep((prevActiveStep) => {slidePlayer?.slickGoTo(prevActiveStep + 1); return prevActiveStep + 1});
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleRedirect = () => {
    setValues({...values, redirect: true})
  };

  const clickSubmit = () => {
    const lesson = {
      title: values.title || undefined,
      content: values.content || undefined,
      resource_url: values.resource_url || undefined
    }
    newLesson({
      courseId: match.params && match.params.courseId
    }, {
      token: isAuthenticated().token
    }, lesson).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
          setValues({...values, 
            _id: data.lessons[data.lessons && data.lessons.length-1]._id, 
            title: '', content: '', resource_url: '', success: 'Lesson description saved. Click Next to proceed.'})
          let next = setTimeout(()=>{
            handleNext(); 
            clearTimeout(next)
          }, 1000) 
      }
    })
  }

  const steps = [{label: 'Describe Lesson'},{label: 'Attach Video'}]
  
  if (values.redirect) {
    return <Redirect to={match.params && '/teach/course/'+match.params.courseId}/>
  }

  return (
      <Paper sx={{ width: '100%', backgroundColor: 'background.paper', py: 8}} elevation={2}>
        <Stepper sx={{mx: {xs: 1, md: 8}, mt: 4}} connector={<StepIconConnector />} alternativeLabel={xsMobileView} activeStep={activeStep} orientation="horizontal">
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
        <Slide timeout={1000} id="step-1" appear={true} direction="right" in={true} color='inherit' unmountOnExit={true}>
          <Box sx={{mx: {xs: 1, md: 8}}}>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - lesson created.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <StyledButton color="primary" variant='contained' onClick={handleRedirect}>View Course</StyledButton>
            </Box>
          </Box>
        </Slide>
      ) : 
      (<>
        {activeStep ===0 && (
          <Slide timeout={1000} id="step-1" appear={true} direction="right" in={true} color='inherit' unmountOnExit={true}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mx: {xs: 1, md: 8}}} >
              <Box sx={{ textAlign: 'center'}}>
                <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                  Add New Lesson
                </Typography>
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
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      autoFocus
                      name="title"
                      autoComplete="title"
                      label="Title"
                      id="title"
                      value={values.title} 
                      onChange={handleChange('title')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      label="Content"
                      name="content"
                      id="content"
                      multiline
                      minRows="5"
                      maxRows='10'
                      fullWidth
                      required
                      value={values.content} 
                      onChange={handleChange('content')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      id="resource-link"
                      fullWidth
                      autoComplete='resource_url'
                      name="resource-link"
                      label="Resource link"
                      value={values.resource_url} 
                      onChange={handleChange('resource_url')}
                    />
                  </Grid>
                </Grid>
              </Box>
              {!values.success ?(
              <Box 
              sx={{width: '100%',
                  display: 'flex',
                  flexDirection: {xs: 'column', sm:'row'},
                  alignItems: 'center',
                  justifyContent: 'center',
                '& > button':{ 
                  mx: {xs: 'unset', sm: 1},
                  my: {xs: 1, sm: 'unset'}}
              }}>
                  <StyledButton disableHoverEffect={false} variant="outlined" onClick={handleSkip}>
                    Skip
                  </StyledButton>
                  <StyledButton disableHoverEffect={false} variant="contained" onClick={clickSubmit}>
                    Save
                  </StyledButton>
              </Box>):(
                  <Box 
                  sx={{width: '100%',
                      display: 'flex',
                      flexDirection: {xs: 'column', sm:'row'},
                      alignItems: 'center',
                      justifyContent: 'center',
                    '& > button':{ 
                      mx: {xs: 'unset', sm: 1},
                      my: {xs: 1, sm: 'unset'}}
                  }}>
                    <StyledSnackbar
                      open={values.success? true: false}
                      duration={3000}
                      handleClose={handleClose}
                      icon={<Verified/>}
                      heading={"Saved"}
                      body={values.success}
                      variant='success'
                      />
                  </Box>
              )}
            </Box>
          </Slide>
        )}
        {activeStep === 1 && values._id && match.params.courseId && 
          <NewMedia lessonId={values._id} courseId={match.params.courseId} handleNext={handleNext}/>
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
      </Paper>)
}
export default NewLesson;
