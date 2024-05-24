import React, {useState, useEffect} from 'react'
import {Box, Container, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {listCategories} from '../courses/api-course'
import Search from '../courses/Search'
// import {ReactTyped}  from "react-typed"
import { Parallax } from 'react-parallax'
import image from '../../public/images/home/home-search.jpg' 
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

const SearchedCourses = () =>{
  
    const [categories, setCategories] = useState([])
    const theme = useTheme()
    /** Fetch course categories */
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listCategories(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error)
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
          backgroundRepeat: 'space',
          backgroundSize: 'contain',
          opacity: percentage*0.5
        },
        '& > div':{
          position: 'relative'
        }
      }}
      />
      )}>
      <Box id="search" sx={{ pt: { xs: 8, md: 10 }, pb:0, width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            py: { xs: 4, md: 6 },
            px: { xs: 1, md: 8 },
            textAlign: 'center',
            '& > span': {mb: 3},
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3.5rem' },
            '& > span>span>p': {display: 'inline', color: 'primary.main'},
            '& > span>span>span': {color: 'secondary.main'}
          }}> 
            {/* <ReactTyped
              startWhenVisible
              strings={['<p>Best</p>  <span>Teachers</span>', '<p>Best</p> <span>Courses</span>', '<p>Best</p> <span>Learning</span> Experience', '<p>Click</p>Edu<span>Solution</span>']}
              typeSpeed={100}
              loop
              smartBackspace={true}
              backDelay={3000}
              backSpeed={100}
            /> */}
          <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '1.2rem', color: 'primary.contrastText', bgcolor: 'rgba(0,0,0, 0.4)', display: 'inline-block' }}>Enter course name, select category, and click on the searchbox.</Typography>
        </Box>
        <Search categories={categories}/>
      </Box>
    </Parallax>)
}
export default SearchedCourses