import React, { FC } from 'react'
import { Box, FormControl, inputBaseClasses, InputBase, SxProps, Theme } from '@mui/material'
import {Search} from '@mui/icons-material'

interface UsersSearchProps{
    value: string,
    handleSubmit: () => void
    handleChange: (event) => void,
    sx?: SxProps<Theme>,
    enterKey: (event) => void,
}
const UsersSearch: FC<UsersSearchProps> = ({value, handleChange, handleSubmit, sx, enterKey}) => {
    return (
        <Box id="search-users" sx={{ width: '100%', bgcolor: 'primary.dark', mb: 1, py: 0.5, px: {xs: 0.1, sm: 0.5}, ...sx}}>
            <Box id="message_container"
                sx={{ px:{xs: 0, sm: 0.5}, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 4,}}>
                <FormControl fullWidth
                sx={{
                    flex:1, m:0, borderRadius: 4, backgroundColor: 'background.paper',
                    [`& .${inputBaseClasses.root}`]: {
                        fontSize: '0.8rem'
                    },
                }}>
                    <InputBase
                    value={value}
                    id="search"
                    multiline={true}
                    minRows={1}
                    maxRows={3}
                    onKeyDown={enterKey}
                    onChange={handleChange}
                    placeholder="Search by name/surname"
                    sx={{width: '100%', minHeight: 30, px: 1}}
                    />
                </FormControl>
                <Search onClick={handleSubmit} sx={{display:{xs: 'none', sm: 'flex'}, width: '1rem', height: '1rem', color: 'text.secondary', '&:hover':{color: 'primary.main'}, cursor: 'pointer'}} />
            </Box>
        </Box>
    )
}   
export default UsersSearch