import React from "react";
import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  ListItemButton,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Badge from "@mui/material/Badge";

const SenderListItem = ({
  sender,
  setReceiverId,
  setReceiver,
  lastMsg,
  createdDate,
  lastUserId,
  numOfMsg,
}) => {
  const { first_name, last_name, profile_picture, username, id } = sender;
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
                <div>
                  <div>{`${msgName}: ${lastMsg}`}</div>
                  <div className="created-date">{createdDate}</div>
                </div>

                // <>
                //   <Typography
                //     sx={{ display: "inline" }}
                //     component="div"
                //     variant="body2"
                //     color="text.secondary"
                //   >
                //     {`${msgName}: ${lastMsg}`}
                //   </Typography>

                //   <Typography
                //     sx={{ display: "inline" }}
                //     component="div"
                //     variant="body2"
                //     color="text.secondary"
                //   >
                //     {createdDate}
                //   </Typography>
                // </>
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
