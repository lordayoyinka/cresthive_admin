import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/config";

const db = getFirestore();

const CmsGallery = () => {
  useEffect(() => {
    // Mock data for galleryPage
    const mockGalleryPageData = {
      heroTitle: "Welcome to Our School",
      heroSubtitle: "Providing Quality Education for All",
      videolink: "examplevid.com",

      detailsText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...",

      gallery: [
        {
          all: [
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
          ],
        },
        {
          staffs: [
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
          ],
        },
        {
          activities: [
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
          ],
        },

        {
          clubs: [
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
          ],
        },
        {
          stakeholders: [
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
            { link: "exampleimg.com", name: "Mr Jane Joe" },
          ],
        },
      ],
    };

    // Add mock data to Firestore
    const resave = async () => {
      try {
        const docRef = doc(db, "cms", "galleryPage");
        await setDoc(docRef, mockGalleryPageData);

        console.log("Mock data added successfully!");
      } catch (error) {
        console.error("Error adding mock data:", error);
      }
    };
  }, []);

  const [galleryPageData, setGalleryPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);

  const handleAddImage = (categoryGallery, category) => {
    const updatedData = { ...galleryPageData };

    // Create a new image object with a default link
    const newImage = { link: "", name: "New Image" };

    // Add the new image to the specified category
    updatedData.gallery[categoryGallery][category].push(newImage);

    setGalleryPageData(updatedData);
  };

  useEffect(() => {
    console.log("gallery", galleryPageData);
  }, [galleryPageData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "cms", "galleryPage");
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          setGalleryPageData(docSnapshot.data());
          console.log("Document found", docSnapshot.data());
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setGalleryPageData((prevData) => {
      const updatedData = { ...prevData };
  
      // Split the field into an array of keys
      const keys = field.split('.');
  
      // Use the keys to navigate through the nested structure and update the last key (name in this case)
      let currentLevel = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!currentLevel[keys[i]]) {
          currentLevel[keys[i]] = {};
        }
        currentLevel = currentLevel[keys[i]];
      }
  
      // Update the last key (name)
      currentLevel[keys[keys.length - 1]] = value;
  
      return updatedData;
    });
  };

  const storage = getStorage();

  const handleFileInputChange = async (
    field,
    file,
    categoryGallery,
    imageGallery
  ) => {
    try {
      const storageRef = ref(storage, `gallery_images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      const updatedData = { ...galleryPageData };
  
      // Update the image link in the data with the download URL
      updatedData.gallery[categoryGallery][
        Object.keys(updatedData.gallery[categoryGallery])[0]
      ][imageGallery].link = downloadURL;
  
      setGalleryPageData(updatedData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(db, "cms", "galleryPage");
      console.log("saving...")
      await setDoc(docRef, galleryPageData);
      setEditing(false);
      console.log("Data saved successfully!");
      alert("Data saved successfully!")
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Function to delete an image
  const handleDeleteImage = (categoryGallery, category, imageGallery) => {
    const updatedData = { ...galleryPageData };

    // Remove the selected image from the data
    updatedData.gallery[categoryGallery][category].splice(imageGallery, 1);

    setGalleryPageData(updatedData);
  };

 

  return (
    <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
      <h1 className="text-4xl font-bold mb-4">CMS Gallery Page</h1>
      {galleryPageData &&
        galleryPageData.gallery.map((category, categoryGallery) => (
          <div key={categoryGallery} className="mb-4">
            <h3 className="text-2xl font-semibold capitalize my-6 mb-2">{Object.keys(category)[0]}</h3>

            <div className="flex flex-wrap gap-4">
              {Object.keys(category)[0] && category[Object.keys(category)[0]].map((image, imageGallery) => (
                <div
                  key={imageGallery}
                  className="flex flex-col items-center mb-4"
                >
                  <img
                    src={image.link}
                    alt={image.name}
                    className="rounded-md w-36 h-36 object-cover"
                  />
                  <div className="flex gap-2 mt-2">
                    {isEditing &&(
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileInputChange(
                          `gallery[${categoryGallery}][${
                            Object.keys(category)[0]
                          }][${imageGallery}].link`,
                          e.target.files[0],
                          categoryGallery,
                          imageGallery
                        )
                      }
                    />

                    )}


                    
                    {isEditing ? (
                      <textarea
                        className="border-b-2 w-full border-blue-500 focus:outline-none"
                        type="text"
                        value={image.name}
                        onChange={(e) =>
                          handleInputChange(
                            `gallery.${categoryGallery}.${
                              Object.keys(category)[0]
                            }.${imageGallery}.name`,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      image.name
                    )}
                    <button
                      onClick={() =>
                        handleDeleteImage(
                          categoryGallery,
                          Object.keys(category)[0],
                          imageGallery
                        )
                      }
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isEditing && (<button
              onClick={() =>
                handleAddImage(categoryGallery, Object.keys(category)[0])
              }
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Image
            </button>
            )}
          </div>
        ))}

      <div className="flex justify-end flex-1 p-4">
        {isEditing ? (
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CmsGallery;
