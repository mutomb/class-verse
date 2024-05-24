import React, {useState, useEffect} from 'react'
import {Paper, List, ListItem, ListItemText, Typography, Divider, Box} from '@mui/material'
import {useAuth} from '../auth'
import {listByUser} from './api-order'
import {Link} from 'react-router-dom'

export default function StudentOrders(){
  const [orders, setOrders] = useState([])
  const {isAuthenticated} = useAuth() 

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByUser({
      userId: isAuthenticated().user && isAuthenticated().user._id
    }, {token: isAuthenticated().token}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
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
      </Paper>
    )
}
