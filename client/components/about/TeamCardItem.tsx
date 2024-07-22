import React, { useState } from 'react'
import {Box, Typography, Link as MuiLink} from '@mui/material'
import { Zoom } from '@mui/material'

const TeamCardItem = ({ item }) => {
  const [more, setMore] = useState('')
  return (
    <Zoom timeout={1000} id="zoom-card" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ px: {xs: 0, sm: 1.5}, py: 5, }} >
        <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
          <Box sx={{ lineHeight: 0, overflow: 'hidden', borderRadius: 3, width: 200, height: 200, mb: 2}} >
              <Box component='img' src={item.photo} sx={{width:'100%', height:'100%', borderRadius: '50%'}}/>
          </Box>
          <Box sx={{ mb: 2,  }}>
            <Typography component="h2" variant="h4" sx={{ color: 'text.primary', fontSize: '1.4rem' }}>
              {item.name}
            </Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{item.category}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }} variant="subtitle1">
              {item.experience && item.experience.substring(0,200)}
              {item.experience && item.experience.substring(0,200) && item.experience.substring(200).length>0 && 
              (item.experience && item.experience.substring(200) === more? 
              <>
              {item.experience.substring(200)} <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setMore('')}} underline="hover" sx={{color: 'primary.main', cursor: 'pointer', ml: 1}}>Hide</MuiLink>
              </>: 
              <>
              ...<MuiLink component='a' onClick={(event)=>{event.preventDefault(); item.experience && setMore(item.experience.substring(200))}} underline="hover" sx={{color: 'primary.main', cursor: 'pointer', ml: 1}}>Read more</MuiLink>
              </>)}
            </Typography>
            {item.company && item.company.logo &&
            (<Box sx={{ '& img': { height: 26 } }}>
              <Box component='img' src={item.company.logo} />
            </Box>)}
          </Box>
        </Box>
      </Box>
    </Zoom>
  )
}
export default TeamCardItem
