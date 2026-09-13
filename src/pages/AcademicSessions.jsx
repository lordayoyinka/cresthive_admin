import { useState, useEffect } from "react";
import {
  getAllSessions,
  createSession,
  deleteSession,
  setActiveSession,
  sessionIdToLabel,
} from "@/firebase/sessions";
import { useSession } from "@/context/SessionContext";

const AcademicSessions = () => {
  const { year, refreshSessions, setYear, setTerm } = useSession();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newLabel, setNewLabel] = useState("");
  const [seedFrom, setSeedFrom] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

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

  const handleDelete = async (sessionId, label) => {
    const confirmed = window.confirm(
      `Delete "${label}"? This can't be undone. It will only work if no classes have been added under it yet.`
    );
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(sessionId);

    try {
      const remaining = await deleteSession(sessionId);

      // If the switcher was currently pointed at the session we just
      // deleted, move it to whichever session is active now (if any) so
      // the rest of the admin panel doesn't keep referencing a session
      // that no longer exists.
      if (year === sessionId) {
        const stillActive = remaining.find((s) => s.isActive);
        if (stillActive) {
          setYear(stillActive.id);
          setTerm("1st");
        }
      }

      await refreshSessions();
      await loadSessions();
    } catch (err) {
      console.error(err);
      setDeleteError(err.message || "Something went wrong deleting the session.");
    } finally {
      setDeletingId(null);
    }
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
      {deleteError && <p className="text-red-600 text-sm mb-4 max-w-xl">{deleteError}</p>}
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
              <div className="flex items-center gap-2">
                {!s.isActive && (
                  <button
                    onClick={() => handleSetActive(s.id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  >
                    Set as Active
                  </button>
                )}
                <button
                  onClick={() => handleDelete(s.id, s.label || sessionIdToLabel(s.id))}
                  disabled={deletingId === s.id}
                  className={`py-1 px-3 rounded text-sm text-white ${
                    deletingId === s.id ? "bg-red-300 cursor-not-allowed" : "bg-red-500"
                  }`}
                >
                  {deletingId === s.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicSessions;
