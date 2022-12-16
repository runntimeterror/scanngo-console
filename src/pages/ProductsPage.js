import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Snackbar, Alert, Container, Stack, Typography, Button, MenuItem, FormControl, InputLabel,OutlinedInput, DialogContent, DialogActions, Dialog, RadioGroup,
  TextField, FormControlLabel, Radio, DialogTitle } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import Iconify from '../components/iconify';
import PRODUCTS from '../_mock/products';

// ----------------------------------------------------------------------

export default function ClientsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState(0);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
 const [productData, setProductData] = useState({
    "name": "",
    "price": "",
    "active": false,
    "imageUrl": "",
    "clientId": ""
  });
  const [snack, setSnack] = useState({
    open : false,
    message:"",
    severity:""
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleSnackClose = () => {

    setSnack({...snack, open:false});
  };
    const FormChange = (event) => {

    const value = event.target.value;
    setProductData({
      ...productData,
      [event.target.id]: value
    });
  }

  const FormChangeRadio = (event) => {
    console.log(productData)
    setProductData({
      ...productData,
      active: event.target.value === 'active'
    })
  }

  const handleChange = (event: SelectChangeEvent) => {
    setClientId(event.target.value);
    fetchProducts(event.target.value)
  };

  const fetchClients = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/client`);
    const data = await response.json();
    setClients(data)
  }

  const fetchProducts = async (cltId) => {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/product/${cltId}`);
    const data = await response.json();
    setProducts(data)
  }

   const handleAddCProduct = async () => {
    console.log("payload=>", productData)
    productData.clientId =  clientId

    fetch(`${process.env.REACT_APP_API_ENDPOINT}/product/${clientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([productData]),
    })
      .then((response) => response.json())
      .then((data) => {
        handleClose()
        setSnack({...snack, open:true, severity:"success", message:"Product saved"});
        console.log('Success:', data);
      })
      .catch((error) => {
        handleClose()
        setSnack({...snack, open:true, severity:"error", message: error});
        console.error('Error:', error);
      });
  }
  useEffect(() => {
    fetchClients()
  }, [])
  return (
    <>
      <Helmet>
        <title> Dashboard: Products </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Products
          </Typography>
          <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Client</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={clientId}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
        >
          {clients.map((clt) => (
            <MenuItem
              key={clt.clientId}
              value={clt.clientId}
            >
              {clt.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
          <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
        </Stack>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={products} />
        <ProductCartWidget />
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            fullWidth
            variant="standard"
            autoComplete='name'
            onChange={FormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="price"
            autoComplete='price'
            fullWidth
            variant="standard"
            onChange={FormChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="imageUrl"
            label="Image Url"
            type="url"
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
          <Button onClick={handleAddCProduct}>Add</Button>
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
