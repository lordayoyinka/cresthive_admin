import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { auth2 } from '@/firebase/config';
import { getFirestore } from 'firebase/firestore';
import Loading from '@/components/Loading';

const db = getFirestore();

const AdminMessages = () => {
  const [loader, setloader] = useState(false);



  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [adminUser, setadminuser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const year = localStorage.getItem('year');
  const term = localStorage.getItem('term');

  useEffect(() => {
    if (auth2) {
      setadminuser(auth2.currentUser);
    }
  }, [auth2]);
  

  const fetchConversations = async () => {
    setloader(true)

    if (adminUser) {
      try {
        const studentsCollection = collection(db, year, term, 'students');
        const studentsQuery = await getDocs(studentsCollection);

        const studentData = studentsQuery.docs.map((doc) => {
          const userData = doc.data();
          return {
            uid: doc.id,
            name: userData.fullName,
            profilePicture: userData.profilePicture,
          };
        });

        const conversationsArray = [];

        // Fetch last message for each student
        for (const student of studentData) {
          const messagesCollection = collection(db, 'messages');
          const messagesQuery = query(
            messagesCollection,
            where('conversationId', '==', student.uid),
            orderBy('timestamp', 'desc')
          );

          const messagesSnapshot = await getDocs(messagesQuery);

          const lastMessage =
            messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data().text : 'No messages';
          const time = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data().timestamp : null;

          conversationsArray.push({
            uid: student.uid,
            name: student.name,
            profilePicture: student.profilePicture,
            time: time,
            lastMessage,

          });
        }

        // Filter conversations based on the search query
        const filteredConversations = conversationsArray.filter((conversation) =>
          conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
        );





        const objectsWithTimestamp = filteredConversations.filter(obj => obj.time);

        // Sort the array based on the timestamp field
        objectsWithTimestamp.sort((a, b) => b.time.seconds - a.time.seconds);

        // Combine the sorted objects with those without a timestamp
        const sortedArray = [...objectsWithTimestamp, ...filteredConversations.filter(obj => !obj.time)];

        console.log("sorted",sortedArray);



        setConversations(sortedArray);

       
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    } else {
      console.log('something went wrong');
    }

    setloader(false)

  };

  useEffect(() => {
    fetchConversations();
  }, [adminUser, searchQuery]);

  return (
    <div className="mx-auto h-full pb-40 md:pb-20 mt-8 md:p-4 p-10 bg-white rounded shadow overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Admin Messages</h1>
      <div className="mb-4 md:flex items-center mb-20 ">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded md:w-96 md:mx-6 my-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />


        <a className='md:ml-auto' href='/TeachersLists'>
        <div className='px-6 py-3 bg-green-800 text-white w-fit h-fit rounded-2xl ml-auto md:mr-10 '>
          Message Teacher
        </div>
          </a>
          
      </div>
      <ul>
        {conversations.map((conversation) => (
          <a key={conversation.uid} href={`Messages?conversationId=${conversation.uid}`}>
            <li className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md mb-4">
              <img
                src={conversation.profilePicture}
                alt={`${conversation.name}'s profile`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{conversation.name}</h2>
                <p className="text-slate-700 truncate max-w-[50vw] lg:max-w-lg">
                  {conversation.lastMessage}
                </p>
              </div>
            </li>
          </a>
        ))}
      </ul>



      
      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>



    </div>
  );
};

export default AdminMessages;
