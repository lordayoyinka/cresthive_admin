import React from 'react'
import ResAssignedSubs from '@/components/ResAssignedSubs';
import SearchBar from '@/components/SearchBar';

const Resources = () => {
  return (

    <div className='overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4'>
    <SearchBar />
    <ResAssignedSubs />
    
    </div>
  )
}

export default Resources