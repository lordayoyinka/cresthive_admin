import { useState, useEffect } from "react";
import {
  getAllSessions,
  createSession,
  setActiveSession,
  sessionIdToLabel,
} from "@/firebase/sessions";
import { useSession } from "@/context/SessionContext";

const AcademicSessions = () => {
  const { refreshSessions, setYear, setTerm } = useSession();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newLabel, setNewLabel] = useState("");
  const [seedFrom, setSeedFrom] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const loadSessions = async () => {
    setLoading(true);
    const all = await getAllSessions();
    setSessions(all);
    if (all.length > 0 && !seedFrom) {
      setSeedFrom(all[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newLabel.trim()) {
      setError("Please enter a session label, e.g. 2026/2027");
      return;
    }

    setCreating(true);
    try {
      const newSessionId = await createSession({
        label: newLabel.trim(),
        seedFromSessionId: seedFrom || null,
      });

      // Switch the whole admin panel over to the newly created session
      // right away, and refresh the switcher's dropdown list.
      setYear(newSessionId);
      setTerm("1st");
      await refreshSessions();

      setNewLabel("");
      await loadSessions();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong creating the session.");
    } finally {
      setCreating(false);
    }
  };

  const handleSetActive = async (sessionId) => {
    await setActiveSession(sessionId);
    await refreshSessions();
    await loadSessions();
  };

  return (
    <div className="container mx-auto px-6 overflow-y-auto h-full pb-40 my-8">
      <h1 className="text-4xl font-bold mb-2">Academic Session</h1>
      <p className="text-gray-600 mb-8">
        Create a new academic session when a new year begins. Class names and
        class teachers are copied over from whichever session you choose
        below as a starting point — students are not, and previous sessions
        stay exactly as they are, as historical records.
      </p>

      {/* ---------- Create new session ---------- */}
      <form
        onSubmit={handleCreate}
        className="border-2 rounded-lg p-6 mb-10 max-w-xl"
      >
        <h2 className="text-2xl mb-4">Create New Session</h2>

        <label className="block text-gray-600 mb-1">Session label</label>
        <input
          type="text"
          placeholder="e.g. 2026/2027"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="border-2 rounded-lg p-2 mb-4 w-full border-blue-500 focus:outline-none"
        />

        <label className="block text-gray-600 mb-1">
          Copy classes from (optional)
        </label>
        <select
          value={seedFrom}
          onChange={(e) => setSeedFrom(e.target.value)}
          className="border-2 rounded-lg p-2 mb-4 w-full"
        >
          <option value="">Don't copy — start with no classes</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label || sessionIdToLabel(s.id)}
            </option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={creating}
          className={`text-white py-2 px-4 rounded ${
            creating ? "bg-green-300 cursor-not-allowed" : "bg-green-500"
          }`}
        >
          {creating ? "Creating..." : "Create Session"}
        </button>
      </form>

      {/* ---------- Existing sessions ---------- */}
      <h2 className="text-2xl mb-4">All Sessions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">
          No sessions created yet — create your first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="border-2 rounded-lg p-4 flex items-center justify-between max-w-xl"
            >
              <div>
                <p className="font-semibold">{s.label || sessionIdToLabel(s.id)}</p>
                <p className="text-sm text-gray-500">
                  {s.isActive ? "Active — default for new logins" : "Inactive"}
                </p>
              </div>
              {!s.isActive && (
                <button
                  onClick={() => handleSetActive(s.id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                >
                  Set as Active
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicSessions;
