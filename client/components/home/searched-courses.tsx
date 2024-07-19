import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {listCategories} from '../courses/api-course'
import Search from '../courses/Search'
import {ReactTyped}  from "react-typed"
import { Parallax } from 'react-parallax'
import image from '../../public/images/home/home-search.jpg' 
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import { StyledSnackbar } from '../styled-banners'
import { Error } from '@mui/icons-material'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"

const SearchedCourses = () =>{
  
    const [categories, setCategories] = useState([])
    const theme = useTheme()
    const [error, setError] = useState('')
    /** Fetch course categories */
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listCategories(signal).then((data) => {
          if (data && data.error) {
             setError(data.error)
          } else {
            setCategories(data)
          }
        })
        return function cleanup(){
          abortController.abort()
        }
      }, [])
    
    return (
    <Parallax bgImage={image}  strength={50} blur={5}
      renderLayer={percentage=>(
      <WallPaperYGW variant='linear' primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.background.paper} 
      style={{
        opacity: percentage*0.7, position: 'absolute', width: '100%', height: '100%',
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto',
          opacity: percentage*0.5
        },
        '& > div':{
          position: 'relative'
        }
      }} overlayStyle={{bgcolor: 'rgba(0,0,0,0)'}}
      />
      )}>
      <Box id="search" sx={{ pt: { xs: 8, md: 10 }, pb:0, width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            py: { xs: 4, md: 6 },
            textAlign: 'center',
            '& > span': {position: 'relative', boxShadow: 4, mb: 3, pb:0.5, borderRadius: {xs: 1, md: 2}, bgcolor: (theme)=> theme.palette.mode ==='dark'?`rgba(0,0,0,0.7)`:`rgba(255,255,255,0.7)`},
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3.5rem' },
            '& > span>span>p': {display: 'inline', color: 'primary.main'},
            '& > span>span>span': {color: 'secondary.main'},
            '& > span>span>img': { position: 'absolute', bottom: 0, left:{xs: 10, md: 35}, width: {xs: 33, sm: 44, md: 66}, height: 'auto' },
          }}> 
            <ReactTyped
              startWhenVisible
              strings={[`<p>G</p><span>O</span><sup><small>2</small></sup> <img src='${HeadLineCurve}'/>`, '<span>Find</span> <p>Courses</p>.', '<span>Find</span> <p>Specialists</span>.', '<p>Verified</p>  <span>Specialists</span>.', '<p>Verified</p> <span>Courses</span>.', '<p>Enjoyable</p> <span>E-Learning</span> Experience.', 'Uber <p>Easy</p> <span>Consultation</span>.']}
              typeSpeed={100}
              loop
              smartBackspace={true}
              backDelay={3000}
              backSpeed={100}
            />
          {/* <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '1.2rem', color: 'primary.contrastText', bgcolor: 'rgba(0,0,0, 0.4)', display: 'inline-block' }}>Browse courses and specialists.</Typography> */}
        </Box>
        <Search categories={categories}/>
        <StyledSnackbar
          open={error? true: false}
          duration={3000}
          handleClose={()=>setError('')}
          icon={<Error/>}
          heading={"Error"}
          body={error}
          variant='error'
          />
      </Box>
    </Parallax>)
}
export default SearchedCourses