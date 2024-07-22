import React, { FC } from 'react'
import {Grid, Container, IconButton, Box, Typography} from '@mui/material'
import {VerifiedUser, DonutLarge, Info} from '@mui/icons-material'
import { CourseCardItem } from '../courses'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { StyledBanner } from '../styled-banners'

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
  if(enrollments && enrollments.length ===0){
    return 
  }
    return (
      <Container maxWidth="lg" sx={{px:{xs:0, sm: 'inherit'}}}>
        <Grid container spacing={2}>
          <Box sx={{  width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'text.disabled',
          textAlign: {xs: 'start', md: 'center'}, bgcolor: 'background.default', borderRadius: 3}}>
            <StyledBanner icon={<Info/>} heading={<Typography variant="h6" sx={{display: 'inline-flex', color: 'text.secondary', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, mb: 1}}>{(enrollments && enrollments.length>0)? " Your Enrollments:":"No Enrollment Found."}</Typography>} 
            body={(enrollments && enrollments.length>0)? "Your are enrolled in the following courses.":
              "You have not yet enrolled in a course. Please buy a course first to see it listed here."} />
          </Box>
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
