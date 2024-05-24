import  React, {SyntheticEvent, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Container, Link, Typography, accordionSummaryClasses, avatarClasses, typographyClasses } from '@mui/material';
import {ExpandMore} from '@mui/icons-material';
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
          {q:<>How do I contact customer support if I have a question or issue?</>, 
          a: <>You can reach our customer support team by emailing <Link>go2support@gmail.com </Link>
              or calling our helpdesk number <Link>(+27) 81 296 5730</Link>. We're here to assist you promptly.</>
          },
          {q:<>Can I return the product if it doesn&apos;t meet my expectations?</>, 
          a: <>Absolutely! We offer a hassle-free return policy. If you're not completely satisfied, 
              you can return the product within 3 days for a full refund or exchange.</>
          },
          {q:<>What makes your product stand out from others in the market?</>, 
          a: <>Our product distinguishes itself through its adaptability, durability,
          and innovative features. We prioritize user satisfaction and
          continually strive to exceed expectations in every aspect.</>
          },
          {q:<> Is there a warranty on the product, and what does it cover?</>, 
          a: <>Yes, our product comes with a [length of warranty] warranty. It covers
          defects in materials and workmanship. If you encounter any issues
          covered by the warranty, please contact our customer support for
          assistance.</>
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
      <Container id="faq" sx={{ px: {xs: 0, sm: 2}, pt: { xs: 4, sm: 12 }, pb: { xs: 8, sm: 16 }, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 3, sm: 6 }, }} >
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
              <Typography
                variant="body2"
                gutterBottom
                sx={{ maxWidth: { xs: '100%', md: '90%', color: 'text.secondary', } }}
              >
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>)
          })}
        </Box>
      </Container>
    </WallPaperYGW>
  );
}
