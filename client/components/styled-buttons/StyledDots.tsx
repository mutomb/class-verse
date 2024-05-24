import { styled } from '@mui/material/styles'

const StyledDots = styled('ul')(({ theme }) => ({
    '&.slick-dots': {
      position: 'absolute',
      left: 0,
      bottom: -20,
      paddingLeft: theme.spacing(1),
      textAlign: 'left',
      '& li': {
        marginRight: theme.spacing(2),
        '&.slick-active>div': {
          backgroundColor: theme.palette.primary.main,
        },
      },
    },
  }))

export default StyledDots