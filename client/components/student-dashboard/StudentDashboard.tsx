import React from 'react'
import {StudentDashBoardCourses, StudentDashBoardOverview} from '.'

export default function StudentDashboard(){
    return(
      <>
        <StudentDashBoardOverview />
        <StudentDashBoardCourses />
      </>
    )
}