import React, { FC } from 'react'
import { Box, Typography } from '@mui/material'
import HeadLineCurve from "../../public/images/icons/headline-curve.svg"

interface Props {
  onClick?: () => void
  variant?: 'primary' | 'secondary',
  style?: any
}

const Logo: FC<Props> = ({ onClick, variant, style }) => {

  return (
    <Box
      onClick={onClick}
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
        ...style
    }}>
    <Box
      component='span'
      sx={{
        position: 'absolute',
        top: 8,
        left:{xs: 10, md: 35},
        transform: 'rotate(3deg)',
        '& img': { width: 22, height: 'auto' },
        display:'flex',
        alignItems: 'flex-start',
      }}>
      <Box component='img' src={HeadLineCurve} alt="Headline curve" />
    </Box>
    <Box
      sx={{ 
        display: 'flex', alignContent: 'center', justifyContent: 'center', flexDirection: 'row',
        fontWeight: 700, 
        '& h1#G': { color: variant === 'primary' ? 'primary.main' : 'unset' },
        '& h1#O': { color: variant === 'primary' ? 'secondary.main' : 'unset' }, 
      }}>
      <Typography component='h1' variant="h4" id="G">G</Typography><Typography component='h1' variant="h4" id='O'>O</Typography><Typography component='h1' variant="subtitle1" sx={{display: 'inline', color: 'text.primary'}}><sup style={{fontWeight: 800}}>2</sup></Typography>
    </Box>
  </Box>
  )
}

Logo.defaultProps = {
  variant: 'primary',
}

export default Logo
