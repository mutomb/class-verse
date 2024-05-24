import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import {useTheme} from '@mui/material/styles'
import file from '../../public/files/privacy_policy_go2.pdf'
import { Logo } from "../logo";
import logo from '../../public/logo.svg'
import { WallPaperYGW } from "../wallpapers/wallpapers";

interface TCProps{
    updateComplied?: (arg: Boolean)=>void
}
const PrivacyAndPolicy: FC<TCProps> = () => {
    const theme = useTheme()
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
      <Box id="privacy-policy" sx={{ px: {xs: 0, md: 2}, py: 1.5, boxShadow: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          <Typography variant="h6" sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'primary.main' }}>
          Privacy
        </Typography>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', md: '2rem' }, ml: {xs: 1, sm: 'unset'}, mb: 1, color: 'secondary.main' }}>
          Policy
        </Typography>
        </Box>
          <Box component='embed' type="application/pdf" src={file} sx={{width: {xs: '100%', md: '90%'}, height:'100vh', borderRadius: 4}}/>
      </Box>
    </WallPaperYGW>
    );
  }
export default PrivacyAndPolicy