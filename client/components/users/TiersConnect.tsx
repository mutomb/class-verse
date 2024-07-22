import React, { FC, useState } from 'react';
import {Box, Card, CardActions, CardContent, CardHeader, Grid, Typography, cardHeaderClasses, Link as MuiLink, useMediaQuery, Divider, Fade, cardContentClasses, SvgIcon} from '@mui/material';
import {ArrowBack, AttachMoney, Check, LocalLibrary} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles'
import { Link, useHistory } from 'react-router-dom';
import { StyledButton } from '../styled-buttons';
import { useAuth } from '../auth';
import { scroller } from 'react-scroll'
import { TiersData } from './tiers.data';
import stripeIcon  from '../../public/images/icons/stripe-icon.svg'
import shopifyIcon  from '../../public/images/icons/shopify-icon.svg'
import payPalIcon  from '../../public/images/icons/paypal-icon.svg'

const stripe_connect_test_client_id = process.env.STRIPE_TEST_CLIENT_ID

interface TiersConnectProps{
  tiers: TiersData[] 
}
const TiersConnect:FC<TiersConnectProps> = ({tiers}) => {
  const theme= useTheme()
  const {isAuthenticated, updateUser} = useAuth()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const [more, setMore] = useState('')
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const history = useHistory()
  const [focus, setFocus] = useState<TiersData | undefined>()
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const handleNext = (nextStep: number, skipTo?: number, tier?: TiersData)=>{
    setFocus((prevState)=>{
      if((nextStep>0 || (skipTo && skipTo>0)) && tier){
        return tier
      }
      if((nextStep===0 || (skipTo && skipTo===0)) && tier){
        return undefined
      }
      return prevState
    })
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep(() => {
      if(skipTo) return skipTo 
      return nextStep
    });
    nextStep === 1 && tier && setTimeout(()=>{
      scroller.scrollTo(tier.title, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: -50
      })
    }, 100)
    setSkipped(newSkipped);
    let user = isAuthenticated().user
    user.tier = tier
    updateUser(user, ()=>{});
  };
  const handleBack = (prevStep: number, skipTo?: number, tier?: TiersData)=> {
    setFocus((prevState)=>{
      if((prevStep>0 || (skipTo && skipTo>0)) && tier){
        return tier
      }
      if((prevStep===0 || (skipTo && skipTo===0)) && tier){
        return undefined
      }
      return prevState
    })
    setActiveStep(() => {
      if(skipTo) return skipTo 
      return prevStep
    });
    prevStep === 0 && tier && tier.title && setTimeout(()=>{
      scroller.scrollTo(tier.title, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: -50
      })
    }, 100)
    let user = isAuthenticated().user
    user.tier = focus
    updateUser(user, ()=>{});
  };
  const steps = [{label: '1'}, {label: '2'}, {label: '3'}, {label: '4'}]
  if(isAuthenticated().user && isAuthenticated().user.active_plan){
    let tier = tiers.find(tier=>tier.title=== isAuthenticated().user.active_plan);
    tier && 
    (<Grid id={tier.title} item key={tier.title} xs={12} sm={tier.title === 'Upskill' ? 12 : 6} md={4}>
      <Card  sx={{mb: 5, boxShadow: 2, transform: 'unset', borderBottomColor: 'rgba(0,0,0,0)', borderBottomStyle: 'inset', borderBottomWidth: {xs: 2, md: 4}, '&:hover': {transform: {xs:'translateY(-3px)', md: 'translateY(-3px) scale(1.03)'}, borderBottomColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}, 
                  transition: (theme)=>theme.transitions.create(['transform', 'height', 'border-bottom-color'], {duration: 500}), [`& .${cardHeaderClasses.title}`]:{color: 'primary.contrastText'}, [`& .${cardHeaderClasses.subheader}`]:{color: 'primary.contrastText'}, [`& .${cardHeaderClasses.root}`]:{px: {xs: 1, md: 2}},
                  [`& .${cardContentClasses.root}`]:{px: {xs: 0, sm: 1, md: 2}}, 
                  }}>
        <Fade timeout={2000} appear={true} in={true} color='inherit' unmountOnExit={true}>
            <Box component='span'>
              <CardHeader
              title={tier.title+' Activated'}
              subheader={'Connected with'}
              titleTypographyProps={{ align: 'center' }}
              action={<Check />}  
              subheaderTypographyProps={{
                  align: 'center',
              }}
              sx={{
                  backgroundColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}
              />
              <CardContent sx={{minHeight: '30vh'}}>
                <Typography variant="h6" color='text.secondary'>
                  Currently Active Account
                </Typography>
                <Typography variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
                <Check sx={{color: 'primary.main'}}/> You have successfully paid for to the {tier.title} payment plan. Please proceed to your admin portal sell courses.
                </Typography>
              </CardContent>
              <CardActions sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '& > button':{ mb: 1, width: 'fit-content'}}}>
                {isAuthenticated().user && isAuthenticated().user.specialist? 
                (<StyledButton onClick={()=>history.push("/specialist/courses")} variant='outlined' color='secondary' style={{width: '100%', justifyContent: 'center'}}
                  startIcon={<LocalLibrary sx={{color: 'secondary.main'}}/>}>
                    Teach
                  </StyledButton>
                ):(
                  (<StyledButton onClick={()=>history.push("/client/courses")} variant='outlined' color='secondary' style={{width: '100%', justifyContent: 'center'}}
                  startIcon={<LocalLibrary sx={{color: 'secondary.main'}}/>}>
                    Learn
                  </StyledButton>
                  )
                )}
              </CardActions>
            </Box>
        </Fade>
      </Card>
    </Grid>)
  }
  return (
      <Grid container spacing={5} justifyContent='center' alignItems='flex-end'>
      {tiers && tiers.map((tier) => (
        (!xsMobileView || !focus || focus.title===tier.title) &&
        (<Grid id={tier.title} item key={tier.title} xs={12} sm={tier.title === 'Upskill' ? 12 : 6} md={4}>
          {(!focus || focus.title===tier.title) &&
          (<Card  sx={{mb: 5, boxShadow: 2, transform: 'unset', borderBottomColor: 'rgba(0,0,0,0)', borderBottomStyle: 'inset', borderBottomWidth: {xs: 2, md: 4}, '&:hover': {transform: {xs:'translateY(-3px)', md: 'translateY(-3px) scale(1.03)'}, borderBottomColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}, 
                      transition: (theme)=>theme.transitions.create(['transform', 'height', 'border-bottom-color'], {duration: 500}), [`& .${cardHeaderClasses.title}`]:{color: 'primary.contrastText'}, [`& .${cardHeaderClasses.subheader}`]:{color: 'primary.contrastText'}, [`& .${cardHeaderClasses.root}`]:{px: {xs: 1, md: 2}},
                      [`& .${cardContentClasses.root}`]:{px: {xs: 0, sm: 1, md: 2}}, 
                      }}>
            {(activeStep === steps.length && focus && focus.title === tier.title)?
            (<Fade timeout={2000} appear={true} in={true} color='inherit' unmountOnExit={true}>
                <Box component='span'>
                  <CardHeader
                  title={tier.title+' Activated'}
                  subheader={'Connected with'}
                  titleTypographyProps={{ align: 'center' }}
                  action={<Check />}  
                  subheaderTypographyProps={{
                      align: 'center',
                  }}
                  sx={{
                      backgroundColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}
                  />
                  <CardContent sx={{minHeight: '30vh'}}>
                    <Typography variant="h6" color='text.secondary'>
                      Currently Active Account
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ fontSize: { xs: 16, md: 21 } }}>
                    <Check sx={{color: 'primary.main'}}/> You have successfully paid for to the {tier.title} payment plan. Please proceed to your admin portal sell courses.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '& > button':{ mb: 1, width: 'fit-content'}}}>
                    {isAuthenticated().user && isAuthenticated().user.specialist? 
                    (<StyledButton onClick={()=>history.push("/specialist/courses")} variant='outlined' color='secondary' style={{width: '100%', justifyContent: 'center'}}
                      startIcon={<LocalLibrary sx={{color: 'secondary.main'}}/>}>
                        Teach
                      </StyledButton>
                    ):(
                      (<StyledButton onClick={()=>history.push("/client/courses")} variant='outlined' color='secondary' style={{width: '100%', justifyContent: 'center'}}
                      startIcon={<LocalLibrary sx={{color: 'secondary.main'}}/>}>
                        Learn
                      </StyledButton>
                      )
                    )}
                  </CardActions>
                </Box>
            </Fade>): 
            (<>
            {activeStep ===0 && 
              (<Fade timeout={2000} appear={true} in={true} color='inherit' unmountOnExit={true}>
                  <Box component='span'>
                    <CardHeader
                    title={tier.title}
                    subheader={tier.subheader}
                    titleTypographyProps={{ align: 'center' }}
                    action={tier.title === 'Free' ? null: <AttachMoney sx={{color: 'primary.contrastText'}}/> }
                    subheaderTypographyProps={{
                        align: 'center',
                    }}
                    sx={{
                        backgroundColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}
                    />
                    <CardContent sx={{minHeight: '30vh'}}>
                      {(!isAuthenticated().user || !isAuthenticated().user.specialist) &&
                      (<Box component='ul' sx={{ m: 0, p: 0, listStyle: 'none' }}>
                        <Typography component="li" variant='h5' align="center" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}>
                          Client
                        </Typography>
                        {tier.price && tier.price.course && 
                        (<Box component='li' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, }}>
                          <Typography component="h3" variant="h4" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}>
                          ${tier.price.course}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                          /Course
                          </Typography>
                        </Box>)}
                        {tier.price && tier.price.consult_course && 
                        (<Box component='li' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, }}>
                          <Typography component="h3" variant="h4" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}>
                          ${tier.price.consult_course}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                          /Consult hour (non-training)
                          </Typography>
                        </Box>)}
                        {tier.price && tier.price.consult_upskill && 
                        (<Box component='li' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, }}>
                          <Typography component="h3" variant="h4" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}>
                          ${tier.price.consult_upskill}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                          /Consult hour (training)
                          </Typography>
                        </Box>)}
                        {tier.client && tier.client.map(({main, detail}, index) => (
                        <Box key={index} sx={{display: 'flex', alignItems: 'start', justifyContent: 'flex-start', mb: 1}}>
                          <Check sx={{width: {xs: 30, sm: 40}, color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main', verticalAlign: 'text-top'}} />
                          <Typography component="li" variant="subtitle1" align="left">
                            {main} {detail && (detail === more? 
                            <>
                            {detail} <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setMore('')}} underline="hover" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main', cursor: 'pointer'}}>Hide</MuiLink>
                            </>: 
                            <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setMore(detail)}} underline="hover" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main', cursor: 'pointer'}}>Read more</MuiLink>)}
                          </Typography>
                        </Box>
                        ))}
                      </Box>)}
                      {(!isAuthenticated().user || isAuthenticated().user.specialist) &&
                      (<Box component='ul' sx={{ m: 0, p: 0, listStyle: 'none' }}>
                        <Typography component="li" variant='h5' align="center" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}>
                          Specialist
                        </Typography>
                        <Box component='li' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2, }}>
                          <Typography component="h3" variant="h4" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}>
                            ${tier.price.specialist}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                          /Month
                          </Typography>
                        </Box>
                        {tier.specialist && tier.specialist.map(({main, detail}, index) => (
                        <Box key={index} sx={{display: 'flex', alignItems: 'start', justifyContent: 'flex-start', mb: 1}}>
                          <Check sx={{width: {xs: 30, sm: 40}, color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main', verticalAlign: 'text-top'}} />
                          <Typography component="li" variant="subtitle1" align="left">
                            {main} {detail && (detail === more? 
                            <>
                            {detail} <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setMore('')}} underline="hover" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main', cursor: 'pointer'}}>Hide</MuiLink>
                            </>: 
                            <MuiLink component='a' onClick={(event)=>{event.preventDefault(); setMore(detail)}} underline="hover" sx={{color: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main', cursor: 'pointer'}}>Read more</MuiLink>)}
                          </Typography>
                        </Box>
                        ))}
                      </Box>)}
                    </CardContent>
                    {(!isAuthenticated().user || tier.title !=='Free') &&
                    (<CardActions sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      {!isAuthenticated().user &&
                      (<Link to='/signin' style={{textDecoration: 'none', width: '100%'}}>
                        <StyledButton color={tier.title ==='Upskill'? 'secondary': tier.title ==='Study'? "primary": 'error'} style={{width: '100%', justifyContent: 'center'}} variant={tier.buttonVariant as 'outlined' | 'contained'}>
                          {tier.buttonText}
                        </StyledButton>
                      </Link>)}
                      {isAuthenticated().user && isAuthenticated().user.specialist && !isAuthenticated().user.stripe_seller && !isAuthenticated().user.shopify_seller && !isAuthenticated().user.paypal_seller &&
                      (<StyledButton onClick={()=>{handleNext(1, undefined, tier)}} color={tier.title ==='Upskill'? 'secondary': tier.title ==='Study'? "primary": 'error'} style={{width: '100%', justifyContent: 'center'}} variant={tier.buttonVariant as 'outlined' | 'contained'}>
                          Activate
                      </StyledButton>
                      )}
                      {isAuthenticated().user && isAuthenticated().user.specialist && (isAuthenticated().user.stripe_seller || isAuthenticated().user.shopify_seller || isAuthenticated().user.paypal_seller) && 
                      (<StyledButton onClick={()=>{isAuthenticated().user && history.push("/user/" + isAuthenticated().user._id)}} variant='contained' color='disabled' style={{width: '100%', justifyContent: 'center'}}>
                          {isAuthenticated().user.stripe_seller? " Stripe Connected": isAuthenticated().user.shopify_seller? "Shopify Connected": "Paypal Connected"}
                      </StyledButton>
                      )}
                      {isAuthenticated().user && !isAuthenticated().user.specialist && tier.title === 'Free' &&
                      (<StyledButton onClick={()=>{handleNext(1, undefined, tier)}} color={"error"} style={{width: '100%', justifyContent: 'center'}} variant={tier.buttonVariant as 'outlined' | 'contained'}>
                          Browser
                      </StyledButton>
                      )}
                      {isAuthenticated().user && !isAuthenticated().user.specialist && tier.title === 'Study' &&
                      (<StyledButton onClick={()=>{scroller.scrollTo('search', {duration: 1000, spy: true, offset: -10, delay: 100, smooth: true})}} color={"primary"} style={{width: '100%', justifyContent: 'center'}} variant={tier.buttonVariant as 'outlined' | 'contained'}>
                          Browser and Buy
                      </StyledButton>
                      )}
                      {isAuthenticated().user && !isAuthenticated().user.specialist && tier.title === 'Upskill' &&
                      (<StyledButton onClick={()=>{handleNext(1, undefined, tier)}} color={'secondary'} style={{width: '100%', justifyContent: 'center'}} variant={tier.buttonVariant as 'outlined' | 'contained'}>
                          Activate
                      </StyledButton>
                      )}
                    </CardActions>)}
                  </Box>
              </Fade>)}
            {activeStep ===1 && focus && focus.title === tier.title &&
            (<Fade timeout={2000} appear={true} in={true} color='inherit' unmountOnExit={true}>
              <Box component='span'>
                <CardHeader
                    title={tier.title+ ' Plan Selected'}
                    subheader={'Payment options:'}
                    titleTypographyProps={{ align: 'center' }}
                    action={
                      <Typography component="h2" variant="h3" sx={{ color: 'primary.contrastText'}}>
                        ${tier.price.specialist}
                      </Typography>
                    }
                    avatar={<ArrowBack sx={{color: 'primary.contrastText'}} onClick={()=>handleBack(0, undefined, tier)} />}
                    subheaderTypographyProps={{
                        align: 'center',
                    }}
                    sx={{
                        backgroundColor: tier.title === 'Study'? 'primary.main': tier.title === 'Free'?  'error.dark':'secondary.main'}}
                    />
                <CardContent sx={{minHeight: '30vh'}}>
                  <Box sx={{width: '100%', display: 'flex', justifyContent: 'center',}}>
                    <Typography variant="h6" color="text.secondary">
                      Please subscribe using one of these secure payment options:
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '& > a':{ mb: 1, ml: '0px !important', width: 'fit-content'}}}>
                  <Box component='a' href={"https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+stripe_connect_test_client_id+"&scope=read_write"}>
                    <StyledButton variant="contained" color='primary' style={{width: '100%', justifyContent: 'center'}}
                    endIcon={
                      <Typography component="h2" variant="h3" sx={{ color: 'primary.contrastText'}}>
                        <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" /> S 
                      </Typography> 
                    }>
                      Pay with Stripe
                    </StyledButton>
                  </Box>
                  <Box component='a' href={"https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+stripe_connect_test_client_id+"&scope=read_write"}>
                    <StyledButton variant="contained" color='dark' style={{width: '100%', justifyContent: 'center'}}
                    endIcon={
                      <Box sx={{ '& img': { width: { xs: 15, md: 20 }, height: 'auto' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" /><img src={payPalIcon}/>  
                      </Box>
                    }>
                      Pay with Paypal
                    </StyledButton>
                  </Box>
                  <Box component='a' href={"https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+stripe_connect_test_client_id+"&scope=read_write"}>
                    <StyledButton variant="contained" color='secondary' style={{width: '100%', justifyContent: 'center'}}
                    endIcon={
                      <Box sx={{ '& img': { width: { xs: 15, md: 20 }, height: 'auto' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Divider component='span' sx={{ height: 28, m: 0.5,}} orientation="vertical" /><img src={shopifyIcon}/> 
                      </Box>
                    }>
                      Pay with Shopify
                    </StyledButton>
                  </Box>
                </CardActions>
              </Box>
            </Fade>)}
            </>)}
          </Card>)}
        </Grid>)
      ))}
      </Grid>
  );
}
export default TiersConnect