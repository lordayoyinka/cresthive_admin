import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  SortAscendingIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const ResDocs = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");


  




  const [assignments, setassignments] = useState([]);
  const [newassignmentName, setNewassignmentName] = useState("");
  const [selectedassignmentFile, setSelectedassignmentFile] = useState(null);
  const [isAddassignmentPopupOpen, setIsAddassignmentPopupOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedassignment, setSelectedassignment] = useState(null);
  const [loadassignmentsfunc, setLoadassignmentsfunc] = useState(null);

  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage
  const storageRef = ref(storage, `assignments`); // Change 'assignments' to your storage path

  const router = useRouter();
  useEffect(() => {
    const { subject } = router.query;
    if (subject) {
      setSubjectName(subject);
    }
  }, [router.query]);






  const loadassignments = async () => {
    console.log("trying to load", subjectName);
    try {
      if (subjectName) {
        setloader(true)
        const q = collection(db, year, term, `subjects/${subjectName}/assignments`); // Change 'assignments' to your Firestore collection name;
        const querySnapshot = await getDocs(q);
        console.log("trying to load", querySnapshot);

        const assignmentList = [];
        querySnapshot.forEach((doc) => {
          assignmentList.push({ id: doc.id, ...doc.data() });
        });
        console.log("loaded", assignmentList)
        setassignments(assignmentList);
        setloader(false)

      }
    } catch (error) {
      setloader(false)
      console.error("Error loading assignments:", error);
      alert("Error loading assignments:", error);
    }
  };

  useEffect(() => {
    // Load existing assignments for the subject from Firestore



    loadassignments();
    setLoadassignmentsfunc(loadassignments())
  }, [db, subjectName]);


  const handleAddassignment = async () => {
    if (newassignmentName && selectedassignmentFile) {
      try {
        setloader(true)
        const assignmentRef = await addDoc(
          collection(db, year, term, `subjects/${subjectName}/assignments`),
          {
            subjectName: subjectName,
            name: newassignmentName,
            date: new Date().toDateString(),
            // Add more fields as needed
          }
        );

        const assignmentId = assignmentRef.id;

        // Upload the selected assignment file to Firebase Storage
        const fileRef = ref(storageRef, assignmentId);
        await uploadBytes(fileRef, selectedassignmentFile);

        // Get the download URL for the uploaded assignment
        const downloadURL = await getDownloadURL(fileRef);

        // Update the assignment with the download URL
        await updateDoc(assignmentRef, {
          downloadURL: downloadURL,
        });

        // Refresh the assignments list
        loadassignments();
        setloader(false)
      } catch (error) {
        console.error("Error adding assignment:", error);
      }

      // Reset input fields
      setNewassignmentName("");
      setSelectedassignmentFile(null);

      // Close the add assignment popup
      setIsAddassignmentPopupOpen(false);
      setloader(false)
    }
  };

  const handleassignmentClick = (assignmentUrl) => {
    setSelectedassignment(assignmentUrl);
    console.log(selectedassignment);

  };

  const handleassignmentmanage = () => {

  }
  return (
    <div className="overflow-y-auto flex-col flex h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <div className="flex mb-6">
        

        
      </div>
      <div></div>

      <button
        onClick={() => setIsAddassignmentPopupOpen(true)}
        className="bg-blue-500 text-white py-2 my-6 w-fit items-self-end flex px-4 rounded mx-2"
      >
        Add assignment
      </button>

      <div>
        <div className="mb-5 bg-white p-6 rounded-lg">
          <h2 className="font-semibold text-lg pb-4 opacity-50">
            All assignments for {subjectName}
          </h2>

          <ul
            role="list"
            className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-6"
          >
            {assignments.map((assignmentitem) => (

              <li
                key={assignmentitem.email}
                className="w-full justify-self-start  align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow">
                <a


                  onClick={() => handleassignmentClick(assignmentitem.downloadURL)}
                  href={selectedassignment}


                >

                  <div className="flex-1 p-2 flex flex-col p-2">
                    <div className="flex justify-between">
                      <img
                        className="w-18 h-16 flex-shrink-0"
                        src={
                          assignmentitem.type === "word"
                            ? "/Assets/google-docs.png"
                            : "/Assets/pdf-file.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <h3 className="mt-2 text-gray-900 font-medium">
                        {assignmentitem.name}
                      </h3>
                      <h3 className="text-red-900 place-content-bottom text-xs font-medium">
                        {assignmentitem.date}
                      </h3>

                      <a
                        href={`/AssignmentNotification?subject=${subjectName}&document=${assignmentitem.id}`}>
                        <div
                          className="text-sm text-center p-2 font-semibold bg-blue-500 mt-2 text-white rounded-xl -mx-2"
                        >
                          <p>Manage</p>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div></div>
                </a>
              </li>

            ))}
          </ul>
        </div>
      </div>

      {/* Button to open the Add assignment popup */}

      {/* Add assignment Popup */}
      {isAddassignmentPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">Add New assignment</p>
            <input
              type="text"
              placeholder="assignment Name"
              value={newassignmentName}
              onChange={(e) => setNewassignmentName(e.target.value)}
              className="border p-2 my-2 w-full"
            />
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={(e) => setSelectedassignmentFile(e.target.files[0])}
              className="border p-2 my-2 w-full"
            />
            <button
              onClick={handleAddassignment}
              className="bg-blue-500 text-white py-2 px-4 rounded mx-2"
            >
              Add assignment
            </button>
            <button
              onClick={() => setIsAddassignmentPopupOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {
        selectedassignment && (
          <assignmentViewer assignmentUrl={selectedassignment} />
        )}



      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default ResDocs;
