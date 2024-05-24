import React, { createContext, FC, ReactNode, useState, useContext } from 'react'
import {signout } from './api-auth'
import cookies from 'cookie'
/**Auth context instance initialized*/
export const AuthContext = createContext({
  isAuthenticated: () => {},  
  authenticate: (jwt, cb) => {}, 
  clearJWT: (cb) => {}, 
  updateUser: (user, cb) => {}, 
  hasCookie: () => {}}) 

export const useAuth = () => useContext(AuthContext) /**Hook encapsulating all auth state and functionalities*/

interface Props {
  children: ReactNode,
  auth?: any
}
/** Pass auth and auth functionalites to children without explicitly passing props */
export const AuthProvider: FC<Props> = ({ children, auth:authProp}) => { 
  
  let [auth=authProp? authProp: false, setAuth] = useState();

  const authenticate = (jwt, cb) => {
    setAuth(jwt);
    if (typeof window !== "undefined"){
      if(hasCookie()) { /** localstorage valid as long as cookie valid*/
        localStorage.setItem('jwt', JSON.stringify(jwt))
      } 
      else{ /** sessionStorage invalid when tab closed*/
        sessionStorage.setItem('jwt', JSON.stringify(jwt))
      } 
    }
    cb()
        
  }

  const hasCookie = () => {
    /** Check cookie during CSR*/
    if(typeof window !== "undefined"){
      let cookie = cookies.parse(document.cookie)
      if(cookie && cookie.token) return cookie.token
    }
    return false
  }

  const isAuthenticated = () => {
    /** if authenticated during SSR*/      
    if (typeof window === "undefined" && auth) return auth
    /** if authenticated during CSR*/
    if (typeof window !== "undefined"){      
      /** find auth in context*/
      if(auth && auth.token && auth.user) return auth
      /** find auth in sessionStorage*/
      let session = JSON.parse(sessionStorage.getItem('jwt')!) || JSON.parse(localStorage.getItem('jwt')!) 
      if (session && session.token && session.user) {
        return session
      }
    }
    return false
  }
  
  const clearJWT = (cb) => {
    setAuth(false) 
    if (typeof window !== "undefined"){
      sessionStorage.removeItem('jwt')
      localStorage.removeItem('jwt')
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    //optional
    signout()
    cb()
  }

  const updateUser = (user, cb) => {
    setAuth({...auth, user: user}); 
    //optionally set session
    if(typeof window !== "undefined" && localStorage.getItem('jwt')){
        let auth = JSON.parse(localStorage.getItem('jwt')!)
        auth.user = user
        localStorage.setItem('jwt', JSON.stringify(auth))
    };
    cb()}
  
  return (
  <AuthContext.Provider value={{isAuthenticated, authenticate, clearJWT, updateUser, hasCookie}}>
    {children}
  </AuthContext.Provider>
  )
}
