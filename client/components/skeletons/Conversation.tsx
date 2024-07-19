import React, { FC } from 'react'
import { Box, Divider, Skeleton, Typography } from '@mui/material'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import logo from '../../public/logo.svg'
import { SendOutlined, VerifiedOutlined } from '@mui/icons-material'
interface ConversationProps{
  sx?:SxProps<Theme>
}
const Conversation: FC<ConversationProps> = ({sx}) => {  
    const theme = useTheme()
    const variants = ['sent', 'received', 'sent', 'received', 'received', 'sent', 'received', 'sent', 'received', 'sent', 'received', 'sent']
    const specialists = [0,1,0,1,1,0,1,0,1,0,1,0]
    return (
        <Box id="Conversation" sx={{py:'10vh', px: 0, width: '100%', height: '100%', maxHeight: '88vh', overflowY: 'scroll',  scrollbarWidth: {xs: 'none',  sm:'thin'},
        '&::before': {
            content: '""',
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundImage: `url(${logo})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
            opacity: 0.4,
            overflow: 'hidden'
          },
          '& > div':{
            position: 'relative'
          }, ...sx}}>
          {Array.from(new Array(5)).map((item, index) => (<>
            <Box sx={{px: {xs: 0, sm: 2}, width: '100%', display: 'flex', justifyContent: variants[index] ==='sent'? 'flex-start': 'flex-end', alignItems: 'center'}}>
              <Skeleton id='image'  width={40} height={40} sx={{boxShadow: 2, borderRadius: '50%', background: theme.palette.mode==='dark'? `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`: `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(18, 124, 113, 0.5) 97%, ${theme.palette.primary.main} 100%)`}} variant="rectangular"/>
                <Box sx={{minWidth:'50%', flexdisplay: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                  <Typography variant='subtitle1' sx={{color: 'text.secondary', fontSize: {xs: '0.6rem', md: '0.8rem'}, fontWeight: 700, display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Skeleton id='details-1' width={'50%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/> <VerifiedOutlined sx={{width: '1rem', height: '1rem', color: specialists[index]? 'primary.main':'secondary.main'}}/>
                  </Typography>
                  <Box sx={{boxShadow: 2, bgcolor: variants[index] ==='sent'?( theme.palette.mode==='dark'? 'primary.dark': 'primary.light'): (theme.palette.mode==='dark'? 'secondary.dark': 'secondary.light'), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', px: 1, pt: 1, borderRadius: 3}}>
                    <Typography variant='body2' sx={{color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem'}}}>
                      <Skeleton id='details-1' width={'30%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/>
                    </Typography>
                    <Typography variant='subtitle1' className='chat__message_timestamp' sx={{pt: 2, alignSelf: 'flex-end', color: 'text.secondary', fontSize: {xs: '0.5rem', md: '0.6rem'}}}>
                      <Skeleton id='details-1' width={'20%'} sx={{boxShadow: 2, background: 'background.default', borderRadius: 1}}/> 
                    </Typography>
                  </Box>
                </Box>
            </Box>
            {index<9 && <Divider sx={{opacity: 0, my: 1}} />}
          </>))}
          <Box id="message" sx={{ width: '100%', bgcolor: 'primary.dark', mt: 1, py: 0.5, px: {xs: 0.1, sm: 0.5, md: 1}, position: 'absolute !important', bottom: 0}}>
            <Box id="message_container" sx={{ px:{xs: 0, sm: 0.5, md: 1}, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 4,}}>
              <Skeleton  width={'100%'} height={30} variant="rectangular" 
                sx={{borderRadius: 2,
                  background: theme.palette.mode ==='dark'?
                  `linear-gradient(rgba(0,0,0, 0.5) 0%, rgba(0,0,0, 1) 97%, ${theme.palette.background.default} 100%)`:
                  `linear-gradient(rgba(255,255,255, 0.5) 0%, rgba(255,255,255, 0.5) 97%, ${theme.palette.background.default} 100%)`
                }}/>
                <SendOutlined sx={{display:{xs: 'none', sm: 'flex'}, width: 20, height: 20, color: 'primary.main', cursor: 'pointer'}} />
            </Box>
          </Box>
        </Box>
    )
}   
export default Conversation