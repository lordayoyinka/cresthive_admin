import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  collection,
  getDoc,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { auth2 } from "@/firebase/config";

const db = getFirestore();


const Messages = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
const [user, setuser] = useState(null);

useEffect(()=> setuser(auth2.currentUser),[auth2])

const conversationId = router.query.conversationId ;

  useEffect(() => {
    const fetchMessages = async () => {
      if (user) {

        const messagesCollection = collection(db, "messages");

       
        const q = query(
          messagesCollection,
          where("conversationId", "in", [conversationId, user.uid]),
          orderBy("timestamp", "asc")
        );
        

        const querySnapshot = await getDocs(q);
        console.log("q", querySnapshot)


        const messagesData = querySnapshot.docs.map((doc) => doc.data());
        console.log("mg", messagesData)
        setMessages(messagesData);
      }
    };

    fetchMessages();
  }, [user,,messages]);

  const handleSendMessage = async () => {
    if (user) {
      const conversationId = router.query.conversationId ;
      const messagesCollection = collection(db, "messages");

      await addDoc(messagesCollection, {
        conversationId,
        text: newMessage,
        timestamp: serverTimestamp(),
        sender: user.uid,
        to: conversationId,
      });


      console.log("sent")

      setNewMessage("");
    }
  };

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Access the DOM element using the ref
    const scrollContainer = scrollContainerRef.current;

    // Scroll to the end
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []); // Empty dependency array to run the effect only once on component mount



  return (
    <div className="flex bg-blue-50 relative flex-col h-screen overflow-y-auto">
      <div ref={scrollContainerRef} className="overflow-y-auto h-[70vh] pb-20 rounded-t-xl bg-indigo-50 m-4 p-4 flex flex-col gap-4">
       

        {/* Conversation Messages */}
        <div className="mx-2 min-h-[40vh]  pb-[60vh] relative">
          {messages.map((message, index) => (
 (message.sender === user.uid || message.sender === conversationId ) && (message.to === user.uid || message.to === conversationId)  ? (

            <div
              key={index}
              className={`flex items-start py-4 gap-4 ${
                message.sender !== user.uid ? "justify-start" : "justify-end"
              }`}
            >
              <div className="flex flex-col gap-4">
                <p
                  className={`rounded-xl p-4 max-w-sm ${
                    message.sender === user.uid
                      ? "bg-white "
                      : "bg-[#4F7753] text-white"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            </div>) : ""
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="w-full p-4 flex justify-between rounded-xl absolute bottom-0 left-0 mb-20 p-4">
        <textarea
          placeholder="Type a message"
          className="grow outline-none h-40 mx-6  rounded-xl rounded-2xl text-[#72777A] py-4 px-8"
          rows="2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button
          onClick={handleSendMessage}
          className="rounded-2xl w-fit h-fit p-4 bg-[#39623D] text-white px-8"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
