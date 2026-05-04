
import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';

const db = getFirestore();

const CmsAdmissions = () => {
  const [admissionsPageData, setAdmissionsPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cms', 'admissionsPage');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          setAdmissionsPageData(docSnapshot.data());
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
    setAdmissionsPageData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddFee = () => {
    setAdmissionsPageData((prevData) => ({
      ...prevData,
      fees: [...prevData.fees, { feeTitle: '', feeFeatures: [] }],
    }));
  };

  const handleUpdateFeeTitle = (index, value) => {
    setAdmissionsPageData((prevData) => {
      const updatedFees = [...prevData.fees];
      updatedFees[index].feeTitle = value;
      return {
        ...prevData,
        fees: updatedFees,
      };
    });
  };

  const handleAddFeature = (feeIndex) => {
    setAdmissionsPageData((prevData) => {
      const updatedFees = [...prevData.fees];
      updatedFees[feeIndex].feeFeatures.push('');
      return {
        ...prevData,
        fees: updatedFees,
      };
    });
  };

  const handleUpdateFeature = (feeIndex, featureIndex, value) => {
    setAdmissionsPageData((prevData) => {
      const updatedFees = [...prevData.fees];
      updatedFees[feeIndex].feeFeatures[featureIndex] = value;
      return {
        ...prevData,
        fees: updatedFees,
      };
    });
  };

  const handleDeleteFeature = (feeIndex, featureIndex) => {
    setAdmissionsPageData((prevData) => {
      const updatedFees = [...prevData.fees];
      updatedFees[feeIndex].feeFeatures = updatedFees[feeIndex].feeFeatures.filter(
        (_, i) => i !== featureIndex
      );
      return {
        ...prevData,
        fees: updatedFees,
      };
    });
  };


  const handleDeleteFee = (index) => {
    setAdmissionsPageData((prevData) => ({
      ...prevData,
      fees: prevData.fees.filter((_, i) => i !== index),
    }));
  };



  //

  

  const handleAddRequirement = () => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[0].requirements.push('');
      return {
        ...prevData,
        requirements: updatedreq,
      };
    });
  };

  const handleUpdateRequirement = (Index, value) => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[0].requirements[Index] = value;
      return {
        ...prevData,
        requirements: updatedreq,
      };
    });
  };

  const handleDeleteRequirement = (Index) => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[0].requirements = updatedreq[0].requirements.filter(
        (_, i) => i !== Index
      );
      return {
        ...prevData,
        requirements: updatedreq,
      };
    });
  };





  //








   

  const handleAddholiday = () => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[1].holidates.push('');
      return {
        ...prevData,
        holidates: updatedreq,
      };
    });
  };

  const handleUpdateholiday = (Index, value) => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[1].holidates[Index] = value;
      return {
        ...prevData,
        holidates: updatedreq,
      };
    });
  };

  const handleDeleteholiday = (Index) => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[1].holidates = updatedreq[1].requirements.filter(
        (_, i) => i !== Index
      );
      return {
        ...prevData,
        holidates: updatedreq,
      };
    });
  };





    //
   

    const handleAddentrancebasic = () => {
      setAdmissionsPageData((prevData) => {
        const updatedreq = [...prevData.admission];
        updatedreq[2].entrancebasic.push('');
        return {
          ...prevData,
          entrancebasic: updatedreq,
        };
      });
    };
  
    const handleUpdateentrancebasic = (Index, value) => {
      setAdmissionsPageData((prevData) => {
        const updatedreq = [...prevData.admission];
        updatedreq[2].entrancebasic[Index] = value;
        return {
          ...prevData,
          entrancebasic: updatedreq,
        };
      });
    };
  
    const handleDeleteentrancebasic = (Index) => {
      setAdmissionsPageData((prevData) => {
        const updatedreq = [...prevData.admission];
        updatedreq[2].entrancebasic = updatedreq[2].entrancebasic.filter(
          (_, i) => i !== Index
        );
        return {
          ...prevData,
          entrancebasic: updatedreq,
        };
      });
    };
  







      //

   

  const handleAddentrancecollege = () => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[3].entrancecollege.push('');
      return {
        ...prevData,
        entrancecollege: updatedreq,
      };
    });
  };

  const handleUpdateentrancecollege = (Index, value) => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[3].entrancecollege[Index] = value;
      return {
        ...prevData,
        entrancecollege: updatedreq,
      };
    });
  };

  const handleDeleteentrancecollege = (Index) => {
    setAdmissionsPageData((prevData) => {
      const updatedreq = [...prevData.admission];
      updatedreq[3].entrancecollege = updatedreq[3].entrancecollege.filter(
        (_, i) => i !== Index
      );
      return {
        ...prevData,
        entrancecollege: updatedreq,
      };
    });
  };








  //

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(db, 'cms', 'admissionsPage');
      await setDoc(docRef, admissionsPageData);
      setEditing(false);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };










  useEffect(() => {
    // Mock data for indexPage
    const mockadmissionsPageData = {
      heroTitle: "Welcome to Our School",
      heroSubtitle: "Providing Quality Education for All",
      heroSubtitletext: "Providing Quality Education for All",

      section1Text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...",

      section2Title: "Our Programs",
      section2Text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...",
      section2subtitle: "Get Involved",

      fees: [
        {
          feeTitle: "John Doe",
          feeFeatures: [
            "Applies Only To New Applicants.",
            "Payable Per Annum",
            "Non-Refundable And Payable In Full Upon Submission Of The Completed Application Form.",
          ],
        },
        {
          feeTitle: "John Doe",
          feeFeatures: [
            "Applies Only To New Applicants.",
            "Payable Per Annum",
            "Non-Refundable And Payable In Full Upon Submission Of The Completed Application Form.",
          ],
        },
      ],


    };

    // Add mock data to Firestore
    const resave = async () => {
      try {
        const docRef = doc(db, "cms", "admissionsPage");
        await setDoc(docRef, mockadmissionsPageData);

        console.log("Mock data added successfully!");
      } catch (error) {
        console.error("Error adding mock data:", error);
      }
    };

    ;
  }, []);

  return (
    <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
      <h1 className="text-4xl font-bold mb-4">CMS Admissions Page</h1>
    

      {/* moving to the other pages */}
      {/* Admission Process page */}


      <div className="mb-4 mt-20">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="admprocessTitle"
        >
          Admission Process Title: - new page
        </label>
        {isEditing ? (
          <input
            className="border border-gray-300 rounded w-full py-2 px-3"
            type="text"
            id="admprocessTitle"
            value={admissionsPageData.admprocessTitle}
            onChange={(e) =>
              handleInputChange("admprocessTitle", e.target.value)
            }
          />
        ) : (
          <p>
            {admissionsPageData && admissionsPageData.admprocessTitle ? (admissionsPageData.admprocessTitle) : "nothing here yet"}
            </p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="section2Text"
        >
          Admission Process Text:
        </label>
        {isEditing ? (
          <textarea
            className="border min-h-32 border-gray-300 rounded w-full py-2 px-3"
            id="section2Text"
            value={admissionsPageData.admprocessText}
            onChange={(e) =>
              handleInputChange("admprocessText", e.target.value)
            }
          />
        ) : (
          <p>{admissionsPageData && admissionsPageData.admprocessText || "nothing here yet"}</p>
        )}
      </div>


      <div>
        <label className="block text-lg font-semibold mb-2">
          Admission Requirements 
        </label>
        <ul>
          {admissionsPageData &&  admissionsPageData.admission[0].requirements && admissionsPageData.admission[0].requirements.map((requirement, index) => (
            <li key={index} className="mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    className="border border-gray-300 rounded py-2 px-3"
                    type="text"
                    value={requirement}
                    onChange={(e) =>
                      handleUpdateRequirement(
                        index,
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      handleDeleteRequirement(index)
                    }
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <p>{requirement}</p>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => handleAddRequirement()}
          >
            Add requirements
          </button>
        )}
      </div>





  {/* moving to the other pages */}
      {/* Holidays page */}


      <div className="mb-4 mt-20">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="holidaysystemTitle"
        >
          Holidays System: Title
        </label>
        {isEditing ? (
          <input
            className="border border-gray-300 rounded w-full py-2 px-3"
            type="text"
            id="holidaysystemTitle"
            value={admissionsPageData.holidaysystemTitle}
            onChange={(e) =>
              handleInputChange("holidaysystemTitle", e.target.value)
            }
          />
        ) : (
          <p>
            {admissionsPageData && admissionsPageData.holidaysystemTitle ? (admissionsPageData.holidaysystemTitle) : "nothing here yet"}
            </p>
        )}
      </div>

      <div className="mb-10 mt-6">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="holidaysystemText"
        >
          Holidays System: Text
        </label>
        {isEditing ? (
          <textarea
            className="border min-h-32 border-gray-300 rounded w-full py-2 px-3"
            type="text"
            id="holidaysystemText"
            value={admissionsPageData.holidaysystemText}
            onChange={(e) =>
              handleInputChange("holidaysystemText", e.target.value)
            }
          />
        ) : (
          <p>
            {admissionsPageData && admissionsPageData.holidaysystemText ? (admissionsPageData.holidaysystemText) : "nothing here yet"}
            </p>
        )}
      </div>

     

      <div>
        <label className="block text-lg font-semibold mb-2">
          Holidays list
        </label>
        <ul>
          {admissionsPageData &&  admissionsPageData.admission[1].holidates && admissionsPageData.admission[1].holidates.map((holidate, index) => (
            <li key={index} className="mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    className="border border-gray-300 rounded py-2 px-3"
                    type="text"
                    value={holidate}
                    onChange={(e) =>
                      handleUpdateholiday(
                        index,
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      handleDeleteholiday(index)
                    }
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <p>{holidate}</p>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => handleAddholiday()}
          >
            Add requirements
          </button>
        )}
      </div>


    




      
  {/* moving to the other pages */}
      {/* Entrance page */}


      <div className="mb-4 mt-20">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="entrancesystemTitle"
        >
          Entrance System: Tilte
        </label>
        {isEditing ? (
          <input
            className="border border-gray-300 rounded w-full py-2 px-3"
            type="text"
            id="entrancesystemTitle"
            value={admissionsPageData.entrancesystemTitle}
            onChange={(e) =>
              handleInputChange("entrancesystemTitle", e.target.value)
            }
          />
        ) : (
          <p>
            {admissionsPageData && admissionsPageData.entrancesystemTitle ? (admissionsPageData.entrancesystemTitle) : "nothing here yet"}
            </p>
        )}
      </div>

      
      <div className="mb-10 mt-6">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="entrancesystemTitle"
        >
          Entrance System: Text
        </label>
        {isEditing ? (
          <textarea
            className="border border-gray-300 rounded min-h-32 w-full py-2 px-3"
            type="text"
            id="entrancesystemText"
            value={admissionsPageData.entrancesystemText}
            onChange={(e) =>
              handleInputChange("entrancesystemText", e.target.value)
            }
          />
        ) : (
          <p>
            {admissionsPageData && admissionsPageData.entrancesystemText ? (admissionsPageData.entrancesystemText) : "nothing here yet"}
            </p>
        )}
      </div>

     

      <div>
        <label className="block text-lg font-semibold mb-2">
          Entrance Process For Basic
        </label>
        <ul>
          {admissionsPageData &&  admissionsPageData.admission[2].entrancebasic && admissionsPageData.admission[2].entrancebasic.map((holidate, index) => (
            <li key={index} className="mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    className="border border-gray-300 rounded py-2 px-3"
                    type="text"
                    value={holidate}
                    onChange={(e) =>
                      handleUpdateentrancebasic(
                        index,
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      handleDeleteentrancebasic(index)
                    }
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <p>{holidate}</p>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => handleAddentrancebasic()}
          >
            Add requirements
          </button>
        )}
      </div>


      <div>
        <label className="block text-lg font-semibold mb-2">
          Entrance Process For College
        </label>
        <ul>
          {admissionsPageData &&  admissionsPageData.admission[3].entrancecollege && admissionsPageData.admission[3].entrancecollege.map((holidate, index) => (
            <li key={index} className="mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    className="border border-gray-300 rounded py-2 px-3"
                    type="text"
                    value={holidate}
                    onChange={(e) =>
                      handleUpdateentrancecollege(
                        index,
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      handleDeleteentrancecollege(index)
                    }
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <p>{holidate}</p>
              )}
            </li>
          ))}
        </ul>
        {isEditing && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => handleAddentrancecollege()}
          >
            Add requirements
          </button>
        )}
      </div>












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

export default CmsAdmissions;