import React from 'react'
import ResPartDocs from '@/components/ResPartDocs'
import RespartAssignments from '@/components/RespartAssignments'

const ResPart = () => {
  return (
    <div className='overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4'>

    <RespartAssignments />
    <ResPartDocs />
    
    </div>
  )
}

export default ResPart