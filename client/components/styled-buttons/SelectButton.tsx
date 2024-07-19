import React, { FC, } from 'react'
import { MenuItem, Select, Typography, menuItemClasses, paperClasses} from '@mui/material'
import { SxProps, Theme} from '@mui/material/styles'

import { useTheme } from '@mui/material/styles'

interface SelectButton {
    options: any[]
    value: any
    handleChange: (arg?: any)=> void,
    label?: string,
    styles?: SxProps<Theme>,
    menuStyle?: SxProps<Theme>,
    variant?: 'outlined' | 'standard'
  }
  const SelectButton: FC<SelectButton> = ({options, value, handleChange, label, styles, variant='standard', menuStyle}) => {
    const { transitions } = useTheme()

    return (<>
      <Select
          {...(label && {labelId:`select-${label}-label`, label:label})}
          id={`select-${label}`}
          variant={variant}
          value={value}
          onChange={handleChange}
          autoWidth
          displayEmpty
          MenuProps={{
            sx:{
              [`& .${paperClasses.root}`]:{
              borderLeftColor: 'secondary.main', borderRightColor: 'secondary.main', borderTopColor: 'primary.main', borderBottomColor: 'primary.main', borderStyle: 'solid', borderWidth: {xs: 1, sm: 2},
              bgcolor: (theme)=> theme.palette.mode ==='dark'?`rgba(0,0,0,0.7)`:`rgba(255,255,255,0.7)`, px:0,
              ...menuStyle
              },
              [`& .${menuItemClasses.root}`]:{
                px: {xs: 1, md: 2},
                ':hover':{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                },
              },
            }
          }}
          sx={{
            my: '0 !important',
            px: 1,
            height: 48, 
            color: 'primary.contrastText',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 1,
            display: 'inline-flex',
            alignItems: 'center',
            userSelect: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            WebkitTapHighlightColor: 'unset',
            verticalAlign: 'middle',
            outline: 'none !important',
            transform: 'unset',
            transition: transitions.create(['transform'], {duration: 500}),
            bgcolor: 'primary.main',
            '::before':{
              border: 'none !important',
            },
            ...styles
          }}
          renderValue={(selected) => {
            if (selected && selected.length === 0 && options.length === 0) {
              return ''
            }
            if (selected && selected.length === 0 && options.length>0) {
              return options[0]
            } 
            return selected
          }}>
          {options && options.map(option => (
            <MenuItem key={option} value={option} sx={{transition: transitions.create(['background-color']), ':hover':{bgcolor: 'primary.main'}}}>
              <Typography variant="inherit">
              {option}
              </Typography>
            </MenuItem>
          ))}
      </Select>
    </>)
  }
  export default SelectButton