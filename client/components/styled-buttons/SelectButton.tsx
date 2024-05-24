import React, { FC } from 'react'
import { MenuItem, Select } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface SelectButton {
    options: any[]
    value: any
    handleChange: ()=> void,
    label: string,
    styles?: any,
  }
  const SelectButton: FC<SelectButton> = ({options, value, handleChange, label, styles}) => {
    const { transitions } = useTheme()

    return (<>
      <Select
          labelId={`select-${label}-label`}
          id={`select-${label}`}
          variant="standard"
          value={value}
          onChange={handleChange}
          autoWidth
          displayEmpty
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
            WebkitTapHighlightColor: 'transparent',
            verticalAlign: 'middle',
            outline: 'none !important',
            transform: 'unset',
            transition: transitions.create(['transform']),
            bgcolor: 'primary.dark',
            ':hover':{
              bgcolor: 'primary.dark',
            },
            '::before':{
              border: 'none !important'
            },
            ...styles
          }}
          renderValue={(selected) => {
            if (selected.length === 0 && options.length === 0) {
              return ''
            }
            if (selected.length === 0 && options.length>0) {
              return options[0]
            } 
            return selected
          }}>
          {options.map(option => (
            <MenuItem key={option} value={option} sx={{transition: transitions.create(['background-color']), ':hover':{bgcolor: 'primary.main'}}}>
              {option}
            </MenuItem>
          ))}
      </Select>
    </>)
  }
  export default SelectButton