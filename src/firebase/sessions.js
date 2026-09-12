import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { firestore as db } from "./config";

export const TERMS = ["1st", "2nd", "3rd"];

// Turns "2026/2027" into a Firestore-safe id "2026-2027" (collection/document
// IDs can't contain a literal "/"). The slash is kept only in the display
// label shown in dropdowns and on screen.
export function sessionLabelToId(label) {
  return label.trim().replace(/\s*\/\s*/g, "-");
}

export function sessionIdToLabel(sessionId) {
  return sessionId.replace(/-/g, "/");
}

// Returns every academic session that's been created, most recent first.
export async function getAllSessions() {
  const snapshot = await getDocs(
    query(collection(db, "academicSessions"), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Returns the session currently marked as the admin panel's default, or
// null if none has been created/activated yet.
export async function getActiveSession() {
  const snapshot = await getDocs(
    query(collection(db, "academicSessions"), where("isActive", "==", true))
  );
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() };
}

// Marks one session active and every other session inactive. Doesn't touch
// any student/class/term data — this only changes which session the admin
// panel defaults to.
export async function setActiveSession(sessionId) {
  const allSessions = await getAllSessions();
  await Promise.all(
    allSessions.map((s) =>
      setDoc(doc(db, "academicSessions", s.id), { isActive: s.id === sessionId }, { merge: true })
    )
  );
}

// Creates a new academic session and (optionally) copies the class list —
// names and class teachers, NOT students — from a previous session's terms,
// so the admin doesn't have to recreate "Basic 1", "JSS 2" etc. from
// scratch every year. The new classes start empty; students arrive either
// through the Promotion workflow or fresh registration.
export async function createSession({ label, seedFromSessionId }) {
  const sessionId = sessionLabelToId(label);

  const existing = await getDoc(doc(db, "academicSessions", sessionId));
  if (existing.exists()) {
    throw new Error(`A session called "${label}" already exists.`);
  }

  if (seedFromSessionId) {
    await Promise.all(
      TERMS.map(async (term) => {
        const sourceClasses = await getDocs(
          collection(db, seedFromSessionId, term, "classes")
        );
        await Promise.all(
          sourceClasses.docs.map((classDoc) => {
            const data = classDoc.data();
            return setDoc(doc(db, sessionId, term, "classes", classDoc.id), {
              name: data.name || classDoc.id,
              order: data.order ?? null,
              // Carried over as a starting default — easy for the admin to
              // reassign afterward on the Class Teachers page if needed.
              classTeacherId: data.classTeacherId || null,
            });
          })
        );
      })
    );
  } else {
    // No source to copy from — still create the three term documents so
    // the session "exists" and shows up correctly in the UI immediately.
    await Promise.all(
      TERMS.map((term) => setDoc(doc(db, sessionId, term), { placeholder: true }))
    );
  }

  await setDoc(doc(db, "academicSessions", sessionId), {
    label,
    terms: TERMS,
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // The newly created session becomes the default; every other session is
  // explicitly marked inactive so there's never ambiguity about which one
  // the admin panel is showing.
  await setActiveSession(sessionId);

  return sessionId;
}
