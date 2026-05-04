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

const CmsBasic = () => {
  const [basicsPageData, setBasicsPageData] = useState(null);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'cms', 'basicsPage');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists) {
          setBasicsPageData(docSnapshot.data());
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
    setBasicsPageData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddNotable = () => {
    setBasicsPageData((prevData) => ({
      ...prevData,
      notables: [...prevData.notables, ''],
    }));
  };

  const handleUpdateNotable = (index, value) => {
    setBasicsPageData((prevData) => {
      const updatedNotables = [...prevData.notables];
      updatedNotables[index] = value;
      return {
        ...prevData,
        notables: updatedNotables,
      };
    });
  };

  const handleDeleteNotable = (index) => {
    setBasicsPageData((prevData) => ({
      ...prevData,
      notables: prevData.notables.filter((_, i) => i !== index),
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(db, 'cms', 'basicsPage');
      await setDoc(docRef, basicsPageData);
      setEditing(false);
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };











    useEffect(() => {
        // Mock data for indexPage
        const mockBasicsPageData = {
          heroTitle: "Welcome to Our School",
          heroSubtitle: "Providing Quality Education for All",
          videolink: "https://www.pexels.com/video/children-walking-on-a-paved-pathway-with-their-backpacks-3191109/",
          
    
          detailsText:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...",
    
        
          notables: [
            
                "Applies Only To New Applicants.",
                "Payable Per Annum",
                "Non-Refundable And Payable In Full Upon Submission Of The Completed Application Form.",
              ],
          
    
         
        };
    
        // Add mock data to Firestore
        const resave = async () => {
          try {
            const docRef = doc(db, "cms", "basicsPage");
            await setDoc(docRef, mockBasicsPageData);
    
            console.log("Mock data added successfully!");
          } catch (error) {
            console.error("Error adding mock data:", error);
          }
        };

        
      }, []);





      return (
        <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
          <h1 className="text-4xl font-bold mb-4">CMS Basics Page</h1>
          {basicsPageData && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl mb-2">
                {isEditing ? (
                  <textarea
                    className="border-b-2 w-full border-blue-500 focus:outline-none"
                    type="text"
                    value={basicsPageData.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  />
                ) : (
                  basicsPageData.heroTitle
                )}
              </h2>
              <p className="mb-4">
                {isEditing ? (
                  <textarea
                    className="border-2 rounded-lg p-2 my-6 w-full border-blue-500 focus:outline-none"
                    type="text"
                    rows={4}
                    value={basicsPageData.heroSubtitle}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  />
                ) : (
                  basicsPageData.heroSubtitle
                )}
              </p>
    
              {/* Add video link and details text fields here */}
    
              <h2 className="text-2xl mb-2">Notables</h2>
              <ul>
                {basicsPageData.notables.map((notable, index) => (
                  <li key={index} className="mb-4">
                    {isEditing ? (
                      <div className="flex items-center gap-4">
                        <input
                          className="border border-gray-300 rounded py-2 px-3"
                          type="text"
                          value={notable}
                          onChange={(e) => handleUpdateNotable(index, e.target.value)}
                        />
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded"
                          onClick={() => handleDeleteNotable(index)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <p>{notable}</p>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={handleAddNotable}
                >
                  Add Notable
                </button>
              )}

              <p className='w-full justify-end items-end flex'>
    
              {isEditing ? (
                <button className="bg-green-500 m-4 text-white py-2 px-4 rounded" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              ) : (
                <button className="bg-blue-500 m-4 justify-end text-white py-2 px-4 rounded" onClick={() => setEditing(true)}>
                  Edit
                </button>
              )}
              </p>
            </div>
          )}
        </div>
      );
    };
    

export default CmsBasic