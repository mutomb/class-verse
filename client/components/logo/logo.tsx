import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { Link as ScrollLink } from 'react-scroll'
import HeadLineCurve from "../../public/images/headline-curve.svg"

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

const Logo: FC<Props> = ({ onClick, variant }) => {

  return (
    <Box
    component={ScrollLink}
    activeClass="current"
    to={"#"}
    onClick={onClick}
    spy={true}
    smooth={true}
    duration={350}
    sx={{
      position: 'relative',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: { xs: 0, md: 3 },
      mb: { xs: 3, md: 0 },
      fontSize: { xs: '1.2rem', md: 'inherit' },
      '& > span': { display: 'block' },
    }}
  >
    <Box
      component='span'
      sx={{
        position: 'absolute',
        top: 12,
        left:{xs: 10, md: 35},
        transform: 'rotate(3deg)',
        '& img': { width: 44, height: 'auto' },
        display:'flex',
        alignItems: 'flex-start',
      }}
    >
      {/* eslint-disable-next-line */}
      <img src={HeadLineCurve} alt="Headline curve" />
    </Box>
    <Typography
        variant="h4"
        component="h1"
        sx={{ 
          fontWeight: 700, 
          '& span': { color: variant === 'primary' ? 'primary.main' : 'unset' }, 
          ':hover': { color: variant === 'primary' ? 'secondary.main' : 'unset' }
        }}
      >
        <span>Funda</span>Gate
    </Typography>
  </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
