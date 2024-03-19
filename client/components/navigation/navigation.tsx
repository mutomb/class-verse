import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import { Link as ScrollLink, scroller } from 'react-scroll'
import { navigations } from './navigation.data'
import HeadLineCurve from "../../public/images/headline-curve.svg"
import { useHistory, useLocation } from 'react-router-dom'
import auth from '../auth/auth-helper'

const Navigation: FC = () => {
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const history = useHistory()
  const scrollToAnchor = (destination:string) => {
    scroller.scrollTo(destination, {
      duration: 1500,
      delay: 0,
      smooth: true,
      offset: -10,
    })
  }
  const goToHomeAndScroll = async (destination:string) => {
    await history.push('/')
    await scrollToAnchor(destination)
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {navigations.map(({ path: destination, label }) => {
        if (!auth.isAuthenticated().user && ['enrolled-in-courses'].includes(destination)) return null
        if (auth.isAuthenticated().user && ['hero', 'testimonial'].includes(destination)) return null
        else{
          return(<Box
          component={ScrollLink}
          key={destination}
          activeClass="current"
          onClick={location==='/'?()=>scrollToAnchor(destination) : ()=>goToHomeAndScroll(destination)}
          to= {destination}
          spy={true}
          smooth={true}
          duration={350}
          sx={{
            position: 'relative',
            color: 'text.disabled',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 0, md: 3 },
            mb: { xs: 3, md: 0 },
            fontSize: { xs: '1.2rem', md: 'inherit' },
            ...(destination === '/' && {
              color: 'primary.main',
            }),
            '& > span': { display: 'none' },
            '&.current>span': { display: 'block' },
            '&.current': { color: 'primary.main' },
            '&:hover': {
              color: 'primary.main',
              '&>span': {
                display: 'block',
              },
            },
          }}
        >
          <Box
            component='span'
            sx={{
              position: 'absolute',
              top: 12,
              transform: 'rotate(3deg)',
              '& img': { width: 44, height: 'auto' },
            }}
          >
            {/* eslint-disable-next-line */}
            <img src={HeadLineCurve} alt="Headline curve" />
          </Box>
          {label}
        </Box>)}
      })}
    </Box>)
}

export default Navigation
