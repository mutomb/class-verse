import React, {FC, ReactElement} from 'react';
import {Box, Chip, SxProps, chipClasses} from '@mui/material';
import{Theme} from '@mui/material/styles'
import {TagFaces} from '@mui/icons-material';

interface ChipProps {
  chipData:{
    key: number,
    label: string
  }[]
  icon?: ReactElement,
  handleDelete?: (chipToDelete: {key: number, label: string}) =>()=> void,
  style?: SxProps<Theme>,
  chipStyle?: SxProps<Theme>,
  size?: 'small' | 'medium'
}

const ChipsArray: FC<ChipProps> = ({icon, chipData, handleDelete, style, chipStyle, size='small', }) => {
  return (
    <Box component="ul" sx={{width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0, ...style}}>
      {chipData && chipData.map((data) => {
        return (
          <Box component='li' sx={{m: 0.5}} key={data.key}>
            <Chip
              icon={icon || <TagFaces sx={{color: 'primary.contrastText'}}/>}
              size={size}
              label={data.label}
              {...(handleDelete && {onDelete:handleDelete(data)})}
              sx={{minHeight: 24, height: 'auto', color: 'primary.contrastText', boxShadow: 2, bgcolor: 'rgba(18, 124, 113, 0.7)', 
              [`& .${chipClasses.icon}`]: {color: 'primary.contrastText'}, 
              [`& .${chipClasses.deleteIcon}`]: {color: 'primary.contrastText'}, ...chipStyle
            }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
export default ChipsArray