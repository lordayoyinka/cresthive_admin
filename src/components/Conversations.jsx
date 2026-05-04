import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, orderBy, getDocs, where, and, or } from 'firebase/firestore';
import { auth2 } from '@/firebase/config';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();

const AdminMessages = () => {
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
    if (adminUser) {
      try {
        const studentsCollection = collection(db, 'Teachers');
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

          console.log("part mssg", messagesSnapshot)

          const lastMessage =
            messagesSnapshot.docs.length > 0  ? messagesSnapshot.docs[0].data().text : 'No messages';
          const time = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data().timestamp : null;
          const to = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data().to : null;
          const sender = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data().sender : null;

          conversationsArray.push({
            uid: student.uid,
            name: student.name,
            profilePicture: student.profilePicture,
            time: time,
            to: to,
            sender: sender,
            lastMessage,

          });
        }


        const myArray = conversationsArray.filter((conversation) =>
        conversation.to == auth2.currentUser.uid || conversation.sender == auth2.currentUser.uid
      );

        // Filter conversations based on the search query
        const filteredConversations = myArray.filter((conversation) =>
          conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
        );





        const objectsWithTimestamp = filteredConversations.filter(obj => obj.time);

        // Sort the array based on the timestamp field
        objectsWithTimestamp.sort((a, b) => b.time.seconds - a.time.seconds);

        // Combine the sorted objects with those without a timestamp
        const sortedArray = [...objectsWithTimestamp, ...filteredConversations.filter(obj => !obj.time)];

        console.log("sorted",conversationsArray);



        setConversations(objectsWithTimestamp);

       
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    } else {
      console.log('something went wrong');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [adminUser, searchQuery]);

  return (
    <div className="mx-auto h-full pb-20 mb-4 md:pb-20 p-4 bg-white rounded shadow overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Teachers Messages</h1>
      <div className="mb-4 md:flex items-center mb-20 ">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded md:w-96 mx-6 my-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />


          
      </div>
      <ul>
        {conversations.map((conversation) => (
          <a key={conversation.uid} href={`TeachersMessages?conversationId=${conversation.uid}`}>
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
    </div>
  );
};

export default AdminMessages;
