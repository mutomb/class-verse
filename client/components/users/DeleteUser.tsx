import React, {FC, FormEvent, useState} from 'react'
import {Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, IconButton
} from '@mui/material'
import {Delete} from '@mui/icons-material'
import auth from '../auth/auth-helper'
import {remove} from './api-user'
import {Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons';

interface DeleteUserProps{
  userId:String
}

const DeleteUser: FC<DeleteUserProps> = ({userId}) =>{
  const [open, setOpen] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const jwt = auth.isAuthenticated()
  const theme = useTheme();

  const clickButton = () => {
    setOpen(true)
  }
  const deleteAccount = () => { 
    remove({
      userId: userId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log('deleted'))
        setRedirect(true)
      }
    })
  }

  const handleClose = (event: FormEvent<HTMLFormElement>, reason) => {
    setOpen(false)
  }

  if (redirect) {
    return <Redirect to='/'/>
  }
    return (<>
      <IconButton aria-label="Delete" onClick={clickButton} color="error"
        sx={{
          zIndex: 10,
          boxShadow: 3,
          transform: 'unset',
          mr: 1, 
          ':hover':{
            transform: 'translateY(-3px)',
            transition: theme.transitions.create(['transform'])
          }}}
      >
        <Delete/>
      </IconButton>

      <Dialog open={open}  onClose={(event, reason) => {if(reason === 'backdropClick'){handleClose(event, reason);}}}>
        <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
          <Logo />
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 } }}>
              Delete Account
          </Typography>        
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center'}}>
          <DialogContentText variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
            You will loose all your data. Deleting cannot be undone. Please confirm.
          </DialogContentText>
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
              Cancel
            </StyledButton>
            <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteAccount}>
              Confirm
            </StyledButton>
        </DialogActions>
      </Dialog>
    </>)

}
export default DeleteUser;
/*DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}*/

