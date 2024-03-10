import React, { FC, ReactNode } from 'react'
import { EmotionCache, CacheProvider as Provider } from '@emotion/react';

interface Props {
  children: ReactNode,
  value: EmotionCache
}

export const CacheProvider: FC<Props> = ({ children, value }) => {
  return <Provider value={value}>{children}</Provider>
}

