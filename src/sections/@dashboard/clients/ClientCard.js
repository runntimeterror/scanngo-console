import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components
import Label from '../../../components/label';

// ----------------------------------------------------------------------

const StyledClientImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ client }) {
  const { name, clientImage,  status } = client;
  const img = `/assets/images/covers/${clientImage}`
  const clientStatus = status === 1?'Active' : 'Inactive'
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {clientStatus && (
          <Label
            variant="filled"
            color={(clientStatus === 'Active' && 'success') || 'error'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {clientStatus}
          </Label>
        )}
        <StyledClientImg alt={name} src={img} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

    
      </Stack>
    </Card>
  );
}
