import React from 'react';
import {Typography, Grid, TextField, FormControlLabel, Checkbox} from '@mui/material';
export default function PaymentForm() {
  return (
    <>
      <Grid container spacing={1} sx={{boxShadow: 4, borderWidth: 2, borderColor: 'secondary.main', borderRadius: 2, borderStyle: 'solid', transform: 'unset'}}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label={<Typography variant='body2' sx={{color: 'primary.main'}}>Remember credit card details for next time</Typography>}
          />
        </Grid>
      </Grid>
    </>
  );
}