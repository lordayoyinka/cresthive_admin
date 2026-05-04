import React  from 'react'
import {useEffect} from "react"
import Calendar  from '@/components/Calendar'
import SubjectStudentReport from '@/components/SubjectStudentResult'
import Fullcaltest from '@/components/CalendarPage'

const Students = () => {


 
  return (
    <div className='bg-indigo-50 h-full pb-40 overflow-y-auto p-6 m-6 rounded-lg'>





    <Fullcaltest />
    
    

    <a href='./AttendanceList' className=''>Attendance</a>
    </div>
  )
}

export default Students