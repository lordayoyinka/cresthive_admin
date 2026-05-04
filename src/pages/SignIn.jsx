import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth2 } from "../firebase/config";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/router";
import { getDocs, doc, getDoc, getFirestore } from "firebase/firestore";

import { jwtVerify } from "jose";
import Loading from "@/components/Loading";





const SignIn = () => {
  const [loader, setloader] = useState(false);

  const router = useRouter();
  const { token } = router.query;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    term: "",
    year: "",
  });

  const [canload, setcanload] = useState(true);


  useEffect(() => {
    const signintoken = async () => {

      if (token) {
        setloader(true)
        const secretKey =
          "b5682868ab17c3780ac25d1213479dffae913e2e9a7ea77d131010aee7fd4e3a";
        const secretKeycode = new TextEncoder().encode(
          secretKey
        );

        try {
          // Verify and decode the JWT
          console.log("tok", token);

          const decodedToken = await jwtVerify(token, secretKeycode);

          if (decodedToken) {
            console.log("decoded", decodedToken);

            const { yeargotten, termgotten, emailgotten, passwordgotten } =
              decodedToken.payload;

            if (yeargotten && termgotten && emailgotten && passwordgotten) {
              console.log("ddec", yeargotten, termgotten, emailgotten);

              localStorage.setItem("year", yeargotten);
              localStorage.setItem("term", termgotten);

              if (canload) {
                try {
                  console.log("log with token");
                  const { user } = await signInWithEmailAndPassword(
                    auth2,
                    emailgotten,
                    passwordgotten
                  );
                  console.log("logged with token", user, user.uid);

                  const studentDocRef = doc(
                    db,
                    "Admins",
                    user.uid
                  );
                  const studentDocSnapshot = await getDoc(studentDocRef);

                  if (studentDocSnapshot.exists()) {
                    // The user's UID exists in the students collection, proceed to redirect
                    console.log("Logged in successfully", user.uid);
                    setcanload(false);
                    router.push("/Maindash");
                    console.log("ended")
                  } else {

                    setloader(false)
                    // The user's UID doesn't exist in the students collection, sign-out and display an error
                    await signOut(auth2);
                    console.error("User not found in the Admins collection.");
                    alert("Something went wrong, please try again")

                  }

                  
                } catch (error) {

                  setloader(false)
                  console.error(error.message);
                  alert("Something went wrong, please try again")
                  // Handle errors, show error messages to the user, etc.
                }
              }
            }
          }

          setloader(false)


          // Now you can use this information for authentication or other purposes
        } catch (error) {

          setloader(false)
          console.error("JWT verification failed:", error.message);
          alert("Something went wrong, please try again")

          // Handle invalid or expired tokens
        }

      }
    };

    signintoken();
  }, []);







  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloader(true)
      const { user } = await signInWithEmailAndPassword(auth2, formData.email, formData.password);

      localStorage.setItem("year", formData.year);
      localStorage.setItem("term", formData.term);
      // Handle successful sign-in (e.g., redirect to dashboard)

      // Check if the user's UID exists in the students collection
      const studentDocRef = doc(db, 'Admins', user.uid);
      const studentDocSnapshot = await getDoc(studentDocRef);

      if (studentDocSnapshot.exists()) {
        // The user's UID exists in the students collection, proceed to redirect
        console.log("Logged in successfully", user.uid)
        setloader(false)
        router.push('/Maindash');

      } else {
        // The user's UID doesn't exist in the students collection, sign-out and display an error
        await signOut(auth2);
        setloader(false)
        console.error('User not found in the admin collection.');
        alert("Something went wrong, User not found under admins, please try again")

        // You can display an error message to the user or handle it as needed
      }



    } catch (error) {
      console.error(error.message);
      setloader(false)
      // Handle errors, show error messages to the user, etc.
      alert("Something went wrong, please try again")

    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>


            <div className="py-6 ">
              <label htmlFor="year" className="">
                Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              >
                <option value="">Please Select</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>


                {/* Add year options */}
              </select>
            </div>

            <div className="">
              <label htmlFor="term" className="">
                Term
              </label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              >
                <option value="">Please Select</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>


                {/* Add year options */}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* You can add a "Remember me" checkbox here */}
            </div>

            <div className="text-sm">
              {/* Add a "Forgot password?" link here */}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>


      </div>


      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default SignIn;
