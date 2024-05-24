import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { StyledButton } from '../styled-buttons'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { Logo } from '../logo'
import { createCookie } from '../users/api-user'
import { useAuth } from '../auth'
import { Error } from '@mui/icons-material'
import { StyledSnackbar } from '../styled-banners'

const Cookie = () => {
  const {isAuthenticated, hasCookie, authenticate} = useAuth()
  const [values, setValues] = useState({error: '', open: false})
  const handleClose = () => {
    setValues({...values, error: '', open: false})
  }
  const handleCloseSnackBar = () => {
    setValues({...values, error: ''})
  }
  useEffect(()=>{
    let timer;
    if (!hasCookie() && isAuthenticated().user) {
      timer = setTimeout(() =>setValues({...values, open:true}) , 5000);
    }
    return function cleanup(){
      timer && clearTimeout(timer)
    }
  },[])

  const handleSubmit = () => {
    const abortController = new AbortController()
    const signal = abortController.signal
    createCookie({
      userId: (isAuthenticated().user && isAuthenticated().user._id)
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: 'An Error Occured. Try Again.'})
      } else {
        let jwt = {user: isAuthenticated().user, token: hasCookie()}
        authenticate(jwt, ()=>setValues({...values, error: '', open: false}))
      }
    })
  }
    return (
      <Dialog transitionDuration={1000} open={values.open}  onClose={handleClose}>
      <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
        <Logo />
        <Typography sx={{color: 'secondary.main', mb: 1, fontSize: { xs: 32, md: 42 } }}>
          Keep Me Logged In?
        </Typography>        
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center'}}>
        <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
          <Typography component='strong' sx={{color: 'primary.main'}}>(Yes) </Typography> Closing the browser does not log you out, for 24 hours.
        </DialogContentText><br/>
        <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
          <Typography component='strong' sx={{color: 'primary.main'}}>(No) </Typography> Closing the browser automatically logs you out.
        </DialogContentText><br/>
        <StyledSnackbar
          open={values.error? true: false}
          duration={3000}
          handleClose={handleCloseSnackBar}
          icon={<Error/>}
          heading={"Error"}
          body={values.error}
          variant='error'
        />
      </DialogContent>
      <DialogActions 
        sx={{
            display: 'flex',
            flexDirection: {xs: 'column', sm:'row'},
            alignItems: 'center',
            justifyContent: 'center',
            '& > button':{ 
            mx: {xs: 'unset', sm: 1},
            my: {xs: 1, sm: 'unset'}}
        }}>
          <StyledButton disableHoverEffect={false} variant="contained" onClick={handleClose}>
            No
          </StyledButton>
          <StyledButton disableHoverEffect={false} variant="outlined" onClick={handleSubmit}>
            Yes
          </StyledButton>
      </DialogActions>
    </Dialog>)
}

export default Cookie
