import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const StudentProfilePage = () => {
  const [loader, setloader] = useState(false);

  
  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const router = useRouter();
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    photo: null,
    gender: "",
    age: "",
    email: "",
    phone: "",
    birthday: "",
    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",
    lga: "",

    medicalChallenge: "",

    middleName: "",

    motherName: "",

    motherOccupation: "",

    motherPhone: "",

    nationality: "",

    phoneNumber: "",

    presentAddress: "",

    previousSchool: "",

    profilePicture: "",

    religion: "",

    selectedClass: "",

    stateOfOrigin: "",

    year: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Flag to enable editing
  const { studentId } = router.query;

  const dbase = getFirestore();

  useEffect(() => {
    // Fetch the details of the selected student
    const fetchStudentDetails = async () => {
      if (studentId) {
        setloader(true)
        const studentRef = doc(dbase, year, term, "students", studentId); // Replace with your actual collection name
        const studentDoc = await getDoc(studentRef);
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          setStudent(studentData);
        }

        setloader(false)
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  const handleSave = async () => {
    if (studentId) {
      setloader(true)
      const studentRef = doc(dbase, year, term, "students", studentId); // Replace with your actual collection name
      await setDoc(studentRef, student);
      setIsEditing(false); // Disable editing after saving
      setloader(false)
      // You can add feedback to the user here to confirm the update.
    }
  };

  return (
    <div className="container overflow-y-auto h-full pb-20 mx-auto p-8">
      <div
        className="bg-cover bg-center h-48 w-full"
        style={{ backgroundImage: `url('${student.profilePicture}')` }}
      ></div>
      <div className="bg-white -mt-16 p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <img
            src={student.profilePicture}
            alt="Student Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>
        <h1 className="text-3xl font-semibold mt-4">{`${student.firstName} ${student.lastName}`}</h1>
        <p className="text-lg text-gray-600">{student.email || "NA"}</p>

        <div className="mt-4 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="text-gray-600">First Name</label>
            <input
              type="text"
              value={student.firstName || "NA"}
              onChange={(e) =>
                setStudent({ ...student, firstName: e.target.value })
              }
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
              value={student.lastName || "NA"}
              onChange={(e) =>
                setStudent({ ...student, lastName: e.target.value })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Phone</label>
            <input
              type="text"
              value={student.phoneNumber || "NA"}
              onChange={(e) =>
                setStudent({ ...student, phoneNumber: e.target.value })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">LGA</label>
            <input
              type="text"
              value={student.lga || "NA"}
              onChange={(e) => setStudent({ ...student, lga: e.target.value })}
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Medical Challenge</label>
            <input
              type="text"
              value={student.medicalChallenge || "NA"}
              onChange={(e) =>
                setStudent({ ...student, medicalChallenge: e.target.value })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Email</label>
            <input
              type="text"
              value={student.email || "NA"}
              onChange={(e) =>
                setStudent({ ...student, email: e.target.value })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Present Address</label>
            <input
              type="text"
              value={student.presentAddress || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  presentAddress:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>



          <div className="mb-4">
            <label className="text-gray-600">Father Name</label>
            <input
              type="text"
              value={student.fatherName || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fatherName:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>


          <div className="mb-4">
            <label className="text-gray-600">Father Phone</label>
            <input
              type="text"
              value={student.fatherPhone || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fatherPhone:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>



          <div className="mb-4">
            <label className="text-gray-600">Father Occpation</label>
            <input
              type="text"
              value={student.fatherOccupation || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  fatherOccupation:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>





          <div className="mb-4">
            <label className="text-gray-600">Mother Name</label>
            <input
              type="text"
              value={student.motherName || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  motherName:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>


          <div className="mb-4">
            <label className="text-gray-600">Mother Phone</label>
            <input
              type="text"
              value={student.motherPhone || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  motherPhone:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>



          <div className="mb-4">
            <label className="text-gray-600">Mother Occpation</label>
            <input
              type="text"
              value={student.motherOccupation || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  motherOccupation:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>




          <div className="mb-4">
            <label className="text-gray-600">Religion</label>
            <input
              type="text"
              value={student.religion || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  religion:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-600">state Of Origin</label>
            <input
              type="text"
              value={student.stateOfOrigin || "NA"}
              onChange={(e) =>
                setStudent({
                  ...student,
                  stateOfOrigin:  e.target.value,
                })
              }
              className={`w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none ${
                isEditing ? "bg-gray-100" : "bg-white"
              }`}
              readOnly={!isEditing}
            />
          </div>







          {/* Add fields for other address details and birthDate here */}
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

export default StudentProfilePage;
