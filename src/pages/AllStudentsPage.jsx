import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Loading from "@/components/Loading";

const AllStudentsPage = () => {
  const [loader, setloader] = useState(false)

  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const dbase = getFirestore();

  useEffect(() => {
    // Fetch all students from your Firebase Firestore database
    const fetchStudents = async () => {
      setloader(true)
      const studentsCollection = collection(dbase, year, term, "students"); // Replace with your actual collection name
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
      setloader(false)
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    // Function to handle student deletion
    try {
      setloader(true)
      const studentRef = doc(dbase, year, term, "students", studentId); // Replace with your actual collection name

      await deleteDoc(studentRef);
      // Refresh the list of students after deletion
      const updatedStudents = students.filter(
        (student) => student.id !== studentId
      );
      setStudents(updatedStudents);
      setloader(false)

    } catch (error) {
      setloader(false)
      console.error("Error deleting student:", error);
      alert("Error deleting student!");
    }
  };

  const navigateToProfile = (uid) => {
    const profileUrl = `/StudentProfilePage?studentId=${uid}`;
    window.location.href = profileUrl;
  };






  // Function to filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container w-full h-full pb-20 overflow-y-auto mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">All Students</h1>


      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none mb-4"
      />

      <div>
        <a href="/RegistrationPage">
        <p className="px-4 w-fit text-white py-2 bg-green-700 rounded-2xl">Add Student</p>
        </a>

      </div>








      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="border p-4 my-4 rounded-lg shadow-md relative cursor-pointer"
            >
              <img
                src={student.profilePicture}
                alt={student.fullName}
                className="w-full h-32 object-cover mb-4"
                onClick={() => navigateToProfile(student.id)}

              />
              <p
                className="text-lg font-semibold"
                onClick={() => navigateToProfile(student.id)}
              >
                {student.fullName}
              </p>
              <p className="text-sm text-gray-600 mt-1">{student.email}</p>

              <div className="flex jsutify-between items-center">

                <p className="px-4 text-sm font-thin my-4 py-2 bg-blue-600 rounded-2xl text-white ">
                  {student.selectedClass}
                </p>



                <Popover className="ml-auto mr-64relative mt-2">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={`${open ? "text-red-500" : "text-red-600"
                          } hover:underline cursor-pointer text-sm`}
                      >
                        Delete
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Popover.Panel className="absolute z-10 right-0 w-40 p-2 mt-2 space-y-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <p className="text-sm">
                            Are you sure you want to delete this student?
                          </p>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-red-600 hover:underline cursor-pointer text-sm"
                          >
                            Confirm
                          </button>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>


            </div>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>



      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>


    </div>
  );
};

export default AllStudentsPage;
