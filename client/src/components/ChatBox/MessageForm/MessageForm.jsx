import React from 'react'
import { Grid, TextField,Fab } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
const MessageForm = () => {
  return (
    <Grid container sx={{p: '20px'}}>
        <Grid item xs={11}>
            <TextField id="outlined-basic-email" label="Type Something" fullWidth />
        </Grid>
        <Grid xs={1} align="right">
            <Fab color="primary" aria-label="add"><SendIcon /></Fab>
        </Grid>
    </Grid>
  )
}

export default MessageForm