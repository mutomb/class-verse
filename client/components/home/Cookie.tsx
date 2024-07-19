import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { StyledButton } from '../styled-buttons'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, dialogClasses, Box } from '@mui/material'
import { Logo } from '../logo'
import { createCookie } from '../users/api-user'
import { useAuth } from '../auth'
import { Error } from '@mui/icons-material'
import { StyledSnackbar } from '../styled-banners'
import { useTheme } from '@mui/material/styles'
const Cookie = () => {
  const {isAuthenticated, hasCookie, authenticate} = useAuth()
  const [values, setValues] = useState({error: '', open: false})
  const theme = useTheme()

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
        let jwt =  isAuthenticated()
        if(jwt) { jwt.token = hasCookie() }
        authenticate(jwt, ()=>setValues({...values, error: '', open: false}))
      }
    })
  }
    return (
      <Dialog PaperComponent={Box} transitionDuration={1000} open={values.open}  onClose={handleClose} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, borderRadius: 4, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: theme.palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
      <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
        <Typography variant='h2' sx={{color: 'primary.main', mb: 1, fontSize: { xs: 32, md: 42 } }}>
         Hi! {isAuthenticated().user && isAuthenticated().user.name}
        </Typography>
        <Typography sx={{color: 'secondary.dark', mb: 1, fontSize: { xs: 20, md: 30 } }}>
          Would you like to be remembered?
        </Typography>        
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center'}}>
        <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 12, md: 17 } }}>
          <Typography component='strong' sx={{color: 'primary.main', fontSize: { xs: 16, md: 21 }}}>(Yes) </Typography> Closing the browser does not log you out, for 24 hours.
        </DialogContentText><br/>
        <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 12, md: 17 } }}>
          <Typography component='strong' sx={{color: 'primary.main', fontSize: { xs: 16, md: 21 }}}>(No) </Typography> Closing the browser automatically logs you out.
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
            mx: {xs: '0px !important', sm: '8px !important'},
            my: {xs: 1, sm: 0},
            width: {xs: '90%', sm: 'initial'},
            display: 'flex',
            justifyContent: 'center'
          }
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
