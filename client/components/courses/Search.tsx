import React, {FormEvent, useEffect, useState} from 'react'
import {Divider, InputBase, Box, FormControl, inputBaseClasses, selectClasses, IconButton, useMediaQuery} from '@mui/material'
import { SelectChangeEvent} from '@mui/material/Select'
import {Search as SearchIcon} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import {list} from './api-course'
import Courses from './Courses'
import { ClearAdornment, SelectButton } from '../styled-buttons'
import MenuIcon from '@mui/icons-material/Menu';
import { listEnrolled } from '../enrollment/api-enrollment'
import {useAuth} from '../auth'
import logo from '../../public/logo.svg'

export default function Search({categories}) {
  const { transitions, breakpoints } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'), {defaultMatches: true})
  const {isAuthenticated} = useAuth()
  const [values, setValues] = useState({
      category: '',
      search: '',
      results: [],
      searched: false
  })
  const [enrollments, setEnrollments] = useState([])
 
  const handleChange = (name: string) => (event:FormEvent<HTMLFormElement> | SelectChangeEvent) => {
    setValues({
      ...values, [name]: event.target.value,
    })
  }
 
  const handleClear = () => {
    setValues({...values, search: ''})
  }

  const search = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(values.search){
      list({search: values.search, category: values.category}, signal).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setValues({...values, results: data, searched:true})
        }
      })
    }
  }
  const enterKey = (event) => {
    if(event.keyCode == 13){
      event.preventDefault()
      search()
    }
  }
  useEffect(() => {
    if (!isAuthenticated().user) return function cleanup(){}
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
        console.log(data.error)
        } else {
        setEnrollments(data)
        }
    })
    return function cleanup(){
        abortController.abort()
    }
  }, [])
    return (
      <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-around', width: '100%'}}>
        <Box id='search-inputs'
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            width: {xs: '100%', md: '60%'},
          }}>
          <Box sx={{
              flex:1,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
          }}> 
            <IconButton disableRipple sx={{ p: '10px', backgroundColor: 'background.paper', borderRadius: 0, height: 48, ':hover':{backgroundColor: 'background.paper'} }} aria-label="menu">
              <MenuIcon sx={{ ':hover':{color: 'primary.main'}}} />
            </IconButton>
            <FormControl fullWidth
            sx={{
              flex:1,
              backgroundColor: 'background.paper',
              borderTopRightRadius: {xs: 3, md: 0},
              borderBottomRightRadius: {xs: 3, md: 0},
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
              mr:0,
              my:0,
              [`& .${inputBaseClasses.focused}`]: {
                transition: transitions.create(['border-color']),
                border: '1px solid',
                borderColor: 'primary.main',
              },
              [`& .${inputBaseClasses.root}:hover`]:{
                transition: transitions.create(['border-color']),
                border: '1px solid',
                borderColor: 'primary.main',
              }
            }}>
              <InputBase
                value={values.search}
                id="search"
                onKeyDown={enterKey}
                onChange={handleChange('search')}
                placeholder="Enter the Course Name"
                endAdornment={<ClearAdornment position='end'  value={values.search} handleClick={handleClear}/>}
                sx={{
                  borderTopRightRadius: {xs: 3, md: 0},
                  borderBottomRightRadius: {xs: 3, md: 0},
                  borderTopLeftRadius: 3,
                  borderBottomLeftRadius: 3,
                  width: '100%',
                  height: 48,
                  px: 2,
                }}
              />
            </FormControl>
            <IconButton disableRipple onClick={search} type="button" sx={{ p: '10px', backgroundColor: 'background.paper', borderRadius: 0, height: 48, ':hover':{backgroundColor: 'background.paper'} }} aria-label="search">
              <SearchIcon  sx={{ ':hover':{color: 'primary.main'}}}/>
            </IconButton>
            <Box sx={{ height: 48, backgroundColor: 'background.paper', display: matchMobileView? 'none':'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Divider sx={{ height: 28, m: 0.5,}} orientation="vertical" />
            </Box>
          </Box>
          <FormControl
            aria-label="categories"
            sx={{
              minWidth: 80, maxWidth: 200,
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
              borderTopLeftRadius: {xs: 3, md: 0},
              borderBottomLeftRadius: {xs: 3, md: 0},
              my: {xs: 2, md: 0},
              mr: { xs: 0, md: 0 },
              // mb: { xs: 2, md: 2 },
              [`& .${selectClasses.icon}`]: {color: 'primary.contrastText'}
            }}>
            <SelectButton options={categories} value={values.category} handleChange={handleChange('category')} label='Categories' 
            styles={{
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
              borderTopLeftRadius: {xs: 3, md: 0},
              borderBottomLeftRadius: {xs: 3, md: 0}
            }}
            />
          </FormControl>
          <Divider sx={{my:1}}/>
        </Box>
        <Box id='search-results' 
        sx={{mt:{xs: 1, md: 4}, width: '100%', bgcolor: 'background.default',
          '&::before': {
            content: '""',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: {xs: 'unset', md: '50%'},
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 0.5,
          },
          '& > div':{
            position: 'relative'
          }
        }}>
          <Courses courses={values.results} searched={values.searched} enrollments={enrollments}/>
        </Box>  
      </Box>  
    )
}