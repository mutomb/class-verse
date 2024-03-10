import React, { Suspense, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

function LinearDeterminate() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%'}}>
      <LinearProgress color='secondary' variant="determinate" value={progress} />
    </Box>
  );
}
  const Loadable = (Component) => (props) => (
        <Suspense fallback={<LinearDeterminate />}>
            <Component {...props} />
        </Suspense>
);

export default Loadable;