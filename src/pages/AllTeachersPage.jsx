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

const AllTeachersPage = () => {
  const [loader, setloader] = useState(false);



  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const dbase = getFirestore();

  useEffect(() => {
    // Fetch all teachers from your Firebase Firestore database
    const fetchTeachers = async () => {
      setloader(true)
      const teachersCollection = collection(dbase, "Teachers"); // Replace with your actual collection name
      const teachersSnapshot = await getDocs(teachersCollection);
      const teachersData = teachersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teachersData);
      setloader(false)
    };

    fetchTeachers();
  }, []);







  const handleDelete = async (teacherId) => {
    // Function to handle teacher deletion
    try {
      setloader(true)
      const teacherRef = doc(dbase, "Teachers", teacherId); // Replace with your actual collection name
      await deleteDoc(teacherRef);
      // Refresh the list of teachers after deletion
      const updatedTeachers = teachers.filter(
        (teacher) => teacher.id !== teacherId
      );
      setTeachers(updatedTeachers);
      setloader(false)
    } catch (error) {

      setloader(false)

      console.error("Error deleting teacher:", error);
      alert("Error deleteing teacher")
    }
  };






  const navigateToProfile = (uid) => {
    const profileUrl = `/TeacherProfilePage?teacherId=${uid}`;
    window.location.href = profileUrl;
  };

  // Function to filter teachers based on search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container w-full h-full pb-20 overflow-y-auto mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">All Teachers</h1>
      <div className="m-8 text-right">
        <a
          href="/TeacherSignUpForm"
          className="bg-blue-600 rounded-md p-2 px-4 text-white hover:underline cursor-pointer"
        >
          Add New Teacher
        </a>
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none mb-4"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="border p-4 my-4 rounded-lg shadow-md relative cursor-pointer"
            >
              <img
                src={teacher.profilePicture}
                alt={teacher.fullName}
                onClick={() => navigateToProfile(teacher.id)}
                className="w-full h-32 object-cover mb-4"
              />
              <p
                className="text-lg font-semibold"
                onClick={() => navigateToProfile(teacher.id)}
              >
                {teacher.fullName}
              </p>
              <p className="text-sm text-gray-600 mt-1">{teacher.email}</p>
              <Popover className="relative mt-2">
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
                          Are you sure you want to delete this teacher?
                        </p>
                        <button
                          onClick={() => handleDelete(teacher.id)}
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
          ))
        ) : (
          <p>No teachers found.</p>
        )}
      </div>



      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default AllTeachersPage;
