import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { formatDate } from "../../helpers/date";

const JobDetailsDialog = ({ jobDetailsOpen, setJobDetailsOpen, job }) => {
  return (
    <Dialog
      open={jobDetailsOpen}
      onClose={() => setJobDetailsOpen(!jobDetailsOpen)}
    >
      <DialogTitle>{job && job.title}</DialogTitle>
      <DialogContent>
        <p>{job && job.description}</p>
        <p>Location: {job && job.location}</p>
        <p>Experience: {job && job.experience}</p>
        <p>Expected Salary: {job && job.salary}</p>
        <p>
          Posted: {formatDate(job && job.created_at)}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
