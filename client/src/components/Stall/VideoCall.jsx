import React from "react";
import { Grid } from "@mui/material";
import Video from "./Video";
import { createMicrophoneAndCameraTracks } from "agora-rtc-react";
import useVideo from "../../hooks/useVideo";

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

export default function VideoCall(props) {
  const { config, useClient, username, channelName, organizationDetails, setInCall } = props;
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const { users, start, setStart } = useVideo(ready, tracks, config, channelName, client, username);

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <Grid item style={{ height: "95%" }}>
        {start && tracks && <Video
          {...{ useClient, username, users, setStart, ready, tracks, organizationDetails, setInCall }}
        />}
      </Grid>
    </Grid>
  );
}
