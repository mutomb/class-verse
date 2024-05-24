import React, { FC, ReactNode } from 'react'
import { EmotionCache, CacheProvider as Provider } from '@emotion/react';

interface Props {
  children: ReactNode,
  value: EmotionCache
}

const CacheProvider: FC<Props> = ({ children, value }) => {
  return <Provider value={value}>{children}</Provider>
}
export default CacheProvider

