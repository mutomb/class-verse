import React from 'react'
import {TeamProfile as AboutTeamProfile, TeamContact as AboutTeamContact} from '.'
import {LoadableVisibility } from '../progress'
const LazyAboutFAQ = LoadableVisibility(import('./FAQ'));
const LazyAboutTermsAndConditions = LoadableVisibility(import('./TermsAndConditions'));
const LazyAboutPrivacyPolicy = LoadableVisibility(import('./PrivacyAndPolicy'));

  export default function About(){
    return(
      <>
        <AboutTeamContact />
        <AboutTeamProfile />
        <LazyAboutFAQ />
        <LazyAboutTermsAndConditions />
        <LazyAboutPrivacyPolicy/>
      </>
    )
}