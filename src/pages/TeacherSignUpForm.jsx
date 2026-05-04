import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth2, firestore, storage } from "../firebase/config";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const TeacherSignUpForm = () => {
  const [loader, setloader] = useState(false);


  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    photo: null,
    gender: "",
    age: "",
    email: "",
    contact: "",
    address: {
      streetAddress: "",
      streetAddressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    qualification: "",
    teachingArea: "",
    classesTaught: "",
    subjectsTaught: "",
    teachingExperience: "",
    locationPreference: "",
    referralSource: "",
    termsAgreed: false,
    additionalComments: "",
  });

  const displaySuccessToast = () => {
    toast.success("Signup successful! Redirecting to the login page...", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth2,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;

      if (formData.photo) {
        const storageRef = ref(storage, `teacherPhotos/${uid}`);
        await uploadBytes(storageRef, formData.photo);
        const downloadURL = await getDownloadURL(storageRef);

        const teachersCollection = collection(firestore, "Teachers");
        const teacherDoc = doc(teachersCollection, uid);

        await setDoc(teacherDoc, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: formData.firstName + " " + formData.lastName,
          profilePicture: downloadURL,
          gender: formData.gender,
          age: formData.age,
          email: formData.email,
          contact: formData.contact,
          address: formData.address,
          qualification: formData.qualification,
          teachingArea: formData.teachingArea,
          classesTaught: formData.classesTaught,
          subjectsTaught: formData.subjectsTaught,
          teachingExperience: formData.teachingExperience,
          locationPreference: formData.locationPreference,
          referralSource: formData.referralSource,
          termsAgreed: formData.termsAgreed,
          additionalComments: formData.additionalComments,
        });
      } else {
        const teachersCollection = collection(firestore, "Teachers");
        const teacherDoc = doc(teachersCollection, uid);

        await setDoc(teacherDoc, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: formData.firstName + " " + formData.lastName,
          gender: formData.gender,
          age: formData.age,
          email: formData.email,
          contact: formData.contact,
          address: formData.address,
          qualification: formData.qualification,
          teachingArea: formData.teachingArea,
          classesTaught: formData.classesTaught,
          subjectsTaught: formData.subjectsTaught,
          teachingExperience: formData.teachingExperience,
          locationPreference: formData.locationPreference,
          referralSource: formData.referralSource,
          termsAgreed: formData.termsAgreed,
          additionalComments: formData.additionalComments,
        });
      }

      setFormData({
        firstName: "",
        lastName: "",
        fullName: "",
        photo: null,
        gender: "",
        age: "",
        email: "",
        contact: "",
        address: {
          streetAddress: "",
          streetAddressLine2: "",
          city: "",
          state: "",
          zipCode: "",
        },
        qualification: "",
        teachingArea: "",
        classesTaught: "",
        subjectsTaught: "",
        teachingExperience: "",
        locationPreference: "",
        referralSource: "",
        termsAgreed: false,
        additionalComments: "",
      });

      displaySuccessToast();

      router.push("/AllTeachersPage");


      setloader(false)
    } catch (error) {

      setloader(false)
      console.error(error);
      alert("something went wrong, try again \n", error.message)
    }
  };

  return (
    <div className="flex w-full h-full overflow-y-auto justify-center ">
      <div className="max-w-xl w-full overflow-y-auto  mx-auto mt-10 pb-20 flex flex-col p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Teacher's Registration Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-gray-600">
              Recent Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required

            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-600">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Please Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-gray-600">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              E-mail Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="streetAddress" className="block text-gray-600">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="address.streetAddress"
              value={formData.address.streetAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="streetAddressLine2" className="block text-gray-600">
              Street Address Line 2
            </label>
            <input
              type="text"
              id="streetAddressLine2"
              name="address.streetAddressLine2"
              value={formData.address.streetAddressLine2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-600">
              City
            </label>
            <input
              type="text"
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="state" className="block text-gray-600">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="zipCode" className="block text-gray-600">
              Postal / Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="qualification" className="block text-gray-600">
              Qualification
            </label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required

            />
          </div>
          <div className="mb-4">
            <label htmlFor="teachingArea" className="block text-gray-600">
              Your preferable teaching area
            </label>
            <input
              type="text"
              id="teachingArea"
              name="teachingArea"
              value={formData.teachingArea}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="classesTaught" className="block text-gray-600">
              Classes you can teach
            </label>
            <input
              type="text"
              id="classesTaught"
              name="classesTaught"
              value={formData.classesTaught}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subjectsTaught" className="block text-gray-600">
              Subjects you can teach
            </label>
            <input
              type="text"
              id="subjectsTaught"
              name="subjectsTaught"
              value={formData.subjectsTaught}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="teachingExperience" className="block text-gray-600">
              Any Experience of teaching
            </label>
            <input
              type="text"
              id="teachingExperience"
              name="teachingExperience"
              value={formData.teachingExperience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="locationPreference" className="block text-gray-600">
              Favorable location of teaching
            </label>
            <input
              type="text"
              id="locationPreference"
              name="locationPreference"
              value={formData.locationPreference}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="referralSource" className="block text-gray-600">
              How do you find about us?
            </label>
            <input
              type="text"
              id="referralSource"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="termsAgreed" className="block text-gray-600">
              Terms and conditions
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="termsAgreed"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                className="mr-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required

              />
              <span className="text-gray-600">
                I agree to the terms and conditions
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="additionalComments" className="block text-gray-600">
              Additional Comments
            </label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-amber-600 focus:outline-none focus:bg-green-600"
            >
              Sign Up
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



export default TeacherSignUpForm;
