import React, {FormEvent, useEffect, useState} from 'react'
import {Typography, TextField, Box, Paper, formControlLabelClasses, formLabelClasses, inputLabelClasses, InputAdornment, MenuItem, FormControl, svgIconClasses, iconButtonClasses} from '@mui/material'
import {Error, Delete, Edit} from '@mui/icons-material'
import {useAuth} from '../auth'
import {create, listCurrencies} from './api-course'
import {Link, Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, SelectButton, StyledButton } from '../styled-buttons'
import { StyledSnackbar } from '../styled-banners'

interface NewCourse{
  cover:any,
  name:string,
  description:string,
  category:string,
  price: number,
  redirect:Boolean,
  error:string,
  currency: string,
}

export default function NewCourse() {
  const [values, setValues] = useState<NewCourse>({
      name: '',
      cover: '',
      category: '',
      description: '',
      redirect: false,
      error: '',
      price: 0,
      currency: 'USD'
  })
  const [currencies, setCurrencies] = useState([])
  const {isAuthenticated} = useAuth()
  const theme = useTheme();
  const defaultCoverURL ='/api/courses/defaultphoto'
  const [localCover, setLocalCover] = useState({
    data: '',
    url: '',
    isDefault: false
  });
  
  const handleChange = (name: string) => (event:FormEvent<HTMLFormElement>) => {
    const value = name === 'cover'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value })
    name === 'cover' && setLocalCover({...localCover, url: URL.createObjectURL(value), isDefault: false})
  }
  const deleteCover = () => {
    setLocalCover({ data: '', url: '', isDefault: true });
    values.cover && setValues({ ...values, cover: '' })
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let courseData = new FormData()
    values.name && courseData.append('name', values.name)
    values.description && courseData.append('description', values.description)
    values.cover && courseData.append('cover', values.cover)
    values.category && courseData.append('category', values.category)
    values.price && courseData.append('price', values.price)
    values.currency && courseData.append('currency', values.currency)

    create({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {
      token: isAuthenticated().token
    }, courseData).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, error: '', redirect: true})
      }
    })
  }
  const handleClose = () => {
    setValues({...values, error: ''})
  }

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

    if (values.redirect) {
      console.log(values.redirect)
      return (<Redirect to={'/teach/courses'}/>)
    }
    return (
      <Paper sx={{ width: {xs: '100%', md: '90%'}, m: 'auto', mx: { xs: 0, md: 'auto'}, backgroundColor: 'background.paper', borderRadius: 4 }} elevation={2}>
        <Box
          sx={{
            my: 8,
            mx: {xs:1, md:4},
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center'}}>
            <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2.5rem' }, color: 'text.primary' }}>
              New Course
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', mx: 'auto'}}>
            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', borderRadius: 10, height: {xs: 150, sm:300}, mb: 2 }}>
              <Box component='img' src={localCover.url? localCover.url : defaultCoverURL} sx={{width: {xs: 150, sm:300}, height:'auto'}} alt={'Course ' + values.name +" "+ ' picture'} />
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
              <MoreMenuVertButton>
                <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                  <Box component='input' accept="image/*" onChange={handleChange('cover')} style={{display: 'none'}} id="cover-upload-button" type="file" />
                  <Box component='label' htmlFor="cover-upload-button" style={{width: '100%', color:"inherit", fontSize: '1rem'}}>
                    <Edit sx={{ml: 1, verticalAlign: 'text-top'}}/>Edit Image
                  </Box>
                </MenuItem>
                {localCover.url && !localCover.isDefault && 
                (<MenuItem sx={{color: 'red', transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                  <Box aria-label="Delete" onClick={deleteCover} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
                  <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Image
                  </Box>
                </MenuItem>)}
              </MoreMenuVertButton>
            </Box>
          </Box>
             
          <Box component="form" onSubmit={handleSubmit} 
            sx={{ mt: 1,
              [`& .${formControlLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${formLabelClasses.asterisk}`]: {display: 'none'},
              [`& .${inputLabelClasses.focused}`]: { 
                color: theme.palette.mode === 'dark' ? 'secondary.main': 'primary.main',
              },
            }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={values.name} 
              onChange={handleChange('name')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="category"
              label="Category"
              placeholder='Example: Machine Learning'
              id="category"
              autoComplete="category"
              value={values.category} 
              onChange={handleChange('category')}
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
              autoComplete="description"
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
              autoComplete="price"
              value={values.price} 
              onChange={handleChange('price')}
              helperText='Choose currency and Enter price'
              InputProps={{
                startAdornment: <InputAdornment position="start"> 
                                  <FormControl
                                    aria-label="currencies"
                                    sx={{
                                      minWidth: 60, maxWidth: 200,
                                      my: {xs: 2, md: 0},
                                      mr: { xs: 0, md: 0 },
                                    }}>
                                    <SelectButton options={currencies} value={values.currency} handleChange={handleChange('currency')} label='Currencies' 
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
                mx: {xs: 'unset', sm: 1},
                my: {xs: 1, sm: 'unset'}}
              }}>
              <StyledButton type='submit' disableHoverEffect={false} variant="contained">
                Save
              </StyledButton>
              <Link to={'/teach/courses'} style={{textDecoration: 'none'}}>
                <StyledButton disableHoverEffect={false} variant="outlined">
                  Cancel
                </StyledButton>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    )
}
