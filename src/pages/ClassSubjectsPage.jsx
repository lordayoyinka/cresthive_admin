import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const extractTextBeforeFirstPeriod = (inputString) => {
  const parts = inputString.split(".");
  return parts[parts.length - 1];
};

const ClassSubjectsPage = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");


  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [className, setClassDocumentName] = useState(null);

 
  const dbase = getFirestore();

  useEffect(() => {
    const { classDocumentName } = router.query;
    if (classDocumentName) {
      setClassDocumentName(classDocumentName);
    }
  }, [router.query]);

  useEffect(() => {
    // Move fetchSubjects into this useEffect
    const fetchSubjects = async () => {
      if (className) { // Check if className is set
        setloader(true)
        const subjectsRef = collection(dbase, year, term, "subjects");
        console.log("set:", className);

        const querySnapshot = await getDocs(subjectsRef);
        const subjectsData = [];

        console.log("Found snap:", querySnapshot);
        console.log("classname:", className);

        querySnapshot.forEach((doc) => {
          const subjectName = doc.id;

          const classForSubject = extractTextBeforeFirstPeriod(subjectName);

          if (subjectName.startsWith(className)) {
            console.log("Found subject:", subjectName);
            subjectsData.push(subjectName);
          }
        });

        setSubjects(subjectsData);
        setloader(false)

      }
    };

    fetchSubjects();
  }, [dbase, className]); // Use 'className' as a dependency


  
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const handleDeleteSubject = async () => {
    // Execute the delete operation here
    if (subjectToDelete) {

      try {
        setloader(true)

        const subjectDocRef = doc(dbase, year, term, "subjects", subjectToDelete);
        await deleteDoc(subjectDocRef);
        // Remove the subject from the subjects array in your state
        setSubjects((subjects) => subjects.filter((subject) => subject !== subjectToDelete));
        setloader(true)

      } catch (error) {
        setloader(true)

        console.error("Error deleting subject:", error);
        alert("Error deleting subject!");
      }
      // Close the delete confirmation modal
      setIsDeleteConfirmationOpen(false);
    }
  };

   // State for the "Add Subject" popup
   const [isAddSubjectPopupOpen, setIsAddSubjectPopupOpen] = useState(false);
   const [newSubjectName, setNewSubjectName] = useState("");
 


  const handleAddSubject = async () => {
    if (newSubjectName) {
      // Modify the newSubjectName to include the class name
      const formattedSubjectName = `${className}.subjects.${newSubjectName}`;
  
      // Execute the add operation here
      try {
        setloader(true)


        const newSubjectDocRef = doc(dbase, year, term, "subjects", formattedSubjectName);
  
        await setDoc(newSubjectDocRef, {
          class: className
        });
  
        // Add the new subject to the subjects array in your state
        setSubjects((subjects) => [...subjects, formattedSubjectName]);
   
        // Close the "Add Subject" popup
        setloader(false)

        setIsAddSubjectPopupOpen(false);
      } catch (error) {
        setloader(false)
        console.error("Error adding subject:", error);
        alert("Error adding subject!");
      }
    }
  };
  
  
  

  return (
    <div className="p-4">

    {/* Button to open the "Add Subject" popup */}
    <button
        onClick={() => setIsAddSubjectPopupOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded my-2"
      >
        Add Subject
      </button>

      {/* "Add Subject" Popup */}
      {isAddSubjectPopupOpen && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-4 rounded shadow-lg w-1/3">
      <p className="text-xl mb-2">Add New Subject</p>
      <input
        type="text"
        placeholder="Subject Name"
        value={newSubjectName}
        onChange={(e) => setNewSubjectName(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <div className="flex justify-end">
        <button
          onClick={handleAddSubject}
          className="bg-blue-500 text-white py-2 px-4 rounded mx-2"
        >
          Add Subject
        </button>
        <button
          onClick={() => setIsAddSubjectPopupOpen(false)}
          className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



      {/* Delete Confirmation Popup */}
      {isDeleteConfirmationOpen && subjectToDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">
              Are you sure you want to delete this subject?
            </p>
            <button
              onClick={() => setIsDeleteConfirmationOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSubject}
              className="bg-red-500 text-white py-2 px-4 rounded mx-2"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-4">Subjects for Class {className}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md border rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-3 bg-gray-200 text-left">Subject Name</th>
              <th className="py-2 px-3 bg-gray-200 text-left">Students</th>
              <th className="py-2 px-3 bg-gray-200 text-left">Teachers</th>
              <th className="py-2 px-3 bg-gray-200 text-left">Documents</th>
              <th className="py-2 px-3 bg-gray-200 text-left">Assignments</th>
              <th className="py-2 px-3 bg-gray-200 text-left">Reports</th>
            </tr>
          </thead>
        <tbody>
          {subjects.map((subjectName) => (
            <tr key={subjectName}>
              <td className="py-2 px-3">{extractTextBeforeFirstPeriod(subjectName)}</td>
              <td className="py-2 px-3">
                <a
                  onClick={() =>
                    router.push(`/SubjectsStudentsPage?subjectName=${subjectName}`)
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  Students
                </a>
              </td>
              <td className="py-2 px-3">
                <a
                  onClick={() =>
                    router.push(`/SubjectsTeachersPage?subjectName=${subjectName}`)
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  Teachers
                </a>
              </td>
              <td className="py-2 px-3">
                <a
                  onClick={() =>
                    router.push(`/ResDocs?class=${className}&subject=${subjectName}`)
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  Documents
                </a>
              </td>
              <td className="py-2 px-3">
                <a
                  onClick={() =>
                    router.push(`/ResAssignments?class=${className}&subject=${subjectName}`)
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  Assignments
                </a>
              </td>
              <td className="py-2 px-3">
                <a
                  onClick={() =>
                    router.push(`/SubjectReportsPage?class=${className}&subject=${subjectName}`)
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  Reports
                </a>
              </td>
              <td className="py-2 px-3">
                <button
                  onClick={() => {
                    setSubjectToDelete(subjectName);
                    setIsDeleteConfirmationOpen(true);
                  }}
                  className="text-red-500 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

              
<div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>


    </div>
  );
};


export default ClassSubjectsPage;
