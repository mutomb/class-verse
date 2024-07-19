import React, { FC } from 'react'
import { Box, FormControl, inputBaseClasses, InputBase, SxProps, Theme } from '@mui/material'
import {SendOutlined} from '@mui/icons-material'

interface ConversationFooterProps{
    newConversationMessage: string,
    handleSubmit: () => void
    handleChange: (name) => (event) => void,
    sx?: SxProps<Theme>,
    enterKey: (event) => void,
}
const ConversationFooter: FC<ConversationFooterProps> = ({newConversationMessage, handleChange, handleSubmit, sx, enterKey}) => {
    return (
        <Box id="message" sx={{ width: '100%', bgcolor: 'primary.dark', mt: 1, py: 0.5, px: {xs: 0.1, sm: 0.5, md: 1}, ...sx}}>
            <Box id="message_container"
                sx={{ px:{xs: 0, sm: 0.5, md: 1}, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 4,}}>
                <FormControl fullWidth
                sx={{
                    flex:1, m:0, borderRadius: 4, backgroundColor: 'background.paper',
                    [`& .${inputBaseClasses.root}`]: {
                        fontSize: '0.8rem'
                    },
                }}>
                    <InputBase
                    value={newConversationMessage}
                    id="search"
                    multiline={true}
                    minRows={1}
                    maxRows={3}
                    onKeyDown={enterKey}
                    onChange={handleChange('body')}
                    placeholder="Type a message/question"
                    sx={{width: '100%', minHeight: 40, px: 1}}
                    />
                </FormControl>
                <SendOutlined onClick={handleSubmit} sx={{display:{xs: 'none', sm: 'flex'}, width: 20, height: 20, color: 'primary.main', cursor: 'pointer'}} />
            </Box>
        </Box>
    )
}   
export default ConversationFooter