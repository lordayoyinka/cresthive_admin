import React, { useState, useEffect } from "react";
import {
  getFirestore,
  arrayRemove,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const subjectStudentsPage = () => {
  const [loader, setloader] = useState(false);



  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [subjectDocumentName, setsubjectDocumentName] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentsInClass, setstudentsInClass] = useState([]);

  const [searchText, setSearchText] = useState("");



  const dbase = getFirestore();

  // Extract subjectDocumentName from the router query
  useEffect(() => {

    const { subjectName } = router.query;
    if (subjectName) {
      setsubjectDocumentName(subjectName);
      console.log(subjectDocumentName);
    }
  }, [router.query]);

  console.log(subjectDocumentName);

  const getUidArrayFromDocument = async () => {
    try {
      const path = "subjects/" + subjectDocumentName;
      const docRef = doc(dbase, year, term, path);

      const docSnap = await getDoc(docRef);
      console.log("UID Array from Firestore document:", docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const uidArray = data.Students;

        console.log("UID Array from Firestore document:", uidArray);

        return uidArray;
      } else {
        console.log("Document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  useEffect(() => {
    if (subjectDocumentName) {
      
      const fetchStudents = async () => {
        setloader(true)
        const uidArray = await getUidArrayFromDocument();
        const studentsData = [];

        if (uidArray) {
          for (const element of uidArray) {
            if (element.uid) {
              const uid = element.uid;
              const profilePath = `students/${uid}`;
              const studentsRef = doc(dbase, year, term, profilePath);
              const studentsSnapshot = await getDoc(studentsRef);

              if (studentsSnapshot.exists) {
                console.log("see", studentsSnapshot);
                const studentData = studentsSnapshot.data();

                if (studentData) {
                  console.log("students data here", studentData);
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
          }

          console.log(studentsData, "studentsData");

          if (studentsData[0]) {
            console.log(studentsData, "studentsDataset");

            const list = studentsData;

            setStudents(list);
          }
        } else {
          console.log("UID Array is null or empty.");
        }


        setloader(false)
      };

      fetchStudents();
      console.log(students, "stu");
    }
  }, [dbase, subjectDocumentName]);

  const handleDeleteStudent = async (studentId) => {
    // Reference to the class document
    // Reference to the class document
    if (subjectDocumentName) {

      setloader(true)
      // Get a reference to the class document
      const classDocRef = doc(dbase, year, term, "subjects", subjectDocumentName);

      // Fetch the current class data
      const classSnapshot = await getDoc(classDocRef);
      if (classSnapshot.exists()) {
        const classData = classSnapshot.data();

        console.log("std data", classData)

        // Remove the student's ID from the "students" array
        const updatedStudentsArray = classData.Students.filter(
          (student) => student.uid !== studentId
        );

        console.log(updatedStudentsArray, "updated")
        // Update the class document with the modified "students" array
        await updateDoc(classDocRef, { students: updatedStudentsArray });

        // Optionally, remove the student from the local state if needed
        setStudents(updatedStudentsArray);
        setloader(false)
      }
    }
  };





  const openAddStudentModal = () => {
    setIsAddStudentModalOpen(true);
  };

  const handleAddStudent = async (selectedStudent) => {
    if (selectedStudent) {
      setloader(true)
      if (subjectDocumentName) {
        // Update the "Students" array in the subject's document
        const path = "subjects/" + subjectDocumentName;
        const docRef = doc(dbase, year, term, path);
        const updatedStudentsArray = [...students, { email: selectedStudent.email, uid: selectedStudent.id }];

        console.log("selected", updatedStudentsArray)

        try {
          await updateDoc(docRef, { Students: updatedStudentsArray });
          setStudents(updatedStudentsArray)
          closeAddStudentModal();
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }

      setloader(false)
    }
  };

  const closeAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };


  const [allStudents, setAllStudents] = useState([]);

  // Fetch all students from the "students" collection
  const fetchAllStudents = async () => {
    setloader(true)
    const studentsCollectionRef = collection(dbase, year, term, "students");
    const studentsSnapshot = await getDocs(studentsCollectionRef);
    console.log(studentsSnapshot)


    const studentsData = [];
    studentsSnapshot.forEach((doc) => {
      const studentData = doc.data();
      studentsData.push({
        id: doc.id,
        fullName: studentData.fullName || "N/A",
        email: studentData.email || "N/A",
        age: studentData.age || "N/A",
        class: studentData.class || "N/A",
        profilePicture:
          studentData.profilePicture ||
          "",
      });


    });


    setloader(false)
    setAllStudents(studentsData);
  };


  useEffect(() => {
    fetchAllStudents();
  }, [dbase]);






  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <div className="justify-end flex">
            <button onClick={openAddStudentModal} className=" py-2 px-4 bg-blue-500 text-white rounded">
              Add Student
            </button>

          </div>
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
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <img
                        src={student.profilePicture}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                      {student.fullName || "N/A"}
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
                handleDeleteStudent(studentToDelete.uid);
                setIsDeleteConfirmationOpen(false, setStudentToDelete(null));
              }}
              className="bg-red-500 text-white py-2 px-4 rounded mx-2"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}



      {/* Add Student Modal */}
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
                      onClick={() => handleAddStudent(student)}
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

export default subjectStudentsPage;
