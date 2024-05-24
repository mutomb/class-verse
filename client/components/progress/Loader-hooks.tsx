import React, { createContext, FC, ReactNode, useState, useContext } from 'react'

export const LoadingContext = createContext({isLoading:()=>{}, startLoading:()=>{}, stopLoading:()=>{}}) /**Loading context instance initialized*/

export const useLoading = () => useContext(LoadingContext) /**Hook encapsulating all loading state and functionalities*/

interface Props {
  children: ReactNode,
}
/** Pass loading and loading functionalites to children without explicitly passing props */
export const LoadingProvider: FC<Props> = ({children}) => { 
  
  let [loading, setLoading] = useState(false);
  const isLoading = () => loading
  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  return (
  <LoadingContext.Provider value={{isLoading, startLoading, stopLoading}}>
    {children}
  </LoadingContext.Provider>
  )
}
