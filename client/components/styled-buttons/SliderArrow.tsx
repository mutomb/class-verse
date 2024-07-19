import React, { FC } from 'react'
import IconArrowBack from '@mui/icons-material/ArrowBack'
import IconArrowForward from '@mui/icons-material/ArrowForward'
import { IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface SliderArrowProps {
    onClick?: () => void
    type: 'next' | 'prev'
    className?: 'string'
  }
  const SliderArrow: FC<SliderArrowProps> = (props) => {
    const { onClick, type, className } = props
    const {  transitions } = useTheme()
    return (
      <IconButton
        sx={{
          backgroundColor: 'background.paper',
          color: 'primary.main',
          transition: transitions.create(['background-color'], {duration: 500}),
          '&:hover': { backgroundColor: 'primary.main', color: 'primary.contrastText' },
          bottom: { xs: '-70px !important', sm: '-28px !important' },
          left: 'unset !important',
          right: type === 'prev' ? '60px !important' : '0 !important',
          zIndex: 10,
          boxShadow: 1,
        }}
        disableRipple
        color="inherit"
        onClick={onClick}
        className={className}
      >
        {type === 'next' ? <IconArrowForward sx={{ fontSize: 22 }} /> : <IconArrowBack sx={{ fontSize: 22 }} />}
      </IconButton>
    )
  }
  export default SliderArrow