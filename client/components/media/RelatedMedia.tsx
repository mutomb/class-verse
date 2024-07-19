import React, { FC, useTransition } from 'react'
import {Paper, Typography, Box, ImageList, ImageListItem, ImageListItemBar, IconButton, iconButtonClasses, Divider, useMediaQuery} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {Link} from 'react-router-dom'
import ReactPlayer from 'react-player'
import { PlayArrow, Visibility } from '@mui/icons-material'


interface RelatedMediaProps {
  media: any
  showPlaylist?: (media)=>void
}
const RelatedMedia: FC<RelatedMediaProps> = ({media, showPlaylist}) =>{
    const theme = useTheme()
    const matchMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches:true})
    const [isPending, startTransition] = useTransition()
    return (
      <Paper elevation={4} sx={{ width: '100%',  backgroundColor: 'background.paper', borderRadius: {xs: 2, md: 4}, py: 4, px: {xs: 1, md: 2} }}>
        <Typography variant="h2" component="h2" sx={{fontWeight: 600, color: 'text.secondary'}}>
          Up Next
        </Typography>
        <ImageList cols={1} sx={{ maxHeight: {xs: 300 , sm: 400, md: '60vh'}, overflowY: 'scroll', width: '100%'}}>
        {media && media.map((item, i) => {
          return (
          <Box key={i} sx={{ px: {xs: 0, sm: 1.5} }} >
            <ImageListItem 
              component={Paper} elevation={24}
              sx={{
                py: 2,
                backgroundColor: 'background.paper',
                boxShadow: theme.shadows[2],
                borderRadius: 4,
                [`& .${iconButtonClasses.root}`]: {
                  backgroundColor: 'primary.contrastText',
                  color: 'primary.main',
                },
                transform: 'unset',
                '&:hover': {
                  [`& .${iconButtonClasses.root}`]: {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    boxShadow: 2,
                  },
                  boxShadow: theme.shadows[5],
                  transform: 'translateY(-3px) scale(1.1)',
                  transition: (theme) => theme.transitions.create(['box-shadow, transform'], {duration: 500}),
                },
              }}>
              {!showPlaylist?(<Link to={"/media/"+item._id} style={{textDecoration: 'none'}}>
                <ReactPlayer url={'/api/media/video/'+item._id} width='100%' height='inherit' style={{maxHeight: '100%'}}
                  ref={ /**Get video preview at 5s or 10% of duration*/
                  (player) => {
                    startTransition(()=>{
                      let duration = player?.getDuration()
                      player && duration && duration>5 && player.seekTo && player.seekTo(4, 'seconds')
                      player && duration && duration>0 && duration<=5 && player.seekTo && player.seekTo(duration*0.1, 'fraction')                
                    })
                  }}/>
              </Link>):(
                <Box component='span' onClick={()=>showPlaylist(item)}>
                  <ReactPlayer url={'/api/media/video/'+item._id} width='100%' height='inherit' style={{maxHeight: '100%'}}
                  ref={ /**Get video preview at 5s or 10% of duration*/
                  (player) => {
                    startTransition(()=>{
                      let duration = player?.getDuration()
                      player && duration && duration>5 && player.seekTo && player.seekTo(4, 'seconds')
                      player && duration && duration>0 && duration<=5 && player.seekTo && player.seekTo(duration*0.1, 'fraction')                
                    })
                  }}/>
                </Box>
              )}
              <ImageListItemBar
                  sx={{
                    backgroundColor: 'background.paper',
                    borderBottomLeftRadius: {xs: 2, md: 4},
                    borderBottomRightRadius: {xs: 2, md: 4},
                    py: 0,
                  }}
                  title={
                    <Link to={'/media/'+item._id} 
                      style={{
                        fontSize:'1.1rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        color: 'initial'
                      }}>
                      <Box sx={{color: 'initial'}}>
                      {item.title}
                      </Box> 
                    </Link>
                  }
                  subtitle={
                    <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column'}}>
                        <Box component='span'>
                          <Box component='em'>{item.genre}</Box>
                        </Box>
                        <Box component='span'>
                          <Box component='em'>{(new Date(item.created)).toDateString()}</Box>
                        </Box>
                    </Box>
                  }
                  actionIcon={
                  <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'column', mr: {xs: 1, md: 3}}}>
                    <Link to={"/media/"+item._id} style={{textDecoration: 'none', color: 'inherit'}}>
                      <IconButton aria-label={`Play ${item.title}`}>
                        <PlayArrow />
                      </IconButton>
                    </Link>
                    <Typography component='em' variant='subtitle1' sx={{fontSize: '0.7rem'}}>
                      {item.views}<Visibility sx={{verticalAlign: 'middle', width: 15, ml: 1,}}/>
                    </Typography>
                  </Box>
                  }
                />
            </ImageListItem>
            <Divider sx={{ height: 28, my: 0.5}}/>
          </Box>
          )
        })}
        </ImageList>
      </Paper>
    )
  }
export default RelatedMedia