import React, {FC, useEffect}  from 'react'
import {Card, CardHeader, Typography, List, ListItem, ListItemAvatar, ListItemText, Divider, 
  Link as MuiLink, cardHeaderClasses, Box, listItemClasses, MenuItem} from '@mui/material'
import {Edit, Visibility, CommentRounded} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import { scroller } from 'react-scroll'
import { useTheme } from '@mui/material/styles'
import { MoreMenuVertButton, ProfilePicButton } from '../styled-buttons'
import { useAuth } from '../auth'
import {DeleteMedia, MediaPlayer} from '.'

interface MediaProps {
  media: any,
  nextUrl?: string,
  handleNext?: (cb) => void,
  handleAutoplay?: (cb) => void,
  variant?: 'full'| 'simple',
  style?: any
  courseId?: string,
}

const Media: FC<MediaProps> = ({media, nextUrl, handleAutoplay, variant, style, handleNext, courseId}) => {
  const theme = useTheme()
  const {isAuthenticated} = useAuth()
  const mediaUrl = media._id? `/api/media/video/${media._id}`: null
  
  useEffect(() => {
    scroller.scrollTo('media', {
      duration: 1500,
      delay: 100,
      smooth: true,
      offset: -10
    })
    
  }, [])

  return (
    <Card id='media' sx={{width: '100%', px: {xs: 0, sm:2}, py: 1.5, borderRadius: 4, display: 'flex', 
      flexDirection: 'column', alignItems: 'center', bgcolor:'background.paper',
      [`& .${cardHeaderClasses.content}`]:{flex: {xs: 1, md: 1.7}},
      [`& .${cardHeaderClasses.title}`]:{fontSize: { xs: '1.5rem', sm: '2.5rem' }, textAlign: 'start'}, 
      [`& .${cardHeaderClasses.subheader}`]:{textAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'},
      [`& .${cardHeaderClasses.action}`]:{flex: {xs: 1, md: 0.3}, width: '100%'},
      ...style
      }}>
      <CardHeader 
        id="media-header"
        sx={{witdth: '100%',px: 0, display: 'flex', flexDirection: {xs:'column', md: 'row'}, justifyContent: 'center', alignItems: 'center', width: '100%'}}
        title={media && media.title}
        subheader={
              <Link to={media && media.postedBy && "/user/"+media.postedBy._id} style={{textDecoration: 'none' }}>
                  <MuiLink variant='subtitle1' component='span' underline='none'
                    sx={{backgroundColor: 'primary.dark', textAlign: 'center', display: 'inline-block', 
                      color: 'primary.contrastText',  my: 1, mx: 0, px: 1, borderRadius: 1}}>
                    {media && media.genre}
                  </MuiLink>     
              </Link>
              }
        action={
        isAuthenticated().user && media.postedBy && isAuthenticated().user._id == media.postedBy._id &&
          (<Box sx={{width: '100%', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', justifyContent: {xs: 'center', md: 'flex-end'}}}>
              <Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <MoreMenuVertButton>
                  <MenuItem sx={{color: "primary.main", transition: theme.transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                    <Link to={courseId? media && `/media/edit/${media._id}/course/${courseId}`: media && `/media/edit/${media._id}`} style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                      <Box aria-label="Edit" color="inherit" 
                      sx={{
                          zIndex: 10,
                          transform: 'unset',
                          '&:hover':{
                            boxShadow: 2,
                            transform: 'translateY(-3px)',
                            transition: theme.transitions.create(['transform'])
                          }}}>
                        <Edit sx={{verticalAlign: 'text-top'}}/> Edit Video
                      </Box>
                    </Link>
                  </MenuItem>
                  <DeleteMedia courseId={courseId} mediaId={media && media._id} mediaTitle={media && media.title}/>
                </MoreMenuVertButton>
              </Box>
          </Box>)}
      />
      <Box id="media-body"
        sx={{width: '100%', borderRadius: 4, display:'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', mb: 5 }}>
        <Box id="media-body-player"
         sx={{ flex:1, borderRadius: 4, width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
          <MediaPlayer srcUrl={mediaUrl} handleNext={handleNext} handleAutoplay={handleAutoplay}/>
        </Box>
        {variant!=='simple' && (
        <Box id="media-body-description" 
          sx={{px: 1, flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}> 
          <Box id="media-body-description-views_comments"
           sx={{display: 'flex',  width:'100%', px: {xs:0, sm: 1}, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography component='span' variant="subtitle1">
               {media && media.views} <Visibility  sx={{color: 'primary.main', verticalAlign: 'text-top'}}/> 
            </Typography>
            <Typography component='span' variant="subtitle1">
             <CommentRounded sx={{color: 'primary.main', verticalAlign: 'text-top'}}/> Comments 
            </Typography>
          </Box>
          <Box id="media-body-description-author"
            sx={{display: 'flex',  width:'100%', px: {xs:0, sm: 1}, alignItems: 'center', justifyContent: 'center'}}>
            <List dense sx={{width: '100%', [`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}}>
              <ListItem sx={{px: 0}}>
                <ListItemAvatar sx={{display: 'flex', flexDirection: {xs: 'row', sm: 'column'}}}>
                  <ProfilePicButton user={media && media.postedBy}/>
                </ListItemAvatar>
                <ListItemText  
                  primary={
                  <Link to={media && media.postedBy && "/user/"+media.postedBy._id} style={{textDecoration: 'none'}}>
                    <MuiLink  underline="hover" component='span' sx={{display: 'inline-block', color: 'text.primary',  my: 1, mx: 0}}>
                      <Typography component="h5" variant="h5" sx={{color: 'text.primary'}}>{media.postedBy.name}</Typography>
                    </MuiLink>
                  </Link>
                  } 
                  secondary={
                  <Typography sx={{ mb: 2, color: 'text.secondary' }} variant="subtitle1">{"Posted on" + (new Date(media.created)).toDateString()}</Typography>
                  }/>
              </ListItem>
            </List>
          </Box>
          <Divider/>
          <Box id="media-body-description-body"
            sx={{display: 'flex',  width:'100%', px: {xs:0, sm: 1}, alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="body1" sx={{witdh:'100%', textAlign: 'justify', color: 'text.secondary'}}>
              {media && media.description}
            </Typography>
          </Box>
        </Box>)}
      </Box>
    </Card>
    )
}
export default Media

