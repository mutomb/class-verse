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
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
  const Loadable = (Component) => (props) => (
        <Suspense fallback={<LinearDeterminate />}>
            <Component {...props} />
        </Suspense>
);
// This will show the animation
// const Loader = ({animationDuration, progress}) => {
// const Loader = () => {
//   return (<Box  
//     sx={{
//      background: "red",
//      height: "0.25rem",
//      position: "fixed",
//      top: 0,
//      left: 0,
//      width: "100%",
//      zIndex: 99999,
//      ml: `${(-1 + 1) * 100}%`,
//      transition: `margin-left 1000ms linear`,
//     }} 
//   /> );
// };

// const Loadable = (Component) => (props) => (
//   <Suspense fallback={(progress)=><Loader progress={progress}/>}>
//     <Component {...props} />
//   </Suspense>
// );

export default Loadable;