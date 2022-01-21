import React, { useEffect, useState, useRef } from "react";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SenderList from "./Sender/SenderList";
import MessageList from "./Messages/MessageList";
import MessageForm from "./MessageForm/MessageForm";
import { Box } from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import { Avatar, ListItemAvatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./ChatBox.css";
import useMessages from "../../hooks/useMessages";

const ChatBox = ({ currentUser }) => {
  const { handleSubmit, messages, senders, setReceiverId } = useMessages();
  return (
    <Grid container className="chat-box">
      <Grid item px={2} xs={3} component={Paper} variant="outlined">
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                alt={currentUser && currentUser.username}
                src={currentUser && currentUser.profile_picture}
              />
            </ListItemAvatar>
            {/* <ListItemText primary={currentUser && currentUser.first_name}>
                    </ListItemText>
                    <ListItemText secondary="You">
                    </ListItemText> */}
            <Typography variant="h4">
              {currentUser && currentUser.first_name}
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <SenderList
              messages={messages}
              currentUser={currentUser}
              senders={senders}
              setReceiverId={setReceiverId}
              handleOnClick={handleOnClick}
              setReceiver={setReceiver}
            />
          </ListItem>
        </List>
      </Grid>
      {/* Chatter Box */}
      <Grid
        item
        xs={9}
        sx={{ backgroundColor: "#eff2f6" }}
        component={Paper}
        variant="outlined"
      >
        {receiverId && currentUser ? (
          <>
            <Box
              sx={{
                width: "100%",
                height: "50px",
                backgroundColor: "#bdc7df",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                alt={`${receiver.id}`}
                src={`${receiver.profile_picture}`}
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {receiver.first_name} {receiver.last_name}
              </Typography>
            </Box>
            <MessageList
              messages={
                messages &&
                messages.filter(
                  (message) =>
                    (message.sender_id === receiverId &&
                      message.receiver_id === currentUser.id) ||
                    (message.sender_id === currentUser.id &&
                      message.receiver_id === receiverId)
                )
              }
              currentUser={currentUser}
              px={2}
              setMessageText={setMessageText}
              handleSubmit={handleSubmit}
            />
            <Divider />
            <MessageForm
              messageText={messageText}
              handleSubmit={handleSubmit}
              setMessageText={setMessageText}
              px={2}
            />
          </>
        ) : (
          <>
            <Typography variant="h3"> Open chat conversation</Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatBox;
