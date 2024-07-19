import React, { createContext, FC, ReactNode, useState, useContext } from 'react'
export const CourseContext = createContext({
  course: {}, 
  setCourse:  (arg: any) => {} 
}) 

export const useCourse = () => useContext(CourseContext) 

interface Props {
  children: ReactNode,
}

export const CourseProvider: FC<Props> = ({ children }) => { 
  
  let [course,  setCourse] = useState({});
  return (
  <CourseContext.Provider value={{course, setCourse}}>
    {children}
  </CourseContext.Provider>
  )
}
