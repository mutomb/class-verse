import React, {useState, useEffect, FC}  from 'react'
import {Card, CardContent, CardMedia, Typography, Grid, Divider, Box} from '@mui/material'
import {read} from './api-order'
import {Link} from 'react-router-dom'
import {useAuth} from '../auth'

interface OrderProps{
  match: any
}
const Order: FC<OrderProps> = ({match}) => {
  const [order, setOrder] = useState({courses:[], delivery_address:{}})
  const {isAuthenticated} = useAuth()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    read({
      orderId: match.params.orderId
    },{token: isAuthenticated().token}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setOrder(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const getTotal = () => {
    return order.courses.reduce((a, b) => {
       const quantity = b.status == "Cancelled" ? 0 : b.quantity
        return a + (quantity*b.course.price)
    }, 0)
  }

    return (
      <Card sx={{textAlign: 'center', pt: 1, pb: 2, flexGrow: 1, m: 4}}>
        <Typography variant='h2' component="h2" sx={{mt: 2, mb: 1, fontSize: '1.2rem'}}>
            Order Details
        </Typography>
        <Typography variant='subtitle1' component="h3" sx={{mt: 1}}>
            Order Code: <strong>{order._id}</strong> <br/> Placed on {(new Date(order.created)).toDateString()}
        </Typography><br/>
        <Grid container spacing={4}>
            <Grid item xs={7} sm={7}>
                <Card sx={{textAlign: 'left', my: 3, mr: 1, ml: 3}}>
                  {order.courses.map((item, i) => {
                    return  <Box component='span' key={i}>
                      <Card sx={{textAlign: 'left', width: '100%', display: 'inline-flex'}} >
                        <CardMedia
                          sx={{width: 160, height: 125, m: 1}}
                          image={'/api/courses/photo/'+item.course._id}
                          title={item.course.name}
                        />
                        <Box sx={{display: 'inline-block', width: '100%', p: 1}}>
                          <CardContent sx={{flex: '1 0 auto', pt: 2, px: 1, pb: 0}}>
                            <Link to={'/course/'+item.course._id}><Typography variant='h3' component="h3" sx={{fontSize: '1.15rem', mb: 1}}>{item.course.name}</Typography></Link>
                            <Typography variant='h3' component="h3" sx={{display: 'block', fontSize: '1rem', color: 'primary.main'}}>$ {item.course.price} x {item.quantity}</Typography>
                            <Box component='span' sx={{float: 'right', mr: 5, fontSize: '1.5rem', color: 'primary.main'}}>${item.course.price * item.quantity}</Box>
                            <Typography variant='h3' component="h3" sx={{color: item.status === "Cancelled" ? "red":"primary.main"}}>Status: {item.status}</Typography>
                          </CardContent>
                        </Box>
                      </Card>
                      <Divider/>
                    </Box>})
                  }
                  <Box sx={{float: 'right'}}>
                    <Box component='span'sx={{fontSize: '1.2rem', mr: 2, fontWeight: 600, verticalAlign: 'bottom'}}>Total: ${getTotal()}</Box>
                  </Box>
                </Card>
            </Grid>
            <Grid item xs={5} sm={5}>
              <Card sx={{textAlign: 'left', my: 3, mr: 1, ml: 3}}>
                <Typography variant='h2' component="h2" sx={{fontSize: '1.15rem'}}>
                 Deliver to:
                </Typography>
                <Typography variant='h3' component="h3" sx={{color: 'secondary.main', fontSize: '0.95rem', display: 'inline'}}><strong>{order.customer_name}</strong></Typography><br/>
                <Typography variant='h3' component="h3" sx={{color: 'secondary.main', fontSize: '0.95rem', display: 'inline'}}>{order.customer_email}</Typography><br/>
                <br/>
                <Divider/>
                <br/>
                <Typography variant='h3' component="h3" sx={{display: 'block', fontSize: '1rem'}}>{order.delivery_address.street}</Typography>
                <Typography variant='h3' component="h3" sx={{display: 'block', fontSize: '1rem'}}>{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipcode}</Typography>
                <Typography variant='h3' component="h3" sx={{display: 'block', fontSize: '1rem'}}>{order.delivery_address.country}</Typography><br/>
                <Typography variant='h3' component="h3" sx={{display: 'block', fontSize: '1rem'}}>Thank you for shopping with us! <br/>You can track the status of your purchased items on this page.</Typography>
              </Card>
            </Grid>
        </Grid>
      </Card>
    )
}
export default Order