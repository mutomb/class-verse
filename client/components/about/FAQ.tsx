import  React, {SyntheticEvent, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Container, Fab, Link, Typography, accordionSummaryClasses, avatarClasses, typographyClasses } from '@mui/material';
import {Email, ExpandMore} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'

export default function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme()
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const qa=[
          {q:<Typography component="h3" variant="subtitle2">
          How do I contact customer support if I have a question or issue?
          </Typography>, 
          a: <Typography variant="body2" gutterBottom sx={{ maxWidth: { xs: '100%', md: '90%', color: 'text.secondary', } }} >
          You can reach our customer support team by emailing <Link>go-square-support@gmail.com </Link>
              or sending us a message directly our ChatBot                 
              <Fab variant='circular' sx={{mx: 1, backgroundColor:'primary.main', color:'primary.contrastText', border:'1px solid', borderColor:'primary.contrastText'}}>
                  <Email color='inherit' sx={{mx:0, my:0}}/>
              </Fab>
                that is located at the bottom-left of the screen on the website. We're here to assist you promptly.
          </Typography>
          },
          {q:<Typography component="h3" variant="subtitle2">
          Can I get a refund if the service doesn't meet my expectations?
          </Typography>, 
          a: <Typography variant="body2" gutterBottom sx={{ maxWidth: { xs: '100%', md: '90%', color: 'text.secondary', } }} >
            Absolutely! We offer a hassle-free refund policy. If you're not completely satisfied, 
              you can claim a refund via email or on our ChatBot with 30 days of the payment. If your reasons for claiming the refund are valid based on our refun policy, then you will be paid out in full within 30 days of your claim. 
            </Typography>
          },
          {q:
          <Typography component="h3" variant="subtitle2">
          What makes GO<Typography variant="subtitle1" sx={{display: 'inline', mr: 1}}><sup>2</sup></Typography> stand out from others in the market?
           </Typography>
           , 
          a: <>
          <Typography variant="body2" gutterBottom sx={{ maxWidth: { xs: '100%', md: '90%', color: 'text.secondary', } }} >
          For Client, our product distinguishes itself through its focus learning, consulting and progress tracking features as well as it affordability. 
          We prioritize user satisfaction, by facilitating the learning process through continuous consulting and progress tracking. 
          We have attempted to make our courses and specialist afforable by limiting the cost you pay to $10/course or $10/hour of consultation. 
          This hopefully allows you access top-notch courses and highly skill specialist at the tip of your finger without selling an arm and leg.
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ maxWidth: { xs: '100%', md: '90%', color: 'text.secondary', } }} >
          For Specialist, our product distinguishes itself through its easy content hosting,  features. 
          We prioritize user satisfaction, by facilitating the learning process through continuous consulting and progress tracking.
          </Typography>
          </>
          }]
  return (
    <WallPaperYGW secondaryColor={theme.palette.background.paper} primaryColor={theme.palette.background.default}
    style={{
      '&::before': {
        content: '""',
        width: '100%',
        height: '100%',
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
      <Container id="faq" sx={{ px: {xs: 0, sm: 2}, py: { xs: 4, sm: 12 }, pb: { xs: 8, sm: 16 }, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, sm: 6 }, }} >
        <Box sx={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          <Typography variant="h6" sx={{mr:1, fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'primary.main' }}>
            Frequent
          </Typography>
          <Typography variant="h6" sx={{fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'secondary.main' }}>
            Questions
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          {qa && qa.map((item, index)=>{
          return (
          <Accordion
            key={index} expanded={expanded === String(index)} onChange={handleChange(String(index))}
            sx={{ p:0, bgcolor: 'background.paper', borderRadius: 3, ':hover':{boxShadow: 2}}}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1d-content"
              id="panel1d-header"
              sx={{ color: 'text.primary', display: 'flex', alignContent: 'center', justifyContent: 'flex-start',  [`& .${typographyClasses.root}`]: { color: 'text.primary'}, 
              '&:hover':{[`& .${avatarClasses.root}`]: { backgroundColor: 'primary.main', color: 'primary.contrastText', boxShadow: 2}, [`& .${accordionSummaryClasses.expandIconWrapper}`]: { color: 'primary.main'},
                          [`& .${typographyClasses.root}`]: { color: 'primary.main'}}
                }}
            >
              <Avatar sx={{borderRadius: '50%', width:{xs: 20, sm:30}, height:{xs: 20, sm:30}, mr: {xs: 1, sm: 2}, }}>
                {index+1}
              </Avatar>
              <Typography component="h3" variant="subtitle2">
                {item.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {item.a}
            </AccordionDetails>
          </Accordion>)
          })}
        </Box>
      </Container>
    </WallPaperYGW>
  );
}
