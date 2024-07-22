import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Box, Grid, Container, Typography, Slide} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { AddBox, Error } from '@mui/icons-material'
import {useAuth} from '../auth'
import { Media } from '../media'
import { listAdmin } from '../media/api-media'
import { StyledButton } from '../styled-buttons'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import { StyledSnackbar } from '../styled-banners'

const HomeIntroVideo: FC = () => {
  const [media, setMedia] = useState([])
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  const [error, setError] = useState('')
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    let attempts = 1
    const retry = setInterval(()=>{
      listAdmin(signal).then((data) => {
        if (data && data.error) {
          if(attempts>=5){ clearInterval(retry)}
          attempts++
           setError(data.error)
        } else {
          setMedia(data)
          clearInterval(retry)
        }
      })
    }, 1000)
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  return (
    <WallPaperYGW variant='linear' primaryColor={theme.palette.background.default} secondaryColor={theme.palette.background.paper}
    style={{
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
      <Box id="intro-video">
        <Container maxWidth={false}
        sx={{px: 0, py: 8}}>
          <Grid container spacing={3} sx={{display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row'}}}>
            <Grid id="video" item xs={12} sm={7} sx={{pt: '0px !important'}}>
            {isAuthenticated().user && isAuthenticated().user.role === 'admin' &&(
              <Link to="/media/new">
                <StyledButton>
                  <AddBox sx={{verticalAlign: 'text-top'}}/> Add Media
                </StyledButton>
              </Link>)}
              {media && media.length > 0 && <Media media={media[0]} variant='simple' style={{backgroundColor: 'inherit'}}/>}  
            </Grid>
            <Grid id="heading" item xs={12} sm={5}>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="left" in={true} color='inherit'>
              <Typography
                    component="h2"
                    sx={{
                      position: 'relative',
                      fontSize: { xs: '2rem', md: '3.5rem' },
                      mt: { xs: 0, md: 7 },
                      mb: 4,
                      lineHeight: 1,
                      fontWeight: 'bold',
                      color: 'text.primary'
                    }}>
                    Quick{' '}
                    <Typography
                      component="mark"
                      sx={{
                        position: 'relative',
                        color: 'primary.main',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        backgroundColor: 'unset',
                      }}>
                      Guide{' '}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: { xs: 20, md: 28 },
                          left: 2,
                          '& img': { width: { xs: 80, md: 150 }, height: 'auto' },
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={HeadLineCurve}  />
                      </Box>
                    </Typography>
                  </Typography> 
              </Slide>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description1" appear={true} direction="left" in={true} color='inherit'>
                <Box component='span' sx={{ color: 'primary.dark', fontSize: '1.2rem', fontWeight: 600, mb: 2, ml: { xs: 0, md: 4 } }}>
                GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> in 5 minutes...
                </Box>
              </Slide>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description2" appear={true} direction="left" in={true} color='inherit'>
                <Typography sx={{ mb: 2, ml: { xs: 0, md: 4 }, fontWeight: 600, color: 'text.primary' }}>
                  Watch a short getting started overview of GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>{" "}
                  and the features it has in store for making your learning or teaching
                  experience uber easy.
                </Typography>
              </Slide>
            </Grid>
          </Grid>
          <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
        </Container>
      </Box>
    </WallPaperYGW>
  )
}

export default HomeIntroVideo
