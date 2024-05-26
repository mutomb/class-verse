import React, {useState, useEffect, useRef, FC} from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import {Box, IconButton, LinearProgress, MenuItem, Slider, Fade, linearProgressClasses, paperClasses, sliderClasses, useMediaQuery, iconButtonClasses} from '@mui/material'
import {PlayArrow, Replay, Pause, SkipNext, VolumeUp, VolumeOff, VolumeMute, Loop, Fullscreen} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import {useTheme} from '@mui/material/styles'
import { MoreMenuVertButton } from '../styled-buttons'
interface MediaPlayerProps {
  srcUrl: string,
  nextUrl?: string,
  handleAutoplay?: (cb)=>void,
  handleNext?: (cb) => void
}

const MediaPlayer: FC<MediaPlayerProps> = ({srcUrl, nextUrl, handleAutoplay, handleNext}) => {
  const theme = useTheme();
  const matchMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)      
  const [muted, setMuted] = useState(false)     
  const [duration, setDuration] = useState(0)  
  const [seeking, setSeeking] = useState(false)    
  const [playbackRate, setPlaybackRate] = useState(1.0)     
  const [loop, setLoop] = useState(false)      
  const [fullscreen, setFullscreen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [widget, setWidget] = useState(true) 
  let playerRef = useRef(null)
  let playerWidgetRef = useRef(null)
  const ref = player => {
    playerRef = player
  }
  const widgetRef = player => {
    playerWidgetRef = player
  }
  const [values, setValues] = useState({
    played: 0, loaded: 0, ended: false
  })
  
  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        let fullscreen = screenfull.isFullscreen ? true : false
        setFullscreen(fullscreen)
      })
    }
  }, [])

  useEffect(() => {
    setVideoError(false)
  }, [srcUrl])
  const changeVolume = value => {
    setVolume(parseFloat(value/100))
  }
  const toggleMuted = () => {
    setMuted(!muted)
  }
  const playPause = () => {
    setPlaying(!playing)
    if(values.ended) setValues({...values, ended: false}) 
  }
  const onLoop = () => {
    setLoop(!loop)
  }
  const onProgress = progress => {
    // Only update time slider if user is not currently seeking
    if (!seeking) {
      setValues({...values, played:progress.played, loaded: progress.loaded})
    }
  }
  const onClickFullscreen = () => {
  screenfull.isFullscreen? screenfull.exit() : screenfull.request(findDOMNode(playerWidgetRef))
  }
  const onEnded = () => {
    if(loop){
      setPlaying(true)
    } else{
      if(handleAutoplay) {
        handleAutoplay(()=>{
          setValues({...values, ended:true}) 
          setPlaying(false)
        })
      }else{
        setValues({...values, ended:true}) 
        setPlaying(false)
      }
    }
  }
  const onDuration = (duration) => {
    setDuration(duration)
  }
  const onSeekMouseDown = event => {
    setSeeking(true)
  }
  const onSeekChange = value => {
    setValues({...values, played:parseFloat(value/100), ended: parseFloat(value/100) >= 1})
    playerRef && playerRef.seekTo(parseFloat(value/100))
    if(parseFloat(value/100) >= 1) setSeeking(false)
  }
  const onSeekMouseUp = event => {
    setSeeking(false)
    // playerRef && playerRef.seekTo(parseFloat(event.target.value))
  }
  const format = (seconds) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    let mm = date.getUTCMinutes()
    const ss = ('0' + date.getUTCSeconds()).slice(-2)
    if (hh) {
      mm = ('0' + date.getUTCMinutes()).slice(-2)
      return `${hh}:${mm}:${ss}`
    }
    return `${mm}:${ss}`
  }
  const showVideoError = event => {
    setVideoError(true)
  }
  const handleSkip = () => {
    if(handleNext) {
      handleNext(()=>{
        setValues({...values, ended:true}) 
        setPlaying(false)
      })
    }
  }
  const showWidget = () => {
    setWidget(true)
  }
  const hideWidget = () => {
    setWidget(false)
  }

  return (<>
  <Box sx={{width: '100%', position: 'relative'}} ref={widgetRef}>
    {videoError && (<Box component='p' sx={{ width: '100%', textAlign: 'center', color: 'red'}}>Video Error. Try again later.</Box>)}
    <Fade id="slide-widget" onMouseEnter={showWidget} onMouseLeave={hideWidget} timeout={500} appear={true} in={widget} color='inherit'>
      <Box component={'div'} id="play-overlay-button"
        onClick={playPause} onMouseEnter={fullscreen? ()=>{}:showWidget} onTouchStart={fullscreen? ()=>{}:showWidget} 
        onMouseLeave={fullscreen? ()=>{}:hideWidget} onTouchEnd={fullscreen? hideWidget:()=>{}} 
        onMouseMove={fullscreen? showWidget:()=>{}} 
        onMouseUp={fullscreen? hideWidget:()=>{}} 
        sx={{zIndex: 1, position: 'absolute', top: 0, right: 0, width: '100%', height: '90%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)',
      }}>
        {playing?
        <Pause sx={{color: 'primary.main', opacity: 0.4, width: {xs: 50, sm: 100, md: 200}, height: {xs: 50, sm: 100, md: 200}, boxShadow: 2}}/>
        :<PlayArrow sx={{color: 'primary.main', opacity: 0.4, width: {xs: 50, sm: 100, md: 200}, height: {xs: 50, sm: 100, md: 200}, boxShadow: 2}}/>}
      </Box>
    </Fade>
    <Box onClick={playPause} onMouseEnter={fullscreen? ()=>{}:showWidget} onTouchStart={fullscreen? ()=>{}:showWidget} 
    onMouseLeave={fullscreen? ()=>{}:hideWidget} onTouchEnd={fullscreen? hideWidget:()=>{}} 
    onMouseMove={fullscreen? showWidget:()=>{}} 
    onMouseUp={fullscreen? hideWidget:()=>{}} component='div'  sx={{width: '100%', display: 'flex'}}>
      <ReactPlayer
        ref={ref}
        width={'100%'}
        height={fullscreen?'100vh':'inherit'}
        // height={fullscreen ? 'inherit':'inherit'}
        // style={fullscreen ? {position:'relative', height: '80%'} : {maxHeight: '500px'}}
        url={srcUrl}
        playing={playing}
        loop={loop}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onEnded={onEnded}
        onError={showVideoError}
        onProgress={onProgress}
        onDuration={onDuration}
        />
        <br/>
    </Box>
    <Fade id="slide-widget" onMouseEnter={showWidget} onMouseLeave={hideWidget} timeout={500} appear={true} in={widget} color='inherit'>
      <Box sx={{position: 'relative', bgcolor: 'background.default', ...(fullscreen && {position: 'absolute', bottom:10, width: '100%', bgcolor: 'rgba(0, 0, 0, 0.5)'}), 
        [`& .${linearProgressClasses.bar1Buffer}`]:{bgcolor: 'primary.main'},
        [`& .${linearProgressClasses.bar2Buffer}`]:{bgcolor: 'secondary.main'},
        [`& .${linearProgressClasses.dashed}`]:{bgcolor: 'red'},
        [`& .${sliderClasses.root}`]:{py: 0},
        }}>
        <Box id='progress-bar'>
          <LinearProgress  variant="buffer" value={values.played*100} valueBuffer={values.loaded*100} 
          sx={{width: '100%', position: 'absolute', top: 0}}/>
          <Slider
              aria-label="duration-input-range"
              size="small"
              value={values.played*100}
              min={0}
              // step={1}
              max={100}
              onMouseDown={onSeekMouseDown}
              onChange={(_, value) => onSeekChange(value as number)}
              onMouseUp={onSeekMouseUp}
              sx={{
                verticalAlign: 'middle',
                position: 'absolute',
                width: '100%',
                top: 0,
                zIndex: 1099,
                height: 4,
                '-webkit-appearance': 'none',
                backgroundColor: 'rgba(0,0,0,0)', 
                [`& .${sliderClasses.rail}`]: {
                  opacity: 0,
                },
                [`& .${sliderClasses.track}`]: {
                  opacity: 0,
                },
                [`& .${sliderClasses.thumb}`]: {
                  color: 'primary.main',
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&::before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: 5
                  },
                  '&.Mui-active': {
                    width: 20,
                    height: 20,
                  },
                },
              }}
            />
        </Box>
        <Box id='widget' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap-reverse'}}>
          <Box id='widgetbuttons' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <IconButton sx={{color: 'primary.main', '& > svg':{width: {xs: 16, md: 24}, height: 'auto'}}} onClick={playPause}>
            {playing ? <Pause/>: (values.ended ? <Replay/> : <PlayArrow />)}
          </IconButton>
          {!handleNext? 
            nextUrl?(
              <Link to={nextUrl} style={{color: 'inherit', textDecoration: 'none', verticalAlign: 'middle'}}>
                <IconButton disabled={!nextUrl} sx={{color: 'primary.main'}}>
                  <SkipNext sx={{'& > svg':{width: {xs: 16, md: 24}, height: 'auto'}}}/>
                </IconButton>
              </Link>):
              (<IconButton disabled={!nextUrl} sx={{color: 'primary.main'}}>
                  <SkipNext sx={{'& > svg':{width: {xs: 16, md: 24}, height: 'auto'}}}/>
                </IconButton>): 
          (<IconButton onClick={handleSkip} sx={{color: 'primary.main'}}>
              <SkipNext sx={{'& > svg':{width: {xs: 16, md: 24}, height: 'auto'}}}/>
            </IconButton>)
          }
          {matchMobileView? (
          <MoreMenuVertButton
            transformOrigin={{vertical: 200, horizontal: 2}} 
            icon={
              <Box component='span' sx={{color: 'primary.main', '& > svg':{width: {xs: 16, md: 24}, height: 'auto'}}} onClick={toggleMuted}>
                {volume > 0 && !muted && <VolumeUp /> || muted && <VolumeOff /> || volume==0 && <VolumeMute />}
              </Box>
            } 
            style={{[`& .${paperClasses.root}`]: {bgcolor: 'rgba(0,0,0,0)', p:0}}}>
            <MenuItem sx={{height: 200, backgroundColor: 'rgba(0,0,0,0)', width: '100%', p: 0}}>
              <Slider
                orientation="vertical"
                aria-label="volume-input-range"
                size="small"
                value={muted? 0: volume*100}
                min={0}
                // step={1}
                max={100}
                onChange={(_, value) => changeVolume(value as number)}
                sx={{
                backgroundColor: 'rgba(0,0,0,0)',
                '-webkit-appearance': 'none',
                verticalAlign: 'middle',
                width: 6,
                [`& .${sliderClasses.rail}`]: {
                  opacity: 0.3,
                  color: 'primary.main'
                },
                [`& .${sliderClasses.track}`]: {
                  color: 'primary.main'
                },
                [`& .${sliderClasses.thumb}`]: {
                  color: 'primary.main',
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&::before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: 5
                  },
                  '&.Mui-active': {
                    width: 20,
                    height: 20,
                  },
                },
                '& > svg':{width: {xs: 16, md: 24}, height: 'auto'}
                }}
              />
            </MenuItem>
          </MoreMenuVertButton>):
          (<>
          <IconButton sx={{color: 'primary.main', '& > svg':{width: {xs: 16, md: 24}, height: 'auto'}}} onClick={toggleMuted}>
            {volume > 0 && !muted && <VolumeUp /> || muted && <VolumeOff /> || volume==0 && <VolumeMute />}
          </IconButton>
          <Slider
              aria-label="volume-input-range"
              size="small"
              value={muted? 0: volume*100}
              min={0}
              // step={1}
              max={100}
              onChange={(_, value) => changeVolume(value as number)}
              sx={{
                width: 200,
                '-webkit-appearance': 'none',
                backgroundColor: 'rgba(0,0,0,0)',
                height: 6,
                verticalAlign: 'middle', 
                [`& .${sliderClasses.rail}`]: {
                  opacity: 0.3,
                  color: 'primary.main'
                },
                [`& .${sliderClasses.track}`]: {
                  color: 'primary.main'
                },
                [`& .${sliderClasses.thumb}`]: {
                  color: 'primary.main',
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&::before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: 5
                  },
                  '&.Mui-active': {
                    width: 20,
                    height: 20,
                  },
                },
              }}
            />
          </>)}
          <IconButton sx={{color: loop? 'primary.main': 'text.disabled'}} onClick={onLoop}>
            <Loop sx={{width: {xs: 16, md: 24}, height: 'auto'}}/>
          </IconButton>
          <IconButton sx={{color: 'primary.main'}} onClick={onClickFullscreen}>
            <Fullscreen sx={{width: {xs: 16, md: 24}, height: 'auto'}} />
          </IconButton>
          </Box>
          <Box id='widget-duration' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: {xs: '0.7rem' ,sm:'1rem'}, color: 'primary.main'}}>
            <Box component='time' dateTime={`P${Math.round(duration * values.played)}S`}>
              {format(duration * values.played)}
            </Box> / 
            <Box component='time' dateTime={`P${Math.round(duration)}S`}>
              {format(duration)}
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade>
  </Box>
  </>)
}
export default MediaPlayer