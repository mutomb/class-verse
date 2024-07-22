import React, {useState, MouseEvent, FC, ReactNode} from 'react';
import { useTheme } from '@mui/material/styles';
import { IconButton, Menu, SxProps, Theme } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
interface MoreMenuVertProps{
  children: ReactNode
  style?: SxProps<Theme> | undefined,
  icon?: any,
  transformOrigin?: {vertical: number, horizontal: number }
}
const MoreMenuVert: FC<MoreMenuVertProps> = ({children, style, icon, transformOrigin}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (<>
    <IconButton
    id="more-vert-menu-button"
    color="primary"
    aria-controls={open ? 'more-vert-menu-button' : undefined}
    aria-haspopup="true"
    aria-expanded={open ? 'true' : undefined}
    onClick={handleClick}
    sx={{
      zIndex: 10,
      transform: 'unset',
      ':hover':{
        boxShadow: 2,
        transform: 'translateY(-3px) scale(1.1)',
        transition: theme.transitions.create(['transform'], {duration: 500})
      },
      ...style
      }}>
      {icon? icon: <MoreVert />}
    </IconButton>
    <Menu
      id="more-vert-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'more-vert-menu-button',
        component: 'div'
      }}
      anchorOrigin={{
        vertical: 0,
        horizontal: 0,
      }}
      transformOrigin={
        transformOrigin? transformOrigin: {vertical: 40, horizontal: 0}
      }>
        {children}
    </Menu>
    </>);
}
export default MoreMenuVert