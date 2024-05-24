import React, { useEffect, useState } from 'react'
import {Box, Container, Typography, Button} from '@mui/material'
import { AddBox } from '@mui/icons-material'
import { listPopular } from '../media/api-media'
import { MediaList } from '../media'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'

const HomeMediaList = () => {
  const [media, setMedia] = useState([])
  const {isAuthenticated} = useAuth()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listPopular(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setMedia(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  console.log(isAuthenticated().user)
  return(
    <Box id="medialist" sx={{pt: {xs: 6,md: 8, }, pb: { xs: 8, md: 12, }}}>
      <Container maxWidth="lg" sx={{px:{xs:0, sm: 'inherit'}}}>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, color: 'text.primary' }}>
          Popular Videos
        </Typography>
        {isAuthenticated().user && isAuthenticated().user.role === 'admin' &&(
        <Link to="/media/new">
          <Button>
            <AddBox style={{marginRight: '8px'}}/> Add Media
          </Button>
        </Link>)}
        <MediaList media={media}/>
      </Container>
    </Box>
  )
}

export default HomeMediaList
