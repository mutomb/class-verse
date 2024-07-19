import React, { FC } from 'react'
import {Grid, Container, IconButton} from '@mui/material'
import {VerifiedUser, DonutLarge} from '@mui/icons-material'
import { CourseCardItem } from '../courses'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

interface EnrollmentsProps{
  enrollments:Array<any>
}
const Enrollments: FC<EnrollmentsProps> = ({enrollments:enrollments}) =>{
  const theme = useTheme()
  const getAction = (enrollment) =>{
    if(enrollment) return (
      <Link style={{textDecorationLine:'none'}}  to={`/client/${enrollment._id}`}>
        <IconButton aria-label={`course-${enrollment._id}`}
          sx={{
              zIndex: 10,
              transform: 'unset',
              color:(enrollment && enrollment.completed)? "primary.main": 'secondary.main',
              '&:hover':{
                boxShadow: 2,
                transform: 'translateY(-3px) scale(1.1)',
                transition: theme.transitions.create(['transform'], {duration: 500})
          }}}>
          {enrollment.completed?<VerifiedUser />:<DonutLarge />}
        </IconButton>
      </Link>
    )
  }
    return (
      <Container maxWidth="lg" sx={{px:{xs:0, sm: 'inherit'}}}>
        <Grid container spacing={2}>
          {enrollments.map((enrollment) => {
            return (
            <Grid item xs={12} sm={6} md={4} key={String(enrollment._id)}>
              <CourseCardItem  item={enrollment.course} action={getAction(enrollment)} enrollmentID={enrollment._id}  />
            </Grid>
            )
            })
          }
        </Grid>
      </Container>)
}
export default Enrollments;
