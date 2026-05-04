import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc 
} from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const ClassStudentsPage = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");






  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [classDocumentName, setClassDocumentName] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [arrayforuid, setarrayforuid] = useState([]);
  

  const dbase = getFirestore();

  // State to store the list of all students and the search query
  const [allStudents, setAllStudents] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Function to fetch all students
  const fetchAllStudents = async () => {
    setloader(true)

    try {
      const studentsCollectionRef = collection(dbase, year, term, "students");
      const studentsQuerySnapshot = await getDocs(studentsCollectionRef);

      const studentsData = [];
      studentsQuerySnapshot.forEach((doc) => {
        const student = doc.data();
        studentsData.push({
          id: doc.id,
          fullName: student.fullName || "N/A",
          email: student.email || "N/A",
        });
      });

      setloader(false)

      setAllStudents(studentsData);
    } catch (error) {

      setloader(false)
      console.error("Error fetching all students:", error);
      alert("Error fetching all students!");
    }
  };

  // Function to select a student and add them to the class
  const handleSelectStudent = async (studentId, studentEmail) => {
    // Check if arrayforuid is an array and not undefined
   
     // Add the selected teacher to the class by updating the document
     if (classDocumentName) {
      setloader(true)

      const updatedUidArray = [
        ...arrayforuid,
        {
          email: studentEmail,
          uid: studentId,
        },
      ];
  
      setarrayforuid(updatedUidArray);
  
      // Update the document with the modified array
      const path = "classes/" + classDocumentName;
      const docRef = doc(dbase, year, term, path);
      const mylist = updatedUidArray;

      console.log(mylist, "updateduid")
  
      updateDoc(docRef, { students: mylist });
      setStudents(mylist)
      setloader(false)

    }
  
    // Clear the existing teacher list when the modal opens
  
  
    // Close the modal
    setloader(false)

    setIsAddStudentModalOpen(false);
  };
  

  useEffect(() => {
    if (isAddStudentModalOpen) {
      // Fetch all students when the modal opens
      fetchAllStudents();
    }
  }, [isAddStudentModalOpen]);


  // Extract classDocumentName from the router query
  useEffect(() => {
    const { classDocumentName } = router.query;
    if (classDocumentName) {
      setClassDocumentName(classDocumentName);
    }
  }, [router.query]);

  const getUidArrayFromDocument = async () => {
    try {
      const path = "classes/" + classDocumentName;
      const docRef = doc(dbase, year, term, path);

      const docSnap = await getDoc(docRef);
      console.log("UID Array from Firestore document:", docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const uidArray = data.students || [];

        const mergedUidArray = [...arrayforuid, ...uidArray];

        setarrayforuid(mergedUidArray);

        console.log("UID Array from Firestore document:", uidArray);

        return uidArray;
      } else {
        console.log("Document does not exist.");
        return arrayforuid;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return arrayforuid;
    }
  };

  useEffect(() => {
    if (classDocumentName) {
      const fetchStudents = async () => {
        const uidArray = await getUidArrayFromDocument();

        setloader(true)

        setarrayforuid(uidArray);

        if (uidArray) {


          const studentsData = [];

          for (const element of uidArray) {
            if (element.uid) {
              const uid = element.uid;
              const profilePath = `students/${uid}`;
              const studentsRef = doc(dbase, year, term, profilePath);
              const studentsSnapshot = await getDoc(studentsRef);

              if (studentsSnapshot.exists && studentsSnapshot.data()) {
                console.log("see", studentsSnapshot);
                const studentData =  studentsSnapshot.data();
                studentsData.push({
                  id: studentsSnapshot.id,
                  fullName: studentData.fullName || "N/A",
                  email: studentData.email || "N/A",
                  age: studentData.age || "N/A",
                  class: studentData.class || "N/A",
                  profilePicture:
                    studentData.profilePicture ||
                    "https://example.com/placeholder-image.png",
                });
              }
            }
          }

          setStudents(studentsData);
        } else {
          console.log("UID Array is null or empty.");
        }

        setloader(false)
      };

      fetchStudents();
    }
  }, [dbase, classDocumentName]);

  const handleDeleteStudent = async (studentId) => {
    // Delete the selected student from Firestore
    if(studentId){
      setloader(true)

    await deleteDoc(doc(dbase, year, term, "students", studentId));

    // Update the students state

    // Update the class document to remove the student
    if (classDocumentName) {
      const path = "classes/" + classDocumentName;
      const docRef = doc(dbase, year, term, path);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const uidArray = data.students || [];

        const updatedUidArray = uidArray.filter((element) => element.uid !== studentId);

        await updateDoc(docRef, { students: updatedUidArray });
        setStudents(updatedUidArray)
      }
    }
    setloader(false)

  }
  };


  return (
    <div className="px-4 sm:px-6 lg:px-8">
    <div className="px-10 flex w-full items-end flex-col sm:px-6 lg:px-12">
        <button
          onClick={() => setIsAddStudentModalOpen(true)}
          className="bg-blue-500  text-white py-2 px-4 rounded mt-4"
        >
          Add Student
        </button>
      </div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
        </div>
      </div>
      <div className="mt-8">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 shadow-md">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Profile
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Age
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Class
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <a href={`./ReportActivity?user=${student.id}`}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <img
                        src={student.profilePicture}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    </a>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                      {student.fullName}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {student.age}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {student.class}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-blue-500">
                      <a
                        onClick={() =>
                          setIsDeleteConfirmationOpen(
                            true,
                            setStudentToDelete(student)
                          )
                        }
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && studentToDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">
              Are you sure you want to delete this student?
            </p>
            <button
              onClick={() =>
                setIsDeleteConfirmationOpen(false, setStudentToDelete(null))
              }
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteStudent(studentToDelete.id);
                setIsDeleteConfirmationOpen(false, setStudentToDelete(null));
              }}
              className="bg-red-500 text-white py-2 px-4 rounded mx-2"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}


      
      {isAddStudentModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Add Student</h2>
            <div className="my-4">
              <input
                type="text"
                placeholder="Search for a student"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allStudents
                .filter((student) =>
                  student.fullName.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((student) => (
                  <div key={student.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                    <div>
                      {student.fullName} - {student.email}
                    </div>
                    <button
                      onClick={() => handleSelectStudent(student.id, student.email)}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Select
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setIsAddStudentModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )} 



                
<div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>

    </div>
  );
};

export default ClassStudentsPage;
