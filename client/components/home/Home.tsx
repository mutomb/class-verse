import React from 'react'
import {HomeSearchedCourses, HomeHero, HomeCookie} from '.'
// import {HomeSearchedCourses, HomeHero, HomeFeature, HomeEnrolledInCourses, HomeTeachingCourses, HomePopularCourse,
//   HomeTestimonial, HomeOurTeachers, HomeNewsLetter, HomeCookie, HomeIntroVideo} from '.'
import {LoadableVisibility } from '../progress'
// const HomeSearchedCourses = LoadableVisibility(import('./searched-courses'));
// const HomeHero = LoadableVisibility(import('./hero'));
const HomeFeature = LoadableVisibility(import('./feature'));
const HomeEnrolledInCourses = LoadableVisibility(import('./enrolled-in-courses'));
const HomeTeachingCourses = LoadableVisibility(import('./teaching-courses'));
const HomePopularCourse = LoadableVisibility(import('./popular-courses'));
const HomeIntroVideo = LoadableVisibility(import('./intro-video'));
const HomeTestimonial = LoadableVisibility(import('./testimonial'));
const HomeOurTeachers = LoadableVisibility(import('./teachers'));
const HomeNewsLetter = LoadableVisibility(import('./newsletter'));
// const HomeCookie = LoadableVisibility(import('./Cookie'));

  export default function Home(){
    return(
      <>
        <HomeSearchedCourses />
        <HomeHero  />
        <HomeFeature id="features" />
        <HomeEnrolledInCourses id="enrolled-in-courses" />
        <HomeTeachingCourses id="teaching-in-courses" />
        <HomePopularCourse  id="popular-courses"/>
        <HomeIntroVideo id="intro-video" />
        <HomeTestimonial id="testimonials" />
        <HomeOurTeachers id="teachers" />
        <HomeNewsLetter id="news-letter"/>
        <HomeCookie  />
      </>
    )
}