import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import Students from '@/pages/Students';
import { useRouter } from 'next/router';


const MClasses = () => {
  
  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");


    const [classes, setClasses] = useState([]);

    const router = useRouter();

  
   
    
      const dbase = getFirestore();
    
      useEffect(() => {
        // Fetch the classes from Firestore when the component mounts
        const fetchClasses = async () => {
          const classesRef = collection(dbase, year, term, 'classes');
          const classesSnapshot = await getDocs(classesRef);
          const classesData = [];
          classesSnapshot.forEach((doc) => {
            if (classesData.length < 8){
            classesData.push({ id: doc.id, ...doc.data() });
            }
          });
          setClasses(classesData);
        };
    
        fetchClasses();
      }, [dbase, classes]);
    



    return (
      <div className='flex-col bg-white my-2 p-4 rounded-lg'>
       <div className=" ">
          <h2 className="font-semibold font-32 opacity-50">Classes Overview</h2>
          <p className="text-xs opacity-60 mb-5">This is the list of all the classes in the school</p>
  
          <ul
            role="list"
            className="gap-4 grid-cols-1 grid md:grid-cols-4  lg:grid-cols-4 "
          >
            {classes.map((theclass) => (
              <li
                key={theclass.id}
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
                    {theclass.id}
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

export default MClasses