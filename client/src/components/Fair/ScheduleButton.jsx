import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import axios from "axios";

const ScheduleButton = ({
  added,
  upcoming,
  id,
  add,
  updateFairDetails,
  setSnackBarDetails,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [options, setOptions] = useState();

  useEffect(() => {
    axios.get(`/api/fairs/organizations/${id}`).then(({ data }) => {
      if (data.length > 0) setOptions(data);
    });
  }, [id]);

  const joinAsJobSeeker = () => {
    axios.post(`/api/fairs/join/${id}`).then(() => {
      add();
      setSnackBarDetails({
        open: true,
        message: "Career fair is added to schedule.",
      });
    });
  };

  const handleMenuItemClick = (event, index) => {
    axios
      .post(`/api/fairs/join/${id}/organizations/${options[index].id}`)
      .then(() => {
        setOptions((prev) => {
          const newState = [...prev];
          newState[index] = { ...newState[index], added: true };
          return newState;
        });
        setSnackBarDetails({
          open: true,
          message: `Career fair is added to schedule for ${options[index].name}.`,
        });
        updateFairDetails();
      });
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button onClick={joinAsJobSeeker} disabled={!upcoming || added}>
          {added ? "Added to Schedule" : "Add to Schedule"}
        </Button>
        <Button
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
          disabled={!options || !upcoming}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.id}
                      disabled={option.added}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.added ? "Added" : "Add"} to {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
export default ScheduleButton;
