import React, {FC, FormEvent, useState} from 'react'
import {Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, MenuItem, Box, dialogClasses
} from '@mui/material'
import {Delete, Error} from '@mui/icons-material'
import {useAuth} from '../auth'
import {remove} from './api-user'
import {Redirect} from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { Logo } from '../logo';
import { StyledButton } from '../styled-buttons';
import { useColorMode } from '../../config/theme/MUItheme-hooks'
import { StyledSnackbar } from '../styled-banners'

interface DeleteUserProps{
  userId:String
}

const DeleteUser: FC<DeleteUserProps> = ({userId}) =>{
  const [open, setOpen] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const {clearJWT, isAuthenticated} = useAuth()
  const {clearPreference} = useColorMode()
  const {transitions, palette} = useTheme();
  const [error, setError] = useState('')

  const clickButton = () => {
    setOpen(true)
  }
  const deleteAccount = () => { 
    remove({
      userId: userId
    }, {token: isAuthenticated().token}).then((data) => {
      if (data && data.error) {
         setError(data.error)
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
      <MenuItem sx={{color: 'error.main', transition: transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
        <Box aria-label="Delete" onClick={clickButton} color="inherit" sx={{fontSize: '1rem', width: '100%'}}>
          <Delete sx={{mr: 1, verticalAlign: 'text-top'}}/>Delete Account
        </Box>
      </MenuItem>
      <Dialog PaperComponent={Box} transitionDuration={1000} open={open}  onClose={handleClose} aria-labelledby="form-dialog-title" sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, borderRadius: 4, borderColor: 'primary.main', borderWidth: {xs: 2, md: 4}, borderStyle: 'solid',  bgcolor: palette.mode === 'dark'? 'rgba(0,0,0,0.8)': 'rgba(255,255,255,0.8)'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
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
              mx: {xs: '0px !important', sm: '8px !important'},
              my: {xs: 1, sm: 0},
              width: {xs: '90%', sm: 'initial'},
              display: 'flex',
              justifyContent: 'center'
            }
        }}>
            <StyledButton disableHoverEffect={false} variant="contained" onClick={handleClose}>
              Cancel
            </StyledButton>
            <StyledButton disableHoverEffect={false} variant="outlined" onClick={deleteAccount}>
              Confirm
            </StyledButton>
        </DialogActions>
      </Dialog>
      <StyledSnackbar
        open={error? true: false}
        duration={3000}
        handleClose={()=>setError('')}
        icon={<Error/>}
        heading={"Error"}
        body={error}
        variant='error'
        />
    </>)

}
export default DeleteUser;

