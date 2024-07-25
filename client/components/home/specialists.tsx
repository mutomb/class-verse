import React, { FC, useEffect, useState } from 'react'
import Slider, { Settings } from 'react-slick'
import {Container, Box, Typography, Slide} from '@mui/material'
import {SliderArrow, SliderDots} from '../styled-buttons'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import SpecialistCardItem from './specialist-card-item'
// import { data } from './specialists.data'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"
import { listApprovedSpecialists } from '../users/api-user'
import { useAuth } from '../auth'
import { StyledSnackbar } from '../styled-banners'
import { Error } from '@mui/icons-material'
import { CardItemSkeleton } from '../skeletons'

const HomeOurSpecialists: FC = () => {
  const theme = useTheme()
  const [users, setUsers] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {isAuthenticated} = useAuth()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const sliderConfig: Settings= {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: xsMobileView ? 1 : smMobileView? 2: 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <SliderDots>{dots}</SliderDots>,
    customPaging: () => (
      <Box sx={{ height: {xs:10, md:8}, width: {xs:10, md:30}, backgroundColor: 'secondary.dark', display: 'inline-block', borderRadius: 4 }} />
    ),
  }
  useEffect(()=>{
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    listApprovedSpecialists(signal, {
      token: isAuthenticated().token
    }).then((data) => {
      if (data && data.error) {
         setError(data.error)
         setLoading(false)
      } else {
        setUsers(data)
        setLoading(false)
      }
    })
  },[])

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
  }} overlayStyle={{pb: 10, bgcolor: theme.palette.mode==='dark'? 'rgba(33, 33, 33, 0.7)': 'rgba(242, 245, 245, 0.7)'}}>
   <Box id="specialists" sx={{pt: {xs: 6,md: 8, }, pb: { xs: 8, md: 12, }}}>
      <Container maxWidth="lg" sx={{px:{xs:0, sm: 'unset'}}}>
        <Slide unmountOnExit={true} timeout={1000} id="slide-heading" appear={true} direction="right" in={true} color='inherit'>
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
            Our{' '}
            <Typography
              component="mark"
              sx={{
                position: 'relative',
                color: 'primary.main',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                backgroundColor: 'unset',
              }}
            >
              Specialists{' '}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 20, md: 28 },
                  left: 2,
                  '& img': { width: { xs: 140, md: 250 }, height: 'auto' },
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HeadLineCurve}  />
              </Box>
            </Typography>
          </Typography>        
        </Slide>
        {(loading || !users || users.length===0)?
        (<Slider {...sliderConfig}>
          {Array.from(new Array(4)).map(()=>(<CardItemSkeleton />))}
        </Slider>):
        (users.length < 3)?
        (<Slider {...sliderConfig}>
          {[...users, ...users, ...users].map((specialist) => (
            <SpecialistCardItem key={String(specialist._id)} item={specialist} />
          ))}
        </Slider>): 
        (<Slider {...sliderConfig}>
          {users.map((specialist) => (
            <SpecialistCardItem key={String(specialist._id)} item={specialist} />
          ))}
        </Slider>)}
      </Container>
    </Box>
    <StyledSnackbar
      open={error? true: false}
      duration={3000}
      handleClose={()=>setError('')}
      icon={<Error/>}
      heading={"Error"}
      body={error}
      variant='error'
      />
  </WallPaperYGW>
  )
}

export default HomeOurSpecialists
