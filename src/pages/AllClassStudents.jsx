import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const AllClassStudents = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [classDocumentName, setClassDocumentName] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const dbase = getFirestore();

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
        const uidArray = data.students;

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
    if (classDocumentName) {
      const fetchStudents = async () => {
        const uidArray = await getUidArrayFromDocument();

        if (uidArray) {
          const studentsData = [];

          for (const element of uidArray) {
            if (element.uid) {
              const uid = element.uid;
              const profilePath = `students/${uid}`;
              const studentsRef = doc(dbase, year, term, profilePath);
              const studentsSnapshot = await getDoc(studentsRef);

              if (studentsSnapshot.data()) {
                console.log("see", studentsSnapshot);
                const studentData = studentsSnapshot.data();

                if (studentData) {
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

          setStudents(studentsData);
        } else {
          console.log("UID Array is null or empty.");
        }
      };

      fetchStudents();
    }
  }, [dbase, classDocumentName]);

  const handleDeleteStudent = async (studentId) => {
    // Delete the selected student from Firestore
    await deleteDoc(doc(dbase, year, term, "students", studentId)).then(
      (deleteUidArrayFromDocument = async () => {
        try {
          const path = "classes/" + classDocumentName;
          const docRef = doc(dbase, year, term, path);

          const docSnap = await getDoc(docRef);
          console.log("UID Array from Firestore document:", docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const uidArray = data.students;

            // Modify the array to remove the UID
            const updatedUidArray = uidArray.filter(
              (element) => element.uid !== uidToDelete
            );

            // Update the document with the modified array
            await updateDoc(docRef, { uidArray: updatedUidArray });

            console.log(`UID ${uidToDelete} removed from the array.`);

            return uidArray;
          } else {
            console.log("Document does not exist.");
            return null;
          }
        } catch (error) {
          console.error("Error getting document:", error);
          return null;
        }
      })
    );

    // Update the students state
    setStudents(students.filter((student) => student.id !== studentId));
  };
  return (
    <div className='bg-indigo-50 h-full p-6 m-6 rounded-lg'>

    <div className="px-4 sm:px-6 lg:px-8">
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
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <img
                        src={student.profilePicture}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
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
    </div>



    
<div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>

  

    </div>
  )
}

export default AllClassStudents;