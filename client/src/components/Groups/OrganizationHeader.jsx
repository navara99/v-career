import React, { useState } from "react";
import { ListItemText, Card, IconButton, Collapse, CardActions, CardMedia } from "@mui/material";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const cardStyles = {
  padding: "2em",
  margin: "1em"
};

function OrganizationHeader({ organization }) {
  const [expanded, setExpanded] = useState(false)

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log(organization);

  return (
    <div className="organization-details-header">
      <Card alignItems="flex-start" style={cardStyles}>
        <div className="organization-card">
          <img
            className="organization-logo"
            src="https://assets.brand.microsites.netflix.io/assets/7dc497e2-4975-11ec-a9ce-066b49664af6_cm_1440w.jpg?v=1"
          />
          <ListItemText
            primary={<h2 className="organization-card-name">{organization.details.name}</h2>}
            secondary={organization.details.description}
          />
          <CardActions>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <p><strong>Industry:</strong> {organization.details.industry}</p>
          <p><strong>Email:</strong> {organization.details.email}</p>
          <p><strong>Website:</strong> {organization.details.website}</p>
        </Collapse>
      </Card >
    </div>
  )
};

export default OrganizationHeader;