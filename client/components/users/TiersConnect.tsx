import React, { FC, useState } from 'react';
import {Box, Card, CardActions, CardContent, CardHeader, Grid, Typography, cardHeaderClasses, Link as MuiLink, useMediaQuery, Divider, Fade, cardContentClasses, SvgIcon} from '@mui/material';
import {ArrowBack, AttachMoney, Check, LocalLibrary} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles'
import { Link, useHistory } from 'react-router-dom';
import { StyledButton } from '../styled-buttons';
import { useAuth } from '../auth';
import { scroller } from 'react-scroll'
import { TiersData } from './tiers.data';
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
                    startIcon={
                      <SvgIcon sx={{verticalAlign: 'text-top', mr: 1}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" fill="#6772e5"><path d="M111.328 15.602c0-4.97-2.415-8.9-7.013-8.9s-7.423 3.924-7.423 8.863c0 5.85 3.32 8.8 8.036 8.8 2.318 0 4.06-.528 5.377-1.26V19.22a10.246 10.246 0 0 1-4.764 1.075c-1.9 0-3.556-.67-3.774-2.943h9.497a39.64 39.64 0 0 0 .063-1.748zm-9.606-1.835c0-2.186 1.35-3.1 2.56-3.1s2.454.906 2.454 3.1zM89.4 6.712a5.434 5.434 0 0 0-3.801 1.509l-.254-1.208h-4.27v22.64l4.85-1.032v-5.488a5.434 5.434 0 0 0 3.444 1.265c3.472 0 6.64-2.792 6.64-8.957.003-5.66-3.206-8.73-6.614-8.73zM88.23 20.1a2.898 2.898 0 0 1-2.288-.906l-.03-7.2a2.928 2.928 0 0 1 2.315-.96c1.775 0 2.998 2 2.998 4.528.003 2.593-1.198 4.546-2.995 4.546zM79.25.57l-4.87 1.035v3.95l4.87-1.032z" fill-rule="evenodd"/><path d="M74.38 7.035h4.87V24.04h-4.87z"/><path d="M69.164 8.47l-.302-1.434h-4.196V24.04h4.848V12.5c1.147-1.5 3.082-1.208 3.698-1.017V7.038c-.646-.232-2.913-.658-4.048 1.43zm-9.73-5.646L54.698 3.83l-.02 15.562c0 2.87 2.158 4.993 5.038 4.993 1.585 0 2.756-.302 3.405-.643v-3.95c-.622.248-3.683 1.138-3.683-1.72v-6.9h3.683V7.035h-3.683zM46.3 11.97c0-.758.63-1.05 1.648-1.05a10.868 10.868 0 0 1 4.83 1.25V7.6a12.815 12.815 0 0 0-4.83-.888c-3.924 0-6.557 2.056-6.557 5.488 0 5.37 7.375 4.498 7.375 6.813 0 .906-.78 1.186-1.863 1.186-1.606 0-3.68-.664-5.307-1.55v4.63a13.461 13.461 0 0 0 5.307 1.117c4.033 0 6.813-1.992 6.813-5.485 0-5.796-7.417-4.76-7.417-6.943zM13.88 9.515c0-1.37 1.14-1.9 2.982-1.9A19.661 19.661 0 0 1 25.6 9.876v-8.27A23.184 23.184 0 0 0 16.862.001C9.762.001 5 3.72 5 9.93c0 9.716 13.342 8.138 13.342 12.326 0 1.638-1.4 2.146-3.37 2.146-2.905 0-6.657-1.202-9.6-2.802v8.378A24.353 24.353 0 0 0 14.973 32C22.27 32 27.3 28.395 27.3 22.077c0-10.486-13.42-8.613-13.42-12.56z" fill-rule="evenodd"/></svg>
                      </SvgIcon> 
                    }>
                      Connect with Stripe
                    </StyledButton>
                  </Box>
                  <Box component='a' href={"https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+stripe_connect_test_client_id+"&scope=read_write"}>
                    <StyledButton variant="contained" color='dark' style={{width: '100%', justifyContent: 'center'}}
                    startIcon={
                      <SvgIcon sx={{verticalAlign: 'text-top', mr: 1}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><g transform="matrix(.123006 0 0 .123006 -29.423026 -14.127235)"><path d="M754.6 298.1c0 54.6-22.7 98.7-68 132.2s-108.6 50.2-190 50.2h-45L417.1 630H298.2L408 171.2h161c30 0 56.1 2.1 78.5 6.2 22.3 4.1 41.6 11.2 57.8 21.3 16 10.1 28.3 23.2 36.7 39.3 8.4 16 12.6 36.1 12.6 60.1z" fill="#009cde"/><path d="M421.1 634.9H292l112.2-468.7H569c30.1 0 56.8 2.1 79.3 6.2 22.8 4.2 42.8 11.6 59.5 21.9 16.7 10.5 29.7 24.4 38.5 41.2s13.2 37.8 13.2 62.5c0 56-23.5 101.9-70 136.2-46 34-110.9 51.2-193 51.2h-41.1zm-116.6-9.8h108.7l34.5-149.5h48.9c79.9 0 142.9-16.6 187.1-49.3 21.9-16.2 38.6-35.2 49.5-56.4s16.4-45.4 16.4-71.8c0-23.1-4.1-42.6-12.1-58-8-15.3-19.7-27.8-34.9-37.4-15.6-9.7-34.5-16.6-56.1-20.6-21.9-4-48-6.1-77.6-6.1h-157z" fill="#fff"/><path d="M701.8 247c0 54.6-22.7 98.7-68 132.2s-108.6 50.2-190 50.2h-45l-34.5 149.5H245.4L351.3 120h164.9c30 0 56.1 2.1 78.5 6.2 22.3 4.1 41.6 11.2 57.8 21.3 16 10.1 28.3 23.2 36.7 39.3 8.4 16 12.6 36.1 12.6 60.2z" fill="#0f3572"/><path d="M368.2 583.8h-129l108.1-468.7h168.9c30.1 0 56.8 2.1 79.3 6.2 22.8 4.2 42.8 11.6 59.5 21.9 16.7 10.5 29.7 24.4 38.5 41.2s13.2 37.8 13.2 62.5c0 56-23.5 101.9-70 136.2-46 34-110.9 51.2-193 51.2h-41.1zm-116.6-9.9h108.8l34.5-149.5h48.9c79.9 0 142.9-16.6 187.1-49.3 21.9-16.2 38.6-35.2 49.5-56.4s16.4-45.4 16.4-71.8c0-23.1-4.1-42.6-12.1-58-8-15.3-19.7-27.8-34.9-37.4-15.6-9.7-34.5-16.6-56.1-20.6-21.9-4-48-6.1-77.6-6.1h-161zm328-310.6c-.9 14-3.7 24.3-12.3 36.2-8.5 11.9-18.5 19.6-31.9 26-8.1 3.8-16.5 6.3-25.3 7.5s-19.3 1.9-31.6 1.9h-59.1l33.1-118.6h53.7c13.7 0 24.7.2 33 2.1 8.3 1.8 15.1 4.3 20.2 7.4 7.1 4.2 12.8 9.3 16.1 15.8 4.1 7.6 4.6 12.5 4.1 21.7z" fill="#fff"/></g></svg>
                      </SvgIcon> 
                    }>
                      Paypal
                    </StyledButton>
                  </Box>
                  <Box component='a' href={"https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+stripe_connect_test_client_id+"&scope=read_write"}>
                    <StyledButton variant="contained" color='secondary' style={{width: '100%', justifyContent: 'center'}}
                    startIcon={
                      <SvgIcon sx={{verticalAlign: 'text-top', mr: 1}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M53.137 12.484c-.047-.283-.278-.5-.564-.527-.225-.037-5.17-.376-5.17-.376l-3.77-3.77c-.34-.376-1.092-.266-1.376-.188-.037 0-.752.225-1.922.605-1.137-3.29-3.15-6.306-6.696-6.306h-.303C32.32.605 31.076 0 30.026 0c-8.256.037-12.19 10.333-13.434 15.594l-5.77 1.77c-1.77.564-1.835.605-2.073 2.293L3.882 57.175 40.35 64l19.763-4.26c0-.037-6.94-46.897-6.976-47.255zM38.313 8.86c-.917.303-1.963.605-3.09.945v-.68a15.03 15.03 0 0 0-.752-4.999c1.848.284 3.09 2.357 3.843 4.733zm-6.068-4.298c.603 1.778.883 3.65.826 5.527v.34l-6.375 1.963c1.248-4.66 3.55-6.962 5.55-7.83zm-2.45-2.293a1.94 1.94 0 0 1 1.055.339c-2.66 1.238-5.472 4.366-6.678 10.627l-5.045 1.546C20.55 10.03 23.87 2.26 29.792 2.26z" fill="#95bf47"/><path d="M52.573 11.957c-.225-.037-5.17-.376-5.17-.376l-3.77-3.77c-.14-.142-.33-.223-.527-.225L40.354 64l19.763-4.26-6.98-47.218a.68.68 0 0 0-.564-.564z" fill="#5e8e3e"/><path d="M33.64 22.89l-2.454 7.242c-1.483-.718-3.104-1.104-4.752-1.133-3.848 0-4.036 2.412-4.036 3.018 0 3.298 8.636 4.564 8.636 12.333 0 6.11-3.885 10.03-9.1 10.03-6.26 0-9.467-3.885-9.467-3.885l1.665-5.55s3.28 2.83 6.073 2.83a2.47 2.47 0 0 0 2.564-2.49c0-4.34-7.09-4.527-7.09-11.618 0-5.962 4.298-11.77 12.934-11.77 3.394.05 5.018.99 5.018.99z" fill="#fff"/></svg>
                      </SvgIcon>
                    }>
                      Shopify
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