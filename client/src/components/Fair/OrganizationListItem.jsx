import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router-dom";

const OrganizationListItem = ({
  setExpanded,
  id,
  fairId,
  name,
  live,
  logo,
  userNum,
}) => {
  const clickHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <Box onClick={setExpanded}>
      <Card variant="outlined" className="not-expanded">
        <CardMedia component="img" image={logo} alt={name + "_logo"} />
        <CardContent>
          <div className="organization-details">
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            {live && (
              <CardActions>
                <Link to={`/live/${fairId}/${id}`} target="_blank">
                  <Button
                    size="small"
                    onClick={clickHandler}
                    variant="outlined"
                  >
                    Join this stall ({userNum})
                  </Button>
                </Link>
              </CardActions>
            )}
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrganizationListItem;
