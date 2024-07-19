import React from 'react'
import {SpecialistDashBoardOverview, SpecialistDashBoardCourses, SpecialistDashBoardConsult} from '.'

export default function SpecialistDashboard(){
    return(
      <>
        <SpecialistDashBoardOverview />
        <SpecialistDashBoardCourses />
        <SpecialistDashBoardConsult />
      </>
    )
}