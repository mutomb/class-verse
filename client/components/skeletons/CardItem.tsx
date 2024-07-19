import React, { FC } from 'react';
import {Box, iconButtonClasses, Rating, Skeleton, Typography, Zoom} from '@mui/material';
import {SxProps, Theme} from '@mui/material/styles'

interface Props {
  wrapperStyle?: SxProps<Theme>
}

const CardItem: FC<Props> = ({ wrapperStyle }) => {
  return (
    <Zoom timeout={1000} id="zoom-card" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box
        sx={{
          py: {xs: 1, md: 2},
          mx:{xs: 0, sm: 1},
          maxWidth: 400,
          ...wrapperStyle
        }}>
        <Box
          sx={{
            width: '100%', 
            p: {xs: 1, md: 2},
            backgroundColor: 'background.paper',
            borderRadius: 4,
            transition: (theme) => theme.transitions.create(['box-shadow'], {duration: 500}),
            '&:hover': {
              boxShadow: 2,
              [`& .${iconButtonClasses.root}`]: {
                backgroundColor: 'primary.main',
                color: '#fbfbfb',
                boxShadow: 2,
              },
            },
          }}>
          <Box
          id='image'
            sx={{
              lineHeight: 0,
              overflow: 'hidden',
              borderRadius: 3,
              height: 200, width: '100%',
              mb: 1,
            }}>
            <Skeleton  width={'100%'} height={200} sx={{boxShadow: 4, borderRadius: 1, gbcolor:(theme)=> theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
          </Box>
          <Box sx={{ mb: 2, width: '100%' }}>
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Typography
                id='title'
                component="h2" variant="h5"
                sx={{
                  textAlign: 'start', fontSize: {xs: '1.1rem', sm: '1.2rem', md: '1.3rem'},
                  pt: 2,
                  pb: 3,
                  lineHeight: 1,
                  fontWeight: 'bold',
                  width: '100%',
                }}>
                <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              </Typography>
              <Typography
                id='title'
                variant="subtitle1"
                sx={{
                  textAlign: 'start', fontSize: {xs: '1.1rem', sm: '1.2rem', md: '1.3rem'},
                  lineHeight: 1,
                  fontWeight: 'bold',
                  width: '100%',
                }}>
                <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
                <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
                <Skeleton width={'100%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
                <Skeleton width={'50%'} sx={{boxShadow: 4, background: 'background.default', borderRadius: 1}}/>
              </Typography>
            </Box>
            <Box sx={{width: '100%',  display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
              <Rating name="rating-course" value={2.5} max={5} sx={{ color: 'secondary.main', mr: 1 }} readOnly />
              <Typography component="span" variant="h5" sx={{color: 'text.primary'}}>
                ({3})
              </Typography>
            </Box>
          </Box>
          <Box sx={{width: '100%',  display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Box sx={{width: '70%',  display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{width: '50%', color: 'primary.main'}}>
                  <Skeleton width={'90%'} sx={{boxShadow: 4, background: 'primary.main', borderRadius: 1}}/>
              </Typography>
            </Box>
            <Box id='button' sx={{width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Skeleton  width={20} height={20} sx={{boxShadow: 4, borderRadius: '50%', bgcolor: 'primary.main'}} variant="rounded"/>            
            </Box>
          </Box>
        </Box>
      </Box>
    </Zoom>
  )
}
export default CardItem
