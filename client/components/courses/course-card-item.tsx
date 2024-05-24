import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import { iconButtonClasses } from '@mui/material/IconButton'
import { Course } from '../../interfaces/course'
import { Link } from 'react-router-dom'
import { Zoom } from '@mui/material'

interface Props {
  item: Course,
  action?: ReactNode,
  enrollmentID?: string 
}

const CourseCardItem: FC<Props> = ({ item, action, enrollmentID }) => {
  return (
    <Zoom timeout={1000} id="zoom-card" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box
        sx={{
          py: 4,
          mx:{xs: 0, sm: 1}
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            borderRadius: 4,
            transition: (theme) => theme.transitions.create(['box-shadow']),
            '&:hover': {
              boxShadow: 2,
              [`& .${iconButtonClasses.root}`]: {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
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
              mb: 2,
            }}
          >
            <Link style={{textDecoration: 'none', width:'100%', height:'100%'}} to={enrollmentID? "/learn/"+ enrollmentID : "/course/"+item._id}>
            <Box component='img' src={'/api/courses/photo/'+item._id} sx={{width:'100%', height:'100%'}} alt={'Course ' + item._id}/>
            </Link>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Link to={enrollmentID? "/learn/"+enrollmentID : "/course/"+item._id} style={{textDecoration: 'none', overflow: 'hidden',  textOverflow: 'ellipsis'}}>
                <Typography component="h2" variant="h5" sx={{ width: '100%', textAlign: 'center', mb: 2, height: 56, overflow: 'hidden',  textOverflow: 'ellipsis', fontSize: '1.2rem', color: 'text.primary' }}>
                  {item.name}
                </Typography>
              </Link>
              {item.teacher && (<Typography variant='subtitle1' sx={{width: '100%', textAlign: 'start', color: 'text.secondary'}}> By { item.teacher.name}</Typography>)}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating name="rating-course" value={5} max={5} sx={{ color: '#ffce31', mr: 1 }} readOnly />
              <Typography component="span" variant="h5" sx={{color: 'text.primary'}}>
                ({5})
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{color: 'primary.main'}}>
                {item.currency + item.price}
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
