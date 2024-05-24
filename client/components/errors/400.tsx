import React from 'react'
import Box from '@mui/material/Box'
import {Container as MUIContainer} from '@mui/material'
import { StyledButton } from '../styled-buttons'
import { StyledBanner } from '../styled-banners'
import { Error } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'

const NotFound = () => {
  const history = useHistory()
  const goBack = async () => {
    await history.goBack()
  }
  return (
    <Box sx={{ backgroundColor: 'background.paper', position: 'relative', pt: 4, pb: { xs: 8, md: 10 } }}>
      <MUIContainer maxWidth="lg">
        <Box sx={{ boxShadow: 2, py: 4, px: 7, borderRadius: 4 }}>
          <StyledBanner
           body={'An error occured while processing your request. Please try again later, or should the issue persist please contact support for assistance.'}
           icon={<Error/>}
           heading={'404 / Not Found'}
           variant='error' 
           />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my:2
        }}>
        <StyledButton type = 'button' onClick={goBack} disableHoverEffect={false} variant="outlined">
          Return To Previous Page
        </StyledButton>
      </Box>
      </MUIContainer>
    </Box>
  )
}

export default NotFound
