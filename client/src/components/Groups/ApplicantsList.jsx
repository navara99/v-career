import React from "react";
import { List } from "@mui/material";
import ApplicantsListItem from "./ApplicantsListItem";

function ApplicantsList({ applications }) {


  const renderApplicants = () => {
    return applications.map((application) => {
      return <ApplicantsListItem key={application.id} {...{ application }} />
    });
  };

  return (
    <>
      <List style={{ width: "80vw" }}>
        {renderApplicants()}
      </List>
    </>
  )

}

export default ApplicantsList;