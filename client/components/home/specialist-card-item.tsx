import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Specialist } from '../../interfaces/specialist'
import { Zoom } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'
import { SliderArrow, StyledRating } from '../styled-buttons'
import { Link } from 'react-router-dom'

interface Props {
  item: Specialist
}

const SpecialistCardItem: FC<Props> = ({ item }) => {
  return (
    <Zoom timeout={1000} id="zoom-card" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ px: {xs: 0, sm: 1.5}, py: 4 }} >
        <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 4, transition: (theme) => theme.transitions.create(['box-shadow'], {duration: 500}), '&:hover': { boxShadow: 2, }, }} >
          <Box sx={{ lineHeight: 0, overflow: 'hidden', borderRadius: 3, height: 200, mb: 2, }} >
            <Link style={{textDecoration: 'none', width:'100%', height:'100%'}} to={"/user/"+item._id}>
              <Box component='img' src={item.photo || `/api/users/photo/${item._id}?${new Date().getTime()}`} sx={{width:'100%', height:'100%'}} />
            </Link>
          </Box>
          <Box sx={{ mb: 2}}>
            <Link style={{textDecoration: 'none', width:'100%', height:'100%'}} to={"/user/"+item._id}>
              <Typography component="h2" variant="h4" sx={{color: 'text.primary', fontSize: {xs:'1.2rem', md:'1.4rem'} }}>
                {item.name}
              </Typography>
              <Typography sx={{ mb: 2, color: 'text.secondary' }}>
              {item.category || (item.skills && item.skills[0])} 
              {item.skills && item.skills.length>1 && ` (+${item.skills.length})`}
              </Typography>
              <Typography sx={{ mb: 2, color: 'text.secondary', height: 100 }} variant="subtitle1">
                {item.experience && item.experience.substring(0,150)}{item.experience && item.experience.substring(150).length>0 && '...'}
              </Typography>
            </Link>
            <Box sx={{ '& img': { height: 26 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* eslint-disable-next-line */}
              {item.company &&  <Box component='img' src={item.company.logo|| `/api/users/${item._id}/company/photo/${item.company}?${new Date().getTime()}`} />}
              <StyledRating 
              readOnly={true}
              icon={<Star fontSize="inherit" sx={{color: 'secondary.main', mr: 1, width: {xs: '1rem', md: '1.5rem'}, height: {xs: '1rem', md: '1.5rem'}}}/>} 
              emptyIcon={<StarBorder fontSize="inherit" sx={{color: 'secondary.main', mr: 1, width: {xs: '1rem', md: '1.5rem'}, height: {xs: '1rem', md: '1.5rem'}}}/>} 
              defaultValue={0} value={item?.rating?.avg_rating} max={5} 
              />
            </Box>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Link style={{textDecoration: 'none'}} to={"/user/"+item._id}>
                <SliderArrow type='next'/>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Zoom>
  )
}
export default SpecialistCardItem
