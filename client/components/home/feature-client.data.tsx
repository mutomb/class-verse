import React, { ReactNode } from 'react'
import {ArtTrack, AttachMoney, LocalLibrary, ContactSupport, VerifiedUser, VerifiedTwoTone, CloudUploadTwoTone } from '@mui/icons-material'
import CertificateIcon from "../../public/images/icons/certificate.png"
import { Box } from '@mui/material'

interface Data {
  title: string
  description: string
  icon?: ReactNode,
  iconStyle?: any
}

export const data: Data[] = [
  {
    title: 'Verified Courses',
    description: 'We scrutinize all course content and only approved courses are published.',
    icon: <VerifiedTwoTone />,
  },
  {
    title: 'Verified Specialist',
    description: 'We conduct a background check on all condidates bofore they can sell courses or consulation services.',
    icon: <VerifiedUser />,
  },
  {
    title: 'Verifiable Certificate',
    description: 'Unlock a unique certificate upon course completing, that employers can verify.',
    icon: <Box component='img' src={CertificateIcon}  sx={{width:'100%', height:'auto'}} />,
    iconStyle: {backgroundColor: 'unset'}
  },
  {
    title: 'No Installations',
    description: 'No installation needed and all features are available on a mobile device, computer and smart TV.',
    icon: <CloudUploadTwoTone />,
  },
  {
    title: 'Affordable Plans',
    description: 'We understand you have a budget, so we offer a variety of plans to fit it, capped at $10 maximum per service, and offer a free plan.',
    icon: <AttachMoney />,
  },
  {
    title: 'Smooth Experience',
    description: 'Course consist of easy-to-digest set of lessons, self-paced progress dashboard, and consultation assistance.',
    icon: <LocalLibrary />,
  }
]
