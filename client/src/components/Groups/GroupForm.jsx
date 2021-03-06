import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button
} from "@mui/material";
import React from "react";
import useInput from "../../hooks/useInput";
import axios from "axios";

function GroupForm({ openForm, setOpenForm, setMyGroups }) {
  const [name, handleNameChange] = useInput("");
  const [description, handleDescriptionChange] = useInput("");
  const [email, handleEmailChange] = useInput("");
  const [industry, handleIndustryChange] = useInput("");
  const [website, handleWebsiteChange] = useInput("");
  const [logo, handleLogoChange] = useInput("");

  const createOrganization = async () => {

    const newGroupInfo = {
      name,
      description,
      email,
      industry,
      website,
      logo
    };

    try {
      const { data } = await axios.post("/api/organizations", newGroupInfo);
      setMyGroups((prev) => [...prev, data]);
    } catch (err) {
      console.log(err);
    };

  };

  const handleCreate = () => {
    createOrganization();
    setOpenForm(!openForm);
  };

  return (
    <Dialog open={openForm} onClose={() => { }}>
      <DialogTitle>Create New Organization</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add your organization's info
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Organization Name"
          fullWidth
          required
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          multiline
          rows="4"
          margin="dense"
          id="description"
          label="Description"
          fullWidth
          required
          value={description}
          onChange={handleDescriptionChange}
        />
        <TextField
          margin="dense"
          id="email"
          label="Email"
          fullWidth
          type="email"
          value={email}
          required
          onChange={handleEmailChange}
        />
        <TextField
          margin="dense"
          id="industry"
          label="Industry"
          fullWidth
          required
          value={industry}
          onChange={handleIndustryChange}
        />
        <TextField
          margin="dense"
          id="website"
          label="Website"
          fullWidth
          value={website}
          onChange={handleWebsiteChange}
        />
        <TextField
          margin="dense"
          id="logo"
          value={logo}
          label="Organization Logo"
          fullWidth
          onChange={handleLogoChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpenForm(!openForm) }}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  )
};

export default GroupForm;