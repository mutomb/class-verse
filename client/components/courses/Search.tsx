import React, {ChangeEvent, useEffect, useState} from 'react'
import {Divider, InputBase, Box, FormControl, inputBaseClasses, selectClasses, IconButton, useMediaQuery} from '@mui/material'
import {Error, Search as SearchIcon} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import {list} from './api-course'
import Courses from './Courses'
import { ClearAdornment, Pagination, SelectButton } from '../styled-buttons'
import { listEnrolled } from '../enrollment/api-enrollment'
import {useAuth} from '../auth'
import logo from '../../public/logo.svg'
import { StyledSnackbar } from '../styled-banners'
import { WallPaperYGW } from '../wallpapers/wallpapers'

export default function Search({categories}) {
  const { transitions, breakpoints, palette } = useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'), {defaultMatches: true})
  const {isAuthenticated} = useAuth()
  const [values, setValues] = useState({
      category: '',
      search: '',
      results: {},
      searched: false,
      error: ''
  })
  const [enrollments, setEnrollments] = useState([])
 
  const handleChange = (name: string) => (event) => {
    setValues({
      ...values, [name]: event.target.value,
    })
  }

  const handleClear = () => {
    setValues({...values, search: ''})
  }

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    search(page)
  }
  
  const search = (page?: number) => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(values.search){
      list({search: values.search, category: values.category, page}, signal).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
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
  const handleClose = () =>{
    setValues({...values, error: ''})
  }
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(isAuthenticated().user){
      listEnrolled({token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
        setValues({...values, error: data.error})
        } else {
        setEnrollments(data)
    }
  })}
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
            {/* <IconButton disableRipple sx={{ p: '10px', backgroundColor: 'background.paper', borderRadius: 0, height: 48, ':hover':{backgroundColor: 'background.paper'} }} aria-label="menu">
              <MenuIcon sx={{ ':hover':{color: 'primary.main'}}} />
            </IconButton> */}
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
                transition: transitions.create(['border-color', 'border'], {duration: 1000}),
                border: '1px solid',
                borderColor: 'primary.main',
              },
              [`& .${inputBaseClasses.root}:hover`]:{
                transition: transitions.create(['border-color', 'border'], {duration: 1000}),
                border: '1px solid',
                borderColor: 'primary.main',
              },
              '&:hover':{
                [`& .${selectClasses.icon}`]: {color: 'primary.main'}, [`& .${selectClasses.root}`]: {color: 'primary.main'},
              },
            }}>
              <InputBase
                value={values.search}
                id="search"
                onKeyDown={enterKey}
                onChange={handleChange('search')}
                placeholder="Enter course, specialist or category name"
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
            <IconButton disableRipple onClick={()=>search} type="button" sx={{ p: '10px', backgroundColor: 'background.paper', borderRadius: 0, height: 48, ':hover':{backgroundColor: 'background.paper'} }} aria-label="search">
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
              
            }}>
            <SelectButton options={categories} value={values.category} handleChange={handleChange('category')} label='Categories' 
            styles={{
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
              borderTopLeftRadius: {xs: 3, md: 0},
              borderBottomLeftRadius: {xs: 3, md: 0},
              [`& .${selectClasses.icon}`]: {color: 'primary.contrastText'},
              '&:hover':{color: 'primary.main', bgcolor: 'primary.contrastText',
                [`& .${selectClasses.icon}`]: {color: 'primary.main'}, [`& .${selectClasses.root}`]: {color: 'primary.main'},
              },
            }}
            />
          </FormControl>
          <Divider sx={{my:1}}/>
        </Box>
        <WallPaperYGW id='search-results' variant='linear' primaryColor={palette.background.paper} secondaryColor={palette.background.default}
          style={{
            '&::before': {
              content: '""',
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundImage: `url(${logo})`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'contain',
              opacity: 0.5,
            },
            '& > div':{
              position: 'relative'
            }
          }}>
          {values.results && values.results.courses &&  enrollments && 
          (<Courses courses={values.results.courses} searched={values.searched} enrollments={enrollments}/>)
          }
          {values.results && values.results.count && values.results.page && 
          (<Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4}}>
            <Pagination size={matchMobileView? 'small': 'medium'} shape='circular' variant='outlined' onChange={handlePageChange} page={Number(values.results.page)} count={Number(values.results.count)} siblingCount={1}/>
          </Box>)}
        </WallPaperYGW>  
        <StyledSnackbar
        open={values.error? true: false}
        duration={3000}
        handleClose={handleClose}
        icon={<Error/>}
        heading={"Error"}
        body={values.error}
        variant='error'
        />
      </Box>  
    )
}