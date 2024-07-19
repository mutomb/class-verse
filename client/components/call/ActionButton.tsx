import React, { FC } from 'react';
import { IconButton } from '@mui/material';
interface ActionButtonProps{
  disabled?: boolean
  icon: any
  onClick: ()=> void
}
const ActionButton: FC<ActionButtonProps> = ({disabled=false, icon, onClick }) => {
  return (
    <IconButton
      type="button"
      onClick={onClick}
      disabled={disabled}>
      {icon}
    </IconButton>
  );
}
export default ActionButton;
