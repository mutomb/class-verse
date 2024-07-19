import  React from 'react';
import {Box, Container, Typography, useMediaQuery } from '@mui/material';
import {useTheme} from '@mui/material/styles'
import { data } from './team-profile.data'
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
import Slider, { Settings } from 'react-slick';
import { SliderArrow, SliderDots } from '../styled-buttons';
import { TeamCardItem } from '.';

export default function TeamProfile() {
  const theme = useTheme()
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const sliderConfig: Settings= {
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: xsMobileView ? 1 : smMobileView? 2: 3,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots) => <SliderDots>{dots}</SliderDots>,
    customPaging: () => (
      <Box sx={{ height: {xs:10, md:8}, width: {xs:10, md:30}, backgroundColor: 'secondary.dark', display: 'inline-block', borderRadius: 4 }} />
    ),
  }
  return (
    <WallPaperYGW secondaryColor={theme.palette.background.paper} primaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
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
      <Container id="team" sx={{ px: {xs: 0, sm: 2}, pt: { xs: 4, sm: 12 }, pb: 16, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, sm: 6 }, }} >
        <Box sx={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          <Typography variant="h6" sx={{fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, mr: 1, color: 'primary.main' }}>
            Our
          </Typography>
          <Typography variant="h6" sx={{fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'secondary.main' }}>
            Team
          </Typography>
        </Box>
        <Box sx={{ width: '100%', }}>
          <Slider {...sliderConfig}>
            {data.map((item) => (
              <TeamCardItem key={String(item.id)} item={item} />
            ))}
          </Slider>
        </Box>
      </Container>
    </WallPaperYGW>
  );
}
