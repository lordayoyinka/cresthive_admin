import React, { useState, useEffect } from 'react';

const Loading = ({newstate}) => {
  


    const [loadingstate, setLoading] = useState(newstate);
   
    
    
      useEffect(() => {
        console.log("loadingstate", loadingstate)
       setLoading(newstate)
      }, [newstate]);
    



      if(loadingstate){ 

        return ( <div className='bg-black/75 h-screen w-screen flex items-center justify-center  '>

            <div className='bg-white p-8 rounded-3xl w-80 m-10'>

                <div className='mx-auto w-fit'>
                    <img src='Assets/l2.gif'  className='w-20 bg-white h-20 md:w-60 md:h-40 object-fit'/>
                </div>

                <div className='text-center pt-4 font-semibold text-slate-500'>
                    <p>Loading...</p>
                </div>


            </div>

        </div>
      ) }
      
      
       
 
  }

export default Loading