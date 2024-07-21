import React, { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { Theme, useMediaQuery } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { ButtonProps } from '@mui/material/Button'
import { fontFamily } from '../../config/theme/typography'

interface BaseButtonProps extends Pick<ButtonProps, 'onClick' | 'type' | 'startIcon' | 'endIcon'> {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'default' | 'primary' | 'secondary' | 'dark' | 'light' | 'disabled' | 'error'
  size?: 'small' | 'medium' | 'large'
  disableHoverEffect?: boolean,
  disabled?:boolean,
  style?: any
}
interface StyledButtonRootProps extends BaseButtonProps {
  theme?: Theme
}

const StyledButtonRoot = styled('button', {
  shouldForwardProp: (prop) =>
    prop !== 'variant' && prop !== 'color' && prop !== 'size' && prop !== 'disableHoverEffect',
})<StyledButtonRootProps>(({ theme, color, variant, size, disableHoverEffect, style }) => ({
  fontFamily,
  cursor: 'pointer',
  minWidth: 40,
  fontSize: {xs: 12, md: 14},
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: 1,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  display: 'inline-flex',
  alignItems: 'center',
  userSelect: 'none',
  transform: 'unset',
  position: 'relative',
  overflow: 'hidden',
  border: 'none',
  whiteSpace: 'nowrap',
  WebkitTapHighlightColor: 'transparent',
  verticalAlign: 'middle',
  outline: 'none !important',
  transition: theme.transitions.create(['transform'], {duration: 500}),

  // hover
  '&:hover': {
    ...(!disableHoverEffect && {
      transform: 'translateY(-3px) scale(1.03)',
    }),
  },

  '& svg': {
    fontSize: {xs: 18, sm:20},
  },

  // sizes and variants
  ...(size === 'small' &&
    variant === 'outlined' && {
      padding: '4px 10px',
    }),
  ...(size === 'medium' &&
    variant === 'outlined' && {
      padding: '6px 14px',
    }),
  ...(size === 'large' &&
    variant === 'outlined' && {
      padding: '10px 18px',
      fontSize: {xs: 12, sm: 15},
    }),

  ...(size === 'small' &&
    variant !== 'outlined' && {
      padding: '6px 12px',
    }),
  ...(size === 'medium' &&
    variant !== 'outlined' && {
      padding: '8px 16px',
    }),
  ...(size === 'large' &&
    variant !== 'outlined' && {
      padding: '12px 20px',
      fontSize: {xs: 12, sm: 15},
    }),

  // variants
  ...(variant !== 'contained' && {
    backgroundColor: 'transparent',
    boxShadow: 'none !important',
  }),

  // colors & varians
  ...(color === 'default' &&
    variant === 'contained' && {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.primary.contrastText,
    }),
  ...(color === 'primary' &&
    variant === 'contained' && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: '0 6px 22px 0 rgb(18 124 113 / 12%)',
    }),
  ...(color === 'secondary' &&
    variant === 'contained' && {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.contrastText,
    }),
  ...(color === 'dark' &&
    variant === 'contained' && {
      backgroundColor: '#313d56',
      color: theme.palette.primary.contrastText,
    }),
  ...(color === 'light' &&
    variant === 'contained' && {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.text.primary,
    }),

  ...(color === 'primary' &&
    variant === 'outlined' && {
      border: `2px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
    }),
  ...(color === 'secondary' &&
    variant === 'outlined' && {
      border: `2px solid ${theme.palette.secondary.main}`,
      color: theme.palette.secondary.main,
    }),
  ...(color === 'dark' &&
    variant === 'outlined' && {
      border: `2px solid #313d56`,
      color: '#313d56',
    }),
  ...(color === 'light' &&
    variant === 'outlined' && {
      border: `2px solid #313d56`,
      color: `#313d56`,
    }),
  ...(color === 'error' &&
    variant === 'outlined' && {
      border: `2px solid ${theme.palette.error.dark}`,
      color: theme.palette.error.dark,
    }),    
  ...(color === 'primary' &&
    variant === 'text' && {
      color: theme.palette.primary.main,
    }),
  ...(color === 'secondary' &&
    variant === 'text' && {
      color: theme.palette.secondary.main,
    }),
  ...(color === 'dark' &&
    variant === 'text' && {
      color: '#313d56',
    }),
  ...(color === 'light' &&
    variant === 'text' && {
      color: theme.palette.primary.contrastText,
    }),
  ...(color === 'disabled' &&
  variant === 'text' && {
    color: theme.palette.text.secondary
  }),
  ...(color === 'disabled' &&
  variant === 'outlined' && {
    color: theme.palette.text.secondary
  }),
  ...(color === 'error' &&
  variant === 'outlined' && {
    color: theme.palette.error.dark
  }),
  ...(color === 'disabled' &&
  variant === 'contained' && {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.text.secondary,
  }),
  ...(color === 'error' &&
  variant === 'contained' && {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.error.dark,
  }),
  ...style
}))

interface Props extends BaseButtonProps {
  children: ReactNode,
}

const StyledButton: FC<Props> = (props: Props) => {
  const {color='primary', variant='contained', disableHoverEffect=false, children, onClick, startIcon, endIcon, disabled, size, ...rest } = props
  const theme = useTheme()
  const xsMobileView = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true})
  const smMobileView = useMediaQuery(theme.breakpoints.down('md'), {defaultMatches: true})
  const mdMobileView = useMediaQuery(theme.breakpoints.down('lg'), {defaultMatches: true})

  return (
    <StyledButtonRoot color={color} variant={variant} size={size || (xsMobileView || smMobileView)? 'small': mdMobileView? 'medium': 'large' } disabled={disabled} onClick={disabled? undefined: onClick} disableHoverEffect={disableHoverEffect} {...rest}>
      {startIcon && (
        <Box component="span" sx={{ display: 'inherit', mr: 1, ml: -0.5 }}>
          {startIcon}
        </Box>
      )}
      <Box component="span">{children}</Box>
      {endIcon && (
        <Box component="span" sx={{ display: 'inherit', ml: 1, mr: -0.5 }}>
          {endIcon}
        </Box>
      )}
    </StyledButtonRoot>
  )
}

export default StyledButton
