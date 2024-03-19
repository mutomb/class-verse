import React, { Suspense, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@emotion/react';

function LinearDeterminate() {
  const [progress, setProgress] = useState(0);
  const theme = useTheme()
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      setProgress(0);
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', position:'relative', color:'secondary.main'}}>
      <LinearProgress color='inherit' variant="determinate" value={progress} style={{height:'7px'}}/>
    </Box>
  );
}
  const Loadable = (Component) => (props) => (
        <Suspense fallback={<LinearDeterminate />}>
            <Component {...props}/>
        </Suspense>
);

export default Loadable;