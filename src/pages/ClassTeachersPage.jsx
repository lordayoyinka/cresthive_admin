import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  arrayRemove,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { merge } from "lodash";
import Loading from "@/components/Loading";

const ClassTeachersPage = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [classDocumentName, setClassDocumentName] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState([]);

  const dbase = getFirestore();



  // Extract classDocumentName from the router query
  useEffect(() => {
    const { classDocumentName } = router.query;
    if (classDocumentName) {

      setClassDocumentName(classDocumentName);
    }
  }, [router.query]);

  const [arrayforuid, setarrayforuid] = useState([]);

  const getUidArrayFromDocument = async () => {
    try {
      const path = "classes/" + classDocumentName;
      const docRef = doc(dbase, year, term, path);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const uidArray = data.teachers || []; // Initialize with an empty array if not found

        setTeachers(uidArray);
        const mergedUidArray = [...arrayforuid, ...uidArray];

        setarrayforuid(mergedUidArray);
        console.log((mergedUidArray))

        return mergedUidArray;

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

      setloader(true)

      // Fetch teacher UIDs associated with the class
      const fetchUidArray = async () => {
        const uidArray = await getUidArrayFromDocument();
        setarrayforuid(uidArray);
        setloader(false)

      };

      fetchUidArray();
    }
  }, [classDocumentName]);

  const handleDeleteTeacher = async (teacherId) => {

    // Reference to the class document
    if (classDocumentName) {
      setloader(true)
      // Get a reference to the class document
      const classDocRef = doc(dbase, year, term, "classes", classDocumentName);
  
      // Fetch the current class data
      const classSnapshot = await getDoc(classDocRef);
      if (classSnapshot.exists()) {
        const classData = classSnapshot.data();
  
        // Remove the teacher's ID from the "teachers" array
        const updatedTeachersArray = classData.teachers.filter(
          (teacher) => teacher.uid !== teacherId
        );
  
        console.log(updatedTeachersArray, "updated")
        // Update the class document with the modified "teachers" array
        await updateDoc(classDocRef, { teachers: updatedTeachersArray });
  
        // Optionally, remove the teacher from the local state if needed
        setloader(false)

        setTeachers(updatedTeachersArray);
      }
    }
  };

  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  // State to store the list of all teachers and the search query
  const [allTeachers, setAllTeachers] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Function to fetch all teachers
  const fetchAllTeachers = async () => {
    try {
      setloader(true)

      const teachersCollectionRef = collection(dbase, "Teachers");
      const teachersQuerySnapshot = await getDocs(teachersCollectionRef);

      const teachersData = [];
      console.log("docs", teachersQuerySnapshot);
      teachersQuerySnapshot.forEach((doc) => {
        const teacher = doc.data();
        teachersData.push({
          id: doc.id,
          fullName: teacher.fullName || "N/A",
          email: teacher.email || "N/A",
          // Add other teacher data fields as needed
        });
      });
      setloader(false)

      setAllTeachers(teachersData);
    } catch (error) {
      setloader(false)

      console.error("Error fetching all teachers:", error);
      alert("Error fetching all teachers!");
    }
  };

  // Function to select a teacher and add them to the class
  const handleSelectTeacher = (teacherId, teacherEmail) => {
    // Add the selected teacher to the class by updating the document
    if (classDocumentName) {
      setloader(true)

      const updatedUidArray = [
        ...arrayforuid,
        {
          email: teacherEmail,
          uid: teacherId,
        },
      ];
  
      setarrayforuid(updatedUidArray);
  
      // Update the document with the modified array
      const path = "classes/" + classDocumentName;
      const docRef = doc(dbase, year, term, path);
  
      updateDoc(docRef, { teachers: updatedUidArray });
      setTeachers(updatedUidArray)
    }
  
    // Clear the existing teacher list when the modal opens
    setloader(false)
    setIsAddTeacherModalOpen(false);
  };
  
  useEffect(() => {
    if (isAddTeacherModalOpen) {
      // Fetch all teachers when the modal opens
      fetchAllTeachers();
    }
  }, [isAddTeacherModalOpen]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="px-10 flex w-full items-end flex-col sm:px-6 lg:px-12">
        <button
          onClick={() => setIsAddTeacherModalOpen(true)}
          className="bg-blue-500  text-white py-2 px-4 rounded mt-4"
        >
          Add Teacher
        </button>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="md:mx-10 sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Teachers</h1>
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
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <img
                        src={teacher.profilePicture}
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                      {teacher.fullName}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {teacher.email}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {teacher.age}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {teacher.class}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-blue-500">
                      <a
                        onClick={() =>
                          setIsDeleteConfirmationOpen(
                            true,
                            setTeacherToDelete(teacher)
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
      {isDeleteConfirmationOpen && teacherToDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">
              Are you sure you want to delete this teacher?
            </p>
            <button
              onClick={() =>
                setIsDeleteConfirmationOpen(false, setTeacherToDelete(null))
              }
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteTeacher(teacherToDelete.uid);
                setIsDeleteConfirmationOpen(false, setTeacherToDelete(null));
              }}
              className="bg-red-500 text-white py-2 px-4 rounded mx-2"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {isAddTeacherModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900">
              Add Teacher
            </h2>
            <div className="my-4">
              <input
                type="text"
                placeholder="Search for a teacher"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allTeachers
                .filter((teacher) =>
                  teacher.fullName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                )
                .map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between border-b border-gray-300 py-2"
                  >
                    <div>
                      {teacher.fullName} - {teacher.email}
                    </div>
                    <button
                      onClick={() =>
                        handleSelectTeacher(teacher.id, teacher.email)
                      }
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Select
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setIsAddTeacherModalOpen(false)}
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

export default ClassTeachersPage;
