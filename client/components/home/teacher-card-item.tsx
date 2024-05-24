import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Teacher } from '../../interfaces/teacher'
import { Zoom } from '@mui/material'

interface Props {
  item: Teacher
}

const TeacherCardItem: FC<Props> = ({ item }) => {
  return (
    <Zoom timeout={1000} id="zoom-card" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ px: {xs: 0, sm: 1.5}, py: 5, }} >
        <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 4, transition: (theme) => theme.transitions.create(['box-shadow']), '&:hover': { boxShadow: 2, }, }} >
          <Box sx={{ lineHeight: 0, overflow: 'hidden', borderRadius: 3, height: 200, mb: 2, }} >
            <Box component='img' src={item.photo} sx={{width:'100%', height:'100%'}} alt={'Teacher ' + item.id} />
          </Box>
          <Box sx={{ mb: 2, color: 'text.primary' }}>
            <Typography component="h2" variant="h4" sx={{ fontSize: '1.4rem' }}>
              {item.name}
            </Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{item.category}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }} variant="subtitle1">
              {item.experience}
            </Typography>
            <Box sx={{ '& img': { height: 26 } }}>
              {/* eslint-disable-next-line */}
              <img src={item.company?.logo} alt={item.company?.name + ' logo'} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Zoom>
  )
}
export default TeacherCardItem
