import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';

const db = getFirestore();

const AttendanceMarkingPage = () => {

  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const router = useRouter();
  const { date, classname } = router.query;

  const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    // Fetch the student list for the class from Firestore
    const fetchStudents = async () => {
      if (classname && date) {
        try {
          const classRef = doc(db, year, term, 'classes', classname);
          const classDoc = await getDoc(classRef);
          
          if (classDoc.exists()) {
            const classData = classDoc.data();
            const studentsArray = classData.students;
    
            if (studentsArray && studentsArray.length !== 0) {
              // Check if the attendance document exists for the given date
              const attendanceRef = doc(classRef, 'Attendance', date);
              const attendanceDoc = await getDoc(attendanceRef);
    
              if (attendanceDoc.exists()) {
                // If the attendance document exists, fetch status from the document
                const attendanceData = attendanceDoc.data();
                const studentsData = attendanceData.students;
    
                // Initialize students' attendance based on the fetched data
                const studentsWithAttendance = studentsArray.map((arraydetails) => {
                  const uid = arraydetails.uid;
                  const studentData = studentsData.find((student) => student.id === uid);
                  if (studentData) {
                    return {
                      id: uid,
                      name: studentData.name,
                      present: studentData.present,
                    };
                  }
                  return null;
                });
    
                if(studentsWithAttendance){

                  const another= [];

                  for(let i = 0; i < studentsWithAttendance.length; i++){

                    if(studentsWithAttendance[i] !== null){
                      another.push(studentsWithAttendance[i])
                    }

                  }


                  console.log("gotten data", another)
    
                // Set the students data
                setStudentsData(another);

                }
              } else {
                // If the attendance document does not exist, fetch student names and initialize as not present
                const studentsDataPromises = studentsArray.map(async (arraydetails) => {
                  const uid = arraydetails.uid;
                  const studentRef = doc(db, year, term, 'students', uid);
                  const studentDoc = await getDoc(studentRef);
                  if (studentDoc.exists()) {
                    const studentData = studentDoc.data();
                    return {
                      id: uid,
                      name: studentData.fullName,
                      present: false, // Initialize as not present
                    };
                  }
                  return null;
                });
    
                const studentsDataResults = await Promise.all(studentsDataPromises);
                const validStudentsData = studentsDataResults.filter((student) => student);
                setStudentsData(validStudentsData);
              }
            } else {
              console.log('No students in the class');
            }
          } else {
            console.log('Class document not found');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    

    fetchStudents();
  }, [classname, date]);

  const handleAttendanceChange = async (studentId, present) => {
    const newStudentsData = studentsData.map((student) => {
      if (student.id === studentId) {
        // Update the student's present status
        student.present = present;
      }
      return student;
    });

    try {
      const classRef = doc(db, year, term, 'classes', classname);
      const attendanceRef = doc(classRef, 'Attendance', date);
    
      // Check if the attendance document exists
      const attendanceSnapshot = await getDoc(attendanceRef);
    
      if (attendanceSnapshot.exists()) {
        // Document exists, update it
        await updateDoc(attendanceRef, { students: newStudentsData });
      } else {
        // Document does not exist, create it
        await setDoc(attendanceRef, { students: newStudentsData });
      }
    
      setStudentsData(newStudentsData);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
    
  };

  return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-6">Mark Attendance for {date}</h1>
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-3 px-4 font-semibold text-left">Student Name</th>
              <th className="w-1/4 py-3 px-4 font-semibold text-left">Status</th>
              <th className="w-1/4 py-3 px-4 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {studentsData.map((student) => (
              <tr key={student.id}>
                <td className="py-3 px-4">{student.name || "N/A"}</td>
                <td className="py-3 px-4">{student.present ? 'Present' : 'Absent' || "N/A"}</td>
                <td className="py-3 px-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5"
                      checked={student.present || false}
                      onChange={student ? (e) => handleAttendanceChange(student.id, e.target.checked) : ""}
                    />
                    <span className="ml-2">Mark Present</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
  );
};

export default AttendanceMarkingPage;
