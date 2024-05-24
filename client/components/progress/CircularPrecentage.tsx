import React, {FC, useEffect, useState, useTransition} from "react"
import { CircularProgress, Typography, Box } from "@mui/material"

interface Props{
  percentage: number
}
const CircularPercentage: FC<Props>= ({percentage}) => {
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
          const diff = Math.random() * 20;
          return Math.min(oldProgress + diff, percentage);
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
          }}
        >
          <Typography sx={{ fontWeight: 600, lineHeight: 1 }}>Your Progress</Typography>
          <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.disabled' }}>
            {percentage < 30 && <>Started</>}
            {percentage < 50 && <>Half Way</>}
            {percentage < 60 && <>Almost Done</>}
            {percentage == 100 && <>Completed</>}
          </Typography>
          <Box
            sx={{
              height: 85,
              width: 85,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4" sx={{ color: progress < 30? 'red':progress < 50? 'secondary.main': progress < 60? 'secondary.light': 'secondary.main' }}>
              {progress} %
            </Typography>
            <CircularProgress
              sx={{ position: 'absolute', color: 'divider' }}
              thickness={2}
              variant="determinate"
              // value={85}
              value={100}
              size={85}
            />
            <CircularProgress
              disableShrink
              thickness={2}
              variant="indeterminate"
              // value={75}
              value={75}
              size={progress}
              sx={{ transform: 'rotate(96deg) !important', position: 'absolute',
              color: progress < 30? 'red' :progress < 50? 'secondary.main': progress < 60? 'secondary.light': 'secondary.main'
               }}
            />
          </Box>
        </Box>
  );
}
export default CircularPercentage