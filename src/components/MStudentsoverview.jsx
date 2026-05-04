import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";



const Studentsoverview = () => {
  
  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");


  const [students, setStudents] = useState("");
  const [teachers, setTeachers] = useState("");


  const dbase = getFirestore();


  useEffect(() => {
    // Fetch all students from your Firebase Firestore database
    const fetchStudents = async () => {
      const studentsCollection = collection(dbase, year, term, "students"); // Replace with your actual collection name
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData.length);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Fetch all students from your Firebase Firestore database
    const fetchTeachers = async () => {
      const studentsCollection = collection(dbase, "Teachers"); // Replace with your actual collection name
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(studentsData.length);
    };

    fetchTeachers();
  }, []);



  return (
    <div>
      <div className=" bg-white p-4 w-full rounded-lg mb-2">
        <h2 className="font-semibold font-32 opacity-50">General Overview</h2>
        <p className="text-xs opacity-60 mb-5">This will show details of overall students performance</p>

        <ul
          role="list"
          className="md:flex lg:flex gap-6 grid-cols-1 md:grid-cols-2 "
        >

            <li
              className="w-full justify-self-center p-2 mb-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
            >
              <div className="flex-1 flex flex-col p-2 pb-4">
                <img
                  className="w-12 h-12 flex-shrink-0 "
                  src="/Assets/Manalytics.png"
                  alt=""
                />
                <h3 className="mt-6 text-gray-900 text-xl font-medium">
                  {students || ""}
                </h3>
                <dl className="mt-1 flex-grow flex flex-col justify-between">
                  <dt className="sr-only">Title</dt>
                  <dd className="text-gray-500 text-sm">Total Number Of Students In School</dd>
                  <dt className="sr-only">Role</dt>
                  <dd className="mt-3">
                    <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full ">
                    Students
                    </span>
                  </dd>
                </dl>
              </div>
              <div></div>
            </li>

            <li
              className="w-full justify-self-center p-2 mb-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
            >
              <div className="flex-1 flex flex-col p-2 pb-4">
                <img
                  className="w-12 h-12 flex-shrink-0 "
                  src="/Assets/Manalytics.png"
                  alt=""
                />
                <h3 className="mt-6 text-gray-900 text-xl font-medium">
                  {teachers || ""}
                </h3>
                <dl className="mt-1 flex-grow flex flex-col justify-between">
                  <dt className="sr-only">Title</dt>
                  <dd className="text-gray-500 text-sm">Total Number Of Teachers In School</dd>
                  <dt className="sr-only">Role</dt>
                  <dd className="mt-3">
                    <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                    Teachers
                    </span>
                  </dd>
                </dl>
              </div>
              <div></div>
            </li>

        </ul>
      </div>
    </div>
  );
};

export default Studentsoverview;
