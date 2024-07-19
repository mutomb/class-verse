import React, {useState, useEffect} from 'react'
import {List, ListItem, ListItemText, Typography, Collapse, Divider, Box, Container, Grid, listItemClasses, Zoom} from '@mui/material'
import {Error, ExpandLess, ExpandMore, Info} from '@mui/icons-material'
import {useTheme} from '@mui/material/styles'
import {useAuth} from '../auth'
import {listBySpecialist, listByUser} from './api-order'
import {CourseOrderEdit} from '.'
import { StyledBanner, StyledSnackbar } from '../styled-banners'
import { WallPaperYGW } from '../wallpapers/wallpapers'
import logo from '../../public/logo.svg'

export default function Orders({match}) {
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState(0)
  const {isAuthenticated} = useAuth()
  const theme = useTheme()
  const [error, setError] = useState('')
  const isSpecialist = () =>{
    return isAuthenticated().user && isAuthenticated().user.specialist
  } 
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    if(isSpecialist()){
      listBySpecialist({
        userId: match.params.userId
      }, {token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
           setError(data.error)
        } else {
          setOrders(data)
        }
      })
    }else{
      listByUser({
        userId: isAuthenticated().user && isAuthenticated().user._id
      }, {token: isAuthenticated().token}, signal).then((data) => {
        if (data && data.error) {
           setError(data.error)
        } else {
          setOrders(data)
        }
      })
    }
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const handleClick = index => event => {
    setOpen(index)
  }

  const updateOrders = (index, updatedOrder) => {
    let updatedOrders = orders
    updatedOrders[index] = updatedOrder
    setOrders([...updatedOrders])
  }

  return (
    <WallPaperYGW variant='radial' primaryColor={theme.palette.background.paper} secondaryColor={theme.palette.background.default}
    style={{
      minHeight: '100vh',
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
        left: {xs: 'unset', md: '50%'},
        position: 'absolute',
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
      },
      '& > div':{
        position: 'relative'
      }
    }}>
      <Box id="shopping-cart" sx={{pt: {xs: 6, md: 8}, pb: 14, }}>
        <Container maxWidth="lg" sx={{px: {xs: 0, sm: 'inherit'}}}>
          <Grid container spacing={2}>
            <Grid item id='items' xs={ 12} sx={{pl: {xs: 0, sm: 'inherit'}, pt: {xs: 0, sm: 'inherit'}}}>
              <Typography variant="h2" component='h2' sx={{m: 2, fontSize: '1.2em', color: 'text.primary'}}>
                Orders 
              </Typography>
              <List dense sx={{width: '100%', [`.${listItemClasses.root}`]: { px: {xs:0, sm: 3}},[`.${listItemClasses.container}`]: { display: 'flex', justifyContent: 'center', alignItems: 'center'}}}>
                {orders.map((order, index) => {
                  return(
                  <Zoom timeout={1000} id="zoom-orders" appear={true} in={true} color='inherit' unmountOnExit={true}>
                    <Box component='span' key={index}>
                      <ListItem onClick={handleClick(index)}>
                        <ListItemText sx={{color: 'text.primary'}} primary={'Order # '+order._id} secondary={(new Date(order.created)).toDateString()}/>
                        {open == index ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Divider/>
                      <Collapse component="li" in={open == index} timeout="auto" unmountOnExit>
                        {isAuthenticated().user && isAuthenticated.user().specialist &&
                        (<CourseOrderEdit userId={match.params.userId} order={order} orderIndex={index} updateOrders={updateOrders}/>)
                        }
                        <Box sx={{pl: 4, pt: 2 }}>
                          <Typography variant="h3" component="h3" sx={{mt: 1, fontSize: '1.1rem', color: 'text.primary'}}>
                            Deliver to:
                          </Typography>
                          <Typography variant="h3" component="h3" sx={{color: 'text.primary'}}><strong>{order.customer_name}</strong> ({order.customer_email})</Typography>
                          <Typography variant="h3" component="h3" sx={{color: 'text.primary'}}>{order.delivery_address.street}</Typography>
                          <Typography variant="h3" component="h3" sx={{color: 'text.primary'}}>{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipcode}</Typography>
                          <Typography variant="h3" component="h3" sx={{color: 'text.primary'}}>{order.delivery_address.country}</Typography><br/>
                        </Box>
                      </Collapse>
                      <Divider/>
                    </Box>
                  </Zoom>
                )})}
                {orders.length ===0 && 
                (<StyledBanner variant={'info'} icon={<Info/>} heading={"List Empty"} 
                  body={"No orders have been recorded yet. Please check again later when an item has been purchased."} />
                )}
              </List>
            </Grid>
          </Grid>
          <StyledSnackbar
            open={error? true: false}
            duration={3000}
            handleClose={()=>setError('')}
            icon={<Error/>}
            heading={"Error"}
            body={error}
            variant='error'
            />
        </Container>
      </Box>
    </WallPaperYGW>
    )
}
