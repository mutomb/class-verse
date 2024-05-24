import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import {useAuth} from '.'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const {isAuthenticated} = useAuth()
  return (
  <Route {...rest} render={props => (
      isAuthenticated().user? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }}/>
    )
  )}/>
)}

export default PrivateRoute
