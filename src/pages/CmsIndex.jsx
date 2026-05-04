// pages/cms.js
import { useState, useEffect } from "react";
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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

const CmsIndex = () => {
  const [indexPageData, setIndexPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "cms", "indexPage");
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          setIndexPageData(docSnapshot.data());
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

  const handleFileInputChange = (field, file, teacherKey) => {


    setIndexPageData((prevData) => {
      const updatedTeachers = { ...prevData.teachers };
      updatedTeachers[teacherKey] = {
        ...updatedTeachers[teacherKey],
        [field]: file,
      };
      console.log("new data", updatedTeachers);
      return {
        ...prevData,
        teachers: updatedTeachers,
      };
    });
  };
  const handleTestimonialFileInputChange = (field, file, teacherKey) => {


    setIndexPageData((prevData) => {
      const updatedTeachers = { ...prevData.testimonials };
      updatedTeachers[teacherKey] = {
        ...updatedTeachers[teacherKey],
        [field]: file,
      };


      console.log("new data", updatedTeachers);
      return {
        ...prevData,
        testimonials: updatedTeachers,
      };
    });
  };





  const handleInputChange = (field, value, key) => {

    console.log("key", key)
    setIndexPageData((prevData) => {
      const updateNestedField = (data, path, val) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const nestedObject = keys.reduce((obj, key) => obj && obj[key], data);

        if (nestedObject) {
          nestedObject[lastKey] = val;
          return { ...data };
        } else {
          console.error('Nested object does not exist:', path);
          return data;
        }
      };

      return key !== undefined
        ? updateNestedField(prevData, field, value)
        : { ...prevData, [field]: value };
    })

  };

  useEffect(() => {
    console.log(indexPageData, "changed")



  }, [indexPageData])


  const handleDeleteTestimonial = (index) => {
    setIndexPageData((prevData) => {

      const prev = {};
      const sth = prevData.testimonials.filter((_, j) => j != index);


      for (var i = 0; i < sth.length; i++) {
        console.log(i)
        const temp = sth;
        prev[i] = temp[i]
      }


      console.log("sth", index, sth)


      return ({
        ...prevData,

        testimonials: sth
      })
    });



  };

  const handleDeleteTeacher = (index) => {
    setIndexPageData((prevData) => {

      const prev = {};
      const sth = prevData.teachers.filter((_, j) => j != index);


      for (var i = 0; i < sth.length; i++) {
        console.log(i)
        const temp = sth;
        prev[i] = temp[i]
      }


      console.log("sth", index, sth)


      return ({
        ...prevData,

        teachers: sth
      })
    });



  };



  const handleAddTeacher = (prevData) => {
    setIndexPageData(() => {



      // for (var i = 0; i < prevData.teachers.length; i++) {
      //   console.log(i)
      //   const temp = prevData.teachers;
      //   prev[i] = temp[i]
      // }

      const prev = { ...prevData.teachers, }
      const propertiesArray =
        Object.getOwnPropertyNames(prev);

      const count = propertiesArray.length;
      console.log("lenght", count)

      prev[count] = { teacherName: "", teacherRole: "", teacherPicture: null }





      console.log("prev", prev)
      return ({
        ...prevData,
        teachers:
          prev,


      })
    });
  };

  const handleAddTestimonial = (prevData) => {
    setIndexPageData(() => {



      // for (var i = 0; i < prevData.teachers.length; i++) {
      //   console.log(i)
      //   const temp = prevData.teachers;
      //   prev[i] = temp[i]
      // }

      const prev = { ...prevData.testimonials, }
      const propertiesArray =
        Object.getOwnPropertyNames(prev);

      const count = propertiesArray.length;
      console.log("lenght", count)

      prev[count] = { parentName: "", parentOccupation: "", testimonialText: "", testimonialimg: null }



        console.log("prev", prev)
      return ({
        ...prevData,
        testimonials:
          prev,


      })
    });
  };


  const handleSaveChanges = async () => {
    try {
      const promises = [];
      const promises2 = [];
      console.log("indat1", indexPageData)

      // Check if teachers is defined and not null
      if (indexPageData.teachers) {
        // Convert teachers object to an array
        const teachersArray = Object.keys(indexPageData.teachers).map((key) => {
          const teacher = indexPageData.teachers[key];
          return { key, ...teacher }; // Include the key as a property
        });

        const testimonialsArray = Object.keys(indexPageData.testimonials).map((key) => {
          const testimonial = indexPageData.testimonials[key];
          return { key, ...testimonial }; // Include the key as a property
        });

        console.log("ta", testimonialsArray)

        // Upload teacher pictures to Firebase Storage
        const storageRef = ref(storage, "teacherPictures");
        const storageRef2 = ref(storage, "blogPictures");
        const teacherPicturesPromises = teachersArray.map(async (teacher) => {
          if (teacher.teacherPicture instanceof File) {
            const fileRef = ref(storageRef, `${teacher.teacherName}_${teacher.key}`);
            await uploadBytes(fileRef, teacher.teacherPicture);
            const downloadURL = await getDownloadURL(fileRef);
            return { ...teacher, teacherPicture: downloadURL };
          }
          return teacher;
        });
        const blogPicturesPromises = testimonialsArray.map(async (blog) => {
          if (blog.testimonialimg instanceof File) {
            const fileRef = ref(storageRef2, `${blog.parentName}_${blog.key}`);
            await uploadBytes(fileRef, blog.testimonialimg);
            const downloadURL = await getDownloadURL(fileRef);
            console.log("downurl", downloadURL)
            return { ...blog, testimonialimg: downloadURL };
          }
          return blog;
        });
        promises.push(Promise.all(teacherPicturesPromises));
        promises2.push(Promise.all(blogPicturesPromises));

        // Save data to Firestore
        const docRef = doc(db, "cms", "indexPage");
        const updatedData = await Promise.all(promises);
        const updatedData2 = await Promise.all(promises2);

        console.log(updatedData, "prom")
        console.log(updatedData2, "prom2")

        // Check if teachers is still defined and not null after uploading pictures
        if (updatedData[0]) {
          const updatedTeachersArray = updatedData[0];
          const updatedBlogArray = updatedData2[0];

          // Directly use the updated teachers array
          await updateDoc(docRef, { ...indexPageData, teachers: updatedTeachersArray, testimonials: updatedBlogArray });

          setEditing(false);
          console.log('Data saved successfully!');
        } else {
          console.error(
            "Error saving data: Teachers object is null or undefined."
          );
        }
      } else {
        console.error(
          "Error saving data: Teachers object is null or undefined."
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
      <h1 className="text-4xl font-bold mb-4">CMS Page</h1>
      {indexPageData && (
        <div className="max-w-2xl mx-auto">
          {/* Add Tailwind styles to other elements */}
          <h2 className="text-3xl mb-2">
            {isEditing ? (
              <textarea
                className="border-b-2 w-full border-blue-500 focus:outline-none"
                type="text"
                value={indexPageData.heroTitle}
                onChange={(e) => handleInputChange("heroTitle", e.target.value)}
              />
            ) : (
              indexPageData.heroTitle
            )}
          </h2>
          <p className="mb-4">
            {isEditing ? (
              <textarea
                className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
                type="text"
                rows={4}
                value={indexPageData.heroSubtitle}
                onChange={(e) =>
                  handleInputChange("heroSubtitle", e.target.value)
                }
              />
            ) : (
              indexPageData.heroSubtitle
            )}
          </p>

          {/* Repeat the pattern for other fields */}

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Title"
            >
              Section 1 Title:
            </label>
            {isEditing ? (
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="text"
                id="section1Title"
                value={indexPageData.section1Title}
                onChange={(e) =>
                  handleInputChange("section1Title", e.target.value)
                }
              />
            ) : (
              indexPageData.section1Title
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Text"
            >
              Section 1 Text:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="section1Text"
                value={indexPageData.section1Text}
                onChange={(e) =>
                  handleInputChange("section1Text", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.section1Text}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Title"
            >
              Mission Statement
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="text"
                id="missionText"
                value={indexPageData.missionText}
                onChange={(e) =>
                  handleInputChange("missionText", e.target.value)
                }
              />
            ) : (
              indexPageData.missionText
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Title"
            >
              Vission Statement
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="text"
                id="visionText"
                value={indexPageData.visionText}
                onChange={(e) =>
                  handleInputChange("visionText", e.target.value)
                }
              />
            ) : (
              indexPageData.visionText
            )}
          </div>


          {/* others sections here*/}


          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Title"
            >
              Section 2 Title:
            </label>
            {isEditing ? (
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="text"
                id="section1Title"
                value={indexPageData.section2Title}
                onChange={(e) =>
                  handleInputChange("section2Title", e.target.value)
                }
              />
            ) : (
              indexPageData.section2Title
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Text"
            >
              Section 2 Text:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="section1Text"
                value={indexPageData.section2Text}
                onChange={(e) =>
                  handleInputChange("section2Text", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.section2Text}</p>
            )}
          </div>




          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Title"
            >
              Section 3 Title:
            </label>
            {isEditing ? (
              <input
                className="border border-gray-300 rounded w-full py-2 px-3"
                type="text"
                id="section1Title"
                value={indexPageData.section3Title}
                onChange={(e) =>
                  handleInputChange("section3Title", e.target.value)
                }
              />
            ) : (
              indexPageData.section3Title
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Text"
            >
              Section 3 Sub Text:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="section1Text"
                value={indexPageData.section3Subtitle}
                onChange={(e) =>
                  handleInputChange("section3Subtitle", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.section3Subtitle}</p>
            )}
          </div>


          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Text"
            >
              Section 3 Text:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="section3Text"
                value={indexPageData.section3Text}
                onChange={(e) =>
                  handleInputChange("section3Text", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.section3Text}</p>
            )}
          </div>







          {/* Footer details */}

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="emailfooter"
            >
              Footer Email:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="emailfooter"
                value={indexPageData.emailfooter}
                onChange={(e) =>
                  handleInputChange("emailfooter", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.emailfooter}</p>
            )}
          </div>


          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="phonefooter"
            >
              Footer Phone:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="emailfooter"
                value={indexPageData.phonefooter}
                onChange={(e) =>
                  handleInputChange("phonefooter", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.phonefooter}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="section1Text"
            >
              Footer Facebook Link:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="facebookfooter"
                value={indexPageData.facebookfooter}
                onChange={(e) =>
                  handleInputChange("facebookfooter", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.facebookfooter}</p>
            )}
          </div>



          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="twitterfooter"
            >
              Footer Twitter Link :
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="twitterfooter"
                value={indexPageData.twitterfooter}
                onChange={(e) =>
                  handleInputChange("twitterfooter", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.twitterfooter}</p>
            )}
          </div>


          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="facebookfooter"
            >
              Footer LinkededIn Link:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="linkedinfooter"
                value={indexPageData.linkedinfooter}
                onChange={(e) =>
                  handleInputChange("linkedinfooter", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.linkedinfooter}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-lg font-semibold mb-2"
              htmlFor="instagramfooter"
            >
              Footer Instagram Link:
            </label>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded w-full py-2 px-3"
                id="instagramfooter"
                value={indexPageData.instagramfooter}
                onChange={(e) =>
                  handleInputChange("instagramfooter", e.target.value)
                }
              />
            ) : (
              <p>{indexPageData.instagramfooter}</p>
            )}
          </div>














          {/* Repeat the pattern for other fields */}

          {/* Testimonials */}
          <h2 className="text-2xl mb-2">Blogs</h2>
          <ul>
            {Object.keys(indexPageData.testimonials).map((index) => {
              const testimonial = indexPageData.testimonials[index];
              return (

                <li key={index} className="mb-4">
                  {/* ... Existing code ... */}
                  <div>
                    <label
                      className="block text-lg font-semibold mb-2"
                      htmlFor={`testimonialParentName${index}`}
                    >
                      Post Title:
                    </label>
                    {isEditing ? (
                      <input
                        className="border m-2 border-gray-300 rounded w-full py-2 px-3"
                        type="text"
                        id={`testimonialParentName${index}`}
                        value={testimonial.parentName}
                        onChange={(e) =>
                          handleInputChange(
                            `testimonials.${index}.parentName`,
                            e.target.value,
                            index
                          )
                        }
                      />
                    ) : (
                      testimonial.parentName
                    )}
                  </div>



                  <div className={isEditing ? "flex flex-col justify-center gap-6" : "flex items-center gap-6"}>

                    {isEditing ? (
                      <div className="">
                        <input
                          className="border border-gray-300 text-sm rounded py-2 px-3"
                          type="file"
                          id={`testimonialimg${index}`}
                          onChange={(e) =>
                            handleTestimonialFileInputChange(
                              `testimonialimg`,
                              e.target.files[0],
                              index
                            )
                          }
                        />

                        {testimonial.testimonialimg && (
                          <img
                            className="rounded-full w-12 h-12 mt-2"
                            src={testimonial.testimonialimg}
                          />
                        )}
                      </div>
                    ) : (
                      <img
                        className="rounded-full w-12 h-12"
                        src={testimonial.testimonialimg}
                      />
                    )}




                  </div>






                  <div>
                    <label
                      className="block text-lg font-semibold mb-2"
                      htmlFor={`testimonialText${index}`}
                    >
                      Blog Post detail:
                    </label>
                    {isEditing ? (
                      <textarea
                        className="border border-gray-300 rounded w-full py-2 px-3"
                        id={`testimonialText${index}`}
                        value={testimonial.testimonialText}
                        onChange={(e) =>
                          handleInputChange(
                            `testimonials.${index}.testimonialText`,
                            e.target.value,
                            index
                          )
                        }
                      />
                    ) : (
                      <p>{testimonial.testimonialText}</p>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={() => handleDeleteTestimonial(index)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              )
            })}

            {isEditing && (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={()=>handleAddTestimonial(indexPageData)}
              >
                Add Blog Post
              </button>
            )}
          </ul>

          {/* Teachers */}
          <h2 className="text-2xl mt-8 mb-2">Teachers</h2>
          <ul>
            {Object.keys(indexPageData.teachers).map((key) => {
              const teacher = indexPageData.teachers[key];
              return (
                <li key={key} className="mb-4">
                  <div>
                    <label
                      className="block text-lg font-semibold mb-2"
                      htmlFor={`teacherName${key}`}
                    >
                      Teacher Name:
                    </label>

                    <div className={isEditing ? "flex flex-col justify-center gap-6" : "flex items-center gap-6"}>

                      {isEditing ? (
                        <div className="">
                          <input
                            className="border border-gray-300 text-sm rounded py-2 px-3"
                            type="file"
                            id={`teacherPicture${key}`}
                            onChange={(e) =>
                              handleFileInputChange(
                                `teacherPicture`,
                                e.target.files[0],
                                key
                              )
                            }
                          />

                          {teacher.teacherPicture && (
                            <img
                              className="rounded-full w-12 h-12 mt-2"
                              src={teacher.teacherPicture}
                              alt={teacher.teacherName}
                            />
                          )}
                        </div>
                      ) : (
                        <img
                          className="rounded-full w-12 h-12"
                          src={teacher.teacherPicture}
                          alt={teacher.teacherName}
                        />
                      )}



                      {isEditing ? (
                        <input
                          className="border m-2 border-gray-300 rounded w-full py-2 px-3"
                          type="text"
                          id={`teacherName${key}`}
                          value={teacher.teacherName}
                          onChange={(e) =>
                            handleInputChange(
                              `teachers.${key}.teacherName`,
                              e.target.value,
                              key
                            )
                          }
                        />
                      ) : (
                        `${teacher.teacherName}`
                      )}




                    </div>

                    {isEditing ? (
                      <input
                        className="border m-2 border-gray-300 rounded w-full py-2 px-3"
                        type="text"
                        id={`teacherName${key}`}
                        value={teacher.teacherRole}
                        onChange={(e) =>
                          handleInputChange(
                            `teachers.${key}.teacherRole`,
                            e.target.value,
                            key
                          )
                        }
                      />
                    ) : (
                      `${teacher.teacherRole}`
                    )}


                  </div>
                  <div>


                  </div>

                  {isEditing && (
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded m-2"
                      onClick={() => handleDeleteTeacher(key)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {isEditing && (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => handleAddTeacher(indexPageData)}
            >
              Add Teacher
            </button>
          )}
        </div>
      )}


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

export default CmsIndex;
