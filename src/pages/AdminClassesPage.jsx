import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

const AdminClassesPage = ({ user }) => {


  const [loader, setloader] = useState(false);

  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");


  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  const router = useRouter(); // Initialize the router

  const handleNavigate = (classDocumentName, destination) => {
    setloader(true)
    router.push({
      pathname: `/${destination}`,
      query: { classDocumentName },
    });
  };

  const dbase = getFirestore();

  useEffect(() => {
    setloader(true)

    // Fetch the classes from Firestore when the component mounts
    const fetchClasses = async () => {
      const classesRef = collection(dbase, year, term, 'classes');
      const classesSnapshot = await getDocs(classesRef);
      const classesData = [];
      classesSnapshot.forEach((doc) => {
        classesData.push({ id: doc.id, ...doc.data() });
      });
      setClasses(classesData);
    };


    fetchClasses();
    setloader(false)


  }, [dbase, classes]);

  const handleAddClass = async () => {

    // Add a new class to Firestore
    if (newClassName) {
      setloader(true)


      try {
        const newClassRef = await setDoc(doc(collection(dbase, year, term, 'classes'), newClassName), {
          class_name: newClassName,
          
        });

        console.log(newClassRef)

      // Update the classes state
      setClasses([
        ...classes,
        { id: newClassRef.id, class_name: newClassName },
      ]);
      } catch (error) {
        setloader(false)


        alert("Something went wrong, please try again! \n", error)

        
      }
      

      

      // Clear the input field
      setNewClassName('');
      setloader(false)

      // Close the Add Class modal
      setIsAddClassModalOpen(false);
    }
  };

  const handleDeleteClass = async () => {
    if (classToDelete) {
      // Delete the selected class from Firestore
      setloader(true)
      await deleteDoc(doc(dbase, year, term, 'classes', classToDelete.id));

      // Update the classes state
      setClasses(
        classes.filter((classItem) => classItem.id !== classToDelete.id)
      );

      // Close the confirmation dialog
      setloader(false)
      setIsDeleteConfirmationOpen(false);

      // Clear the classToDelete state
      setClassToDelete(null);
    }
  };

  // Navigate to the ClassStudentsPage with the classDocumentName as a query parameter
  const navigateToClassStudents = (classItem) => {
    router.push({
      pathname: '/ClassStudentsPage',
      query: { classDocumentName: classItem.id },
    });
  };


  

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Admin Classes</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Class
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col ">
        <div className="relative -my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <table className="min-w-full  divide-y divide-gray-300 shadow-md">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Class Name
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Students
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Managers
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Attendance
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Subjects
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0 text-left text-sm font-semibold text-gray-900"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {classes.map((classItem) => (
                  <tr key={classItem.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {classItem.class_name}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 text-sm text-blue-500">
                      <a onClick={() => handleNavigate(classItem.id, "ClassStudentsPage")}>Students</a>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 text-sm text-blue-500">
                      <a onClick={() => handleNavigate(classItem.id, "ClassTeachersPage")}>Managers</a>
                    </td>
                   
                    <td className="whitespace-nowrap py-4 pl-3 text-sm text-blue-500">
                      <a onClick={() => handleNavigate(classItem.id, "Students")}>Attendance</a>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 text-sm text-blue-500">
                      <a onClick={() => handleNavigate(classItem.id, "ClassSubjectsPage")}>Subjects</a>
                    </td>
                    <td className="whitespace-nowrap flex py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => {
                          setIsDeleteConfirmationOpen(true);
                          setClassToDelete(classItem);
                        }}
                        className="bg-red-500 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Class Modal */}
      {isAddClassModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">Add a New Class</p>
            <input
              type="text"
              placeholder="Class Name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="w-64 p-2 border border-gray-300 rounded mr-2"
            />
            <button
              onClick={handleAddClass}
              className="bg-blue-500 text-white m-2 py-2 px-4 rounded"
            >
              Add Class
            </button>
            <button
              onClick={() => setIsAddClassModalOpen(false)}
              className="bg-gray-500 m-2 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmationOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">
              Are you sure you want to delete this class?
            </p>
            <button
              onClick={() => setIsDeleteConfirmationOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClass}
              className="bg-red-500 text-white py-2 px-4 rounded mx-2"
            >
              Confirm Delete
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


export default AdminClassesPage;
