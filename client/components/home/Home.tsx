import React from 'react'
import {HomeSearchedCourses, HomeHero, HomeCookie, HomePricing} from '.'
import { LoadableVisibility } from '../progress'
const HomeFeatureClient = LoadableVisibility(import('./feature-client'));
const HomeFeatureSpecialist = LoadableVisibility(import('./feature-specialist'));
const HomeEnrolledInCourses = LoadableVisibility(import('./enrolled-in-courses'));
const HomeTeachingCourses = LoadableVisibility(import('./teaching-courses'));
const HomeIntroVideo = LoadableVisibility(import('./intro-video'));
const HomeTestimonial = LoadableVisibility(import('./testimonial'));
const HomeOurSpecialists = LoadableVisibility(import('./specialists'));
const HomeNewsLetter = LoadableVisibility(import('./newsletter'));

  export default function Home(){
    return(<>
        <HomeSearchedCourses />
        <HomeHero  />
        <HomePricing />
        <HomeFeatureClient id="features-client" />
        <HomeFeatureSpecialist id="features-specialist" />
        <HomeEnrolledInCourses id="enrolled-in-courses" />
        <HomeTeachingCourses id="teaching-in-courses" />
        <HomeIntroVideo id="intro-video" />
        <HomeTestimonial id="testimonials" />
        <HomeOurSpecialists id="specialists" />
        <HomeNewsLetter id="news-letter"/>
        <HomeCookie  />
    </>)
}