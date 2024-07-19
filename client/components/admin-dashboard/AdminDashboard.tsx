import React from 'react'
import {AdminDashBoardOverview, AdminDashBoardPendingCourses, AdminDashBoardPendingUsers} from '.'

export default function AdminDashboard(){
    return(
      <>
        <AdminDashBoardOverview />
        <AdminDashBoardPendingCourses />
        <AdminDashBoardPendingUsers />
      </>
    )
}