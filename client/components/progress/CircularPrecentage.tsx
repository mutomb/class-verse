import React, {FC, ReactNode, useEffect, useState, useTransition} from "react"
import { CircularProgress, Typography, Box } from "@mui/material"

interface Props{
  percentage: number,
  heading?: ReactNode,
  size?: number
}
const CircularPercentage: FC<Props>= ({percentage, heading, size=85}) => {
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    let timer;
    startTransition(()=>{
       timer = setInterval(() => {
        setProgress((oldProgress) => {
          if(oldProgress>=percentage){
            clearInterval(timer);
            return oldProgress
          }
          const diff = Math.random() * 5;
          return Math.round(Math.min(oldProgress + diff, percentage));
        });
      }, 500);
    });
    return () => {
      setProgress(0);
      timer && clearInterval(timer);
    };
  }, []);
  return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            '&:hover':{boxShadow: 2},
            textAlign: 'center',
            color: progress>70?'primary.main':(progress<70 && progress>50)?'secondary.main':'error.main'
          }}>
          {heading}
          <Typography variant="subtitle1" sx={{ mb: 1, color: 'inherit' }}>
            {percentage < 30 && <>Barely scratched the surface! Keep Going!</>}
            {percentage >= 30 && percentage < 50 && <>Almost half way through!</>}
            {percentage >= 50 && percentage < 60 && <>Half Way through! Keep up the good work!</>}
            {percentage >= 60 && percentage < 80 && <>Keep going!</>}
            {percentage >= 80 && percentage < 100 && <>Almost Done! Keep going!</>}
            {percentage == 100 && <>Well Done! Completed!</>}
          </Typography>
          <Box
            sx={{
              height: size,
              width: size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              position: 'relative',
              color: 'inherit'
            }}>
            <Typography variant="h4" sx={{ color: 'inherit'}}>
              {progress? progress: 0} %
            </Typography>
            <CircularProgress
              sx={{ position: 'absolute', color: 'divider' }}
              thickness={2}
              variant="determinate"
              value={100}
              size={size}
            />
            <CircularProgress
              disableShrink
              thickness={2}
              variant="determinate"
              value={progress}
              size={size}
              sx={{transform: 'rotate(90deg) !important', position: 'absolute', color: 'inherit'}}
            />
          </Box>
        </Box>
  );
}
export default CircularPercentage