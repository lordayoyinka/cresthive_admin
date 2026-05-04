import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';


const extractTextBeforeFirstPeriod = (inputString) => {
    const parts = inputString.split(".");
    if(parts.length > 1){
        return parts[parts [0] , parts.length - 1];
    }else{
        return parts[parts.length -1]
    }
    
  };



const Msubjects = () => {
  
  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");



    const [subjects, setSubjects] = useState([]);

  
    
      const dbase = getFirestore();
    
      useEffect(() => {
        // Fetch the subjects from Firestore when the component mounts
        const fetchSubjects = async () => {
          const subjectsRef = collection(dbase,year, term, 'subjects');
          const subjectsSnapshot = await getDocs(subjectsRef);
          const subjectsData = [];
          subjectsSnapshot.forEach((doc) => {
            if(subjectsData.length < 8){
            subjectsData.push({ id: doc.id, ...doc.data() });
            }
          });
          setSubjects(subjectsData);
        };
    
        fetchSubjects();
      }, [dbase, subjects]);
    



    return (
      <div className='flex-col bg-white my-2 p-4 rounded-lg'>
       <div className=" ">
          <h2 className="font-semibold font-32 opacity-50">Subjects Overview</h2>
          <p className="text-xs opacity-60 mb-5">This is the list of all the subjects in the school</p>
  
          <ul
            className="gap-4 grid grid-cols-1  md:grid-cols-4  lg:grid-cols-4"
          >
            {subjects.map((thesubject) => (
              <li
                key={thesubject.id}
                className="w-full mb-2 justify-self-center p-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
              >
                <div className="flex-1 flex flex-col p-2 ">
  
                <div className='flex justify-between'>
                <img
                    className="w-12 h-12 flex-shrink-0 "
                    src={"/Assets/folders.png"}
                    alt=""
                  />
  
                
                </div>
                
                  <h3 className="mt-6 text-gray-900 text-xs font-medium">
                    {extractTextBeforeFirstPeriod(thesubject.id || "")}
                  </h3>
                
                </div>
                <div></div>
              </li>
            ))}
          </ul>
       
        </div>
        <div className="mt-6">
          <a
            href="./AdminClassesPage"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View all
          </a>
        </div>
      </div>
    )
  }

export default Msubjects;