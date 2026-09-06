import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithCustomToken, signOut } from "firebase/auth";
import { auth2 } from "../firebase/config";
import { useRouter } from "next/router";
import { getDoc, doc, getFirestore } from "firebase/firestore";

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

  const db = getFirestore();

  useEffect(() => {
    const signintoken = async () => {
      if (!token || !canload) return;

      setloader(true);

      try {
        // SECURITY FIX: this used to verify the incoming JWT client-side
        // with a secret key hardcoded right here in this component (shipped
        // to every visitor's browser), then pull the plaintext password
        // back out of it to sign in again. Both of those were real
        // problems — see login.mjs in crestlandpage for the full writeup.
        //
        // Now: the token from the URL is a Firebase ID token (proof of
        // identity, never contains a password). We send it to our own
        // server-side API route, which is the only place allowed to use
        // the Firebase Admin SDK to verify it safely. That route hands
        // back a short-lived custom token for the same verified user,
        // which we use to sign in for real, right here.
        const response = await fetch("/api/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });

        if (!response.ok) {
          throw new Error("Token verification failed");
        }

        const { customToken } = await response.json();

        setcanload(false);
        const { user } = await signInWithCustomToken(auth2, customToken);

        const adminDocRef = doc(db, "Admins", user.uid);
        const adminDocSnapshot = await getDoc(adminDocRef);

        if (adminDocSnapshot.exists()) {
          console.log("Logged in successfully", user.uid);
          router.push("/Maindash");
        } else {
          await signOut(auth2);
          console.error("User not found in the Admins collection.");
          alert("Something went wrong, please try again");
        }
      } catch (error) {
        console.error(error.message);
        alert("Something went wrong, please try again");
      } finally {
        setloader(false);
      }
    };

    signintoken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
