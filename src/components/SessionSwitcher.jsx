import { useSession } from "@/context/SessionContext";
import { sessionIdToLabel } from "@/firebase/sessions";

const SessionSwitcher = () => {
  const { year, term, setYear, setTerm, sessions, loading, TERMS } = useSession();

  if (loading) {
    return <div className="text-sm text-gray-400">Loading session...</div>;
  }

  if (!year) {
    return (
      <a
        href="/AcademicSessions"
        className="text-sm text-red-600 font-medium underline"
      >
        No academic session yet — create one
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border rounded-md px-2 py-1 bg-white text-gray-700"
      >
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label || sessionIdToLabel(s.id)}
            {s.isActive ? " (active)" : ""}
          </option>
        ))}
      </select>

      <select
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="border rounded-md px-2 py-1 bg-white text-gray-700"
      >
        {TERMS.map((t) => (
          <option key={t} value={t}>
            {t} term
          </option>
        ))}
      </select>
    </div>
  );
};

export default SessionSwitcher;
