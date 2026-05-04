import React, { useEffect, useState } from 'react';
import SignIn from '@/pages/SignIn'
import { onAuthStateChanged } from 'firebase/auth';
import Maindash from './Maindash';
import { auth2 } from '@/firebase/config';


export default function Home() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Use Firebase's onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser) {
        // User is authenticated, set the user state
        setUser(authUser);
      } else {
        // User is not authenticated, set the user state to null
        setUser(null);
      }
    });

    console.log(user, "user")


    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(user, "user")

  
  }, [user])
  

  
  return (
    <main className='bg-white'>
      <Maindash />
    </main> 
  );
}
