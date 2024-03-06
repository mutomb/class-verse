import createCache from '@emotion/cache';
// Emotion cache instance to extract the critical styles for the html.
/*The prepend option to createCache give priority of to prevent custom cache from overriding the emotion cache provided by Material UI.*/
export default function createEmotionCache() {
  return createCache({ key: 'css', prepend:true });
}
