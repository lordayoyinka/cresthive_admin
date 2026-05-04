// pages/TeachersListPage.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import Conversations from './../components/Conversations'
import Loading from '@/components/Loading';


const TeachersListPage = () => {
  const [loader, setloader] = useState(false);

  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const dbase = getFirestore();

  useEffect(() => {
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



  return (
    <div className="overflow-y-auto bg-gray-100 py-12 px-4 h-full sm:px-6 lg:px-8">


      <div>
        <Conversations />

      </div>




      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900">Teachers List</h1>
        <div className="mt-6 overflow-y-auto overscroll-y-auto grid grid-cols-1 gap-4 h-auto">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{teacher.fullName}</h2>
                <h2 className="text-sm text-gray-400">{teacher.email}</h2>

              </div>
              <div className="px-4 py-3">
                <a href={`/TeachersMessages?conversationId=${teacher.id}`}>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Chat
                  </button>


                </a>

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default TeachersListPage;
