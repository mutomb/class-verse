import React from 'react'
import {AboutFAQ, TermsAndConditions, PrivacyAndPolicy, TeamProfile} from '.'
// import {LoadableVisibility } from '../progress'
// const AboutFAQ = LoadableVisibility(import('./FAQ'));

  export default function About(){
    return(
      <>
        <TeamProfile />
        <AboutFAQ />
        <TermsAndConditions />
        <PrivacyAndPolicy/>
        {/* <HomeFeature id="features" /> */}
      </>
    )
}