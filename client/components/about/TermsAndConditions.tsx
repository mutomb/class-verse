import React, { FC } from "react";
import { Box, Fab, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
import file from '../../public/files/terms_and_conditions_go2.pdf'
import { FileDownload } from "@mui/icons-material";

interface TCProps{
    updateComplied?: (arg: Boolean)=>void
}
const TermsAndConditions: FC<TCProps> = ({updateComplied}) => {
    const theme = useTheme()
    const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'))

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
        <Box id="terms-conditions" sx={{ width: '100%', px: {xs: 0, sm: 2}, pt: { xs: 4, sm: 12 }, boxShadow: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <Box sx={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography variant="h6" sx={{mr: 1, fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'primary.main' }}>
              Terms
              </Typography>
              <Typography variant="h6" sx={{mr: 1, fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'text.primary' }}>
              &
              </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'secondary.main' }}>
              Conditions
            </Typography>
            </Box>
            {(xsMobileView && !updateComplied)?
            (<Box component='a' href={file} sx={{width: '100%', display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', color: 'primary.main', '&:hover':{textDecorationLine: 'underline'}}}>
              <Typography component="h4" variant="h4" sx={{fontSize: '1rem', display: 'flex', alignItems: 'center'}}>
                <FileDownload sx={{color:'primary.main', verticalAlign: 'text-top', display: {xs: 'none', sm: 'inline-block'}}}/> 
                Click To view 
              </Typography>
            </Box>):
            <Box component='embed' type="application/pdf" src={file} sx={{width: {xs: '100%', md: '90%'}, height:'100vh', borderRadius: 4}}/>
            }
          </Box>
          <Box>
            {updateComplied &&
              (<Box sx={{position: 'absolute', bottom: '30vh', left: '50%', right: '50%',  boxShadow: 4}}> 
                <Fab size='large' onClick={updateComplied} aria-label='I-agree-to-terms-and-conditions-button' variant='circular'
                    sx={{backgroundColor:'primary.main', color:'primary.contrastText', border:'1px solid', borderColor:'primary.contrastText', transform: 'unset',
                        opacity: 0.8, ':hover':{ backgroundColor:'secondary.main', transition: theme.transitions.create(['transform'], {duration: 500}), transform: 'translateY(-3px) scale(1.1)'}}}>
                  I Agree
                </Fab>
              </Box>)}
          </Box>
        </Box>
    </WallPaperYGW>
    );
  }
export default TermsAndConditions