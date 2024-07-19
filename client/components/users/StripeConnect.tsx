import React, {useState, useEffect, FC} from 'react'
import {Box, Card, CardContent, CardHeader, Dialog, Fade, Grid, Typography, cardContentClasses, cardHeaderClasses, dialogClasses} from '@mui/material'
import queryString from 'querystring';
import {stripeUpdate} from './api-user'
import {useAuth} from '../auth'
import { TiersConnect } from '.';
import {tiers} from './tiers.data'
import { StyledButton } from '../styled-buttons';
import { Check, Error, LocalLibrary } from '@mui/icons-material';
import { HashLoader } from '../progress';
import { useHistory } from 'react-router-dom';
interface StripeConnectProps{
  location: { search: string }
}
const StripeConnect: FC<StripeConnectProps> = ({location})=>{
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false,
    open: true
  })
  const {isAuthenticated} = useAuth()
  const tier = isAuthenticated().user && isAuthenticated().user.tier
  const history = useHistory()
  const reset = () =>{
    setValues({...values, error: false, connecting: false, connected: false})
  }
  const handleClose = () =>{
    setValues({...values, open: true})
  }
  const redirect = () =>{
    history.push("/specialist/courses")
  }
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const parsed = queryString.parse(location.search)
    if(parsed.error){
      setValues({...values, error: true})
    }
    if(parsed.code && (tier.title==='Study' || tier.title==='Upskill')){
      setValues({...values, connecting: true, error: false})
      //post call to stripe, get credentials and update user data
      let sellerData = new FormData()
      sellerData.append('stripe', parsed.code);
      sellerData.append('active_plan', tier.title);
      // !isAuthenticated().user.specialist && tier.title ==='Upskill' && sellerData.append('upskill', tier.title);
      stripeUpdate({
        userId: isAuthenticated().user && isAuthenticated().user._id
      }, {
        token: isAuthenticated().token
      }, sellerData, signal).then((data) => {
        if (data && data.error) {
          setValues({...values, error: true, connected: false, connecting: false})
        } else {
          setValues({...values, connected: true, connecting: false, error: false})
        }
      })
    }
    return function cleanup(){
      abortController.abort()
    }

  }, [])
    return (
      <Dialog PaperComponent={Box} fullWidth maxWidth='lg' transitionDuration={1000} open={values.open} onClose={handleClose} sx={{[`& .${dialogClasses.paper}`]:{mx: {xs: 0, md: 'unset'}, width:'100%'}, background: 'linear-gradient(rgba(18, 124, 113, 0.3) 0%, rgba(255,175,53,0.3) 100%)'}}>
        {(values.connected || values.connected || values.connected)?
        (<Grid container spacing={5} justifyContent='center' alignItems='flex-end'>
          <Grid id={tier.title} item key={tier.title} xs={12} sm={tier.title === 'Upskill' ? 12 : 6} md={4}>
            <Card  sx={{mb: 5, boxShadow: 2, transform: 'unset', borderBottomColor: 'rgba(0,0,0,0)', borderBottomStyle: 'inset', borderBottomWidth: {xs: 2, md: 4}, '&:hover': {transform: {xs:'translateY(-3px)', md: 'translateY(-3px) scale(1.03)'}, borderBottomColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}, 
                    transition: (theme)=>theme.transitions.create(['transform', 'height', 'border-bottom-color'], {duration: 500}), [`& .${cardHeaderClasses.title}`]:{color: 'primary.contrastText'}, [`& .${cardHeaderClasses.subheader}`]:{color: 'primary.contrastText'}, [`& .${cardHeaderClasses.root}`]:{px: {xs: 1, md: 2}}, [`& .${cardContentClasses.root}`]:{px: {xs: 0, sm: 1, md: 2}}, 
              }}>
              <Fade timeout={2000} appear={true} in={true} color='inherit' unmountOnExit={true}>
                <Box component='span'>
                  <CardHeader
                    title={tier.title+' Connection Status'}
                    titleTypographyProps={{ align: 'center' }}
                    {...(values.error &&  {subheader:'Error:', action:<Error />})}
                    {...(values.connecting &&  {subheader:'Connecting:', action: null})}
                    {...(values.connected &&  {subheader:'Connected with:', action:<Check />})}  
                    subheaderTypographyProps={{
                        align: 'center',
                    }}
                    sx={{backgroundColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}
                  />
                  <CardContent sx={{minHeight: '30vh'}}>
                    <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                      {values.error && 
                      (<>
                      <Typography variant="h6" color="text.secondary">
                          Could not connect your Stripe account. Try again later.
                      </Typography>
                      <StyledButton onClick={reset} variant="contained" color='primary'>
                        Retry
                      </StyledButton>
                      </>)}
                      {values.connecting && 
                      (<>
                      <Typography variant="h6" color="text.secondary">
                          Connecting your Stripe account ...
                      </Typography>
                      <HashLoader style={{marginTop: '10px'}} size={10}/>
                      </>)}
                      {values.connected && 
                      (<>
                      <Typography variant="h6" color="text.secondary">
                          Your Stripe account successfully connected! Proceed to sell course.
                      </Typography>
                      <StyledButton onClick={redirect} variant='outlined' color='secondary' style={{width: '100%', justifyContent: 'center'}}
                       startIcon={<LocalLibrary sx={{color: 'secondary.main'}}/>}>
                        View Courses
                      </StyledButton>
                      </>)}
                    </Box>
                  </CardContent>
                </Box>
              </Fade>
            </Card>
          </Grid>
        </Grid>):
        (<TiersConnect tiers={tiers.filter(tier=>tier.title!=='Free')} />)}
      </Dialog>
    )
}
export default StripeConnect