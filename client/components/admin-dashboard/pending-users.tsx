import React, { useEffect, useState } from 'react'
import {Typography, Box, Grid, Container, Slide, Avatar} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'
import {useAuth} from '../auth'
import {Redirect} from 'react-router-dom'
import { Users } from '../users'
import { listPending } from '../users/api-user'
import { ListSkeleton } from '../skeletons'
import { Error } from '@mui/icons-material'
import { StyledSnackbar } from '../styled-banners'

export default function AdminDashboardPendingUsers(){
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    listPending(signal,{
      token: isAuthenticated().token
    }).then((data) => {
      if (data && data.error) {
         setError(data.error)
        setLoading(false)
      } else {
        setUsers(data)
        setLoading(false)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  },[])

  if (!isAuthenticated().user && isAuthenticated().user.role !== 'admin') {
    return <Redirect to='/signin'/>
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
      <Box id="courses" sx={{pt: {xs: 6, md: 8}, pb: 14}}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Slide unmountOnExit={true} timeout={1000} id="slide-description" appear={true} direction="right" in={true} color='inherit'>
                <Box
                    sx={{
                    height: '100%',
                    width: { xs: '100%', md: '90%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    }}>
                  <Typography variant="h1" sx={{ mt: { xs: 0, md: -5 }, fontSize: { xs: 30, md: 48 }, color: 'text.primary' }}>
                    Users 
                  </Typography>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={9} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Box 
              sx={{ px: {xs: 0, sm:2}, py: 1.5, 
                borderRadius: 4, display: 'flex',
                flexDirection: {xs:'column', md:'row'},
                alignItems: 'center', bgcolor:'background.default'}}>
                <Box sx={{ mt: 1, width: '100%'}}>
                  <Box sx={{  width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', 
                  textAlign: {xs: 'start', md: 'center'}, borderRadius: 3}}>
                    <Avatar sx={{ borderRadius: '50%', width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 } }}>
                      {users && users.length}
                    </Avatar>
                    <Typography variant="h3" component="h2" 
                    sx={{ flex: 1, textAlign: 'center', mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem'}, color: 'text.primary'}}>
                      Pending profile users
                    </Typography>
                  </Box>
                  {!loading? (<Users users={users}/>): (<ListSkeleton />)}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
        </Container>
        </Box>
      </WallPaperYGW>
 )
}