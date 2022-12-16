import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Snackbar, Alert,
  Container, Stack, Button, Typography, DialogTitle,
  DialogContent, DialogActions, Dialog, RadioGroup,
  TextField, FormControlLabel, Radio
} from '@mui/material';

import { ClientList } from '../sections/@dashboard/clients';
import Iconify from '../components/iconify';

export default function ClientsPage() {

  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState({
    open : false,
    message:"",
    severity:""
  });
  
  const [data, setData] = useState([]);

  const [clientData, setClientData] = useState({
    "name": "",
    "address": "",
    "active": false,
    "clientImage": "",
    "logoUrl": "",
    "primaryContact": ""
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackClose = () => {

    setSnack({...snack, open:false});
  };

  const fetchClients = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/client`);
    const data = await response.json();
    setData(data)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const FormChange = (event) => {

    const value = event.target.value;
    setClientData({
      ...clientData,
      [event.target.id]: value
    });
  }

  const FormChangeRadio = (event) => {
    console.log(clientData)
    setClientData({
      ...clientData,
      active: event.target.value === 'active'
    })
  }

  const handleAddClient = async () => {
    console.log("payload=>", clientData)
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    })
      .then((response) => response.json())
      .then((data) => {
        handleClose()
        setSnack({...snack, open:true, severity:"success", message:"Client saved"});
        console.log('Success:', data);
      })
      .catch((error) => {
        handleClose()
        setSnack({...snack, open:true, severity:"error", message: error});
        console.error('Error:', error);
      });
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: Clients </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Clients
          </Typography>
          <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Client
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <ClientList clients={data} />
        </Stack>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Client Name"
            fullWidth
            variant="standard"
            autoComplete='name'
            onChange={FormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            autoComplete='address'
            fullWidth
            variant="standard"
            onChange={FormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="clientImage"
            label="Client Image Url"
            fullWidth
            variant="standard"
            onChange={FormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="logoUrl"
            label="Logo Url"
            type="url"
            fullWidth
            variant="standard"
            onChange={FormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="primaryContact"
            label="Primary Contact"
            type="email"
            fullWidth
            variant="standard"
            onChange={FormChange}
          />
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Inactive"
            name="radio-buttons-group"
          >
            <FormControlLabel id="inactive" value="inactive" control={<Radio />} label="Inactive" onChange={FormChangeRadio} />
            <FormControlLabel id="active" value="active" control={<Radio />} label="Active" onChange={FormChangeRadio} />

          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddClient}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
