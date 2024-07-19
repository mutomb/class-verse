import React, {useState, useEffect, FC} from 'react'
import {List, ListItem, ListItemText, Typography, MenuItem, TextField, Divider, Box} from '@mui/material'
import {useAuth} from '../auth'
import {getStatusValues, update, cancelCourse, processCharge} from './api-order'

interface CourseOrderEditProps {
  userId: string,
  order: any,
  orderIndex: number,
  updateOrders: (arg0: number, arg1: any)=>void
}
const CourseOrderEdit: FC<CourseOrderEditProps> = ({ userId, order, orderIndex, updateOrders}) => {
  const [values, setValues] = useState({
      open: 0,
      statusValues: [],
      error: ''
  })
  const {isAuthenticated} = useAuth()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    getStatusValues(signal, {token: isAuthenticated().token}).then((data) => {
      if (data && data.error) {
        setValues({...values, error: "Could not get status"})
      } else {
        setValues({...values, statusValues: data, error: ''})
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const handleStatusChange = courseIndex => event => {
    let order_update = order
    order_update.course[courseIndex].status = event.target.value
    let course = order_update.courses[courseIndex]

    if (event.target.value == "Cancelled") {
      cancelCourse({
          userId: userId,
          courseId: course.course._id
        }, {
          token: isAuthenticated().token
        }, {
          cartItemId: course._id,
          status: event.target.value,
          quantity: course.quantity
        })
        .then((data) => {
          if (data && data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order_update)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    } else if (event.target.value == "Processing") {
      processCharge({
          userId: isAuthenticated().user && isAuthenticated().user._id,
          orderId: order_update._id
        }, {
          token: isAuthenticated().token
        }, {
          cartItemId: course._id,
          status: event.target.value,
          amount: (course.quantity * course.course.price),
          currency: course.course.currency
        })
        .then((data) => {
          if (data && data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order_update)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    } else {
      update({
          userId: userId
        }, {
          token: isAuthenticated().token
        }, {
          cartItemId: course._id,
          status: event.target.value
        })
        .then((data) => {
          if (data && data.error) {
            setValues({
              ...values,
              error: "Status not updated, try again"
            })
          } else {
            updateOrders(orderIndex, order_update)
            setValues({
              ...values,
              error: ''
            })
          }
        })
    }
  }
    return (
    <>
      <Typography component="span" color="error" sx={{position: 'absolute', zIndex: 12, right: 1, p: 1}}>
        {values.error}
      </Typography>
      <List disablePadding style={{backgroundColor:'#f8f8f8'}}>
        {order.courses.map((item, index) => {
          return <Box component='span' key={index}>
                  { item.specialist == userId && //Only show courses belonging to specialist/not order courses in the order
                    <ListItem sx={{pl: 4, pb:0}}>
                      <ListItemText
                        sx={{color: 'text.primary'}}
                        primary={<Box>
                                    <Box component='img' sx={{width: 10, mr: 1}} src={'/api/courses/photo/'+item.course._id}/>
                                    <Box sx={{display: 'inline-block'}}>
                                      {item.course.title}
                                      <Typography variant='body1' sx={{m: 0, fontSize: '0.9rem'}}>{"Quantity: "+item.quantity}</Typography>
                                    </Box>
                                  </Box>}/>
                      <TextField
                        id="select-status"
                        select
                        label="Update Status"
                        sx={{width: 20, mr: 2}}
                        value={item.status}
                        onChange={handleStatusChange(index)}
                        margin="normal">
                        {values.statusValues.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </ListItem>
                  }
                  <Divider style={{margin: 'auto', width: "80%"}}/>
                </Box>})
              }
      </List>
    </>)
}
export default CourseOrderEdit