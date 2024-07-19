import React, { useState, useEffect, FC } from "react";
import {List, ListItem, ListItemText, ListItemAvatar, Avatar, Zoom, Box, Typography} from "@mui/material";
import {socket} from '../communication'
import { listByCourse } from "../../users/api-user";
import { StyledSnackbar } from "../../styled-banners";
import { Error, VerifiedOutlined } from "@mui/icons-material";
import { useAuth } from "../../auth";
import { ConversationsSkeleton } from "../../skeletons";
import {UsersSearch} from ".";
interface UsersProps{
  setUser: (user: any) => void, 
  setScope: (scope: string) => void,
  courseId: string 
}
const Users: FC<UsersProps> = ({setUser, setScope, courseId}) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(''); 
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(false); 
  const {isAuthenticated} = useAuth()
  const [value, setValue] = useState('')

  const handleClick = (user) => (event)=>{
    if(isAuthenticated().user && (user._id !== isAuthenticated().user._id)){
      setUser(user); 
      setScope(user.name+ " "+user.surname);
    }
  }
  const handleChange = (event) => {
    setValue( event.target.value)
  }
  const search = (value) => {
    // const abortController = new AbortController()
    // const signal = abortController.signal
    // if(values.search){
    //   list({search: values.search, category: values.category, page}, signal).then((data) => {
    //     if (data && data.error) {
    //       setValues({...values, error: data.error})
    //     } else {
    //       setValues({...values, results: data, searched:true})
    //     }
    //   })
    // }
  }
  const enterKey = (event) => {
    if(event.keyCode == 13){
      event.preventDefault()
      event.target.value && search(event.target.value)
    }
  }
  const handleSubmit = () => {}
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    setLoading(true)
    listByCourse(signal,{
      token: isAuthenticated().token
    },{
      courseId: courseId
    }).then((data) => {
      if (data && data.error) {
         setError(data.error)
         setLoading(false)
      } else {
        let users = data.map(enrollment=> enrollment.client)
        data[0] && data[0].course && users.push(data[0].course.specialist)
        setUsers(users)
        setLoading(false)
      }
    });
  }, [newUser]);

  useEffect(() => {
    socket.on(`users-${courseId}`, (data) => {
      if (data && data.error) {
         setError(data.error)
      } else {
        setNewUser(data);
      }
    });
  }, []);
  if(loading){
    return <ConversationsSkeleton />
  }
  return (
    <List sx={{maxHeight: "100vh", overflowY: "auto"}}>
      <ListItem sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: 'background.paper'}}>
        <UsersSearch value={value} handleChange={handleChange} handleSubmit={handleSubmit} enterKey={enterKey} />
      </ListItem>
      {users && users.map((user, i) => (
          <Zoom key={i} timeout={1000} id="zoom-user" appear={true} in={true} color='inherit' unmountOnExit={true}>
            <ListItem onClick={handleClick(user)} sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, alignItems: 'center', justifyContent: 'center', boxShadow: 2, '&:hover':{boxShadow: 4}, cursor: 'pointer',
                            my: {xs:1, sm:2}, borderRadius: 3, bgcolor: 'background.paper'}}>
              <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <ListItemAvatar 
                sx={{ flex: 0.5,
                  lineHeight: 0,
                  overflow: 'hidden',
                  borderRadius: 3,
                  height: {xs: 40, md: 50},
                  width: {xs: 40, md: 50},
                  mb: 2,
                  }}>
                  <Avatar src={'/api/users/photo/'+user._id+"?" + new Date().getTime()} 
                  sx={{
                    height: {xs: 40, md: 50},
                    width: {xs: 40, md: 50},
                    borderRadius: '50%'
                  }}
                  alt={user.name? user.name[0]: ''}
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
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Box component='span' 
                          sx={{margin: '7px 10px 0 10px', alignItems: 'center', color: 'text.disabled', display: 'inline-flex',
                              '& > svg': { mr: 2, color: user.specialist?'primary.main': 'secondary.main' } }}>
                          <VerifiedOutlined/> {user.specialist? 'Specialist': 'Client'}
                        </Box>
                      </Box>
                  }/>
              </Box>
            </ListItem>
          </Zoom>
          )
      )}
      <StyledSnackbar
        open={error? true: false}
        duration={3000}
        handleClose={()=>setError('')}
        icon={<Error/>}
        heading={"Error"}
        body={error}
        variant='error'
        />
    </List>
  );
};

export default Users;
