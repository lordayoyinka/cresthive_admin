import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { useRouter } from 'next/router';


import { getFirestore, doc, getDocs, collection, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';

const db = getFirestore();





const CalendarPage = () => {

  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);

  const router = useRouter();
  const { classDocumentName } = router.query;
  const [markedDates, setMarkedDates] = useState([]); // Store marked dates

  useEffect(() => {
    // Fetch marked dates from the attendance collection
    const fetchMarkedDates = async () => {
      try {
        // Replace 'classname' with your class name
        const classname =  await classDocumentName;
        const attendanceRef = collection(db, year, term, 'classes', classname, 'Attendance');
        const markedDatesSnapshot = await getDocs(attendanceRef);
        const markedDates = [];

        markedDatesSnapshot.forEach((doc) => {
          markedDates.push(doc.id);
        });

        setMarkedDates(markedDates);
      } catch (error) {
        console.error('Error fetching marked dates:', error);
      }
    };

    fetchMarkedDates();
  }, []);

  // Create an events array dynamically from marked dates
  const events = markedDates.map((date) => ({
    title: 'Marked Attendance',
    start: date,
    classNames: 'attendance-marked',
  }));

  

  const updateAttendance = async (className, date, student) => {
    const classRef = doc(db, year, term, 'classes', className);
    const attendanceRef = doc(classRef, 'Attendance', date);
  
    try {
      // Check if the date document exists
      const attendanceSnapshot = await get(attendanceRef);
  
      if (attendanceSnapshot.exists()) {
        // If it exists, update the students array
        await updateDoc(attendanceRef, {
          students: arrayUnion(student),
        });
      } else {
        // If it doesn't exist, create the date document
        await setDoc(attendanceRef, { students: [student] });
      }
  
      return 'Attendance updated successfully';
    } catch (error) {
      return `Error updating attendance: ${error.message}`;
    }
  };

  // Handle day click event to navigate to the attendance marking page
  const handleDayClick = (arg) => {
    const selectedDate = arg.dateStr;
    // Navigate to the attendance marking page with the selected date
    window.location.href = `/AttendanceMarkingPage?date=${selectedDate}&classname=${classDocumentName}`;
  };

  return (
    <div className="h-fit">
      <a href={`/AllClassStudents?classDocumentName=${classDocumentName}`}>
        <div className="mt-2 mb-10 drop-shadow-xl bg-white p-2 flex align-contents-center justify-between text-lg font-semibold text-slate-700 rounded-lg">
          <p className="place-self-center ml-4">View All Students list</p>
          <img className="w-12 h-12 opacity-50" src="./Assets/right-arrow.png" />
        </div>
      </a>


      

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next',
        }}
        events={events} // Pass the events data here
        dateClick={handleDayClick} // Use dateClick event handler
      />
    </div>
  );
};

export default CalendarPage;
