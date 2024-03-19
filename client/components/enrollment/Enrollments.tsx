import React, { FC } from 'react'
import {ImageList, ImageListItem, ImageListItemBar, Box, useMediaQuery} from '@mui/material'
import CompletedIcon from '@mui/icons-material/VerifiedUser'
import InProgressIcon from '@mui/icons-material/DonutLarge'
import {Link} from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'


interface EnrollmentsProps{
  enrollments:Array<any>
}
const Enrollments: FC<EnrollmentsProps> = ({enrollments:enrollments}) =>{
    const { breakpoints } = useTheme()
    const matchMobileView = useMediaQuery(breakpoints.down('md'))
    return (<Box>
        <ImageList rowHeight={120} 
          sx={{
            width: '100%',
            minHeight: 100,
            padding: '12px 0 10px'
          }} 
          cols={matchMobileView ? 1 : 3}
          >
          {enrollments.map((course, i) => (
            <ImageListItem key={i} sx={{textAlign: 'center'}}>
              <Link to={"/learn/"+course._id}>
                <img style={{height: '100%'}} src={'/api/courses/photo/'+course.course._id} 
                loading="lazy"
                alt={course.course.name} />
                </Link>
              <ImageListItemBar 
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                textAlign: 'left'
              }} 
                title={
                  <Link style={{textDecorationLine:'none'}}  to={"/learn/"+course._id}>
                  <MuiLink
                    component='span'
                    underline="hover"
                    sx={{
                      display: 'block',
                      mb: 1,
                      color: 'primary.contrastText',
                      backgroundColor: 'rgba(0, 0, 0, 0.85)',
                      textAlign: 'left'
                    }}
                  >
                    {course.course.name}
                  </MuiLink>
                </Link>}
                actionIcon={<div style={{margin: '0 10px'}}>
                 {course.completed ? (<CompletedIcon sx={{color:"primary.main"}} />)
                 : (<InProgressIcon sx={{color: 'seondary.main'}} 
                 aria-label={`info about ${course.course.name}`} />)
                }</div>}
              />
            </ImageListItem>
          ))}
        </ImageList>
    </Box>)
}
export default Enrollments;
