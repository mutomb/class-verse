import React, { FC, useState } from 'react'
import { Box, FormControl, inputBaseClasses, InputBase, Typography, IconButton, Grow } from '@mui/material'
import { Close, Send, Error} from '@mui/icons-material'
import { StyledSnackbar } from '../../styled-banners'
import { useTheme } from '@mui/material/styles'

interface AddEmailProps{
    send: (email: string) => void
    close: () => void,
    timeout?: number
}
const AddEmail: FC<AddEmailProps> = ({send, close, timeout}) => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const theme = useTheme()
    const handleChange = (event) => {
        setEmail(event.target.value)
    }
    const enterKey = (event) => {
        if(event.keyCode === 13){
          event.preventDefault()
          if(email.search(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) === 0){
            send(email)
            close()
          }else{
            setError('Please fill in a valid email address')
          }
        }
    }
    const handleClick = () => {
        if(email.search(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) === 0){
            send(email)
        }else{
            setError('Please fill in a valid email address')
        }
    }
    const handleClose = () => {
        setEmail('')
        close()
    }
    return (
        <Grow easing= 'cubic-bezier(0, 0, 1, 3)' timeout={timeout} id="zoom-conversation" appear={true} in={true} unmountOnExit={true}>
            <Box sx={{boxShadow: 4, borderTopWidth: 4, borderTopColor: 'primary.main', borderTopStyle: 'solid',  borderRadius: 2, bgcolor: theme.palette.mode ==='light'? 'secondary.light': 'secondary.dark', position: 'relative', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', mt: 1, py: 0.5, px: {xs: 0.1, sm: 0.5, md: 1}}}>
                <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant='body2' sx={{color: 'text.secondary', fontWeight: 700, }}>
                        Email
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <Close sx={{color: 'primary.main', width: 20, height: 20}} />
                    </IconButton>
                </Box>
                <Box 
                    sx={{ width: '100%', px:{xs: 0, sm: 0.5, md: 1}, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FormControl fullWidth
                    sx={{
                        flex:1, m:0, borderRadius: 2, backgroundColor: 'background.default',
                        [`& .${inputBaseClasses.root}`]: {
                            fontSize: '0.8rem'
                        },
                    }}>
                        <InputBase
                        value={email}
                        id="email"
                        multiline={true}
                        minRows={1}
                        maxRows={3}
                        onKeyDown={enterKey}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        sx={{width: '100%', height: 30, px: 1}}
                        />
                    </FormControl>
                    <Send onClick={handleClick} sx={{width: 20, height: 20, color: 'primary.main'}} />
                </Box>
                <StyledSnackbar
                    open={error? true: false}
                    duration={3000}
                    handleClose={()=>setError('')}
                    icon={<Error/>}
                    heading={"Error"}
                    body={error}
                    variant='error'
                    />
            </Box>
        </Grow>
    )
}   
export default AddEmail