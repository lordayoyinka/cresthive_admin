import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  SortAscendingIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import DocumentViewer from "@/pages/DocumentViewer";
import Loading from "@/components/Loading";

const ResDocs = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const [documents, setDocuments] = useState([]);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
  const [isAddDocumentPopupOpen, setIsAddDocumentPopupOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);

  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage
  const storageRef = ref(storage, `documents`); // Change 'documents' to your storage path

  const router = useRouter();
  useEffect(() => {
    const { subject } = router.query;
    if (subject) {
      setSubjectName(subject);
    }
  }, [router.query]);



  const loadDocuments = async () => {
    console.log("trying to load");
    try {
      setloader(true)
      const q = collection(db, year, term, `subjects/${subjectName}/documents`); // Change 'documents' to your Firestore collection name;
      const querySnapshot = await getDocs(q);
      console.log("trying to load", querySnapshot);

      const documentList = [];
      querySnapshot.forEach((doc) => {
        documentList.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(documentList);
      setloader(false)
    } catch (error) {
      setloader(false)
      console.error("Error loading documents:", error);
      alert("Error loading documents");
    }
  };

  useEffect(() => {
    // Load existing documents for the subject from Firestore

    loadDocuments();
  }, [db, subjectName]);

  const handleAddDocument = async () => {
    if (newDocumentName && selectedDocumentFile) {
      try {
        setloader(true)
        const documentRef = await addDoc(
          collection(db, year, term, `subjects/${subjectName}/documents`),
          {
            subjectName: subjectName,
            name: newDocumentName,
            date: new Date().toDateString(),
            // Add more fields as needed
          }
        );

        const documentId = documentRef.id;

        // Upload the selected document file to Firebase Storage
        const fileRef = ref(storageRef, documentId);
        await uploadBytes(fileRef, selectedDocumentFile);

        // Get the download URL for the uploaded document
        const downloadURL = await getDownloadURL(fileRef);

        // Update the document with the download URL
        await updateDoc(documentRef, {
          downloadURL: downloadURL,
        });

        // Refresh the documents list
        loadDocuments();
        setloader(false)
      } catch (error) {
        console.error("Error adding document:", error);
      }

      // Reset input fields
      setNewDocumentName("");
      setSelectedDocumentFile(null);

      // Close the add document popup
      setIsAddDocumentPopupOpen(false);
    }
  };

  const handleDocumentClick = (documentUrl) => {
    setSelectedDocument(documentUrl);
    console.log(selectedDocument);

  };

  return (
    <div className="overflow-y-auto flex-col flex h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <div className="flex mb-6">
        

        
      </div>
      <div></div>

      <button
        onClick={() => setIsAddDocumentPopupOpen(true)}
        className="bg-blue-500 text-white py-2 my-6 w-fit items-self-end flex px-4 rounded mx-2"
      >
        Add Document
      </button>

      <div>
        <div className="mb-5 bg-white p-6 rounded-lg">
          <h2 className="font-semibold text-lg pb-4 opacity-50">
            All Documents for {subjectName}
          </h2>

          <ul
            role="list"
            className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-8"
          >
            {documents.map((documentitem) => (

              <li
                key={documentitem.email}
                className="w-full justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow"
              >
                <a


                  onClick={() => handleDocumentClick(documentitem.downloadURL)}
                  href={selectedDocument}


                >

                  <div className="flex-1 flex flex-col p-2">
                    <div className="flex justify-between">
                      <img
                        className="w-12 h-12 flex-shrink-0"
                        src={
                          documentitem.type === "word"
                            ? "/Assets/google-docs.png"
                            : "/Assets/pdf-file.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <h3 className="mt-6 text-gray-900 font-medium">
                        {documentitem.name}
                      </h3>
                      <h3 className="text-red-900 place-content-bottom text-xs font-medium">
                        {documentitem.date}
                      </h3>
                    </div>
                  </div>
                  <div></div>
                </a>
              </li>

            ))}
          </ul>
        </div>
      </div>

      {/* Button to open the Add Document popup */}

      {/* Add Document Popup */}
      {isAddDocumentPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-xl">Add New Document</p>
            <input
              type="text"
              placeholder="Document Name"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              className="border p-2 my-2 w-full"
            />
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={(e) => setSelectedDocumentFile(e.target.files[0])}
              className="border p-2 my-2 w-full"
            />
            <button
              onClick={handleAddDocument}
              className="bg-blue-500 text-white py-2 px-4 rounded mx-2"
            >
              Add Document
            </button>
            <button
              onClick={() => setIsAddDocumentPopupOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded mx-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {
        selectedDocument && (
          <DocumentViewer documentUrl={selectedDocument} />
        )}



      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default ResDocs;
