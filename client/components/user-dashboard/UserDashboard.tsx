import React from 'react'
import {Profile} from '../users'

export default function UserDashboard({match}){
    return(
      <>
        <Profile match={match}/>
      </>
    )
}