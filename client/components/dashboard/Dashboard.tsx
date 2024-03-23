import React, { FC, FormEvent, useState } from 'react';
import MuiDrawer from '@mui/material/Drawer';
import { Toolbar, List, Divider, IconButton, buttonBaseClasses, ListSubheader } from '@mui/material';
import {ChevronLeftRounded, ChevronRightRounded} from '@mui/icons-material';
import { ProfileSideNavLink, StudentSideNavLink, TeacherSideNavLink, ReportSideNavLink } from './listItems';
import { useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { Logo } from '../logo';

const Dashboard: FC = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleClose = (event: FormEvent<HTMLFormElement>, reason) => {
    setOpen(false)
  }
  
  const theme = useTheme();
  const path = useLocation().pathname
  const location = path.split('/')[1]
  const isPartActive = (path: string) => {
    return location.includes(path)
  }
  if(!isPartActive('user')) return null
  return (<MuiDrawer elevation={6} variant="permanent" open={open}
            onClose={(event, reason) => {if(reason === 'backdropClick'){handleClose(event, reason);}}}
            sx={{
              '& .MuiDrawer-paper': {
                position: 'fixed',
                boxShadow:theme.shadows[5], 
                border: 'none',
                zIndex: 1099,
                display: 'flex', 
                flexDirection: open? 'row-reverse': 'row',
                justifyContent: open? 'flex-end': 'flex-start',
                height: open? '100%': 'auto',
                width: {xs: '100%', sm: '50%', md: '40%', lg: '25%', xl: '20%'},
                borderTopRightRadius: open? {xs: 100, sm: 150, md: 200, lg: 150, xl:  150}: 0,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.easeIn,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                boxSizing: 'border-box',
                ...(!open && {
                  overflowX: 'hidden',
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                  width:theme.spacing(7),
                }),
              },
            }}
          >
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 64,
                boxShadow: open? 'none': theme.shadows[5],
                p:0,
                alignSelf: 'center',
                position: open? 'unset': 'fixed',
                bottom: open? 0: {xs: '20%', md:'50%'},
                top: open? 0: {xs: '80%', md:'50%'},
                backgroundColor: open? 'inherit': 'primary.main',
                ':hover': {
                    backgroundColor: open? 'inherit': 'secondary.main',
                    ...(!open && { 
                      transition: theme.transitions.create(['transform']),
                      transform: 'translateX(3px)'})                    
                },
                border: open? 'none': '1px solid',
                borderColor: open? 'unset': 'primary.contrastText',
                borderTopRightRadius:open? 0: 10,
                borderBottomRightRadius:open? 0: 10,
              }}
            >
              <IconButton onClick={toggleDrawer} 
              sx={{ border: open? '1px solid': 'none',
                    borderColor: open? 'primary.contrastText':'unset',
                    ':hover': { backgroundColor: open? 'secondary.main': 'inherit'}
                  }}>
                {open? <ChevronLeftRounded /> : <ChevronRightRounded />}
              </IconButton>
            </Toolbar>
            <List component="nav" sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              pt: 20,
              textWrap: 'nowrap',
              transition: theme.transitions.create('display', {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
              }),
              ...(!open && {
                display: 'none',
                transition: theme.transitions.create('display', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.leavingScreen,
                })}),
                [`.${buttonBaseClasses.root}`]:{ 
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                },
                [`.${buttonBaseClasses.root}:hover`]:{ 
                  backgroundColor: 'secondary.main',
                }
              }}>
              <ListSubheader component="div" inset>
              <Logo onClick={handleClose} />
              </ListSubheader>
              <ProfileSideNavLink />
              <Divider sx={{ my: 1 }} />
              <StudentSideNavLink />
              <Divider sx={{ my: 1 }} />
              <TeacherSideNavLink />
              <Divider sx={{ my: 1 }} />
              <ReportSideNavLink />
              <Divider sx={{ my: 1 }} />
            </List>
        </MuiDrawer>);
}

export default Dashboard