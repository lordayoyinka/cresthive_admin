import { useState, useEffect } from "react";
import XLSX from "xlsx";
import { getFirestore } from "firebase/firestore";
import ExcelJS from "exceljs";
import {
  collection,
  setDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import Loading from "@/components/Loading";

const TokensPage = () => {
  const [loader, setloader] = useState(false);




  const [selectedDocument, setSelectedDocument] = useState("");
  const [fileType, setFileType] = useState("xlsx");
  const [tableData, setTableData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const db = getFirestore();
  const [documentOptions, setDocumentOptions] = useState([]);

  useEffect(() => {
    const fetchDocumentOptions = async () => {
      const documentRef = collection(db, "tokens");

      try {
        setloader(true)
        const querySnapshot = await getDocs(documentRef);
        const documentNames = querySnapshot.docs
          .map((doc) => doc.id) // Get document names (date format)
          .slice(-10) // Get the last 10 documents
          .reverse(); // Reverse the order to show the most recent first

        setDocumentOptions(documentNames);
        console.log("dnd",documentNames)
        handleDocumentChange(documentNames[0])

        
        setloader(false)
      } catch (error) {
        console.error("Error fetching document names:", error);
      }
    };

    fetchDocumentOptions();
  }, []); // Run this effect only once when the component mounts

  const handleDocumentChange = async (eventgotten) => {
    const selectedDate = eventgotten;
    console.log("drd",eventgotten)
    setSelectedDocument(selectedDate);
    const documentRef = doc(db, "tokens", selectedDate);
    console.log(selectedDate);
    const querySnapshot = await getDoc(documentRef);
    const data = querySnapshot.data();
    if (data) {
      console.log(data.tokens);
      try {
        setTableData(data.tokens);
      } catch (error) {
        console.error("there is no token here");
      }
    } else {
      alert("No token");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binary = e.target.result;
        const workbook = new ExcelJS.Workbook();
        const worksheet = await workbook.xlsx.load(binary);
        const data = worksheet.getWorksheet(1).getSheetValues();
        setFileData(data);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = async () => {
    console.log("downloading");
    if (fileType === "xlsx") {
      // Convert data to XLSX format
      const xlsxBuffer = await convertToXLSX(tableData);
      // Create a Blob from the buffer
      const blob = new Blob([xlsxBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "data.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleUpload = async () => {

    setloader(false)
    if (fileData.length === 0) {
      alert("Please upload a file first.");
      return;
    }
    console.log("filedata first", fileData);

    const headers = [fileData[1][1], fileData[1][2], fileData[1][3]];

    if (!headers || headers.some((header) => !header)) {
      console.log("filedata", fileData);
      alert("Column headers must not be empty.");
      return;
    }

    console.log("headers", headers);

    // Check that the expected headers are present
    if (
      headers[0] !== "Tokens" ||
      headers[1] !== "First Name" ||
      headers[2] !== "Last Name"
    ) {
      alert('Column headers must be "Tokens", "First Name", and "Last Name".');
      setloader(false)
      return;
    }

    // Remove the first row (headers) from the data

    const time = new Date().toLocaleTimeString();
    const date = new Date().toDateString();

    const thedate = time + " " + date;
    const documentName = thedate;
    console.log(documentName);

    const documentData = {
      date: new Date(),
      tokens: fileData.map((row) => ({
        tokens: row[1],
        firstName: row[2],
        lastName: row[3],
      })),
    };

    documentData.tokens.shift();

    console.log("checkdata", documentData.tokens);

    const docRef = await setDoc(
      doc(collection(db, "tokens"), documentName),
      documentData
    );

    setDocumentOptions(documentData)

    alert("File uploaded successfully!");
    setloader(false)
  };

  function convertToXLSX(data) {
    console.log("converting data");

    const workbook = new ExcelJS.Workbook();
    console.log("converting");

    const worksheet = workbook.addWorksheet("Sheet 1");
    console.log("convertingg");

    // Add column headers
    const headerRow = worksheet.addRow(Object.keys(data[0]));

    // Add data rows
    data.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });

    const dnd = workbook.xlsx.writeBuffer();
    console.log("converted", dnd);
    // Create a buffer containing the XLSX file
    return workbook.xlsx.writeBuffer();
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-40">
      <div className="flex-col w-full mx-auto p-6">
        <h1 className="text-4xl font-bold mb-14">Tokens Page</h1>

        <div className="mb-4 p-4 rounded-lg pr-10 bg-blue-50 w-full flex space-x-2 items-center">
          <label htmlFor="documentSelect" className="w-fit font-bold">
            Select Document:
          </label>
          <select
            id="documentSelect"
            value={selectedDocument}
            onChange={()=> handleDocumentChange(event.target.value)}
            className="border flex-1 mx-12 p-2 rounded-md bg-gray-100"
          >
            <option>Select a file</option>
            {documentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end p-4 mt-6 mb-4">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            className="border p-2 rounded-md bg-gray-100"
          />
        </div>

        <div className="flex justify-end pr-10 w-full ">
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white p-2 rounded-md mr-2 hover:bg-blue-600"
          >
            Download
          </button>
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Upload
          </button>
        </div>

        <div className="max-h-[400px] overflow-x-auto overscroll-y-auto h-fit mt-8">
          <table className="min-w-full table-auto border border-collapse border-gray-200">
            <thead>
              <tr className="bg-blue-200">
                <th>Tokens</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.tokens}>
                  <td className="border px-4 py-2">{item.tokens}</td>
                  <td className="border px-4 py-2">{item.firstName}</td>
                  <td className="border px-4 py-2">{item.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>
    </div>
  );
};

export default TokensPage;
