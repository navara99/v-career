import React, { useState } from "react";
import "./App.css";
import LogIn from "./components/LogIn";
import Navbar from "./components/Navbar/index";
import Register from "./components/Register";
import ErrorModal from "./components/ErrorModal";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Stall from "./components/Stall"
import Groups from "./components/Groups/index";
import { Snackbar, Alert } from "@mui/material";
import Fair from "./components/Fair";
import ChatBox from "./components/ChatBox/ChatBox";
import FairLobby from "./components/FairLobby";
import OrganizationDetails from "./components/Groups/OrganizationDetails";
import Jobs from "./components/JobBoard/index";
import Schedule from "./components/Schedule";
import ProfileSetting from "./components/ProfileSetting/ProfileSetting";
import useMessages from "../src/hooks/useMessages";
import JobApplications from "./components/Groups/JobApplications";
import UserProfile from "./components/UserProfile/UserProfile";
import OtherProfile from "./components/UserProfile/OtherProfile";
import InterviewRoom from "./components/InterviewRoom";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [snackBarDetails, setSnackBarDetails] = useState({
    open: false,
    message: "",
  });
  const { currentUser, setCurrentUser, logout, messageState } = useMessages();

  const handleSnackBarClose = () => {
    setSnackBarDetails({ open: false, message: "" });
  };

  return (
    <div className="App">
      <Snackbar
        open={snackBarDetails.open}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackBarDetails.message}
        </Alert>
      </Snackbar>
      <Navbar {...{ currentUser, logout, numOfUnreadMsg: messageState.numOfUnreadMsg }} />
      <ErrorModal {...{ errorMessage, showError, setShowError }} />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <Register
                {...{
                  setErrorMessage,
                  setShowError,
                  setCurrentUser,
                  currentUser,
                  logout,
                }}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LogIn
                {...{
                  setErrorMessage,
                  setShowError,
                  setCurrentUser,
                  currentUser,
                  logout,
                }}
              />
            }
          />
          <Route
            path="/organizations"
            element={<Groups {...{ setSnackBarDetails }} />}
          />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<UserProfile currentUser={currentUser} />} />
          <Route path="/profile/:user_id" element={<OtherProfile currentUser={currentUser} />} />
          <Route path="/settings" element={<ProfileSetting {...{ setCurrentUser, currentUser, setErrorMessage, setShowError, setSnackBarDetails }} />} />
          <Route
            path="/messages"
            element={<ChatBox currentUser={currentUser} messageState={messageState} />}
          />
          <Route
            path="/live/:fairId/:organizationId"
            element={<Stall {...{ setSnackBarDetails }} {...{ currentUser }} />}
          />
          <Route
            path="/jobs/:id/applications"
            element={
              <JobApplications
                setSnackBarDetails={setSnackBarDetails}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/live/:id"
            element={<FairLobby currentUser={currentUser} />}
          />
          <Route
            path="/fairs/:id"
            element={<Fair currentUser={currentUser} />}
          />
          <Route
            path="/organizations/:id"
            element={<OrganizationDetails {...{ setSnackBarDetails }} />}
          />
          <Route
            path="/interviews/:id"
            element={<InterviewRoom {...{ currentUser }} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
