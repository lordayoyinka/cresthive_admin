import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const SubjectReportsPage = () => {
  const [loader, setloader] = useState(false);


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");





  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [subjectDocumentName, setSubjectDocumentName] = useState(null);
  const [subjectData, setSubjectData] = useState(null);

  const dbase = getFirestore();

  // Extract subjectDocumentName from the router query
  useEffect(() => {
    const { subject } = router.query;


    if (subject) {
      setSubjectDocumentName(subject);
    }
  }, [router.query]);

  useEffect(() => {
    // Fetch subject data from Firestore
    const fetchSubjectData = async () => {
      if (subjectDocumentName) {
        const subjectPath = `subjects/${subjectDocumentName}`;
        const subjectDocRef = doc(dbase, year, term, subjectPath);
        const subjectDoc = await getDoc(subjectDocRef);

        if (subjectDoc.exists()) {
          setSubjectData(subjectDoc.data());
        }

      }
    };

    fetchSubjectData();
  }, [dbase, subjectDocumentName]);

  useEffect(() => {
    // Fetch student information based on UIDs in the subject's data
    const fetchStudents = async () => {
      if (subjectData && subjectData.Students) {
        setloader(true)
        const studentPromises = subjectData.Students.map(async (studentUid) => {
          const studentDocRef = doc(dbase, year, term, `students/${studentUid.uid}`);
          const studentDoc = await getDoc(studentDocRef);

          if (studentDoc.exists()) {
            const studentData = studentDoc.data();

            // Find the student's report from the "Reports" array if it exists
            const report = (subjectData.Reports || []).find(
              (report) => report.uid === studentUid.uid
            );

            setloader(false)

            return {
              uid: studentUid.uid,
              name: studentData.fullName || "N/A",
              email: studentData.email || "N/A",
              testScore: report ? report.testScore : 0, // Initialize with the report value, or 0 if not found
              testScore2: report ? report.testScore2 : 0, // Initialize with the report value, or 0 if not found
              examScore: report ? report.examScore : 0, // Initialize with the report value, or 0 if not found
            };
          }

          setloader(false)
          return null;
        });




        const studentResults = await Promise.all(studentPromises);
        setStudents(studentResults.filter((student) => student !== null));

        setloader(false)
      }
    };

    fetchStudents();
  }, [dbase, subjectData]);

  const handleScoreChange = (studentUid, field, value) => {
    const updatedStudents = students.map((student) => {
      if (student.uid === studentUid) {
        return {
          ...student,
          [field]: parseFloat(value),
        };
      }
      return student;
    });

    setStudents(updatedStudents);
  };

  const saveScore = async (studentUid) => {
    if (subjectDocumentName) {
      setloader(true)
      const student = students.find((s) => s.uid === studentUid);

      if (student) {
        const subjectPath = `subjects/${subjectDocumentName}`;
        const subjectDocRef = doc(dbase, year, term, subjectPath);
        const subjectDoc = await getDoc(subjectDocRef);
        let subjectData = subjectDoc.data();

        if (!subjectData.Reports) {
          subjectData.Reports = [];
        }

        const studentReport = {
          uid: studentUid,
          email: student.email,
          testScore: student.testScore,
          testScore2: student.testScore2,
          examScore: student.examScore,
        };

        const existingIndex = subjectData.Reports.findIndex(
          (report) => report.uid === studentUid
        );
        if (existingIndex !== -1) {
          subjectData.Reports[existingIndex] = studentReport;
        } else {
          subjectData.Reports.push(studentReport);
        }

        console.log("nr", subjectData.Reports);

        await updateDoc(subjectDocRef, { Reports: subjectData.Reports });
      }

      setloader(false)
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Subject Reports</h1>
      <div className="mt-8">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300 shadow-md">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Student Name
                  </th>
                  <th className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    1st Test Score
                  </th>
                  <th className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    2nd Test Score
                  </th>
                  <th className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Exam Score
                  </th>
                  <th className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                    Save
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.uid}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      <input
                        type="number"
                        value={student.testScore}
                        onChange={(e) => {
                          const newValue = Math.min(
                            15,
                            parseInt(e.target.value, 10)
                          ); // Limit exam score to a maximum of 70
                          handleScoreChange(student.uid, "testScore", newValue);
                        }}
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      <input
                        type="number"
                        value={student.testScore2}
                        onChange={(e) => {
                          const newValue = Math.min(
                            15,
                            parseInt(e.target.value, 10)
                          ); // Limit exam score to a maximum of 70

                          handleScoreChange(
                            student.uid,
                            "testScore2",
                            newValue
                          );
                        }}
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      <input
                        type="number"
                        value={student.examScore}
                        onChange={(e) => {
                          const newValue = Math.min(
                            70,
                            parseInt(e.target.value, 10)
                          ); // Limit exam score to a maximum of 70

                          handleScoreChange(student.uid, "examScore", newValue);
                        }}
                      />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      {student.testScore + student.testScore2 + student.examScore}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm text-gray-500">
                      <button onClick={() => saveScore(student.uid)}>
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
      </div>
    </div>
  );
};

export default SubjectReportsPage;
