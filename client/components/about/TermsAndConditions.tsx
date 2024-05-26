import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import { StyledButton } from "../styled-buttons";
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'
import file from '../../public/files/terms_and_conditions_go2.pdf'

interface TCProps{
    updateComplied?: (arg: Boolean)=>void
}
const TermsAndConditions: FC<TCProps> = ({updateComplied}) => {
    const theme = useTheme()
    
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
        <Box id="terms-conditions" sx={{ width: '100%', px: {xs: 0, sm: 2}, py: 1.5, boxShadow: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <Box component='embed' type="application/pdf" src={file} sx={{width: {xs: '100%', md: '90%'}, height:'100vh', borderRadius: 4}}/>
          </Box>
          <Box>
            {updateComplied && 
            <StyledButton type='button' disableHoverEffect={false} variant="contained" onClick={()=>updateComplied(true) }>
              I Agree
            </StyledButton>}
          </Box>
        </Box>
    </WallPaperYGW>
    );
  }
export default TermsAndConditions