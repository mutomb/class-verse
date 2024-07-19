import React from 'react';
import LoadableVisibility from "react-loadable-visibility/react-loadable"
import { SectionSkeleton } from '../skeletons';

const Loader = ()=> {
  return <SectionSkeleton/>
}

const Loadable = (component) => (props) => { 
  const Component = LoadableVisibility({
    loader: () => component,
    loading: Loader
  });
  return <Component {...props}/>
}

export default Loadable;