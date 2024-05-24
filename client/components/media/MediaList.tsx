import React, { FC, useTransition } from 'react'
import {ImageList, ImageListItem, ImageListItemBar, Box, IconButton, iconButtonClasses, useMediaQuery, Paper} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Link} from 'react-router-dom'
import ReactPlayer from 'react-player'
import { PlayArrow, Visibility } from '@mui/icons-material'

interface MediaListProps {
  media: any,
  cols?: number
}
const MediaList: FC<MediaListProps> = ({media, cols}) => {
  const theme= useTheme()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm')) 
  const [pending, startTransition ] = useTransition()

  return (
    <Box id='medialist' sx={{width: '100%'}}>
      <ImageList cols={cols? cols: xsMobileView? 1: smMobileView? 2: 3} sx={{ width: '100%', height: '100%' }}>
        {media && media.map((tile, i) => (
        <Box key={i} sx={{ px: {xs: 0, sm: 1.5}, py: 5, }} >
        <ImageListItem 
          component={Paper} elevation={24}
          sx={{
            py: 2,
            backgroundColor: 'background.paper',
            boxShadow: theme.shadows[5],
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
              boxShadow: theme.shadows[10],
              transform: 'translateY(-3px)',
              transition: (theme) => theme.transitions.create(['box-shadow, transform'], {duration: 1000}),
            },
          }}>
          <Link to={"/media/"+tile._id} style={{textDecoration: 'none'}}>
            <ReactPlayer  url={'/api/media/video/'+tile._id} width='100%' height='inherit' style={{maxHeight: '100%'}}
            ref={ /**Get video preview at 5s or 10% of duration*/
            (player) => {
              startTransition(()=>{
                let duration = player?.getDuration()
                player && duration && duration>0 && duration<=5 && player.seekTo && player.seekTo(duration*0.1, 'fraction')
                player && duration && duration>5 && player.seekTo && player.seekTo(100, 'seconds')                
              })
            }} 
           />
          </Link>
          <ImageListItemBar
            sx={{
              backgroundColor: 'background.paper',
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              py: 2,
            }}
            title={
              <Link to={"/media/"+tile._id} 
                style={{
                  fontSize:'1.1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: 'initial'
                }}>
                <Box sx={{color: 'initial'}}>
                {tile.title}
                </Box> 
              </Link>
            }
            subtitle={
              <Box component='span' sx={{color: 'text.disabled'}}>
                <Box component='span'><Visibility sx={{verticalAlign: 'middle', width: 20}}/>{tile.views} views</Box>
                <Box component='span' sx={{float: 'right', mr: 1}}>
                  <Box component='em'>{tile.genre}</Box>
                </Box>
              </Box>
            }
            actionIcon={
              <Link to={"/media/"+tile._id} style={{textDecoration: 'none', color: 'inherit'}}>
                <IconButton
                  aria-label={`Play ${tile.title}`}
                  sx={{mr: {xs: 1, md: 3}}}
                >
                  <PlayArrow />
                </IconButton>
              </Link>
            }
          />
        </ImageListItem>
        </Box>
        ))}
      </ImageList>
    </Box>)
}
export default MediaList