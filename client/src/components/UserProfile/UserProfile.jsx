import {
  Avatar,
  Grid,
  Stack,
  Typography,
  Box,
  Badge,
  List,
  ListItemAvatar,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import useMyGroups from '../../hooks/useMyGroups';
import useTitle from "../../hooks/useTitle";

const ProfilePic = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const UserProfile = ({ currentUser }) => {
  const { myGroups } = useMyGroups();
  const [openResume, setOpenResume] = useState(false);

  const title =
    currentUser &&
    `${currentUser.first_name} ${currentUser.last_name} (@${currentUser.username})`;
  useTitle(title);
  return (
    <>
      {currentUser && (
        <Grid
          item
          xs={12}
          container
          sx={{ backgroundColor: "#eff2f6" }}
          justifyContent="space-around"
        >
          <Stack spacing={2}>
            <Box sx={{ bgcolor: "#1f78b1" }}>
              <Badge
                sx={{ bgcolor: "#1f78b1", width: 700 }}
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                badgeContent={
                  <ProfilePic
                    alt={currentUser.first_name}
                    src={currentUser.profile_picture}
                  />
                }
              >
              <Box component="span" sx={{ height: 150, width: 500 }} />
            </Badge>
          </Box>
          <Box sx={{ pt: 6, px: 3, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: 'flex', flexDirection:"column", pr:10 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='h4' sx={{}}>{`${currentUser.first_name} ${currentUser.last_name}`}</Typography>
                <Typography variant='body1' sx={{ pl: 1, pt: 1.5 }}>{`( ${currentUser.username} )`}</Typography>
              </Box>
              <Box sx={{mt:3}}>
                <Button onClick={(e) => setOpenResume(true)} variant='contained'>Your Resume</Button>
              </Box>
              <Box>
                <Dialog open={openResume} fullWidth={true} maxWidth={"lg"} onClose={() => { }} sx={{ height: "100vh" }} scroll='body' >
                  <DialogContent sx={{ height: "70vh" }}>
                    {!currentUser.resume ? (<Typography variant='h6' p={2}> You haven't uploaded your resume. Go to settings and upload new resume</Typography>) : (<embed src={"http://localhost:8080/" + currentUser.resume + "#toolbar=0"} height="100%" width="100%" />)}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => { setOpenResume(!openResume) }}>Close</Button>
                  </DialogActions>
                </Dialog>
              </Box>

              <Box sx={{mt:3}}>
                <Typography variant='h6'>About</Typography>
                <Typography variant='body1' sx={{ pt: 1 }}>{currentUser.bio}</Typography>
              </Box>
            </Box>
            <Box sx={{pr: 3,display: 'flex', flexWrap:"wrap", flexDirection:"column", gap:'10px'}}>
              <Typography variant='h6' alignSelf='center'>Organization</Typography>
              {myGroups && myGroups.length > 0 ?(
                <List sx={{width:200, display:'flex', flexWrap:'wrap', gap:'10px'}}>
                  {myGroups.map((group, i) => (
                    <ListItem key={i} sx={{width: '30%'}}>
                      <Tooltip title={group.name} placement="top-start">
                        <ListItemAvatar variant="rounded" sx={{height:25, width:25}}>
                          <Avatar alt={`${group.name}`} src={group.logo}></Avatar>
                        </ListItemAvatar>
                      </Tooltip>
                      
                      {/* <ListItemText primary={`${group.name}`} primaryTypographyProps={{ variant: "h6" }}/> */}
                    </ListItem>))
                  }
                </List>) : (
                  <Typography variant="body1" sx={{ pl: 1, pt: 1.5 }}>
                    Not associated with any organization
                  </Typography>
                )
              }
            </Box>
          </Box>
        </Stack>
      </Grid>)
  }

  </>

  )
}

export default UserProfile;
