import React, {useState, FC,} from "react"
import {Box, Grow} from "@mui/material"
import HashLoader from "react-spinners/HashLoader"
import {keyframes} from "@emotion/react"
import { useTheme } from '@mui/material/styles'

interface Props{
  style?: any,
  size?: number,
  speedMultiplier?: number
}
const Loader: FC<Props>= ({size=15, speedMultiplier=1.5, style}) => {
  let [loading, setLoading] = useState();
  const {palette }=useTheme()
  const translate_primary = keyframes`
    0% {
      box-shadow: ${palette.primary.main} ${size*2}px ${-size}px, ${palette.primary.main} ${-size*2}px ${size}px;
    }
    35% {
      width: ${size*2}px;
      box-shadow: ${palette.primary.main} 0px ${-size}px, ${palette.primary.main} 0px ${size}px;
    }
    100% {
      box-shadow: rgb(0, 0, 0, 0) ${size*2}px ${-size}px, rgb(0, 0, 0, 0) ${-size*2}px ${size}px;
    }
`;
const transalte_secondary = keyframes`
    0% {
      box-shadow: ${palette.secondary.main} ${size}px ${size*2}px, ${palette.secondary.main} ${-size}px ${-size*2}px;
    }
    35% {
      height: ${size*2}px;
      box-shadow: ${palette.secondary.main} ${size}px 0px, ${palette.secondary.main} ${-size}px 0px;
    }
    100% {
      box-shadow: rgb(0, 0, 0, 0) ${size}px ${size*2}px, rgb(0, 0, 0, 0) ${-size}px ${-size*2}px;
    }
`;
const rotate = keyframes`
    0% {
      transform: rotate(0deg)
    }
    35% {
      transform: rotate(45deg)
    }
    70% {
      transform: rotate(90deg)
    }
    100% {
      transform: rotate(180deg)
    }
`;

  return (
    <Grow timeout={2000} id="zoom-loader" appear={true} in={true} color='inherit' unmountOnExit={true}>
    <Box sx={{ 
      '& span > span:nth-of-type(1)':{
        animation: `${translate_primary} 20s cubic-bezier(1, 0, 0, 1) 0s infinite normal none running !important` 
      },
      '& span > span:nth-of-type(2)':{
        animation: `${transalte_secondary} 20s cubic-bezier(1, 0, 0, 1) 0s infinite normal none running !important`
      },
      '& span#hashloader':{
        animation: `${rotate} 60s linear(0 0%, 1.19 2.21%) 0s infinite normal none running !important`,
      },
      }}>
      <HashLoader
        id="hashloader"
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={speedMultiplier}
        size={size}
        cssOverride={{...style}}
      />
    </Box>
    </Grow>
  );
}
export default Loader