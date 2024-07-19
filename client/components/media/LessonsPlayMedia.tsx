import React, {useState, FC, useEffect} from 'react'
import {Grid, FormControlLabel, Switch, Box, Container, Typography, useMediaQuery} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Media, RelatedMedia} from '.'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import { MediaSkeleton } from '../skeletons'
import logo from '../../public/logo.svg'

interface PlayMediaProps {
  relatedData: any,
  data: any,
  showPlaylist?: (media) => void,
  courseId: string
}

const PlayMedia: FC<PlayMediaProps>= ({data, relatedData, showPlaylist, courseId}) => {
  let [media=data, setMedia] = useState()
  let [relatedMedia=relatedData, setRelatedMedia] = useState()
  const [autoPlay, setAutoPlay] = useState(false)
  const theme = useTheme()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})

  const handleChange = (event) => {
   setAutoPlay(event.target.checked)
  }

  const handleAutoplay = (updateMediaControls) => {
    let playList = relatedMedia
    if(!autoPlay || playList.length == 0 ){
      return updateMediaControls()
    }
    if(playList && playList.length > 0){
      let playMedia = playList.shift()
      playList.push(media)
      setMedia(playMedia)
      setRelatedMedia(playList)
    }
  }
  const handleNext = (updateMediaControls) => {
    let playList = relatedMedia
    if(playList.length == 0 ){
      return updateMediaControls()
    }
    if(playList && playList.length > 0){
      let playMedia = playList.shift()
      playList.push(media)
      setMedia(playMedia)
      setRelatedMedia(playList)
    }
  }
  
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
        <Box id="specialists" sx={{zIndex: 1000, pt: {xs: 6,md: 8, }, pb: { xs: 8, md: 12}}}>
          <Container maxWidth="lg" sx={{px:{xs:0, sm: 'unset'}}}>
            <Grid container spacing={smMobileView? 2: 4}>
              <Grid item xs={12} sm={8}>
                {media && media.postedBy?
                (<Media media={media} handleNext={handleNext} handleAutoplay={handleAutoplay} courseId={courseId}/>):
                ( <MediaSkeleton />)}
              </Grid>
              <Grid item xs={12} sm={4}>
              {relatedMedia && relatedMedia.length > -1?
              (<>
                <FormControlLabel
                    control={<Switch checked={autoPlay} color='secondary'  onChange={handleChange} />}
                    label={<Typography variant='subtitle1' sx={{fontWeight: 600}}>{autoPlay ? 'Autoplay ON':'Autoplay OFF'}</Typography>}
                  />
                <RelatedMedia showPlaylist={showPlaylist} media={relatedMedia}/>
                </>):
              (!relatedMedia && Array.from(new Array(2)).map((item, index) => (<MediaSkeleton key={index} />)))
              }
              </Grid>
            </Grid>
          </Container>
        </Box>
      </WallPaperYGW>
      )
  }
export default PlayMedia
