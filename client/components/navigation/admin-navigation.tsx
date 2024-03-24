import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Divider, ListItem, ListItemButton, ListItemText, ListSubheader, Link as MuiLink, typographyClasses } from '@mui/material'
import { userLinks, studentLinks, teacherLinks, reportLinks } from './admin-navigation.data'

const NavigationSide: FC = () => {
  return (<>
        <ListSubheader component="div" inset>
          User
        </ListSubheader>
        {userLinks.map(({ path: destination, label, icon })=>(
          <Link to={`/${destination}`} style={{textDecoration: 'none'}}>
            <MuiLink
                underline="hover"
                component='span'
                sx={{
                  display: 'block',
                  mb: 1,
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.disabled',
                  cursor:'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none'
                  }
            }}>
              <ListItemButton>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText primary={label} />
              </ListItemButton>
            </MuiLink>
          </Link>
        ))}
        <Divider sx={{ my: 1 }} />  
        <ListSubheader component="div" inset>
          Learn
        </ListSubheader>
        {studentLinks.map(({ path: destination, label, icon })=>(
          <Link to={`/${destination}`} style={{textDecoration: 'none'}}>
            <MuiLink
                underline="hover"
                component='span'
                sx={{
                  display: 'block',
                  mb: 1,
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.disabled',
                  cursor:'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none'
                  }
            }}>
              <ListItemButton>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText primary={label} />
              </ListItemButton>
            </MuiLink>
          </Link>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Teach
        </ListSubheader>
        {teacherLinks.map(({ path: destination, label, icon })=>(
          <Link to={`/${destination}`} style={{textDecoration: 'none'}}>
            <MuiLink
                underline="hover"
                component='span'
                sx={{
                  display: 'block',
                  mb: 1,
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.disabled',
                  cursor:'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none'
                  }
            }}>
              <ListItemButton>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText primary={label} />
              </ListItemButton>
            </MuiLink>
          </Link>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListSubheader component="div" inset>
          Report
        </ListSubheader>
        {reportLinks.map(({ path: destination, label, icon })=>(
          <Link to={`/${destination}`} style={{textDecoration: 'none'}}>
            <MuiLink
                underline="hover"
                component='span'
                sx={{
                  display: 'block',
                  mb: 1,
                  fontSize: { xs: '1rem', md: 'inherit' },
                  [`& .${typographyClasses.root}`]:{fontWeight: 600},
                  color: 'text.disabled',
                  cursor:'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'none'
                  }
            }}>
              <ListItemButton>
                <ListItem sx={{width: 40}}>
                  {icon}
                </ListItem>
                <ListItemText primary={label} />
              </ListItemButton>
            </MuiLink>
          </Link>
        ))}                
        </>);
}

export default NavigationSide