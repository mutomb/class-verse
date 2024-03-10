import createCache, { EmotionCache } from '@emotion/cache'
/* 
-Emotion cache instance to extract the critical styles for the html.
-key prefix all emotion classes with "css"
-prepend: true moves MUI styles to the top of the <head> so they're loaded first, 
  to easily override MUI styles with other styling solutions, like CSS modules.
*/
export default function createEmotionCache(): EmotionCache {
  return createCache({ key: 'css', prepend: true})
}

