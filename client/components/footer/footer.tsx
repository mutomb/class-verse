import React, { FC } from 'react'
import {useTheme} from '@mui/material/styles'
import {Box, Grid, Container, Typography} from '@mui/material'
import { FooterNavigation, FooterSocialLinks } from '.'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

const Footer: FC = () => {
  const theme = useTheme()
  return (
    <WallPaperYGW primaryColor={theme.palette.primary.dark} secondaryColor={theme.palette.mode ==='dark'? 'rgba(0,0,0,0.3)': 'rgba(0,0,0,1)'}
      style={{
        '&::before': {
          content: '""',
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'space',
          backgroundSize: 'contain',
          opacity: 0.3,
        },
        '& > footer':{
          position: 'relative'
        },
        '& > div':{
          position: 'relative'
        }
      }} overlayStyle={{bgcolor: 'rgba(0, 0, 0, 0)'}}>
      <Box component="footer" sx={{ boxShadow: 4, p:1, color: 'primary.contrastText', py:{xs:2, md:5}, mb:0, mt:'auto' }}>
        <Container sx={{px: {xs: 0, sm: 'unset'}}}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ width: { xs: '100%', md: 360 }, mb: { xs: 3, md: 0 } }}>
                <Box sx={{ color: 'primary.contrastText', fontWeight: '700' }}>
                GO<Typography component='span' variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>
                </Box>
                <Box component='span' sx={{ letterSpacing: 1, mb: 2, textWrap: 'wrap' }}>
                GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> is an online learning and consulting platform that has been operating since 2024.
                </Box>
                <FooterSocialLinks />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <FooterNavigation />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
  )
}

export default Footer
