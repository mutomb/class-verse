import React, {FC, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import auth from '../auth/auth-helper'
import {remove} from './api-user'
import {Redirect} from 'react-router-dom'

interface DeleteUserProps{
  userId:String
}

const DeleteUser: FC<DeleteUserProps> = ({userId}) =>{
  const [open, setOpen] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)

  const jwt = auth.isAuthenticated()
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
  const handleRequestClose = () => {
    setOpen(false)
  }

  if (redirect) {
    return <Redirect to='/'/>
  }
    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog open={open} TransitionProps={{onExit:handleRequestClose}}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)

}
export default DeleteUser;
/*DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}*/

