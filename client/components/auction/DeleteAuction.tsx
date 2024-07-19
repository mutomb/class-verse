import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from '../auth/auth-helper'
import {remove} from './api-auction'
import { Box, dialogClasses } from '@mui/material'
import { StyledSnackbar } from '../styled-banners'
import { Error } from '@mui/icons-material'

export default function DeleteAuction(props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteAuction = () => {
    remove({
      auctionId: props.auction._id
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setOpen(false)
        props.onRemove(props.auction)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog  PaperComponent={Box} open={open} onClose={handleRequestClose} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
        <DialogTitle>{"Delete "+props.auction.itemName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your auction {props.auction.itemName}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAuction} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
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
    </span>)
}
DeleteAuction.propTypes = {
  auction: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}