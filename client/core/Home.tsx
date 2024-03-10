import React, {lazy } from 'react'
import {HomeHero, HomeFeature, HomeNewsLetter, HomeOurMentors, HomePopularCourse, HomeTestimonial} from '../components/home'

export default function Home(){
    return(
      <>
        <HomeHero />
        <HomeFeature />
        <HomePopularCourse />
        <HomeTestimonial />
        <HomeOurMentors />
        <HomeNewsLetter />
      </>
    )
}