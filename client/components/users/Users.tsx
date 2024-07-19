import React, {FC} from 'react'
import {List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Zoom, Box, MenuItem} from '@mui/material'
import {ReadMore, VerifiedOutlined} from '@mui/icons-material'
import {Link} from 'react-router-dom'
import { MoreMenuVertButton } from '../styled-buttons'
interface UsersProps{
  users?: any[]
}
const Users:FC<UsersProps> = ({users=[]}) => { 
    return (
      <List dense>
      {users && users.map((user, i) => {
          return(
            <Zoom key={i} timeout={1000} id="zoom-user" appear={true} in={true} color='inherit' unmountOnExit={true}>
              <ListItem sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center', boxShadow: 2, '&:hover':{boxShadow: 4},
                              my: {xs:1, sm:2}, borderRadius: 3, bgcolor: 'background.paper'}}>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                  <ListItemAvatar 
                  sx={{ flex: 0.5,
                    lineHeight: 0,
                    overflow: 'hidden',
                    width: {xs: 30, sm: 40, md: 50},
                    height: {xs: 30, sm: 40, md: 50},
                    mb: 2,
                    }}>
                    <Avatar src={'/api/users/photo/'+user._id+"?" + new Date().getTime()} alt={user.name? user.name[0]: ''}
                    sx={{
                      borderRadius: '50%',
                      width: {xs: 30, sm: 40, md: 50},
                      height: {xs: 30, sm: 40, md: 50},
                    }}
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    sx={{flex: 1.5, ml: {xs: 0, sm: 1, textAlign: 'center', color: 'text.primary'}}}
                    primary={
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                        <Typography variant='body2' sx={{mr:{xs: 0, sm: 1}, mb: 2, color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem', alignItems: 'center'}}}>
                          {user.name}
                        </Typography>
                        <Typography variant='body2' sx={{mb: 2, color: 'text.primary', fontSize: {xs:  '0.7rem', sm: '0.8rem', alignItems: 'center'}}}>
                          {user.surname}
                        </Typography>
                    </Box>
                    } 
                    secondaryTypographyProps={{component: 'div'}}
                    secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                          <Box component='span' 
                            sx={{margin: '7px 10px 0 10px', alignItems: 'center', color: 'text.disabled', display: 'inline-flex',
                                '& > svg': {
                                  mr: 2,
                                  color: user.resume_status==='approved'?'primary.main': user.resume_status==='pending'? 'secondary.main': user.resume_status==='rejected'?'error.main': 'text.disabled'
                                }
                            }}>
                            <VerifiedOutlined/> Resume | {user.resume_status} 
                          </Box>
                          <Box component='span' 
                            sx={{margin: '7px 10px 0 10px', alignItems: 'center', color: 'text.disabled', display: 'inline-flex',
                                '& > svg': {
                                  mr: 2,
                                  color: user.qualification_status==='approved'?'primary.main': user.qualification_status==='pending'? 'secondary.main': user.qualification_status==='rejected'?'error.main': 'text.disabled'
                                }
                            }}>
                            <VerifiedOutlined/> Qualification | {user.qualification_status} 
                          </Box>
                        </Box>
                    }/>
                </Box>
                <Box sx={{width: {xs: '100%', md: 'initial'},  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                  <MoreMenuVertButton>
                    <MenuItem sx={{color: "primary.main", transition: (theme)=> theme.transitions.create(['background-color'], {duration: 500}), '&:hover':{ bgcolor: 'primary.main', color: 'primary.contrastText'}}}>
                      <Link style={{textDecoration:'none', color: 'inherit'}} to={"/user/" + user._id}> 
                        <IconButton aria-label="Edit" color="inherit" sx={{fontSize: '1rem'}}>
                          <ReadMore sx={{mr: 1, verticalAlign: 'text-top'}}/> View More  
                        </IconButton>
                      </Link>
                    </MenuItem>
                  </MoreMenuVertButton>
                </Box>
              </ListItem>
            </Zoom>
          )
        })}
      </List>
    )
}
export default Users