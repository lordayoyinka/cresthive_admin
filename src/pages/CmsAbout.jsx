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

// Converts a File object to a base64 string (without the data: prefix)
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Uploads a file to the crestlandpage GitHub repo via our API route
// and returns a public CDN URL for it (no Firebase Storage involved) —
// same approach used for teacher photos and blog images on the index page.
const uploadToGitHub = async (file, folder, safeName) => {
  const contentBase64 = await fileToBase64(file);
  const ext = file.name.split(".").pop();
  const filename = `${safeName}.${ext}`;

  const res = await fetch("/api/upload-to-github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, filename, contentBase64 }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub upload failed: ${errText}`);
  }

  const { url } = await res.json();
  return url;
};

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

  const [aboutPageData, setAboutPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const emptyAdmin = () => ({ adminName: "", adminRole: "", adminPicture: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cms', 'aboutPage');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          // Always exactly 4 administrator slots, even on first load.
          const administrators =
            Array.isArray(data.administrators) && data.administrators.length === 4
              ? data.administrators
              : [emptyAdmin(), emptyAdmin(), emptyAdmin(), emptyAdmin()];
          setAboutPageData({ ...data, administrators });
          console.log('Document found', data);
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

  const handleAdminChange = (index, field, value) => {
    setAboutPageData((prevData) => {
      const administrators = [...prevData.administrators];
      administrators[index] = { ...administrators[index], [field]: value };
      return { ...prevData, administrators };
    });
  };

  const handleAdminPhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAboutPageData((prevData) => {
      const administrators = [...prevData.administrators];
      administrators[index] = { ...administrators[index], adminPicture: file };
      return { ...prevData, administrators };
    });
  };

  // A director photo field can be either a saved URL string (already on
  // GitHub) or a freshly-picked File object waiting to be uploaded on
  // Save. This picks the right thing to put in the <img src>.
  const getPreviewSrc = (value) => {
    if (!value) return "";
    if (value instanceof File) return URL.createObjectURL(value);
    return value;
  };


  // Just holds the picked File in state — it isn't uploaded to GitHub
  // until Save Changes is clicked, same pattern as staff photos on the
  // index page CMS. The <img> preview below falls back to the last
  // saved URL until then.
  const handleimageChange = (field, value) => {
    const file = value.target.files[0];
    if (!file) return;
    setAboutPageData((prevData) => ({
      ...prevData,
      [field]: file,
    }));
  };

  const handleSaveChanges = async () => {
    setSaveError(null);

    const imageFields = ["basicphoto", "prebasicphoto", "collegephoto"];
    const adminPhotosToUpload = (aboutPageData.administrators || []).filter(
      (a) => a.adminPicture instanceof File
    ).length;
    const picturesToUpload =
      imageFields.filter((f) => aboutPageData[f] instanceof File).length +
      adminPhotosToUpload;

    setIsSaving(true);
    setSaveProgress(
      picturesToUpload > 0 ? { total: picturesToUpload, done: 0 } : null
    );

    try {
      const updatedData = { ...aboutPageData };

      await Promise.all(
        imageFields.map(async (field) => {
          const value = aboutPageData[field];
          if (value instanceof File) {
            const url = await uploadToGitHub(value, "directors", field);
            updatedData[field] = url;
            setSaveProgress((prev) =>
              prev ? { ...prev, done: prev.done + 1 } : prev
            );
          }
        })
      );

      const updatedAdministrators = await Promise.all(
        (aboutPageData.administrators || []).map(async (admin, i) => {
          if (admin.adminPicture instanceof File) {
            const safeName = `admin-${i}-${(admin.adminName || "staff").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
            const url = await uploadToGitHub(admin.adminPicture, "administrators", safeName);
            setSaveProgress((prev) =>
              prev ? { ...prev, done: prev.done + 1 } : prev
            );
            return { ...admin, adminPicture: url };
          }
          return admin;
        })
      );
      updatedData.administrators = updatedAdministrators;

      const docRef = doc(db, 'cms', 'aboutPage');
      await setDoc(docRef, updatedData);
      setAboutPageData(updatedData);
      setEditing(false);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveError(
        "Save failed — one or more photos didn't upload. Nothing was changed on the live site. Please try again."
      );
    } finally {
      setIsSaving(false);
      setSaveProgress(null);
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
                src={getPreviewSrc(aboutPageData.basicphoto)}
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
              src={getPreviewSrc(aboutPageData.prebasicphoto)}
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
              src={getPreviewSrc(aboutPageData.collegephoto)}
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

            {/* School Administration — 4 fixed profiles, shown on the About
                page before the Teachers section */}
            <div className="mt-16 pt-10 border-t-2">
              <h2 className="text-3xl mb-6">School Administration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(aboutPageData.administrators || []).map((admin, i) => (
                  <div key={i} className="border-2 rounded-lg p-4">
                    <p className="font-semibold mb-2">Administrator {i + 1}</p>

                    <label className="block text-gray-600 mb-1">Name</label>
                    {isEditing ? (
                      <input
                        className="border-2 rounded-lg p-2 mb-3 w-full border-blue-500 focus:outline-none"
                        type="text"
                        value={admin.adminName || ""}
                        onChange={(e) => handleAdminChange(i, "adminName", e.target.value)}
                      />
                    ) : (
                      <p className="mb-3">{admin.adminName || "Nothing here yet!"}</p>
                    )}

                    <label className="block text-gray-600 mb-1">Role</label>
                    {isEditing ? (
                      <input
                        className="border-2 rounded-lg p-2 mb-3 w-full border-blue-500 focus:outline-none"
                        type="text"
                        value={admin.adminRole || ""}
                        onChange={(e) => handleAdminChange(i, "adminRole", e.target.value)}
                      />
                    ) : (
                      <p className="mb-3">{admin.adminRole || "Nothing here yet!"}</p>
                    )}

                    <img
                      src={getPreviewSrc(admin.adminPicture)}
                      className="rounded-md w-24 h-24 object-cover mb-2"
                    />
                    {isEditing && (
                      <div>
                        <label className="block text-gray-600 mb-1">Add Photo</label>
                        <input
                          type="file"
                          onChange={(e) => handleAdminPhotoChange(i, e)}
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>











          </div>

          {saveError && (
            <p className="text-red-600 text-sm m-4 max-w-md">{saveError}</p>
          )}
          {isSaving && (
            <p className="text-sm text-gray-600 m-4">
              {saveProgress
                ? `Uploading photos to GitHub... (${saveProgress.done}/${saveProgress.total})`
                : "Saving..."}
              {" "}Please don't close or navigate away.
            </p>
          )}

          {isEditing ? (
            <button
              className={`text-white m-4 py-2 px-4 rounded ${
                isSaving ? "bg-green-300 cursor-not-allowed" : "bg-green-500"
              }`}
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
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