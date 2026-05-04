import React, {useState, useEffect} from 'react'
import { auth2 } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

  




const MNotifiations = () => {
  
  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const db = getFirestore();
  const [user, setUser] = useState(null);

  const [profilepic, setprofilepic] = useState("");
  const [userdata, setuserdata] = useState([]);

  useEffect(() => {
    // Use Firebase's onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser) {
        // User is authenticated, set the user state
        setUser(authUser);
        setprofiledp(authUser.uid);
      } else {
        // User is not authenticated, set the user state to null
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const setprofiledp = async (uid) => {
    const db = getFirestore();

    const docref = doc(db, year, term, "students", "Q2tbPx1lByWoBN057xP0cVocFng1");
    const snapshot = await getDoc(docref);

    const data = snapshot.data();
    if(data){
    console.log(data.notifications, "notifictions");
  
    const nots = [];

    if(data.notifications.length > 3){
      const coll = data.notifications.sort((a, b) => a.date.seconds - b.date.seconds).reverse();


    for(let i = 0; i < 3; i++){

      nots.push(coll[i])

    }

  }else{

    const coll = data.notifications.sort((a, b) => a.date.seconds - b.date.seconds).reverse();

    for(let i = 0; i < coll.length; i++){
      console.log("nots", coll[i])
    nots.push(coll[i])
    }

  }

    setuserdata(nots
    );
  }

}





  return (
    <div className=' bg-white rounded-lg w-full p-4 mt-2'>

    <h2 className='text-lg font-semibold text-slate-500'>
        Notifications
    </h2>

    <div className='w-full p-2'>
        <div className=" flow-root ">
          <ul role="list" className="flex-col divide-y divide-gray-200">
          {userdata ? (
          <>
            {userdata.map((documentitem) => (
              <div
                className={
                  documentitem.status === false
                    ? "flex bg-red-100 h-fit m-4 mx-2 p-4 pl-2 rounded-xl drop-shadow-lg"
                    : "flex bg-green-100 h-fit m-4 mx-2 p-4 pl-2 rounded-xl drop-shadow-xl"
                }
              >
               

                <div className="grow md:mr-6">

                <div className='flex'>


                <div className="bg-white rounded-full m-2 my-auto ml-0 p-1 h-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-yellow-800"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                  <div className="p-2 text-sm flex font-bold text-slate-700">
                    <p className="grow">
                      {documentitem.title || "something went wrong"}
                    </p>
                  </div>

                  </div>

                  <div>
                    <p className="pl-2 text-xs text-slate-800 ">
                      {documentitem.message || "something went wrong"}
                    </p>
                  </div>
                </div>

                <div className="my-auto">
                  <div className="my-auto h-fit">
                    {documentitem.status === false ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-red-800"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-green-800"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>

            <div className="text-2xl p-4 text-center">
                <p>
                    No Notifications Yet
                </p>
            </div>
          </>
        )}
          </ul>
        </div>
        <div className="mt-6">
          <a
            href="./Notifications"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  )
}

export default MNotifiations