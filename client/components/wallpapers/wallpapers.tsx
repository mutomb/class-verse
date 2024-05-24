import React, { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
interface WallpaperProps{
 children?: ReactNode,
 variant?: 'linear' | 'radial'
 primaryColor: string,
 secondaryColor: string,
 style?: any
 id?: string
}
const WallPaperYGW: FC<WallpaperProps> = ({children, variant, primaryColor, secondaryColor, style, id}) =>{
  return (
      <Box 
      id={id}        //   content: '""',
      //   width: '140%',
      //   height: '140%',
      //   position: 'absolute',
      //   bottom: '-50%',
      //   left: '-30%',
      //   background:
      //     'radial-gradient(at center center, rgb(18, 124, 113) 0%, rgba(247, 237, 225, 0) 70%)',
      //   transform: 'rotate(30deg)',
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: `${variant? variant: 'linear'}-gradient(${primaryColor} 0%, ${secondaryColor} 100%)`,
        transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
        ...style,
        // '&::before': {
        //   content: '""',
        //   width: '140%',
        //   height: '140%',
        //   position: 'absolute',
        //   top: '-40%',
        //   right: '-50%',
        //   background:
        //     'radial-gradient(at center center, rgb(255, 194, 33) 0%, rgba(62, 79, 249, 0) 64%)',
        // },
        // '&::after': {
        //   content: '""',
        //   width: '140%',
        //   height: '140%',
        //   position: 'absolute',
        //   bottom: '-50%',
        //   left: '-30%',
        //   background:
        //     'radial-gradient(at center center, rgb(18, 124, 113) 0%, rgba(247, 237, 225, 0) 70%)',
        //   transform: 'rotate(30deg)',
        // },
      }}>
      {children}
      </Box>
  )
}
const WallPaperPOB = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});

export {WallPaperYGW, WallPaperPOB}