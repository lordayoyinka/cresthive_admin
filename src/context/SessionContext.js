import { createContext, useContext, useEffect, useState } from "react";
import { getActiveSession, getAllSessions, TERMS } from "@/firebase/sessions";

const SessionContext = createContext(null);

// Wraps the whole authenticated admin app (see _app.js). Every page reads
// the current session/term from here via useSession() instead of each page
// independently reading its own localStorage key — that's what was causing
// different sections of the app to risk drifting out of sync with each
// other. Change it once here (via the switcher in the sidebar), every page
// sees the new value immediately.
export function SessionProvider({ children }) {
  const [year, setYearState] = useState(null);
  const [term, setTermState] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const allSessions = await getAllSessions();
      setSessions(allSessions);

      const storedYear = localStorage.getItem("adminYear");
      const storedTerm = localStorage.getItem("adminTerm");

      // Only trust a stored choice if that session still actually exists —
      // avoids getting stuck pointing at a session that was renamed/removed.
      const storedYearStillExists =
        storedYear && allSessions.some((s) => s.id === storedYear);

      if (storedYearStillExists && storedTerm) {
        setYearState(storedYear);
        setTermState(storedTerm);
        setLoading(false);
        return;
      }

      const active = await getActiveSession();
      if (active) {
        setYearState(active.id);
        setTermState("1st");
        localStorage.setItem("adminYear", active.id);
        localStorage.setItem("adminTerm", "1st");
      }

      setLoading(false);
    };

    init();
  }, []);

  const setYear = (newYear) => {
    setYearState(newYear);
    localStorage.setItem("adminYear", newYear);
  };

  const setTerm = (newTerm) => {
    setTermState(newTerm);
    localStorage.setItem("adminTerm", newTerm);
  };

  // Called after creating a new session elsewhere in the app, so the
  // switcher's dropdown list updates without needing a full page reload.
  const refreshSessions = async () => {
    const allSessions = await getAllSessions();
    setSessions(allSessions);
  };

  return (
    <SessionContext.Provider
      value={{ year, term, setYear, setTerm, sessions, refreshSessions, loading, TERMS }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession() must be used inside a <SessionProvider>.");
  }
  return ctx;
}
