import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const TeacherProfilePage = () => {
  const [loader, setloader] = useState(false);

  const router = useRouter();
  const [teacher, setTeacher] = useState({
    firstName: "",
    lastName: "",
    fullname: "" ,
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
  const [isEditing, setIsEditing] = useState(false); // Flag to enable editing
  const { teacherId } = router.query;

  const dbase = getFirestore();

  useEffect(() => {
    // Fetch the details of the selected teacher
    const fetchTeacherDetails = async () => {
      setloader(true)
      if (teacherId) {
        const teacherRef = doc(dbase, "Teachers", teacherId); // Replace with your actual collection name
        const teacherDoc = await getDoc(teacherRef);
        if (teacherDoc.exists()) {
          const teacherData = teacherDoc.data();
          setTeacher(teacherData);
        }
      }
      setloader(false)
    };

    fetchTeacherDetails();
    
  }, [teacherId]);

  const handleSave = async () => {
    setTeacher({...teacher, fullName: teacher.firstName + " " + teacher.lastName})

    setloader(true)

    if (teacherId && teacher.fullname !== "") {
      const teacherRef = doc(dbase, "Teachers", teacherId); // Replace with your actual collection name
      await setDoc(teacherRef, {...teacher, fullName: teacher.firstName + " " + teacher.lastName});
      console.log(teacher.fullname)
      setIsEditing(false); // Disable editing after saving
      setloader(false)
      // You can add feedback to the user here to confirm the update.
    }
  };

  return (
    <div className="container overflow-y-auto h-full pb-20 mx-auto p-8">
      <div className="bg-cover bg-center h-48 w-full" style={{ backgroundImage: `url('${teacher.profilePicture}')` }}></div>
      <div className="bg-white -mt-16 p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <img src={teacher.profilePicture} alt="Teacher Profile" className="w-24 h-24 rounded-full border-4 border-white" />
        </div>
        <h1 className="text-3xl font-semibold mt-4">{`${teacher.fullName}`}</h1>
        <p className="text-lg text-gray-600">{teacher.email}</p>

        <div className="mt-4 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="text-gray-600">First Name</label>
            <input
              type="text"
              value={teacher.firstName}
              onChange={(e) => setTeacher({ ...teacher, firstName: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Last Name</label>
            <input
              type="text"
              value={teacher.lastName}
              onChange={(e) => setTeacher({ ...teacher, lastName: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Age</label>
            <input
              type="text"
              value={teacher.age}
              onChange={(e) => setTeacher({ ...teacher, age: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Contact</label>
            <input
              type="text"
              value={teacher.contact}
              onChange={(e) => setTeacher({ ...teacher, contact: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Qualification</label>
            <input
              type="text"
              value={teacher.qualification}
              onChange={(e) => setTeacher({ ...teacher, qualification: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Teaching Area</label>
            <input
              type="text"
              value={teacher.teachingArea}
              onChange={(e) => setTeacher({ ...teacher, teachingArea: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Classes Taught</label>
            <input
              type="text"
              value={teacher.classesTaught}
              onChange={(e) => setTeacher({ ...teacher, classesTaught: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Subjects Taught</label>
            <input
              type="text"
              value={teacher.subjectsTaught}
              onChange={(e) => setTeacher({ ...teacher, subjectsTaught: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Teaching Experience</label>
            <input
              type="text"
              value={teacher.teachingExperience}
              onChange={(e) => setTeacher({ ...teacher, teachingExperience: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Location Preference</label>
            <input
              type="text"
              value={teacher.locationPreference}
              onChange={(e) => setTeacher({ ...teacher, locationPreference: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Referral Source</label>
            <input
              type="text"
              value={teacher.referralSource}
              onChange={(e) => setTeacher({ ...teacher, referralSource: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Additional Comments</label>
            <input
              type="text"
              value={teacher.additionalComments}
              onChange={(e) => setTeacher({ ...teacher, additionalComments: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleSave}
              className={`bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 focus:outline-none focus:bg-green-600 ${
                !isEditing ? "hidden" : "block"
              }`}
              disabled={!isEditing}
            >
              Save Changes
            </button>
          </div>
        </div>
        <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white py-2 my-10 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Edit Profile
            </button>
      </div>

      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>
    </div>
  );
};

export default TeacherProfilePage;
