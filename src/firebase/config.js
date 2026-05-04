import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyBYcl_xWRjmqvexrohOMkNPpgnVDvmyZQc",
    authDomain: "cresthive-88396.firebaseapp.com",
    projectId: "cresthive-88396",
    storageBucket: "cresthive-88396.appspot.com",
    messagingSenderId: "1094759056974",
    appId: "1:1094759056974:web:5296327482ffe0b459651f",
    measurementId: "G-FXDQ0S20EW",
  };

  
const firebaseApp = initializeApp(firebaseConfig);
const auth2 = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export { auth2, firestore, storage };
