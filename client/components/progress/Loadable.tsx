import React from 'react';
import {LinearProgress, Box, Grow } from '@mui/material';
import loadable from '@loadable/component'
import { HashLoader } from '.';

function Loading() {
  // const [progress, setProgress] = useState(0);
  // const [isPending, startTransition] = useTransition()
  // useEffect(() => {
  //   let timer;
  //   startTransition(()=>{
  //      timer = setInterval(() => {
  //       setProgress((oldProgress) => {
  //         const diff = Math.random() * 10;
  //         return Math.min(oldProgress + diff, 100);
  //       });
  //     }, 500);
  //   });
  //   return () => {
  //     setProgress(0);
  //     timer && clearInterval(timer);
  //   };
  // }, []);
  const Loader = React.forwardRef(function (props, ref) {
    return (
      <div ref={ref} {...props}>
        Fade
      </div>
    );
  });

  return ( 
    <Box sx={{ width: '100%', position:'relative', color: 'secondary.main',
    // [`& .${linearProgressClasses.bar1Buffer}`]:{bgcolor: 'primary.main'},
    // [`& .${linearProgressClasses.bar2Buffer}`]:{bgcolor: 'secondary.main'},
    // [`& .${linearProgressClasses.dashed}`]:{bgcolor: 'red'},
    }}>
      <LinearProgress  variant='indeterminate' sx={{height: '7px'}}/>
      {/* <LinearProgress  variant="buffer" value={progress} valueBuffer={10} sx={{height: '7px'}}/> */}
      <Box sx={{height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <HashLoader size={20}/>
      </Box>
    </Box>
  );
}

const Loadable = (component) => (props) => { 
    const Component = loadable(()=>component, {fallback:<Loading />})
  return(<Component {...props}/>);
}
export default Loadable;