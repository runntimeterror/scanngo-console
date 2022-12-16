import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ClientCard from './ClientCard';

// ----------------------------------------------------------------------

ClientList.propTypes = {
  clients: PropTypes.array.isRequired,
};

export default function ClientList({ clients, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {clients.map((client) => (
        <Grid key={client.id} item xs={12} sm={6} md={3}>
          <ClientCard client={client} />
        </Grid>
      ))}
    </Grid>
  );
}
