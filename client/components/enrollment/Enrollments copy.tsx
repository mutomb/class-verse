import React, { FC } from 'react'
import { makeStyles } from '@mui/styles'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import CompletedIcon from '@mui/icons-material/VerifiedUser'
import InProgressIcon from '@mui/icons-material/DonutLarge'
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  container: {
    minWidth: '100%',
    paddingBottom: '14px'
  },
  gridList: {
    width: '100%',
    minHeight: 100,
    padding: '12px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    textAlign: 'left'
  },
  tileTitle: {
    fontSize:'1.1em',
    marginBottom:'5px',
    color:'#fffde7',
    display:'block'
  },
  action:{
    margin: '0 10px'
  },
  progress:{
    color: '#b4f8b4'
  }
}))
interface EnrollmentsProps{
  enrollments:Array<any>
}
const Enrollments: FC<EnrollmentsProps> = ({enrollments:enrollments}) =>{
  const classes = useStyles()
    return (
      <div>
        <ImageList rowHeight={120} className={classes.gridList} cols={4}>
          {enrollments.map((course, i) => (
            <ImageListItem key={i} className={classes.tile}>
              <Link underline="hover" to={"/learn/"+course._id}><img className={classes.image} src={'/api/courses/photo/'+course.course._id} alt={course.course.name} /></Link>
              <ImageListItemBar className={classes.tileBar}
                title={<Link underline="hover" to={"/learn/"+course._id} className={classes.tileTitle}>{course.course.name}</Link>}
                actionIcon={<div className={classes.action}>
                 {course.completed ? (<CompletedIcon color="secondary"/>)
                 : (<InProgressIcon className={classes.progress} />)
                }</div>}
              />
            </ImageListItem>
          ))}
        </ImageList>
    </div>
    )
}
export default Enrollments;
