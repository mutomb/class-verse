import React, {FC, FormEvent, useState} from 'react'
import {Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, MenuItem, Box
} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {useAuth} from '../auth'
import {remove} from './api-user'
import {Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons';
import { useColorMode } from '../../config/theme/MUItheme-hooks'

interface DeleteUserProps{
  userId:String
}

const DeleteUser: FC<DeleteUserProps> = ({userId}) =>{
  const [open, setOpen] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const {clearJWT, isAuthenticated} = useAuth()
  const {clearPreference} = useColorMode()
  const {transitions} = useTheme();

  const clickButton = () => {
    setOpen(true)
  }
  const deleteAccount = () => { 
    remove({
      userId: userId
    }, {token: isAuthenticated().token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        clearJWT(() => {clearPreference(); setRedirect(true);})
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
      <MenuItem sx={{color: 'red', transition: transitions.create(['background-color']), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
        <Box aria-label="Delete" onClick={clickButton} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
          <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Account
        </Box>
      </MenuItem>
      <Dialog transitionDuration={1000} open={open}  onClose={(event, reason) => {if(reason === 'backdropClick'){handleClose(event, reason);}}} aria-labelledby="form-dialog-title">
        <DialogTitle sx={{ textAlign: 'center', borderRadius:1, borderColor:'primary.main'}}>
          <Logo />
          <Typography variant="h1" component="h2" sx={{ mb: 1, fontSize: { xs: 32, md: 42 }, color: 'text.primary' }}>
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

