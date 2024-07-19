import React from 'react';
import { styled } from '@mui/material/styles';
import {CheckOutlined, Description, VideoLabel} from '@mui/icons-material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Box, Zoom } from '@mui/material';

export const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.secondary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: theme.palette.secondary.main,
    }),
    '& .QontoStepIcon-completedIcon': {
      color: theme.palette.primary.main,
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      borderLeftColor: theme.palette.secondary.main,
      borderRightColor: theme.palette.secondary.main,
      borderTopColor: theme.palette.primary.main,
      borderBottomColor: theme.palette.primary.main,
      borderStyle: 'solid',
      borderWidth: {xs: 1, sm: 2}
    },
    transition: theme.transitions.create(['color', 'width', 'zIndex', 'font-size', 'border-radius', 'background-color'], {duration: 1000})
  }),
);

export const QontoStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Zoom timeout={1000} appear={true} in={true} color='inherit' unmountOnExit={false}>
          <CheckOutlined className="QontoStepIcon-completedIcon" sx={{bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: {xs: 15, sm: 30, md: 40}, height: {xs: 15, sm: 30, md: 40}}}/>
        </Zoom>
      ) : (
        <Box component='div' className="QontoStepIcon-circle" sx={{width: {xs: 15, sm: 30, md: 40}, height: {xs: 15, sm: 30, md: 40}, transform: 'rotate(-45deg)'}}/>
      )}
    </QontoStepIconRoot>
  );
}

export const StepIconConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        `linear-gradient( 95deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
      `linear-gradient( 95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,

    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
  transition: theme.transitions.create(['top', 'background-image', 'height', 'border', 'border-radius', 'background-color'], {duration: 1000})
}));

const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: `linear-gradient( 95deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
    boxShadow: theme.shadows[4],
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
  }),
  transition: theme.transitions.create(['background-image', 'box-shadow'], {duration: 1000})
}));

export const StepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Description />,
    2: <VideoLabel />,
  };

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </StepIconRoot>
  );
}