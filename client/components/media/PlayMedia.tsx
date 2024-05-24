import React, {useState, useEffect, FC} from 'react'
import {Grid, FormControlLabel, Switch, Box, Container, Typography, useMediaQuery} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {read, listRelated} from './api-media'
import {Media, RelatedMedia} from '.'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { MediaSkeleton } from '../skeletons'
import logo from '../../public/logo.svg'

interface PlayMediaProps {
  match: any,
  data: any
}

const PlayMedia: FC<PlayMediaProps>= ({match, data}) => {
  let [media, setMedia] = useState()
  let [relatedMedia, setRelatedMedia] = useState()
  const [autoPlay, setAutoPlay] = useState(false)
  const theme = useTheme()
  const [error, setError] = useState('')
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    let attempts = 1
    const retry = setInterval(()=>{
        read({mediaId: match && match.params && match.params.mediaId}, signal).then((data) => {
          if (data && data.error) {
            if(attempts>=5){ clearInterval(retry)}
            attempts++
            console.log(data.error)
          } else {
            setMedia(data)
            clearInterval(retry)
          }
        })
    }, 1000)
    return function cleanup(){
      abortController.abort()
      clearInterval(retry)
    }
  }, [match && match.params && match.params.mediaId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    let attempts = 1
    const retry = setInterval(()=>{
      listRelated({
        mediaId: match && match.params && match.params.mediaId}, signal).then((data) => {
        if (data && data.error) {
          if(attempts>=5){ clearInterval(retry)}
          attempts++
          console.log(data.error)
          console.log('Retrying, attempt', attempts)
        } else {
          setRelatedMedia(data)
          clearInterval(retry)
        }
      })
    }, 1000)
    return function cleanup(){
      abortController.abort()
    }
  }, [match && match.params && match.params.mediaId])

  const handleChange = (event) => {
   setAutoPlay(event.target.checked)
  }

  const handleAutoplay = (updateMediaControls) => {
    let playList = relatedMedia
    let playMedia = playList[0]
    if(!autoPlay || playList.length == 0 ){
      return updateMediaControls()
    }
    if(playList && playList.length > 1){
      playList.shift()
      setMedia(playMedia)
      setRelatedMedia(playList)
    }else{ /**GET all related media (if any) before playing the last related  media*/
      const abortController = new AbortController()
      const signal = abortController.signal
      listRelated({
          mediaId: playMedia && playMedia._id}, signal).then((data) => {
            if (data.error) {
             console.log(data.error)
            } else {
              setMedia(playMedia)
              setRelatedMedia(data)
            }
         })
    }
  }
  //render SSR data
  if (data && data[0] != null) {
          media = data[0]
          relatedMedia = []
    }

    
    const nextUrl = relatedMedia && relatedMedia.length > 0 ? `/media/${relatedMedia[0]._id}` : ''
    return (
      <WallPaperYGW variant='radial' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
      style={{
        minHeight: '100vh',
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          left: {xs: 'unset', md: '50%'},
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          opacity: 0.5,
        },
        '& > div':{
          position: 'relative'
        }
      }}>
        <Box id="teachers" sx={{zIndex: 1000, pt: {xs: 6,md: 8, }, pb: { xs: 8, md: 12}}}>
          <Container maxWidth="lg" sx={{px:{xs:0, sm: 'unset'}}}>
            <Grid container spacing={smMobileView? 2: 4}>
              <Grid item xs={12} sm={relatedMedia && relatedMedia.length > 0? 8: 12}>
                {media && media.postedBy?
                (<Media media={media} nextUrl={nextUrl} handleAutoplay={handleAutoplay}/>):
                ( <MediaSkeleton />)}
              </Grid>
              <Grid item xs={12} sm={4}>
              {relatedMedia && relatedMedia.length > 0?
              (<>
                <FormControlLabel
                    control={<Switch checked={autoPlay} color='secondary'  onChange={handleChange} />}
                    label={<Typography variant='subtitle1' sx={{fontWeight: 600}}>{autoPlay ? 'Autoplay ON':'Autoplay OFF'}</Typography>}
                  />
                <RelatedMedia media={relatedMedia}/>
                </>):
              (!relatedMedia && Array.from(new Array(1)).map((item, index) => (<MediaSkeleton key={index} />)))
              }
              </Grid>
            </Grid>
          </Container>
        </Box>
      </WallPaperYGW>
      )
  }
export default PlayMedia
