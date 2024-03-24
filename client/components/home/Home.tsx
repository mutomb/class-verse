import React from 'react'
import {HomeHero, HomeFeature, HomeNewsLetter, HomeOurTeachers, HomePopularCourse, 
  HomeTestimonial, HomeEnrolledInCourses} from '.'

export default function Home(){
    return(
      <>
        <HomeHero />
        <HomeFeature />
        <HomeEnrolledInCourses/>
        <HomePopularCourse />
        <HomeTestimonial />
        <HomeOurTeachers />
        <HomeNewsLetter />
      </>
    )
}