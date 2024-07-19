import React, { FC } from 'react';
import {Box, Typography, Zoom} from '@mui/material';

interface ExpItemProps {
  item: Exp
}

const ExpItem: FC<ExpItemProps> = ({ item }) => {
  const { value, label } = item
  return (
    <Zoom timeout={2000} id="zoom-image" appear={true} in={true} color='inherit' unmountOnExit={true}>
      <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 0 }, p: {xs: 2, md: 4} }}>
        <Typography
          sx={{ color: 'secondary.main', mb: { xs: 1, md: 2 }, fontSize: { xs: 34, md: 44 }, fontWeight: 'bold' }}
        >
          {value}
        </Typography>
        <Typography variant="h4" sx={{color: 'primary.contrastText', fontSize: {xs: 20, md: 22}}}>
          {label}
        </Typography>
      </Box>
    </Zoom>
  )
}
export default ExpItem