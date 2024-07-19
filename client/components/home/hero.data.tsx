import React, { ReactNode } from 'react'
import {ArtTrack, AttachMoney, LocalLibrary, ContactSupport, PieChartTwoTone } from '@mui/icons-material'
import {Typography } from '@mui/material'

interface Data {
  title: ReactNode | string
  description: {li:  ReactNode | string}[]
  icon?: ReactNode,
  iconStyle?: any
}

export const data: Data[] = [
  {
    title:<>What is GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> ?</>,
    description: [
      {li:'Allows Clients to buy software engineering / development courses and consult Specialists.'},
      {li:'Specialist and their courses are verified.'},
      {li:'Provides seamlessly integrated payment system.'},
    ],
    icon: <ArtTrack />,
  },
  {
    title: 'Who is Client or Specialist ?',
    description: [
      {li: 'Specialist is a expert software engineer keen to sell their courses or/and consulation service.'},
      {li: 'Client is anyone looking for verified software engineering courses, smooth learning and upskilling experience.'}
    ],
    icon: <LocalLibrary />,
  },
  {
    title: <>Who uses GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> ?</>,
    description: [
      {li: 'People keen on upskilling in software engineering.'},
      {li: 'People looking for verified, value-for-money courses, and experts to assist in learning.'},
      {li: 'Qualified software engineers keen on selling their courses or/and consultation service.'},
    ],
    icon: <PieChartTwoTone />,
  },
  {
    title: <>How much is GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> ?</>,
    description: [
      {li: 'Client only pay a once-off fee for the course or an hourly fee for training consulation. These do not exceed $10/month or $10/hour, respectively.'},
      {li: 'Specialist only pay $10/month for paid courses or 5% for EFT fee if payment is made into our trust account.'},
    ],
    icon: <AttachMoney />,
  },
]
