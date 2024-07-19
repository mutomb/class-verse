import React, {useState, useEffect} from 'react'
import {Paper, List, ListItem, ListItemText, Typography, Divider, Box} from '@mui/material'
import {useAuth} from '../auth'
import {listByUser} from './api-order'
import {Link} from 'react-router-dom'
import { StyledSnackbar } from '../styled-banners'
import { Error } from '@mui/icons-material'

export default function ClientOrders(){
  const [orders, setOrders] = useState([])
  const {isAuthenticated} = useAuth() 
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByUser({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setOrders(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

    return (
      <Paper sx={{maxWidth: 600, mx: 3, my: 2, p: 3, bgColor: 'background.paper'}} elevation={4}>
        <Typography variant='h2' component='h2' sx={{mt:2, mr:0, mb: 2, ml: 1 }}>
          Your Orders
        </Typography>
        <List dense>
          {orders.map((order, i) => {
            return (<Box component='span' key={i}>
                      <Link style={{textDecoration: 'none'}} to={"/order/"+order._id}>
                        <ListItem>
                          <ListItemText sx={{color: 'text.primary'}} primary={<strong>{"Order # "+order._id}</strong>} secondary={(new Date(order.created)).toDateString()}/>
                        </ListItem>
                      </Link>
                      <Divider/>
                    </Box>)
          })}
        </List>
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
    )
}
