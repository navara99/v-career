import React from "react";
import { useParams } from "react-router";
import useOrganizationDetails from "../../hooks/useOrganizationDetails";
import OrganizationHeader from "./OrganizationHeader";
import OrganizationJobs from "./OrganizationJobs";
import OrganizationMembers from "./OrganizationMembers";
import OrganizationFairs from "./OrganizationFairs";

const cardStyles = {
  padding: "2em",
  margin: "1em"
};

function OrganizationDetails({ setSnackBarDetails }) {
  const { id } = useParams();
  const organization = useOrganizationDetails(id);

  console.log(organization);
  return (
    <div className="organization-details-wrapper">
      {organization && <OrganizationHeader {...{ organization }} {...{ cardStyles }} />}
      {organization && <OrganizationJobs {...{ organization }} {...{ cardStyles }} {...{ setSnackBarDetails }} />}
      {organization && <OrganizationFairs {...{ organization }} {...{ cardStyles }} {...{ setSnackBarDetails }} />}
      {organization && <OrganizationMembers {...{ organization }} {...{ cardStyles }} />}
    </div>

  );
};

export default OrganizationDetails;