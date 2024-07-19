import React from 'react'
import {ClientDashBoardConsult, ClientDashBoardCourses, ClientDashBoardOverview} from '.'

export default function ClientDashboard(){
    return(
      <>
        <ClientDashBoardOverview />
        <ClientDashBoardCourses />
        <ClientDashBoardConsult />
      </>
    )
}