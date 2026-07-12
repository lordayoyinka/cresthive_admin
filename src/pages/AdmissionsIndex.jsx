// src/pages/AdmissionsIndex.jsx
//
// Add a nav link to this page from your CMS sidebar (wherever "CMS",
// "Manage Students" etc. are defined) — this file wasn't visible to me,
// so I couldn't wire that link in automatically.

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, writeBatch, orderBy, query, serverTimestamp } from "firebase/firestore";

const db = getFirestore();

// Non-sequential, hard-to-guess so it can't be brute-forced easily.
function generateExamNumber() {
  const year = new Date().getFullYear();
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const code = Array.from(bytes, (b) => b.toString(10).padStart(3, "0").slice(-3)).join("").slice(0, 6);
  return `EX-${year}-${code}`;
}

function generatePasskey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion when typed
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export default function AdmissionsIndex() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPath, setDownloadingPath] = useState(null);
  const [confirmingRef, setConfirmingRef] = useState(null);
  const [deletingRef, setDeletingRef] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deleteAllText, setDeleteAllText] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setApplications(snap.docs.map((d) => d.data()));
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (path, applicationRef) => {
    setDownloadingPath(path);
    try {
      const res = await fetch(`/api/get-admission-pdf?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${applicationRef}-admission-form.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Could not download the PDF. Check the console for details.");
    } finally {
      setDownloadingPath(null);
    }
  };

  const confirmPayment = async (app) => {
    if (!window.confirm(`Confirm payment received for ${app.student?.fullName} (${app.applicationRef})? This will generate their exam credentials and email them.`)) {
      return;
    }

    setConfirmingRef(app.applicationRef);
    try {
      const examNumber = generateExamNumber();
      const passkey = generatePasskey();

      await updateDoc(doc(db, "applications", app.applicationRef), {
        status: "confirmed",
        examNumber,
        passkey,
        confirmedAt: serverTimestamp(),
      });

      const recipientEmail = app.contactEmail;
      const emailRes = await fetch("/api/send-admission-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          studentName: app.student?.fullName,
          applicationRef: app.applicationRef,
          examNumber,
          passkey,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Email send failed:", errText);
        alert("Payment confirmed and credentials generated, but the email failed to send. You can still share the Exam Number/Passkey shown below manually.");
      }

      await loadApplications();
    } catch (err) {
      console.error(err);
      alert("Something went wrong confirming payment. Check the console for details.");
    } finally {
      setConfirmingRef(null);
    }
  };

  const deleteApplication = async (app) => {
    if (!window.confirm(`Delete ${app.student?.fullName}'s application (${app.applicationRef})? This only removes the Firestore record — the documents already committed to GitHub (Cresthivedocument) are NOT deleted and would need removing there separately. This cannot be undone here.`)) {
      return;
    }
    setDeletingRef(app.applicationRef);
    try {
      await deleteDoc(doc(db, "applications", app.applicationRef));
      await loadApplications();
    } catch (err) {
      console.error(err);
      alert("Could not delete this application. Check the console for details.");
    } finally {
      setDeletingRef(null);
    }
  };

  const deleteAllApplications = async () => {
    if (deleteAllText.trim().toUpperCase() !== "DELETE") {
      alert('Type DELETE in the box (exactly, all caps) to confirm.');
      return;
    }
    if (!window.confirm(`This will permanently delete all ${applications.length} application record(s) from Firestore. The documents already committed to GitHub (Cresthivedocument) will NOT be deleted and would need removing there separately. Continue?`)) {
      return;
    }

    setDeletingAll(true);
    try {
      // Firestore batched writes cap at 500 operations, so chunk just in case.
      const chunkSize = 450;
      for (let i = 0; i < applications.length; i += chunkSize) {
        const chunk = applications.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        chunk.forEach((app) => batch.delete(doc(db, "applications", app.applicationRef)));
        await batch.commit();
      }
      setDeleteAllText("");
      await loadApplications();
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting applications. Check the console for details.");
    } finally {
      setDeletingAll(false);
    }
  };

  if (loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Admissions</h2>

      {applications.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 flex-wrap">
          <span className="text-sm text-red-700">
            Danger zone: type <strong>DELETE</strong> to enable bulk delete of all {applications.length} application(s).
          </span>
          <input
            type="text"
            className="border border-red-300 rounded px-2 py-1 text-sm"
            value={deleteAllText}
            onChange={(e) => setDeleteAllText(e.target.value)}
            placeholder="Type DELETE"
          />
          <button
            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
            onClick={deleteAllApplications}
            disabled={deletingAll || deleteAllText.trim().toUpperCase() !== "DELETE"}
          >
            {deletingAll ? "Deleting..." : "Delete All Applications"}
          </button>
        </div>
      )}

      {applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Reference</th>
              <th className="p-2">Student</th>
              <th className="p-2">Class Applying For</th>
              <th className="p-2">Parent Contact</th>
              <th className="p-2">Status</th>
              <th className="p-2">Exam Credentials</th>
              <th className="p-2">Form</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.applicationRef} className="border-b align-top">
                <td className="p-2 font-mono">{app.applicationRef}</td>
                <td className="p-2">{app.student?.fullName}</td>
                <td className="p-2">{app.student?.classApplyingFor}</td>
                <td className="p-2">
                  {app.father?.phone}
                  <br />
                  <span className="text-sm text-gray-500">{app.contactEmail}</span>
                </td>
                <td className="p-2">
                  <span
                    className={
                      app.status === "confirmed"
                        ? "text-green-700 font-semibold"
                        : "text-orange-600 font-semibold"
                    }
                  >
                    {app.status === "confirmed" ? "Payment Confirmed" : "Pending Payment"}
                  </span>
                </td>
                <td className="p-2 font-mono text-sm">
                  {app.status === "confirmed" ? (
                    <>
                      {app.examNumber}
                      <br />
                      {app.passkey}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">
                  {app.documents?.formPdf && (
                    <button
                      className="bg-green-700 text-white px-3 py-1 rounded text-sm"
                      onClick={() => downloadPdf(app.documents.formPdf, app.applicationRef)}
                      disabled={downloadingPath === app.documents.formPdf}
                    >
                      {downloadingPath === app.documents.formPdf ? "Downloading..." : "Download PDF"}
                    </button>
                  )}
                </td>
                <td className="p-2">
                  {app.status !== "confirmed" && (
                    <button
                      className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold"
                      onClick={() => confirmPayment(app)}
                      disabled={confirmingRef === app.applicationRef}
                    >
                      {confirmingRef === app.applicationRef ? "Confirming..." : "Mark as Paid"}
                    </button>
                  )}
                  <button
                    className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold mt-1"
                    onClick={() => deleteApplication(app)}
                    disabled={deletingRef === app.applicationRef}
                  >
                    {deletingRef === app.applicationRef ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
