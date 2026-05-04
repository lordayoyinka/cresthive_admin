import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getFirestore,
  collection,
  query,
  where,
  updateDoc,
  getDoc,
  doc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { data } from "autoprefixer";

const AssignmentNotificationPage = () => {
  const [loader, setloader] = useState(false);

  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const router = useRouter();
  const { subject, document } = router.query;

  const [studentsData, setStudentsData] = useState([]);
  const [missedStudents, setMissedStudents] = useState([]);
  const subjectId = subject; // Replace with the subject you want to fetch
  const assignmentDocumentId = document; // Replace with the assignment document you want to update
  const [students, setStudents] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [partname, setpartname] = useState("");


  const db = getFirestore();

  console.log(subjectId, document);

  useEffect(() => {
    // Log the students when the state updates
    console.log("Students updated:", students);
    console.log("Students Data updated:", studentsData);
  }, [studentsData]);

  const fetchData = async () => {
    const studentsCollection = collection(db, year, term, "subjects");
    const studentsQuery = doc(studentsCollection, subjectId);

    try {
      const querySnapshot = await getDoc(studentsQuery);
      const gdata = querySnapshot.data();
      const mydata = gdata.Students;
      const mystudents = [];

      
      mydata.forEach(student => {
        const uid = student.uid;
        if (uid) {

      
          const studentref = doc(db, year, term, "students", uid);
  
          getDoc(studentref).then((snap) => {
            const data = snap.data();
    
            if (data) {
              console.log(data.fullName, "thename2");
              student.fullName = data.fullName;
              mystudents.push(student)

            }
          
          }).      
        catch((e) => {
          console.error("Something went wrong somewhere", e)
        })
  
      }
        
      });


      const datatoset = mystudents;
      console.log("Students data to set:", datatoset);

      setStudents(datatoset);
      console.log("Students set:", datatoset);

      if (assignmentDocumentId) {
        console.log("Assignment document ID exists:", assignmentDocumentId);

        const assignmentDocRef = doc(
          db,
          "subjects",
          subjectId,
          "assignments",
          assignmentDocumentId
        );
        const assignmentDocSnapshot = await getDoc(assignmentDocRef);
        console.log(
          "Assignment document snapshot:",
          assignmentDocSnapshot.data()
        );

        if (assignmentDocSnapshot.exists()) {
          console.log("Assignment document exists");

          const assignmentData = assignmentDocSnapshot.data();
          console.log("Assignment data:", assignmentData);

          const sass = assignmentData.students;
          console.log("get student data", sass)


          if (sass && sass.length > 0) {
            // Match students with the list of all students and set the "missed" flag accordingly
            console.log("There is at least student's array")

            if(datatoset){
            const studentsWithoutAssignments = datatoset.map( (arraydetails) => {
              const uid = arraydetails.uid;
              const studentData = sass.find((student) => student.uid === uid);
              if (studentData) {
                console.log("set student data")

                return {
                  uid: uid,
                  fullName: studentData.fullName,
                  missed: studentData.missed,
                };

              }

              return arraydetails;
            });

            console.log("students without assignments", studentsWithoutAssignments);

            setStudentsData(
              studentsWithoutAssignments.filter((student) => student !== null)
            );

            }
          } else {
            // No "students" array in the assignment document, set all students as not missed
            console.log("No students array in the assignment document");
            console.log("Assignment document does not exist");
            const allStudentsMissed = datatoset.map((student) => ({
              ...student,
              missed: false,
            }));
            console.log("All students marked as missed1:", allStudentsMissed);

            setStudentsData(
              allStudentsMissed.filter((student) => student !== null)
            );

            if(datatoset){


            const studentsDataPromises = datatoset.map(async (arraydetails) => {
              const uid = arraydetails.uid;
              console.log("arraydetails", uid)
              if(uid){
              const studentRef = doc(db, year, term, "students", uid);
              const studentDoc = await getDoc(studentRef);
              if (studentDoc.exists()) {
                const studentData = studentDoc.data();
                return {
                  uid: uid,
                  fullName: studentData.fullName,
                  missed: false, // Initialize as not present
                };
              }

            }
              return null;
            });


            const studentsDataResults = await Promise.all(studentsDataPromises);
            const validStudentsData = studentsDataResults.filter(
              (student) => student
            );
            setStudentsData(
              validStudentsData.filter((student) => student !== null)
            );

            }
          }
        } else {
          // Assignment document doesn't exist, set all students as not missed
          console.log("Assignment document does not exist");
          const allStudentsMissed = datatoset

          console.log("All students marked as missed2:", allStudentsMissed);

          setStudentsData(
            allStudentsMissed.filter((student) => student !== null)
          );
        }
      } else {
        // If no assignment document specified, set all students as not missed
        console.log("No assignment document specified");
        const allStudentsMissed = datatoset.map(async (student) => {
          const data = await matchstudentui(student.uid);

            
          return ({
          ...student,
          missed: false,
          fullName: data,
        })});
        console.log("All students marked as missed:", allStudentsMissed);

        setStudentsData(
          allStudentsMissed.filter((student) => student !== null)
        );
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const matchstudentui = async (uid) => {
    if (uid) {

      
        const studentref = doc(db, year, term, "students", uid);

        const name = await getDoc(studentref).then((snap) => {
          const data = snap.data();
  
          if (data) {
            console.log(data.fullName, "thename");
            setpartname(data.fullName);
            return data.fullName;
          }else{
            setpartname("Not found")
            return "data not found";

          }
        
        }).      
      catch((e) => {
        console.error("Something went wrong somewhere", e)
      })

      return name;
    }else{
      
    return "name not found";
    }
  }

  useEffect(() => {
    if (subjectId) {
      fetchData();
    }
  }, [subjectId, assignmentDocumentId]);

  const handleAssignmentStatusChange = async (studentId, isChecked) => {
    const db1 = getFirestore();

    // Handle marking attendance here and update the "missedStudents" array
    const newStudentsData = studentsData.map((student) => {
      if (student.uid === studentId) {
        // Update the student's present status
        student.missed = isChecked;
      }
      return student;
    });

    try {
      const assignmentDocRef = doc(
        db1,
        "subjects",
        subjectId,
        "assignments",
        assignmentDocumentId
      );
      const assignmentDocSnapshot = await getDoc(assignmentDocRef);

      if (assignmentDocSnapshot.exists()) {
        // Document exists, update it
        await updateDoc(assignmentDocRef, { students: newStudentsData });


        console.log("updsus")
        setStudentsData(newStudentsData.filter((student) => student !== null));
        sendNotification(studentId, isChecked);
      } else {
        // Document does not exist, create it
        await setDoc(assignmentDocRef, { students: newStudentsData });
        console.log("updsus")


        setStudentsData(newStudentsData.filter((student) => student !== null));
        sendNotification(studentId, isChecked);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("something went wrong!")
    }
  };

  const sendNotification = async (studentId, isChecked) => {
    // Data
    const notificationmissed = {
      title: "Assignment Not Done",
      message: `You have not done one of your ${subjectId} assignments. Kindly do it or see the teacher`,
      date: new Date(),
      status: false,
    };

    const notificationdone = {
      title: "Assignment Marked Done",
      message: `Your previously flagged assignment in ${subjectId} has been marked done by the teacher`,
      date: new Date(),
      status: true,
    };

    // Add code to send notifications here
    const db1 = getFirestore();

    const studentDocRef = doc(db1, year, term, "students", studentId);

    try {
      const studentdoc = await getDoc(studentDocRef);
      const studentDocRefsnap = studentdoc.data();
      const existingNotifications = studentDocRefsnap.notifications || [];

      let updatenotif;

      if (isChecked) {
        updatenotif = [...existingNotifications, notificationmissed];
      } else {
        updatenotif = [...existingNotifications, notificationdone];
      }

      // Update the Firestore document
      await updateDoc(studentDocRef, {
        notifications: updatenotif,
        notificationactive: "true",
      });
    } catch (error) {
      console.error("Error updating Firestore document:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Select Students Who Haven't Done Assignment
      </h1>
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-3 px-4 font-semibold text-left">
              Student Name
            </th>
            <th className="w-1/4 py-3 px-4 font-semibold text-left">Status</th>
            <th className="w-1/4 py-3 px-4 font-semibold text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {studentsData.length === 0 || studentsData.includes([null]) ? (
            <tr>
              <td colSpan="3" className="py-3 px-4 text-center">
                {studentsData.length === 0 ? "No data yet" : "Loading..."}
              </td>
            </tr>
          ) : (
            studentsData.map((student) => (
              <tr key={student.uid}>
                <td className="py-3 px-4">{ student.fullName}</td>
                <td className="py-3 px-4">
                  {student.missed ? "Not Done" : "Done"}
                </td>
                <td className="py-3 px-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5"
                      checked={student.missed}
                      onChange={(e) =>
                        handleAssignmentStatusChange(
                          student.uid,
                          e.target.checked
                        )
                      }
                    />
                    <span className="ml-2">Mark as not completed</span>
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentNotificationPage;
