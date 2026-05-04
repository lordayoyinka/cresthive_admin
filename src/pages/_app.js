import '@/styles/globals.css'; // Remove the "@" symbol
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth2} from './../firebase/config'; // Import the auth object
import Sidebar from '@/components/Sidebar';
import OnboardHolder from './OnboardHolder';
import SignIn from "./SignIn"
import { useRouter } from 'next/router';





export default function App({ Component, pageProps, pageProps2 }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 


  useEffect(() => {
    // Check the user's authentication status
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser && authUser.uid !== 'default') {
        setUser(authUser); // User is signed in and not the default user
        setLoading(false)
      } else {
        setUser(null); // User is signed out or is the default user
        setLoading(false)

      }
    });

    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  if(loading){
    return(
      <div className='flex h-screen justify-center items-center text-slate-700 bg-white'>
      loading...
      </div>
    )
  }

  return (
    <div className="flex w-full overscroll-y-auto">
      {user && user.uid !== 'default' ? (
        <Sidebar>
          <Component {...pageProps} user={user} />
        </Sidebar>
      ) : (
       <SignIn />
      )}
    </div>
  );
}
