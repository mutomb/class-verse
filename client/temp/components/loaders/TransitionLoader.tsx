import React, {useState} from "react"
import Box from "@mui/material/Box"
import HashLoader from "react-spinners/HashLoader"
import {keyframes} from "@emotion/react"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from '@mui/material/styles'

const react_spinners_HashLoader_before = keyframes`
    0% {
      width: 30px;
      box-shadow: rgb(18 124 113) 60px -30px, rgb(18 124 113) -60px 30px;
    }
    35% {
      width: 150px;
      box-shadow: rgb(18 124 113) 0px -30px, rgb(18 124 113) 0px 30px;
    }
    70% {
      width: 30px;
      box-shadow: rgb(18 124 113) -60px -30px, rgb(18 124 113) 60px 30px;
    }
    100% {
      box-shadow: rgb(0, 0, 0) 60px -30px, rgb(0, 0, 0) -60px 30px;
    }
`;
const react_spinners_HashLoader_after = keyframes`
    0% {
      height: 30px;
      box-shadow: rgb(255 194 33) 30px 60px, rgb(255 194 33) -30px -60px;
    }
    35% {
      height: 150px;
      box-shadow: rgb(255 194 33) 30px 0px, rgb(255 194 33) -30px 0px;
    }
    70% {
      height: 30px;
      box-shadow: rgb(255 194 33) 30px -60px, rgb(255 194 33) -30px 60px;
    }
    100% {
      box-shadow: rgb(0, 0, 0) 30px 60px, rgb(0, 0, 0) -30px -60px;
    }
`;

export default function Loader() {
  let [loading, setLoading] = useState(true);
  const {breakpoints }=useTheme()
  const matchMobileView = useMediaQuery(breakpoints.down('md'))

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      '& span > span:nth-of-type(1)':{
        animation: `${react_spinners_HashLoader_before} 1.33333s ease 0s infinite normal none running !important`
        
      },
      '& span > span:nth-of-type(2)':{
        animation: `${react_spinners_HashLoader_after} 1.33333s ease 0s infinite normal none running !important`
      }
      }}>
      <HashLoader
        id="hashloader"
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={1.5}
        size={matchMobileView? 100: 150}
      />
    </Box>
  );
}