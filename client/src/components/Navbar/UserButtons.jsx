import React from "react";
import Button from "./Button";
import DateRangeIcon from "@mui/icons-material/DateRange";
import GroupsIcon from "@mui/icons-material/Groups";
import ForumIcon from "@mui/icons-material/Forum";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const UserButtons = ({ logout, currentUser, numOfUnreadMsg }) => {
  return (
    <div>
      <Button
        {...{ to: "/schedule", Icon: DateRangeIcon, text: "My Schedule" }}
      />
      <Button {...{ to: "/messages", Icon: ForumIcon, text: "Messages", numOfUnreadMsg }} />
      <Button
        {...{
          to: "/organizations",
          Icon: GroupsIcon,
          text: "My Organizations",
        }}
      />
      <Button
        {...{
          to: "/bookmarks",
          Icon: BookmarksIcon,
          text: "Bookmarks"
        }}
      />
      <Tippy content="Profile" placement="right" theme="material" arrow={true}>
        <div className="navbar-button">
          <Avatar
            component={Link}
            to="/profile"
            alt={currentUser.username}
            src={currentUser.profile_picture}
          />
        </div>
      </Tippy>
      <Button
        {...{
          to: "/settings",
          Icon: SettingsIcon,
          text: "Settings",
        }}
      />
      <Tippy content="Logout" placement="right" theme="material" arrow={true}>
        <span onClick={logout} className="navbar-button">
          <LogoutIcon />
        </span>
      </Tippy>
    </div>
  );
};

export default UserButtons;
