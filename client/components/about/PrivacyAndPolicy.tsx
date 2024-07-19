import React, { FC } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import {useTheme} from '@mui/material/styles'
import file from '../../public/files/privacy_policy_go2.pdf'
import logo from '../../public/logo.svg'
import { WallPaperYGW } from "../wallpapers/wallpapers";
import { FileDownload } from "@mui/icons-material";

interface TCProps{
    updateComplied?: (arg: Boolean)=>void
}
const PrivacyAndPolicy: FC<TCProps> = () => {
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
          left: {xs: 'unset', md: '50%'},
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          opacity: 0.5,
        },
        '& > div':{
          position: 'relative'
        }
      }}>
      <Box id="privacy-policy" sx={{ px: {xs: 0, md: 2}, py: { xs: 4, sm: 12 }, boxShadow: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          <Typography variant="h6" sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'primary.main' }}>
          Privacy
        </Typography>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'secondary.main' }}>
          Policy
        </Typography>
        </Box>
        {xsMobileView?
        (<Box component='a' href={file} sx={{width: '100%', display: 'flex', px: {xs:0, sm: 3}, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', color: 'primary.main', '&:hover':{textDecorationLine: 'underline'}}}>
          <Typography component="h4" variant="h4" sx={{fontSize: '1rem', display: 'flex', alignItems: 'center'}}>
            <FileDownload sx={{color:'primary.main', verticalAlign: 'text-top', display: {xs: 'none', sm: 'inline-block'}}}/> 
            Click To view 
          </Typography>
        </Box>):
          <Box component='embed' type="application/pdf" src={file} sx={{width: {xs: '100%', md: '90%'}, height:'100vh', borderRadius: 4}}/>
        }
      </Box>
    </WallPaperYGW>
    );
  }
export default PrivacyAndPolicy