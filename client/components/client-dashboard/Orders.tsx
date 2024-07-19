import React from 'react';
import {Box, Link as MuiLink, Table, TableBody, TableCell, TableHead, TableRow, Typography, Zoom, tableCellClasses} from '@mui/material';

// Generate Order Data
function createData(
  id: number,
  status: string,
  date: string,
  product: string,
  shipTo: string,
  paymentMethod: string,
  amount: number,
) {
  return { id, status, date, product, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    'Processed',
    '16 Mar, 2019',
    'UI/UX Course',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44,
  ),
  createData(
    1,
    'Delivered',
    '16 Mar, 2019',
    'Angular 2 Book',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99,
  ),
  createData(2, 
  'Processing',
  '16 Mar, 2019', 
  'Mathematics F2F', 
  'Boston, MA', 
  'MC ⠀•••• 1253', 
  100.81),
  createData(
    3,
    'Processed',
    '16 Mar, 2019',
    'Machine Learning',
    'Gary, IN',
    'AMEX ⠀•••• 2000',
    654.39,
  ),
  createData(
    4,
    'Cancelled',
    '15 Mar, 2019',
    '3D Design',
    'Long Branch, NJ',
    'VISA ⠀•••• 5919',
    212.79,
  ),
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <Zoom timeout={1000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{overflowX: 'scroll', bgcolor: 'background.default', borderRadius: 3, p: 1}}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{color: 'text.primary'}}>
        Recent Orders
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (<TableRow key={row.id} 
              sx={{[`& .${tableCellClasses.root}`]:{
                color: row.status === 'Not processed'?'text.primary': row.status === 'Processing'?'secondary.main': row.status === 'Processed'?'primary.main':
                row.status === 'Shipped'?'primary.main': row.status === 'Delivered'?'primary.main': 'error.main' }}}>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>)
          })}
        </TableBody>
      </Table>
      <MuiLink color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </MuiLink>
      </Box>
    </Zoom>
  );
}
