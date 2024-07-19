import React, { FC, ReactNode } from 'react'
import {Box, Rating, Typography, Zoom} from '@mui/material'
import {SxProps, Theme} from '@mui/material/styles'
import { iconButtonClasses } from '@mui/material/IconButton'
import { Course } from '../../interfaces/course'
import { Link } from 'react-router-dom'

interface Props {
  item: Course,
  action?: ReactNode,
  enrollmentID?: string,
  wrapperStyle?: SxProps<Theme>
}

const CourseCardItem: FC<Props> = ({ item, action, enrollmentID, wrapperStyle }) => {
  return (
    <Zoom timeout={1000} id="zoom-card" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box
        sx={{
          py: {xs: 1, md: 2},
          mx:{xs: 0, sm: 1},
          maxWidth: 400,
          ...wrapperStyle
        }}>
        <Box
          sx={{
            p: {xs: 1, md: 2},
            backgroundColor: 'background.paper',
            borderRadius: 4,
            transition: (theme) => theme.transitions.create(['box-shadow'], {duration: 500}),
            '&:hover': {
              boxShadow: 2,
              [`& .${iconButtonClasses.root}`]: {
                backgroundColor: 'primary.main',
                color: '#fbfbfb',
                boxShadow: 2,
              },
            },
          }}
        >
          <Box
            sx={{
              lineHeight: 0,
              overflow: 'hidden',
              borderRadius: 3,
              height: 200,
              mb: 1,
            }}
          >
            <Link style={{textDecoration: 'none', width:'100%', height:'100%'}} to={enrollmentID? "/client/"+ enrollmentID : "/course/"+item._id}>
            <Box component='img' src={'/api/courses/photo/'+item._id} sx={{width:'100%', height:'100%'}} alt={'Course ' + item._id}/>
            </Link>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Link to={enrollmentID? "/client/"+enrollmentID : "/course/"+item._id} style={{textDecoration: 'none'}}>
                <Typography component="h2" variant="h5" sx={{ mb: 1, width: '100%', textAlign: 'start', fontSize: {xs: '1.1rem', sm: '1.2rem', md: '1.3rem'}, color: 'text.primary' }}>
                {item.title && item.title.substring(0,50)}{item.title && item.title.substring(50).length>0 && '...'}
                </Typography>
                <Typography sx={{width: '100%', textAlign: 'start', mb: 1, color: 'text.secondary' }} variant="subtitle1">
                 {item.description && item.description.substring(0,150)}{item.description && item.description.substring(150).length>0 && '...'}
                </Typography>
              </Link>
              {item.specialist && (<Typography variant='subtitle1' sx={{width: '100%', textOverflow: 'ellipsis', textAlign: 'start', color: 'text.secondary'}} noWrap> By { item.specialist.name}</Typography>)}
            </Box>
            <Box sx={{ wdith: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
              <Rating name="rating-course" value={5} max={5} sx={{ color: 'secondary.main', mr: 1 }} readOnly />
              <Typography component="span" variant="h5" sx={{color: 'text.primary'}}>
                ({5})
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{color: 'primary.main'}}>
                {item.currency +" "+ item.price}
              </Typography>
              <Typography variant="h6" sx={{color: 'text.primary'}}>/ course</Typography>
            </Box>
            {action}
          </Box>
        </Box>
      </Box>
    </Zoom>
  )
}

export default CourseCardItem
