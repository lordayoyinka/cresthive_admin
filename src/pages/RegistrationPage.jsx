import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore"; // Replace with your Firebase configuration and Firestore import path
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const RegistrationPage = () => {
  const router = useRouter();

  const [iserror, setiserror] = useState(false);
  const [loader, setloader] = useState(false)


  const year = localStorage.getItem("studentyear");
  const term = localStorage.getItem("studentterm");

  
  

  const [formData, setFormData] = useState({
    token: "",
    firstName: "",
    middleName: "",
    lastName: "",
    year: "",
    email: "",
    nationality: "",
    stateOfOrigin: "",
    lga: "",
    religion: "",
    previousSchool: "",
    lastClass: "",
    medicalChallenge: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    selectedClass: "",
    subjects: [],
    phoneNumber: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    presentAddress: "",
    otherAddress: "",
    profilePicture: null,
    password: "",
    confirmPassword: "",
    extraCurricular: [],
    clubs: [],
    sports: [],
  });

  const [isdone, setisdone] = useState(false);


  useEffect(() => {

    localStorage.setItem("studentterm", formData.term);
    localStorage.setItem("studentyear", formData.year);

    console.log("the logs", formData.year, formData.term)
    setisdone(!isdone);
    
  }, [formData])

  const extractTextBeforeFirstPeriod = (inputString) => {
    const parts = inputString.split(".");
    return parts[parts.length - 1];
  };

  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);

  // Function to fetch subjects based on the selected class
  const fetchSubjects = async (selectedClass) => {
    if (selectedClass) {
      try {
        const db = getFirestore();
        console.log("y n t", year, term )
        const subjectsCollection = collection(db, year, term, "subjects");
        const querySnapshot = await getDocs(subjectsCollection);

        const subjectList = [];
        querySnapshot.forEach((doc) => {
          const subjectName = doc.id;

          if (subjectName.startsWith(selectedClass)) {
            subjectList.push(subjectName);
          }
        });

        setSubjectOptions(subjectList);
      } catch (error) {
        console.error("Error fetching subject options:", error);
        alert("Error fetching subjects");
      }
    } else {
      // Clear subject options if no class is selected
      setSubjectOptions([]);
    }
  };

  const createNewUser = async (email, password) => {
    const auth = getAuth();
    const db = getFirestore();
      // If a matching token is found, proceed to create the user
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // User has been successfully created
        return user;
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Something went wrong, \nCannot create user", error);
        return false;
      }
     };

  useEffect(() => {
    fetchSubjects(selectedClass);
  }, [selectedClass]);

  // Function to fetch class options
  const fetchClassOptions = async () => {
    if(year && term){

      console.log("y n t", year, term);
    try {
      const db = getFirestore();
      const classCollection = collection(db, year, term, "classes");
      const querySnapshot = await getDocs(classCollection);

      const classList = [];
      console.log("cl1", classList)

      querySnapshot.forEach((doc) => {
        classList.push({ id: doc.id, ...doc.data() });
      });
      console.log("cl", classList)

      setClassOptions(classList);
    } catch (error) {
      console.error("Error fetching class options:", error);
      alert("Something went wrong!", error)
    }

  }
  };

  useEffect(() => {
    fetchClassOptions();
  }, [isdone]);

  // Function to add a student to a subject document
  const addStudentToSubject = async (subjectName, uid, email) => {
    const db = getFirestore();

    const subjectDoc = doc(db, year, term, "subjects", subjectName);

    try {
      await updateDoc(subjectDoc, {
        Students: arrayUnion({ uid, email }),
      });
      console.log(`Added student to ${subjectName} subject`);
    } catch (error) {
      console.error("Error adding student to subject:", error);
      alert("Error adding student to subject")
    }
  };

  // Function to add a student to a class document
  const addStudentToClass = async (className, uid, email) => {
    const db = getFirestore();
    const classDoc1 = doc(db, year, "1st", "classes", className);
    const classDoc2 = doc(db, year, "2nd", "classes", className);
    const classDoc3 = doc(db, year, "3rd", "classes", className);

    try {

      const classDocSnapshot = await getDoc(classDoc1);

      if(classDocSnapshot.exists()){
        await updateDoc(classDoc1, {

          students: arrayUnion({ uid, email }),
        });
      } else{
        await setDoc(classDoc1, {
          students: [{ uid, email }],
        });
      }

      console.log(`Added student to ${className} class`);
    } catch (error) {
      console.error("Error adding student to class:", error);
      alert("Error adding student to class")
    }


    try {

      const classDocSnapshot = await getDoc(classDoc3);

      if(classDocSnapshot.exists()){
        await updateDoc(classDoc3, {

          students: arrayUnion({ uid, email }),
        });
      } else{
        await setDoc(classDoc3, {
          students: [{ uid, email }],
        });
      }}

    catch (error) {
      console.error("Error adding student to class:", error);
      alert("Error adding student to class")
    }

    try {

      const classDocSnapshot = await getDoc(classDoc2);

      if(classDocSnapshot.exists()){
        await updateDoc(classDoc2, {

          students: arrayUnion({ uid, email }),
        });
      } else{
        await setDoc(classDoc2, {
          students: [{ uid, email }],
        });
      }

 
      console.log(`Added student to ${className} class`);
    } catch (error) {
      console.error("Error adding student to class:", error);
      alert("Error adding student to class")
    }

  };

 
   

  // Function to upload the profile picture
  const uploadProfilePicture = async (file, uid) => {
    const storage = getStorage();
    const storageRef = ref(storage, `ProfilePictures/${uid}.jpg`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      console.log("Profile picture uploaded successfully");

      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error adding student profile picture")
      return "./assets/logo.png";
    }
  };

  // Function to save student details
  const saveStudentDetails = async (uid, formData) => {
    // Upload profile picture
    let downloadURL = "";
    if (formData.profilePicture) {
      downloadURL = await uploadProfilePicture(formData.profilePicture, uid);
    }

    const db = getFirestore();
    const studentDoc1 = doc(db, year, "1st", "students", uid);
    const studentDoc2 = doc(db, year, "2nd", "students", uid);
    const studentDoc3 = doc(db, year, "3rd", "students", uid);

    try {
      await setDoc(studentDoc1, {
        profilePicture: downloadURL,
        // Add other fields from formData
        registrationNumber: formData.registrationNumber,


        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        fullName: formData.firstName + " " + formData.lastName,

        nationality: formData.nationality,
        stateOfOrigin: formData.stateOfOrigin,
        lga: formData.lga,
        religion: formData.religion,
        previousSchool: formData.previousSchool,
        lastClass: formData.lastClass,
        medicalChallenge: formData.medicalChallenge,
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherPhone: formData.motherPhone,
        motherOccupation: formData.motherOccupation,

        year: formData.year,
        email: formData.email,
        selectedClass: selectedClass,
        phoneNumber: formData.phoneNumber,
        birthMonth: formData.birthMonth,
        birthDay: formData.birthDay,
        birthYear: formData.birthYear,
        presentAddress: formData.presentAddress,
        otherAddress: formData.otherAddress,
        password: formData.password,
        extraCurricular: formData.extraCurricular,
        clubs: formData.clubs,
        sports: formData.sports,
        token: formData.registrationNumber,

        psychomotor: [
          { activity: "Handwriting", score: 0 },
          { activity: "Fluency", score: 0 },
          { activity: "Games", score: 0 },
          { activity: "Sports", score: 0 },
          { activity: "Drawing and PAinting", score: 0 },
        ],
        affective: [
          { activity: "Punctuality", score: 0 },
          { activity: "Politeness", score: 0 },
          { activity: "Neatness", score: 0 },
          { activity: "Honesty", score: 0 },
          { activity: "Group Interaction", score: 0 },
          { activity: "Organization Ability", score: 0 },
          { activity: "Reliability", score: 0 },
          { activity: "Relationship with staff", score: 0 },
          { activity: "Perseverance", score: 0 },
          { activity: "Self Control", score: 0 },
          { activity: "Initiative", score: 0 },
        ],
      });

      
      await setDoc(studentDoc2, {
        profilePicture: downloadURL,
        // Add other fields from formData
        registrationNumber: formData.registrationNumber,


        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        fullName: formData.firstName + " " + formData.lastName,

        nationality: formData.nationality,
        stateOfOrigin: formData.stateOfOrigin,
        lga: formData.lga,
        religion: formData.religion,
        previousSchool: formData.previousSchool,
        lastClass: formData.lastClass,
        medicalChallenge: formData.medicalChallenge,
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherPhone: formData.motherPhone,
        motherOccupation: formData.motherOccupation,

        year: formData.year,
        email: formData.email,
        selectedClass: selectedClass,
        phoneNumber: formData.phoneNumber,
        birthMonth: formData.birthMonth,
        birthDay: formData.birthDay,
        birthYear: formData.birthYear,
        presentAddress: formData.presentAddress,
        otherAddress: formData.otherAddress,
        password: formData.password,
        extraCurricular: formData.extraCurricular,
        clubs: formData.clubs,
        sports: formData.sports,
        token: formData.registrationNumber,

        psychomotor: [
          { activity: "Handwriting", score: 0 },
          { activity: "Fluency", score: 0 },
          { activity: "Games", score: 0 },
          { activity: "Sports", score: 0 },
          { activity: "Drawing and PAinting", score: 0 },
        ],
        affective: [
          { activity: "Punctuality", score: 0 },
          { activity: "Politeness", score: 0 },
          { activity: "Neatness", score: 0 },
          { activity: "Honesty", score: 0 },
          { activity: "Group Interaction", score: 0 },
          { activity: "Organization Ability", score: 0 },
          { activity: "Reliability", score: 0 },
          { activity: "Relationship with staff", score: 0 },
          { activity: "Perseverance", score: 0 },
          { activity: "Self Control", score: 0 },
          { activity: "Initiative", score: 0 },
        ],
      });

      await setDoc(studentDoc3, {
        profilePicture: downloadURL,
        // Add other fields from formData
        registrationNumber: formData.registrationNumber,


        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        fullName: formData.firstName + " " + formData.lastName,

        nationality: formData.nationality,
        stateOfOrigin: formData.stateOfOrigin,
        lga: formData.lga,
        religion: formData.religion,
        previousSchool: formData.previousSchool,
        lastClass: formData.lastClass,
        medicalChallenge: formData.medicalChallenge,
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherPhone: formData.motherPhone,
        motherOccupation: formData.motherOccupation,

        year: formData.year,
        email: formData.email,
        selectedClass: selectedClass,
        phoneNumber: formData.phoneNumber,
        birthMonth: formData.birthMonth,
        birthDay: formData.birthDay,
        birthYear: formData.birthYear,
        presentAddress: formData.presentAddress,
        otherAddress: formData.otherAddress,
        password: formData.password,
        extraCurricular: formData.extraCurricular,
        clubs: formData.clubs,
        sports: formData.sports,
        token: formData.registrationNumber,

        psychomotor: [
          { activity: "Handwriting", score: 0 },
          { activity: "Fluency", score: 0 },
          { activity: "Games", score: 0 },
          { activity: "Sports", score: 0 },
          { activity: "Drawing and PAinting", score: 0 },
        ],
        affective: [
          { activity: "Punctuality", score: 0 },
          { activity: "Politeness", score: 0 },
          { activity: "Neatness", score: 0 },
          { activity: "Honesty", score: 0 },
          { activity: "Group Interaction", score: 0 },
          { activity: "Organization Ability", score: 0 },
          { activity: "Reliability", score: 0 },
          { activity: "Relationship with staff", score: 0 },
          { activity: "Perseverance", score: 0 },
          { activity: "Self Control", score: 0 },
          { activity: "Initiative", score: 0 },
        ],
      });

      console.log("Student details saved successfully");
    } catch (error) {
      console.error("Error saving student details:", error);
      alert("Error saving student details")
    }
  };

  

  const handleClubsChange = (e) => {
    const { name, checked } = e.target;

    // Create a copy of the current extraCurricular array
    const updatedClubs = [...formData.clubs];

    if (checked) {
      // Add the activity with a default score of 0
      updatedClubs.push({ activity: name, score: 0 });
    } else {
      // Remove the activity
      const index = updatedClubs.findIndex((item) => item.activity === name);
      if (index !== -1) {
        updatedClubs.splice(index, 1);
      }
    }

    // Update the formData with the updated extraCurricular array
    setFormData({
      ...formData,
      clubs: updatedClubs,
    });
  };

  const handleSportsChange = (e) => {
    const { name, checked } = e.target;

    // Create a copy of the current extraCurricular array
    const updatedSports = [...formData.sports];

    if (checked) {
      // Add the activity with a default score of 0
      updatedSports.push({ activity: name, score: 0 });
    } else {
      // Remove the activity
      const index = updatedSports.findIndex((item) => item.activity === name);
      if (index !== -1) {
        updatedSports.splice(index, 1);
      }
    }

    // Update the formData with the updated extraCurricular array
    setFormData({
      ...formData,
      sports: updatedSports,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true);

    

    if (formData.sports.length < 1) {
      // Display an error message or take any other desired action
      setloader(false)
      alert("Please select at least 1 sporting activities.");

      return;
    } else if (formData.clubs.length < 1) {
      // Display an error message or take any other desired action
      setloader(false)
      alert("Please select at least 1 Club.");
      return;
    }

    try {
      console.log(formData.registrationNumber, "my token");
      const user = await createNewUser(
        formData.email,
        formData.password,
        
      );

      
    localStorage.setItem("studentterm", formData.term);
    localStorage.setItem("studentyear", formData.year);

      if (user !== false) {
        // Update subjects and class documents
        if (selectedClass) {
          await addStudentToClass(selectedClass, user.uid, formData.email);

          for (const subject of subjectOptions) {
            await addStudentToSubject(subject, user.uid, formData.email);
          }
        }

        // Save additional student details
        await saveStudentDetails(user.uid, formData);
        router.push('/AllStudentsPage');
        setloader(false)

      }


    } catch (error) {
      console.log(error);
      setloader(false)
      alert("Something went wrong \n", error)
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if(name == "confirmPassword" || name == "password"){

      if(value !== formData.password){

        setiserror(true)
        
      } else{
        setiserror( false)
      }
      
    }

    // Check if the input field is for extra-curricular activities
    if (name === "extracurricular") {
      // Split the input into an array of activities with scores
      const extraCurricularActivities = value.split(",").map((activity) => {
        // For each activity, set the initial score to 0
        return { activity: activity.trim(), score: 0 };
      });

      setFormData({
        ...formData,
        extraCurricular: extraCurricularActivities,
      });
    } else if (name === "clubs") {
      // Split the input into an array of activities with scores
      const clubActivities = value.split(",").map((activity) => {
        // For each activity, set the initial score to 0
        return { activity: activity.trim(), score: 0 };
      });

      setFormData({
        ...formData,
        clubs: clubActivities,
      });
    } else if (name === "sports") {
      // Split the input into an array of activities with scores
      const sportActivities = value.split(",").map((activity) => {
        // For each activity, set the initial score to 0
        return { activity: activity.trim(), score: 0 };
      });

      setFormData({
        ...formData,
        sports: sportActivities,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [isSExpanded, setSExpanded] = useState(false);
  const [isCExpanded, setCExpanded] = useState(false);

  const handleSToggle = () => {
    setSExpanded(!isSExpanded);
  };
  const handleCToggle = () => {
    setCExpanded(!isCExpanded);
  };

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
    });
  };

  return (
    <div className="h-full overflow-y-auto pb-40 mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center text-indigo-600">
        Student Registration Form
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Token/Registration Number Input */}
        <div className="mb-6">
          <label className="block text-gray-600">
            Token/Registration Number
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            className="border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
            required
          />
        </div>
        {/* Basic Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="w-full">
              <label className="block text-gray-600">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-600">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-600">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div>
              <div className="w-full mb-12">
                <label className="block text-gray-600">Birth Date</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleInputChange}
                    className="border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                    required
                  >
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">Febuary</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>                    <option value="04">April</option>
                    <option value="12">Decmber</option>

                  </select>
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    className="border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                    required
                  >
                    <option value="">Day</option>
                    <option value="01">01</option>
  <option value="02">02</option>
  <option value="03">03</option>
  <option value="04">04</option>
  <option value="05">05</option>
  <option value="06">06</option>
  <option value="07">07</option>
  <option value="08">08</option>
  <option value="09">09</option>
  <option value="10">10</option>
  <option value="11">11</option>
  <option value="12">12</option>
  <option value="13">13</option>
  <option value="14">14</option>
  <option value="15">15</option>
  <option value="16">16</option>
  <option value="17">17</option>
  <option value="18">18</option>
  <option value="19">19</option>
  <option value="20">20</option>
  <option value="21">21</option>
  <option value="22">22</option>
  <option value="23">23</option>
  <option value="24">24</option>
  <option value="25">25</option>
  <option value="26">26</option>
  <option value="27">27</option>
  <option value="28">28</option>
  <option value="29">29</option>
  <option value="30">30</option>
  <option value="31">31</option>

                    {/* Add day options */}
                  </select>
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                    required
                  >
                   <option value="">Year</option>
  <option value="2001">2001</option>
  <option value="2002">2002</option>
  <option value="2003">2003</option>
  <option value="2004">2004</option>
  <option value="2005">2005</option>
  <option value="2006">2006</option>
  <option value="2007">2007</option>
  <option value="2008">2008</option>
  <option value="2009">2009</option>
  <option value="2010">2010</option>
  <option value="2011">2011</option>
  <option value="2012">2012</option>
  <option value="2013">2013</option>
  <option value="2014">2014</option>
  <option value="2015">2015</option>
  <option value="2016">2016</option>
  <option value="2017">2017</option>
  <option value="2018">2018</option>
  <option value="2019">2019</option>
  <option value="2020">2020</option>
  <option value="2021">2021</option>
  <option value="2022">2022</option>
  <option value="2023">2023</option>
                    {/* Add year options */}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-gray-600">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">State Of Origin</label>
              <input
                type="text"
                name="stateOfOrigin"
                value={formData.stateOfOrigin}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">
                Local Government Area
              </label>
              <input
                type="text"
                name="lga"
                value={formData.lga}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">
                Name of Previous School
              </label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">Name of last class</label>
              <input
                type="text"
                name="lastClass"
                value={formData.lastClass}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">
                Any Medical Challenge
              </label>
              <input
                type="text"
                name="medicalChallenge"
                value={formData.medicalChallenge}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
          </div>

          <div></div>
          <div className="pt-12">
            <h2 className="text-xl font-semibold mb-2 text-indigo-600">
              Session Details
            </h2>
            <div className="flex gap-14">
              <div className="flex-1">
                <label className="block text-gray-600">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                  required
                >
                  <option value="">Please Select</option>
                  <option value="2023">2023/2024</option>

                  {/* Add year options */}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-600">Term</label>
                <select
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
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

              <div className="flex-1">
                <label className="block text-gray-600">Class</label>
                <select
                  name="selectedClass"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    // Clear subject options when the class changes
                    setSubjectOptions([]);
                  }}
                  className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                  required
                >
                  <option value="">Please Select</option>
                  {classOptions.map((classOption) => (
                    <option key={classOption.id} value={classOption.id}>
                      {classOption.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="w-full mb-14"></div>
        </div>

        {/* Present Address Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Contact Information (To be filled by Parent/Guardian)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                placeholder="ex: myname@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                autoComplete="off"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                placeholder="(000) 000-0000"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Current Address</label>
              <input
                type="text"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Other Address</label>
              <input
                type="text"
                name="otherAddress"
                value={formData.otherAddress}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
              />
            </div>
          </div>

          <h2 className="text-indigo-600 my-6 font-semibold text-xl">
            {" "}
            Parent details
          </h2>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div>
              <label className="block text-gray-600">Father's Full Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600" >
                Father's Telephone Number
              </label>
              <input
                type="tel"
                autoComplete="off"
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600">Father's Occupation</label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600">Mother's Full Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600" >
                Mother's Telephone Number
              </label>
              <input
                type="tel"
                autoComplete="off"
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600">Mother's Occupation</label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleInputChange}
                className="border w-full p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
          </div>
        </div>
        {/* ... Other sections remain the same ... */}
        {/* Profile Picture Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Profile Picture
          </h2>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-indigo-600"
            />
          </div>
        </div>
        {/* Security Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-indigo-600">
            Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={iserror ? "border p-2 rounded focus:outline-none focus:ring focus:border-red-400 text-red-400" : "border p-2 rounded focus:outline-none focus:ring focus:border-indigo-300"}
                required
              />
            </div>
          </div>
        </div>
        {/* Sporting Activities Section */}
        <div className="my-12 p-2 border-[1px] rounded-xl border-slate-300">
          <h2
            className="text-xl border-[1px] flex p-4 pr-8 rounded-xl border-slate-300 font-semibold mb-2 text-indigo-600 cursor-pointer"
            onClick={handleSToggle}
          >
            <p className="flex-1">Sports Activities </p>
            {isSExpanded ? <p>▲</p> : <p>▼</p>}
          </h2>
          {isSExpanded && (
            <div className="flex flex-col">
              <label className="text-gray-600">
                Select at least 1 activity:
              </label>
              {["Chess", "Scrabble", "Football", "Taekwondo", "Ayo Olopon", "Table Tenis"].map(
                (activity) => (
                  <div key={activity} className="mt-2">
                    <input
                      type="checkbox"
                      name={activity}
                      checked={formData.sports.some(
                        (item) => item.activity === activity
                      )}
                      onChange={handleSportsChange}
                      className="text-indigo-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">{activity}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Clubs Section */}
        <div className="my-12 p-2 border-[1px] rounded-xl border-slate-300">
          <h2
            className="text-xl border-[1px] flex p-4 pr-8 rounded-xl border-slate-300 font-semibold mb-2 text-indigo-600 cursor-pointer"
            onClick={handleCToggle}
          >
            <p className="flex-1">Clubs </p>
            {isCExpanded ? <p>▲</p> : <p>▼</p>}
          </h2>
          {isCExpanded && (
            <div className="flex flex-col">
              <label className="text-gray-600">
                Select at least 1 activity:
              </label>
              {["litterary and debate club", "press club", "programming club", "FRSC club", "enterpreneurship"].map((activity) => (
                <div key={activity} className="mt-2">
                  <input
                    type="checkbox"
                    name={activity}
                    checked={formData.clubs.some(
                      (item) => item.activity === activity
                    )}
                    onChange={handleClubsChange}
                    className="text-indigo-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{activity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Submit
          </button>
        </div>
      </form>



      <Loading newstate={loader} />
    </div>
  );
};

export default RegistrationPage;
