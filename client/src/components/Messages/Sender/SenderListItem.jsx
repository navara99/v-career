import React from "react";
import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Badge from "@mui/material/Badge";
import moment from "moment";

const SenderListItem = ({
  sender,
  setReceiverId,
  setReceiver
}) => {
  const {
    first_name,
    last_name,
    profile_picture,
    id,
    lastMsg,
    createdDate,
    lastUserId,
    numOfMsg,
  } = sender;
  const handleClick = (e) => {
    setReceiverId(id);
    setReceiver({ ...sender });
  };
  const msgName = sender.id === lastUserId ? sender.first_name : "Me";
  return (
    <>
      <Badge
        badgeContent={numOfMsg}
        color="warning"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ListItem disablePadding>
          <ListItemButton alignItems="flex-start" onClick={handleClick}>
            <ListItemAvatar>
              <Avatar alt={first_name} src={profile_picture} />
            </ListItemAvatar>
            <ListItemText
              primary={`${first_name} ${last_name}`}
              secondary={
                <span className="sender-text">
                  <span>{`${msgName}: ${lastMsg}`}</span>
                  <span className="created-date">{moment(`${createdDate}`).fromNow()}</span>
                </span>
              }
            />
          </ListItemButton>
        </ListItem>
      </Badge>

      <Divider />
    </>
  );
};

export default SenderListItem;
