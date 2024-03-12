import React, {lazy } from 'react'
import {HomeHero, HomeFeature, HomeNewsLetter, HomeOurMentors, HomePopularCourse, HomeTestimonial} from '../home'

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