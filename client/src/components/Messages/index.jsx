import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import SenderList from "./Sender/SenderList";
import MessageList from "./Message/MessageList";
import MessageForm from "./MessageForm/MessageForm";
import { Box } from "@mui/material";
import { Avatar } from "@mui/material";
import "./Messages.css";
import { Link } from "react-router-dom";
import Unauthorized from "../Unauthorized";
import useTitle from "../../hooks/useTitle";

const Messages = ({ currentUser, messageState }) => {
  const {
    setMessageText,
    messageText,
    receiverId,
    receiver,
    handleOnClick,
    setReceiver,
    handleSubmit,
    messages,
    senders,
    setReceiverId,
    setMessages,
    socket,
  } = messageState;

  useTitle("Messages");
  if (!currentUser) {
    return <Unauthorized action="view messages" />;
  }

  return (
    <Grid container className="chat-box">
      <Grid
        item
        px={2}
        xs={3}
        component={Paper}
        variant="outlined"
        className="sender"
      >
        <List>
          <SenderList
            messages={messages}
            currentUser={currentUser}
            senders={senders}
            setReceiverId={setReceiverId}
            handleOnClick={handleOnClick}
            setReceiver={setReceiver}
          />
        </List>
      </Grid>
      <Grid
        item
        xs={9}
        sx={{ backgroundColor: "#eff2f6" }}
        component={Paper}
        variant="outlined"
        className="messages"
      >
        {receiverId && currentUser ? (
          <>
            <Box
              sx={{
                width: "100%",
                height: "50px",
                backgroundColor: "#bdc7df",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0.5em",
              }}
              component={Link}
              to={`/profile/${receiver.id}`}
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
              receiverId={receiverId}
              currentUser={currentUser}
              px={2}
              setMessageText={setMessageText}
              handleSubmit={handleSubmit}
              setMessages={setMessages}
              socket={socket}
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
          <div className="default">
            <h4>Click contact to view messages</h4>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default Messages;
