import React, { useEffect } from 'react';
import Router from 'next/router';

const OnboardHolder = ({children}) => {

  return (
    <div className='flex justify-center w-full'>
    
    {children}
    </div>
  )
}

export default OnboardHolder