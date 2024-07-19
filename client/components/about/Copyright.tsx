import React from "react";
import { Box, Typography} from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright(props: any) {
    return (
      <Box component='span' sx={{fontWeight: 700, color: 'text.secondary', ...props}}>
        {'Copyright © '}
        <Link color="inherit" to="/about" style={{textDecoration: 'none', color: 'inherit'}}>
          GO<Typography variant="subtitle1" sx={{display: 'inline'}}><sup>2</sup></Typography>
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Box>
    );
  }