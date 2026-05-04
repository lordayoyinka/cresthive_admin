import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { isArray } from "lodash";
import Loading from "@/components/Loading";

const SubjectTeachersPage = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [subjectDocumentName, setSubjectDocumentName] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [teachersInClass, setTeachersInClass] = useState([]);

  const [searchText, setSearchText] = useState("");


  const dbase = getFirestore();

  // Extract subjectDocumentName from the router query
  useEffect(() => {
    const { subjectName } = router.query;
    if (subjectName) {
      setSubjectDocumentName(subjectName);
    }
  }, [router.query]);

  const getUidArrayFromDocument = async () => {
    try {
      const path = "subjects/" + subjectDocumentName;
      const docRef = doc(dbase, year, term, path);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const uidArray = data.Teachers;

        return uidArray;
      } else {
        console.log("Document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  useEffect(() => {
    if (subjectDocumentName) {
      const fetchTeachers = async () => {
        setloader(true)
        const uidArray = await getUidArrayFromDocument();
        if (isArray(uidArray)) {
          setTeachersInClass(uidArray);

        }


        if (uidArray) {
          const teachersData = [];

          for (const element of uidArray) {
            if (element.uid) {
              const uid = element.uid;
              const profilePath = `Teachers/${uid}`;
              const teachersRef = doc(dbase, profilePath);
              const teachersSnapshot = await getDoc(teachersRef);

              if (teachersSnapshot.exists) {
                const teacherData = teachersSnapshot.data();
                teachersData.push({
                  id: teachersSnapshot.id,
                  fullName: teacherData.fullName || "N/A",
                  email: teacherData.email || "N/A",
                  age: teacherData.age || "N/A",
                  class: teacherData.class || "N/A",
                  profilePicture:
                    teacherData.profilePicture ||
                    "https://example.com/placeholder-image.png",
                });
              }
            }
          }

          setloader(false)

          setTeachers(teachersData);
        } else {
          setloader(false)
          console.log("UID Array is null or empty.");
        }
      };

      fetchTeachers();

    }
  }, [dbase, subjectDocumentName]);



  const handleDeleteTeacher = async (teacherId) => {
    // Delete the selected teacher from Firestore
    setloader(true)
    await deleteDoc(doc(dbase, "teachers", teacherId));

    // Update the teachers state
    setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));

    // Update the Teachers array in the subject's document
    if (subjectDocumentName) {
      const uidArray = await getUidArrayFromDocument();

      if (uidArray) {
        const updatedUidArray = uidArray.filter(
          (element) => element.uid !== teacherId
        );

        // Update the document with the modified array
        const path = "subjects/" + subjectDocumentName;
        const docRef = doc(dbase, year, term, path);
        await updateDoc(docRef, { Teachers: updatedUidArray });
        setTeachers(updatedUidArray)
      }
    }

    setloader(false)
  };



  // ...
  const [allTeachers, setAllTeachers] = useState([]);

  // Fetch all teachers from the "teachers" collection
  const fetchAllTeachers = async () => {
    setloader(true)
    const teachersCollectionRef = collection(dbase, "Teachers");
    const teachersSnapshot = await getDocs(teachersCollectionRef);
    console.log(teachersSnapshot)


    const teachersData = [];
    teachersSnapshot.forEach((doc) => {
      const teacherData = doc.data();
      teachersData.push({
        id: doc.id,
        fullName: teacherData.fullName || "N/A",
        email: teacherData.email || "N/A",
        age: teacherData.age || "N/A",
        class: teacherData.class || "N/A",
        profilePicture:
          teacherData.profilePicture ||
          "",
      });
    });
    setloader(false)
    setAllTeachers(teachersData);
  };

  useEffect(() => {
    fetchAllTeachers();
  }, [dbase]);

  // ...

  const openAddTeacherModal = () => {
    setIsAddTeacherModalOpen(true);
  };

  const handleAddTeacher = async (selectedTeacher) => {
    if (selectedTeacher) {
      if (subjectDocumentName) {
        setloader(true)
        // Update the "Teachers" array in the subject's document
        const path = "subjects/" + subjectDocumentName;
        const docRef = doc(dbase, year, term, path);
        if (isArray(teachersInClass)) {
          const updatedTeachersArray = [...teachersInClass, { email: selectedTeacher.email, uid: selectedTeacher.id }];

          console.log("selected", selectedTeacher.email)

          try {
            await updateDoc(docRef, { Teachers: updatedTeachersArray });
            setTeachers(updatedTeachersArray)
            closeAddTeacherModal();
          } catch (error) {
            console.error("Error updating document:", error);
          }

        } else {

          console.error("Error updating document at all")
        }

        setloader(false)

      }
    }
  };

  const closeAddTeacherModal = () => {
    setIsAddTeacherModalOpen(false);
  };



  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Teachers</h1>
        </div>
        <button onClick={openAddTeacherModal} className="ml-2 py-2 px-4 bg-blue-500 text-white rounded">
          Add Teacher
        </button>
      </div>
      <div className="mt-8">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 shadow-md">
              {/* Table headers */}
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Profile
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Age
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Class
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Delete
                  </th>
                </tr>
              </thead>
              {/* Table data */}
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <img src={teacher.profilePicture} alt="Profile" className="h-10 w-10 rounded-full" />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                      {teacher.fullName}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {teacher.email}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {teacher.age}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {teacher.class}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-blue-500">
                      <a onClick={() => setIsDeleteConfirmationOpen(true, setTeacherToDelete(teacher))}>
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && teacherToDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">
              Are you sure you want to delete this teacher?
            </p>
            <button onClick={() => setIsDeleteConfirmationOpen(false, setTeacherToDelete(null))} className="bg-gray-500 text-white py-2 px-4 rounded mx-2">
              Cancel
            </button>
            <button onClick={() => {
              handleDeleteTeacher(teacherToDelete.id);
              setIsDeleteConfirmationOpen(false, setTeacherToDelete(null));
            }} className="bg-red-500 text-white py-2 px-4 rounded mx-2">
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddTeacherModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Add Teacher</h2>
            <div className="my-4">
              <input
                type="text"
                placeholder="Search for a teacher"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allTeachers
                .filter((teacher) =>
                  teacher.fullName.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                    <div>
                      {teacher.fullName} - {teacher.email}
                    </div>
                    <button
                      onClick={() => handleAddTeacher(teacher)}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Select
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setIsAddTeacherModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}



      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default SubjectTeachersPage;
