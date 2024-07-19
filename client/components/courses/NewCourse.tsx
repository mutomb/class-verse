import React, {FormEvent, ReactNode, useEffect, useRef, useState} from 'react'
import {Typography, TextField, Box, formControlLabelClasses, formLabelClasses, inputLabelClasses, InputAdornment, MenuItem, FormControl, svgIconClasses, iconButtonClasses, Grid, Container, outlinedInputClasses, Stepper, Step, StepLabel, Slide, useMediaQuery} from '@mui/material'
import {Error, Delete, Edit} from '@mui/icons-material'
import {useAuth} from '../auth'
import {create, listCurrencies} from './api-course'
import {Link, Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, SelectButton, StepIcon, StepIconConnector, StyledButton } from '../styled-buttons'
import { StyledSnackbar } from '../styled-banners'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { Parallax } from 'react-parallax'
import {ChipsArray} from '../styled-buttons'
import logo from '../../public/logo.svg'
import image from '../../public/images/workspace/1.png'
import { FormSkeleton } from '../skeletons'
import { HashLoader } from '../progress'
import { NewMedia } from '../media'

interface NewCourse{
  _id: string,
  cover:any,
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
  redirect:boolean,
  error:string,
  disableSubmit: boolean
}

export default function NewCourse() {
  const [values, setValues] = useState<NewCourse>({
      _id: '',
      cover: '',
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
      redirect: false,
      error: '',
      price: 0,
      currency: '$',
      disableSubmit: false
  })
  const [currencies, setCurrencies] = useState([])
  const {isAuthenticated} = useAuth()
  const theme = useTheme();
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const defaultCoverURL ='/api/courses/defaultphoto'
  const [localCover, setLocalCover] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  const containerRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const handleChange = (name: string) => (event) => {
    const value = name === 'cover'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
    name === 'cover' && setLocalCover({...localCover, url: URL.createObjectURL(value), isDefault: false})
  }

  const handleChangePrice = event => {
    if(event.target.value <=0){
      return setValues({...values, price: 0 })
    }
    if(event.target.value >=10){
      return setValues({...values, price: 10 })
    }
      return setValues({...values, price: event.target.value })
  }
  const deleteCover = () => {
    setLocalCover({ data: '', url: '', isDefault: true });
    values.cover && setValues({ ...values, cover: '' })
  }
  const handleAddChip = (group_name: string, item_name: string) => (event) =>{
    if(event.keyCode === 13){
      event.preventDefault()
      if(values[group_name] && values[group_name].filter(item=>item.label===event.target.value).length>0){
        return setValues({...values, error: 'Skill already added'})
      }
      let updatedChipData = values[group_name]
      updatedChipData.push({key: updatedChipData.length, label: event.target.value})
      setValues({...values, [group_name]: updatedChipData, [item_name]: ''})
    }
  }
  const handleDeleteChipProgrammingLanguage = (chipToDelete) => () => {
    setValues(({programming_languages}) => {
      return {...values, programming_languages: programming_languages.filter((programming_language) => programming_language.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipTechnology= (chipToDelete) => () => {
    setValues(({technologies}) => {
      return {...values, technologies: technologies.filter((technology) => technology.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipSection = (chipToDelete) => () => {
    setValues(({sections}) => {
      return {...values, sections: sections.filter((section) => section.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipAudience = (chipToDelete) => () => {
    setValues(({audiences}) => {
      return {...values, audiences: audiences.filter((audience) => audience.key !== chipToDelete.key)}
    });
  }
  const handleDeleteChipRequirement = (chipToDelete) => () => {
    setValues(({requirements}) => {
      return {...values, requirements: requirements.filter((requirement) => requirement.key !== chipToDelete.key)}
    });
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!(values.title && values.subtitle && values.category && values.language && values.programming_languages && values.programming_languages.length>=1 && 
      values.technologies && values.technologies.length>=1 && values.sections && values.sections.length>1 && values.requirements && values.requirements.length>1 &&
      values.level && values.audiences && values.audiences.length>=1 && values.description && values.price && values.currency)){
      return setValues({...values, error: 'Please make sure all the Fields are filled in.'})
    };
    if (!(values.price>=0 && values.price<=10)){
      return setValues({...values, error: 'Price may not exceed $10. Please enter a price between $1 and $10.'})
    };
    let courseData = new FormData()
    values.title && courseData.append('title', values.title)
    values.subtitle && courseData.append('subtitle', values.subtitle)
    values.category && courseData.append('category', values.category)
    values.language && courseData.append('language', values.language)
    values.level && courseData.append('level', values.level)
    values.description && courseData.append('description', values.description)
    values.price && courseData.append('price', values.price)
    // values.currency && courseData.append('currency', values.currency)
    values.currency && courseData.append('currency', values.currency)
    values.programming_languages ? courseData.append('programming_languages', JSON.stringify(values.programming_languages.map(item=>item.label))) : courseData.append('programming_languages', JSON.stringify([]));
    values.technologies ? courseData.append('technologies', JSON.stringify(values.technologies.map(item=>item.label))) : courseData.append('technologies', JSON.stringify([]));
    values.sections ? courseData.append('sections', JSON.stringify(values.sections.map(item=>item.label))) : courseData.append('sections', JSON.stringify([]));
    values.requirements ? courseData.append('requirements', JSON.stringify(values.requirements.map(item=>item.label))) : courseData.append('requirements', JSON.stringify([]));
    values.audiences ? courseData.append('audiences', JSON.stringify(values.audiences.map(item=>item.label))) : courseData.append('audiences', JSON.stringify([]));
    values.cover && courseData.append('cover', values.cover)
    if(!values.cover || localCover.isDefault){
      courseData.append('cover', null)
    }
    setValues({...values, disableSubmit: true})
    create({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {
      token: isAuthenticated().token
    }, courseData).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error, disableSubmit: false})
      } else {
        setValues({...values, error: '', _id: data._id, disableSubmit: false})
        handleNext(1)
      }
    })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
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

  const handleRedirect = () => {
    setValues({...values, redirect: true})
  };

  const steps = [{label: 'Describe Course'},{label: 'Add Preview Video'}]
  /** Fetch price currencies */
  useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
      setLoading(true)
      listCurrencies(signal).then((data) => {
        if (data && data.error) {
          setValues({...values, error: "Could not get currencies"})
          setLoading(false)
        } else {
          setCurrencies(data)
          setLoading(false)

        }
      })
      return function cleanup(){
        abortController.abort()
      }
}, [])

  if(loading){
    return <FormSkeleton />
  }
  if (values.redirect && values._id) {
    return <Redirect to={'/specialist/course/'+values._id}/>
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
                <Stepper sx={{mx: 0, px: {xs: 1, md: 8}, mt: 4, width: '100%'}} connector={<StepIconConnector />} alternativeLabel={xsMobileView} activeStep={activeStep} orientation="horizontal">
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
                <Slide container={containerRef.current} timeout={1000} id="step-1" appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                  <Box sx={{width: '100%', textAlign: 'center', mx: {xs: 1, md: 8}}}>
                     <Box sx={{ textAlign: 'center'}}>
                        <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                          Well done! Course created
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center'}}>
                        <Typography variant='body1' sx={{textAlign: 'center', py: {xs: 1, sm: 2, md: 4}, width: '100%', color: 'text.primary', fontSize: {xs: '0.8rem', sm: '1rem', md: '1.2rem'}}}>
                        Now, please view the course and add lessons to it.
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 2 }}>
                        <StyledButton color="primary" variant='contained' onClick={handleRedirect}>View Course</StyledButton>
                      </Box>
                  </Box>
                </Slide>
                ):
                (<>
                {activeStep ===0 && (
                <Slide id='step-0' container={containerRef.current} timeout={1000} appear={true} direction={direction} in={true} color='inherit' unmountOnExit={true}>
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mx: {xs: 1, md: 8}}} >
                      <Box sx={{ textAlign: 'center'}}>
                        <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
                          Describe the course
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center'}}>
                        <Typography variant='body1' sx={{textAlign: 'center', py: {xs: 1, sm: 2, md: 4}, width: '100%', color: 'text.primary', fontSize: {xs: '0.8rem', sm: '1rem', md: '1.2rem'}}}>
                          Please add as much details as neccessary, as these will be advertised once approved us and reviewed by clients once published.
                        </Typography>
                      </Box>
                      <Typography component='h4' variant='h3' sx={{fontSize: '1rem', color: 'text.primary'}}> Upload Cover Image </Typography>
                      <Box sx={{ position: 'relative', mx: 'auto'}}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:300}, mb: 2 }}>
                          <Box component='img' src={localCover.url? localCover.url : defaultCoverURL} sx={{width: {xs: 150, sm:300}, height:'auto'}} alt={'Course ' + values.title +" "+ ' picture'} />
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
                            <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                              <Box component='input' accept="image/*" onChange={handleChange('cover')} style={{display: 'none'}} id="cover-upload-button" type="file" />
                              <Box component='label' htmlFor="cover-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                                <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/>Edit Image
                              </Box>
                            </MenuItem>
                            {localCover.url && !localCover.isDefault && 
                            (<MenuItem sx={{color: 'error.main', transition: theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                              <Box aria-label="Delete" onClick={deleteCover} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                              <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Image
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
                          value={values.title} 
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
                          value={values.subtitle} 
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
                          value={values.category} 
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
                          <SelectButton options={['English','French']} value={values.language} handleChange={handleChange('language')} variant='outlined' label='Spoken Language' 
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
                        <ChipsArray handleDelete={handleDeleteChipProgrammingLanguage} chipData={values.programming_languages}  />
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
                          value={values.programming_language} 
                          onKeyDown={handleAddChip('programming_languages', 'programming_language')}
                          onChange={handleChange('programming_language')}
                        />
                        <ChipsArray handleDelete={handleDeleteChipTechnology} chipData={values.technologies}  />
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
                          value={values.technology} 
                          onKeyDown={handleAddChip('technologies','technology')}
                          onChange={handleChange('technology')}
                        />
                        <ChipsArray handleDelete={handleDeleteChipSection} chipData={values.sections}  />
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
                          value={values.section} 
                          onKeyDown={handleAddChip('sections', 'section')}
                          onChange={handleChange('section')}
                        />
                        <ChipsArray handleDelete={handleDeleteChipRequirement} chipData={values.requirements}  />
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
                          value={values.requirement} 
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
                          <SelectButton options={['Beginner', 'Intermediate', 'Advanced']} value={values.level} handleChange={handleChange('level')} label='Difficulty Level' 
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
                        <ChipsArray handleDelete={handleDeleteChipAudience} chipData={values.audiences}  />
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
                          value={values.audience} 
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
                          value={values.description} 
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
                          value={values.price} 
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
                                                <SelectButton /*options={currencies}*/ options={['$']} value={values.currency} handleChange={handleChange('currency')} label='Currencies' 
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
                          <StyledButton onClick={handleSubmit} disableHoverEffect={false} variant="contained">
                            Save
                          </StyledButton>
                          </>)}
                        </Box>
                      </Box>
                  </Box>
                </Slide>
                )}
                {activeStep ===1 && values._id && 
                  <NewMedia courseId={values._id} handleNext={()=>handleNext(2)} containerRef={containerRef} direction={direction} heading='Add Preview video and its cover image'/>
                }
              </>)}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Parallax>
    )
}
