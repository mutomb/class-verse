import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import auth from '../auth/auth-helper'
import {listBySeller} from './api-auction'
import {Link} from 'react-router-dom'
import Auctions from './Auctions'
import { StyledSnackbar } from '../styled-banners'
import { Error } from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  }
}))
export default function MyAuctions(){
  const classes = useStyles()
  const [auctions, setAuctions] = useState([])
  const [error, setError] = useState('')
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listBySeller({
      userId: jwt.user._id
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setError(data.error)
      } else {
        setAuctions(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const removeAuction = (auction) => {
    const updatedAuctions = [...auctions]
    const index = updatedAuctions.indexOf(auction)
    updatedAuctions.splice(index, 1)
    setAuctions(updatedAuctions)
  }

    return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Auctions
          <span className={classes.addButton}>
            <Link to="/auction/new">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon>  New Auction
              </Button>
            </Link>
          </span>
        </Typography>
        <Auctions auctions={auctions} removeAuction={removeAuction}/>
        <StyledSnackbar
        open={error? true: false}
        duration={3000}
        handleClose={()=>setError('')}
        icon={<Error/>}
        heading={"Error"}
        body={error}
        variant='error'
        />
      </Paper>
    </div>)
}