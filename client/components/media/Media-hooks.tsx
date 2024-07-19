import React, { createContext, FC, ReactNode, useState, useContext } from 'react'
export const MediaContext = createContext({
  media: {}, 
  setMedia:  (arg: any) => {},
  relatedMedia: [], 
  setRelatedMedia:  (arg: any) => {}  
}) 

export const useMedia = () => useContext(MediaContext) 

interface Props {
  children: ReactNode,
}

export const MediaProvider: FC<Props> = ({ children }) => { 
  
  let [media,  setMedia] = useState({});
  let [relatedMedia,  setRelatedMedia] = useState([]);

  return (
  <MediaContext.Provider value={{media, setMedia, relatedMedia, setRelatedMedia}}>
    {children}
  </MediaContext.Provider>
  )
}
