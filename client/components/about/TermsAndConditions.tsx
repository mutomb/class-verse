import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import { Logo } from "../logo";
import { StyledButton } from "../styled-buttons";
import Copyright from "./Copyright";
import {useTheme} from '@mui/material/styles'
import { WallPaperYGW } from '../wallpapers/wallpapers';
import logo from '../../public/logo.svg'

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
        <Box id="terms-conditions" sx={{ px: {xs: 0, sm: 2}, py: 1.5, boxShadow: 1, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
          </Box>
          <Typography
          variant="body2" 
          sx={{ lineHeight: 1.5, color: 'text.primary'}}>
            <p>Thanks for using this application. We hope you like it. If not, reach out to claim a refund!</p>
            <p>Thanks to Jeanluc Mutomb, GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> group and other contributors for all the help.</p>
            <p>This software is copyrighted by GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>, Inc. The following terms apply to web pages 
            associated with the GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography> web app, unless explicitly disclaimed in individual pages:</p>
            <p>The authors hereby grant permission to use this web application only for educational purposes
              in accordance with  the licensing terms described here.</p>
            <p>
            In no event shall the authors or distributors be liable to any party for direct, indirect, special, 
            incidental, or consequential damages arising out of the use of this software, its documentation, or 
            any derivatives thereof, even if the authors have been advised of the possibility of such damage,
            even if such incident occurs (including, without limitation, for any loss directly or indirectly attributable to our gross 
            negligence or willful default or that of any other person acting for or controlled by us)  by GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>.
            </p>
            <p>
            The authors and distributors specifically disclaim any warranties, including, but not limited to, 
            the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.  
            This software is provided on an "as is" basis, and the authors and distributors have no obligation 
            to provide maintenance, support, updates, enhancements, or modifications.
            </p>
          </Typography>
          <Copyright sx={{ mt: 5 }} />
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