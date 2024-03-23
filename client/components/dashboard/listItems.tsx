import React, { FC } from 'react';
import {ListItemButton, ListItem, ListItemText, ListSubheader} from '@mui/material';
import {Dashboard, ShoppingCart, People, Layers, Assignment, Person, Settings, Stars,
Quiz, Book, Checkroom, HelpCenter, Help, Map, BarChart, MonetizationOn, School, Public, Security, AddCircle, AddComment, PendingActions} from '@mui/icons-material';
// import BarChartIcon from '@mui/icons-material/BarChart';

export const ProfileSideNavLink: FC = () => (
  <>
    <ListSubheader component="div" inset>
      User Infos
    </ListSubheader>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Person />
      </ListItem>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Settings />
      </ListItem>
      <ListItemText primary="Edit Profile" />
    </ListItemButton>
  </>
);

export const StudentSideNavLink: FC = () => (
  <>
    <ListSubheader component="div" inset>
      Student Infos
    </ListSubheader>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <BarChart />
      </ListItem>
      <ListItemText primary="Overview" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Book />
      </ListItem>
      <ListItemText primary="Courses" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Quiz />
      </ListItem>
      <ListItemText primary="Quizz" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <School />
      </ListItem>
      <ListItemText primary="Exam" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Stars />
      </ListItem>
      <ListItemText primary="Certificates" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Map />
      </ListItem>
      <ListItemText primary="Find Teacher" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Help />
      </ListItem>
      <ListItemText primary="Help" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <MonetizationOn />
      </ListItem>
      <ListItemText primary="Transactions" />
    </ListItemButton>
  </>
);

export const TeacherSideNavLink: FC = () => (
  <>
    <ListSubheader component="div" inset>
      Teacher Infos
    </ListSubheader>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <Public />
      </ListItem>
      <ListItemText primary="Published" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <PendingActions />
      </ListItem>
      <ListItemText primary="Unpublished" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <AddCircle />
      </ListItem>
      <ListItemText primary="New Course" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <ShoppingCart />
      </ListItem>
      <ListItemText primary="Enrollments" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <MonetizationOn />
      </ListItem>
      <ListItemText primary="Transactions" />
    </ListItemButton>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <People />
      </ListItem>
      <ListItemText primary="Requests" />
    </ListItemButton>
  </>
);

export const ReportSideNavLink: FC = () => (
  <>
    <ListSubheader component="div" inset>
       Report Issues
    </ListSubheader>
    <ListItemButton>
      <ListItem sx={{width: 40}}>
        <AddComment />
      </ListItem>
      <ListItemText primary="Help Center" />
    </ListItemButton>
  </>
);
