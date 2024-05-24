import React from "react";
import {IconButton, InputAdornment} from "@mui/material";
import { Clear }from "@mui/icons-material";

export default function ClearAdornment ({position, value, handleClick}) {
    if (value) {
        return (
        <InputAdornment position={position}>
            <IconButton
            onClick={handleClick}
            sx={{color: 'primary.main'}}
            >
            <Clear />
            </IconButton>
        </InputAdornment>
        );
    }

    return "";
};

