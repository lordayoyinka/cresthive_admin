import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
const CmsAbout = () => {

  const db = getFirestore();

  useEffect(() => {
    // Mock data for indexPage
    const mockIAboutPageData = {
      aboutTitle: "Welcome to Our School",
      aboutSubtitle: "Providing Quality Education for All",

      section1Title: "About Us",
      section1Text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...",

    };

    // Add mock data to Firestore
    const resave = async () => {
      try {
        const docRef = doc(db, "cms", "aboutPage");
        await setDoc(docRef, mockIAboutPageData);

        console.log("Mock data added successfully!");
      } catch (error) {
        console.error("Error adding mock data:", error);
      }
    };

  }, []);

  const storage = getStorage();



  const [aboutPageData, setAboutPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cms', 'aboutPage');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          setAboutPageData(docSnapshot.data());
          console.log('Document found', docSnapshot.data());
        } else {
          console.log('Document not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setAboutPageData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleimageChange = async (field, value) => {
    const file = value.target.files[0];


    const storageRef = ref(storage, "indeximages");
    const date = new Date()
    const fileRef = ref(storageRef, date.toString());
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    setAboutPageData((prevData) => ({
      ...prevData,
      [field]: downloadURL,
    }));


  };

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(db, 'cms', 'aboutPage');
      await setDoc(docRef, aboutPageData);
      setEditing(false);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  return (
    <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
      <h1 className="text-4xl font-bold mb-4">CMS About Page</h1>
      {aboutPageData && (

        <div>
          <div className="max-w-2xl mx-auto flex-col">
            <h2 className="text-3xl mb-2">
              {isEditing ? (
                <textarea
                  className="border-b-2 w-full border-blue-500 focus:outline-none"
                  type="text"
                  value={aboutPageData.aboutTitle}
                  onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                />
              ) : (
                aboutPageData.aboutTitle
              )}
            </h2>
            <p className="mb-4">
              {isEditing ? (
                <textarea
                  className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  value={aboutPageData.aboutSubtitle}
                  onChange={(e) => handleInputChange('aboutSubtitle', e.target.value)}
                />
              ) : (
                aboutPageData.aboutSubtitle
              )}
            </p>

          





              {/* Basics school director */}


              <p className="mt-20">
              Director Of School Name

              {isEditing ? (
                <input
                  className="border-2 rounded-lg text-2xl p-2 my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  value={aboutPageData.directbasicTitle || ""}
                  placeholder="Director Of School Name"
                  onChange={(e) => handleInputChange('directbasicTitle', e.target.value)}
                />
              ) : (<h2 className="text-2xl">
                {aboutPageData.directbasicTitle || "From Director Of Basic School"}
              </h2>
              )}

            </p>


            
            <p>

              {isEditing ? (
                <textarea
                  className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  value={aboutPageData.directprebasicText || ""}
                  onChange={(e) => handleInputChange('directprebasicText', e.target.value)}
                />
              ) : (
                aboutPageData.directprebasicText || "Nothing here yet!"
              )}


            </p>



            <div className="pb-10">



              <p>Director of School Picture</p>
              <img
                src={aboutPageData.basicphoto}
                className="rounded-md w-36 h-36 object-cover"
              />

              <div className="mb-4 mt-4">
                <label htmlFor="basicphoto" className="block text-gray-600">
                  Add Photo
                </label>
                <input
                  type="file"
                  id="basicphoto"
                  name="basicphoto"
                  onChange={(e) => handleimageChange("basicphoto", e)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
                  required

                />
              </div>



              
            <p className="">

<p> About Nursery and Primary School </p>

 {isEditing ? (
   <textarea
     className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
     type="text"
     rows={4}
     value={aboutPageData.directprebasicAbout || ""}
     placeholder="About Nursery and Primary School                  "
     onChange={(e) => handleInputChange('directprebasicAbout', e.target.value)}
   />
 ) : (
   aboutPageData.directprebasicAbout || "Nothing here yet!"
 )}





</p>









            </div>









      

            {/* Additional fields can be added similar to the index page */}


            {/* {Prebasic Director} */}




            <p className="mt-24">

              Director Name For Nursery And Primary


              {isEditing ? (
                <input
                  className="border-2 rounded-lg text-2xl p-2  my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  value={aboutPageData.directprebasicTitle || ""}
                  placeholder="Director Name For Nursery And Primary"
                  onChange={(e) => handleInputChange('directprebasicTitle', e.target.value)}
                />
              ) : (<h2 className="text-2xl">
                {aboutPageData.directprebasicTitle || "Director Name For Nursery And Primary"}
              </h2>
              )}

            </p>




            <img
              src={aboutPageData.prebasicphoto}
              className="rounded-md w-36 h-36 object-cover"
            />


            <div className="mb-4 mt-4">
              <label htmlFor="prebasicphoto" className="block text-gray-600">
                Add Photo
              </label>
              <input
                type="file"
                id="prebasicphoto"
                name="prebasicphoto"
                onChange={(e) => handleimageChange("prebasicphoto", e)}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
                required

              />
            </div>




        




            {/* College Director */}




            <p className="mt-24">

              Director Name For College


              {isEditing ? (
                <input
                  className="border-2 rounded-lg text-2xl p-2 my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  placeholder="Director Name For College"
                  value={aboutPageData.directcollegeTitle || ""}
                  onChange={(e) => handleInputChange('directcollegeTitle', e.target.value)}
                />
              ) : (<h2 className="text-2xl">
                {aboutPageData.directcollegeTitle || "From Director Of Prebasic"}
              </h2>
              )}

            </p>


            <p>

              {isEditing ? (
                <textarea
                  className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  value={aboutPageData.directcollegeText || ""}
                  onChange={(e) => handleInputChange('directcollegeText', e.target.value)}
                />
              ) : (
                aboutPageData.directcollegeText || "Nothing here yet!"
              )}


            </p>


            <img
              src={aboutPageData.collegephoto}
              className="rounded-md w-36 h-36 object-cover"
            />


            <div className="mb-4 mt-4">
              <label htmlFor="collegephoto" className="block text-gray-600">
                Add Photo
              </label>
              <input
                type="file"
                id="collegephoto"
                name="collegephoto"
                onChange={(e) => handleimageChange("collegephoto", e)}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
                required

              />
            </div>

            <div>


             <p> About Cresthive college </p>

              {isEditing ? (
                <textarea
                  className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
                  type="text"
                  rows={4}
                  value={aboutPageData.directcollegeAbout || ""}
                  onChange={(e) => handleInputChange('directcollegeAbout', e.target.value)}
                />
              ) : (
                aboutPageData.directcollegeAbout || "Nothing here yet!"
              )}


            </div>










          </div>

          {isEditing ? (
            <button className="bg-green-500 text-white m-4 py-2 px-4 rounded" onClick={handleSaveChanges}>
              Save Changes
            </button>
          ) : (
            <button className="bg-blue-500 text-white m-4 py-2 px-4 rounded" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CmsAbout