import React, { FC } from 'react'
import {useTheme} from '@mui/material/styles'
import {Box, Grid, Container, Typography} from '@mui/material'
import { FooterNavigation, FooterSocialLinks } from '.'
import { WallPaperYGW } from '../wallpapers/wallpapers'

const Footer: FC = () => {
  const theme = useTheme()
  return (
    <WallPaperYGW primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.primary.dark}>
      <Box
        component="footer"
        sx={{ boxShadow: 4, color: 'primary.contrastText', py:{xs:2, md:5}, mb:0, mt:'auto' }}
      >
        <Container sx={{px: {xs: 0, sm: 'unset'}}}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5}>
              <Box sx={{ width: { xs: '100%', md: 360 }, mb: { xs: 3, md: 0 } }}>
                <Box sx={{ color: 'primary.contrastText', fontWeight: '700' }}>
                GO<Typography component='span' variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>
                </Box>
                <Box component='span' sx={{ letterSpacing: 1, mb: 2 }}>
                GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> is an online learning platform that has been operating since 2024.
                </Box>
                <FooterSocialLinks />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <FooterNavigation />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WallPaperYGW>
  )
}

export default Footer
