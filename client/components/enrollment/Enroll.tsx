import React, {FC, useState} from 'react'
import {create} from './api-enrollment'
import {useAuth} from '../auth'
import {Redirect} from 'react-router-dom'
import { LocalLibrary } from '@mui/icons-material'
import { IconButton} from '@mui/material'

interface EnrollProps{
  courseId:string
}
interface ValuesState{
  redirect:Boolean,
  error:string,
  enrollmentId:string
}
const Enroll: FC<EnrollProps> = ({courseId}) =>{
  const [values, setValues] = useState<ValuesState>({
    enrollmentId: '',
    error: '',
    redirect: false
  })
  const {isAuthenticated} = useAuth()
  const clickEnroll = () => {
    create({
      courseId: courseId
    }, {
      token: isAuthenticated().token
    }).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, enrollmentId: data._id, redirect: true})
      }
    })
  }

    if(values.redirect){
        return (<Redirect to={'/client/'+values.enrollmentId}/>)
    }

  return (
    <IconButton onClick={clickEnroll}>
      <LocalLibrary sx={{color: 'secondary.main'}}/>
    </IconButton>
  )
}
export default Enroll;
