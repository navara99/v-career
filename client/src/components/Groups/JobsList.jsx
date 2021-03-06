import React from "react";
import { List, Divider } from "@mui/material"
import JobListItem from "./JobListItem";

function JobsList({
  jobs,
  setJobs,
  isMember,
  setSnackBarDetails,
  currentUser,
  updateAppliedJobs
}) {

  const renderJobs = () => {
    return jobs.map((job, i) => {
      return (
        <div key={job.id}>
          <JobListItem {...{ job, jobs, setJobs, isMember, setSnackBarDetails, currentUser, updateAppliedJobs }} key={job.id} />
          {i === jobs.length - 1 ? "" : < Divider />}
        </div>
      )
    });
  };

  return (
    <List style={{ width: "90%" }}>
      {renderJobs()}
    </List>
  )

}

export default JobsList;