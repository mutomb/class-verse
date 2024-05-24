import React, { FC } from 'react'
import { Testimonial } from '../../interfaces/testimonial'
import avatar1 from '../../public/images/avatars/1.jpg'
import { Slide, Typography, Box } from '@mui/material'

interface Props {
  item: Testimonial
}

const TestimonialItem: FC<Props> = ({ item }) => {
  return (
    <Slide unmountOnExit={true} timeout={1000} id="slide-card" appear={true} direction="right" in={true} color='inherit'>
      <Box sx={{ py: 2, px: {xs: 1, sm: 2} }}>
        <Box sx={{ mb: 2 }}>
          <Typography component="h2" variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
            {item.title}
          </Typography>
          <Typography sx={{ mb: 2, color: 'text.secondary' }}>{item.content}</Typography>
        </Box>
        <Box
          sx={{
            boxShadow: 1,
            borderRadius: 1,
            px: 2,
            py: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            width: 270,
            backgroundColor: 'background.default',
          }}
        >
          <Box
            sx={{
              borderRadius: '50%',
              height: 52,
              width: 52,
              overflow: 'hidden',
              mr: {xs: 1, sm: 2},

              '& img': {
                width: '100%',
              },
            }}
          >
            <Box component='img' 
            src={avatar1} 
            sx={{width:'100%', height:'auto'}}
            alt={item.user.name}
            />
          </Box>
          <Box>
            <Typography variant="h6">{item.user.name}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {item.user.professional}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Slide>
  )
}
export default TestimonialItem
