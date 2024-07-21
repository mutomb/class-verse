import React, { FC, useEffect, useState, useTransition } from 'react'
import { styled } from '@mui/material/styles'
import { LinearProgress, linearProgressClasses } from "@mui/material"

interface LinearProgressProps {
  order: 1 | 2 | 3
}

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'color',
})<LinearProgressProps>(({ theme, order }) => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    ...(order === 1 && {
      backgroundColor: theme.palette.primary.main,
    }),
    ...(order === 2 && {
      backgroundColor: theme.palette.secondary.main,
    }),
    ...(order === 3 && {
      backgroundColor: theme.palette.error.main,
    }),
  },
}))
interface StyledLinearProgressProps extends LinearProgressProps{
  variant: "determinate" | "indeterminate" | "buffer" | "query"
  value: number,
}
const StyledLinearProgress: FC<StyledLinearProgressProps> = ({order, variant, value})=>{
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    let timer;
    startTransition(()=>{
       timer = setInterval(() => {
        setProgress((oldProgress) => {
          if(oldProgress>=value){
            clearInterval(timer);
            return oldProgress
          }
          const diff = Math.random() * 20;
          return Math.min(oldProgress + diff, value);
        });
      }, 500);
    });
    return () => {
      setProgress(0);
      timer && clearInterval(timer);
    };
  }, []);
  return (<BorderLinearProgress variant={variant}  value={progress} order={order} />)
}
export default StyledLinearProgress