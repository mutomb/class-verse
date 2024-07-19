import React, { ReactNode } from 'react'
import {AttachMoney, SecurityTwoTone, DashboardCustomize, MonetizationOnTwoTone, CloudUploadTwoTone } from '@mui/icons-material'

interface Data {
  title: string
  description: string
  icon?: ReactNode,
  iconStyle?: any
}

export const data: Data[] = [
  {
    title: 'Easy Publishing',
    description: 'Dashboard is user friendly, has Microsoft Word-like Editor and allows you to upload media files. Optional support team assistance.',
    icon: <DashboardCustomize />,
  },
  {
    title: 'No Installation',
    description: 'No installation needed, content is auto-delivered to Clients and all features are available across various device screens.',
    icon: <CloudUploadTwoTone />,
  },
  {
    title: 'Affordable Plans',
    description: 'You only pay $10/month based on your storage requirement, or 5% if transactions is made into our trust account.',
    icon: <AttachMoney />,
  },
  {
    title: 'Easy Payment',
    description: 'We seamlessly integrate with popular payment systems, including Shopify, Paypal and Stripe.',
    icon: <MonetizationOnTwoTone />,
  },
  {
    title: 'Secure Hosting',
    description: 'We promise to keep your courses securely hosted, allowing access to paid lessons only those who bought the course.',
    icon: <SecurityTwoTone />,
  }
]
