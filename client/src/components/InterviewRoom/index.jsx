import React, { useState } from "react";
import { useParams } from "react-router";
import useInterview from "../../hooks/useInterview";
import { Button } from "@mui/material";
import VideoCall from "./VideoCall";
import useChannel from "../../hooks/useChannel";
import "./interviewroom.css";
import { formatStartEndTime } from "../../helpers/date";
import WhiteBoardModal from "./WhiteBoardModal";
import useTitle from "../../hooks/useTitle";

function InterviewRoom({ currentUser }) {
  const { id } = useParams();
  const [interview] = useInterview(id);
  const [inCall, setInCall] = useState(false);
  const { config, useClient } = useChannel(`interview${id}`, currentUser ? `${currentUser.username}${interview && interview.interviewer ? " (interviewer)" : ""}` : "");

  useTitle(interview && `Interview for ${interview.title} position at ${interview.name}`);
  
  return (
    <div className="interview-lobby">
      {interview && !inCall &&
        <h3
          className="interview-lobby-title">
          Your interview for {interview.title} position at {interview.name} starts is at {formatStartEndTime(interview.start_time, interview.end_time)}.
          Please click join when you are ready.
        </h3>}
      {!inCall && < Button variant="contained" color="primary" onClick={() => setInCall(true)}>Join Interview</Button>}
      {inCall &&
        <>
          <div className="interview-head">
            <h3>Interview for {interview.title} position at {interview.name}</h3>
            <WhiteBoardModal boardCode={`interview${id}-${interview.start_time}-${interview.end_time}`} />
          </div>
          <VideoCall setInCall={setInCall} {...{ config, useClient, channelName: `interview${id}`, interview, username: `${currentUser.username}${interview.interviewer ? " (interviewer)" : ""}` }} />
        </>}
    </div>
  )
}

export default InterviewRoom;