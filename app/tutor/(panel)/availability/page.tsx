// "use client";

// import { useEffect, useMemo, useState } from "react";

// type SessionType = "ONE_TO_ONE" | "GROUP";

// type Slot = {
//   id: string;
//   date: string;
//   subject: string;
//   level?: string | null;
//   startTime: string;
//   endTime: string;
//   durationMin: number;
//   sessionType: SessionType;
//   maxStudents?: number | null;
// };

// function parseSubject(s: string) {
//   const [subject, level] = s.split("|");
//   return { subject, level };
// }

// function formatDate(date: string) {
//   return new Date(date).toLocaleDateString(undefined, {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// export default function TutorAvailabilityPage() {
//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [subjects, setSubjects] = useState<string[]>([]);
//   const [subject, setSubject] = useState("");
//   const [date, setDate] = useState("");
//   const [startTime, setStartTime] = useState("17:00");
//   const [endTime, setEndTime] = useState("18:00");
//   const [durationMin, setDurationMin] = useState(60);
//   const [sessionType, setSessionType] = useState<SessionType>("ONE_TO_ONE");
//   const [maxStudents, setMaxStudents] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const grouped = useMemo(() => {
//     const map: Record<string, Slot[]> = {};
//     slots.forEach((s) => (map[s.date] ||= []).push(s));
//     return map;
//   }, [slots]);

//   async function loadData() {
//     setLoading(true);
//     try {
//       const [slotRes, tutorRes] = await Promise.all([
//         fetch("/api/tutor/availability", { cache: "no-store" }),
//         fetch("/api/tutor/profile"),
//       ]);

//       const slotData = await slotRes.json();
//       const tutorData = await tutorRes.json();

//       setSlots(slotData.slots || []);
//       setSubjects(tutorData?.tutor?.subjects || []);
//       setSubject(tutorData?.tutor?.subjects?.[0] ?? "");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   async function addSlot() {
//     if (!date || !subject) {
//       alert("Please select subject and date");
//       return;
//     }

//     const { subject: parsedSubject, level } = parseSubject(subject);

//     setSubmitting(true);
//     try {
//       const res = await fetch("/api/tutor/availability", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           subject: parsedSubject,
//           level: level || null,
//           date,
//           startTime,
//           endTime,
//           durationMin,
//           sessionType,
//           maxStudents: sessionType === "GROUP" ? maxStudents : null,
//         }),
//       });

//       let data = null;
//       try {
//         data = await res.json();
//       } catch {}

//       if (!res.ok) {
//         alert(data?.error || "Failed to add availability");
//         return;
//       }

//       await loadData();
//       setDate("");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <div className="space-y-8">
//       {/* ADD FORM */}
//       <div className="bg-white border rounded-xl p-6">
//         <h1 className="text-xl font-semibold text-[#004B4B]">
//           Availability & Schedule
//         </h1>

//         <div className="mt-6 grid grid-cols-1 md:grid-cols-7 gap-4">
//           <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
//             {subjects.map((s) => {
//               const { subject, level } = parseSubject(s);
//               return (
//                 <option key={s} value={s}>
//                   {subject} {level && `(${level})`}
//                 </option>
//               );
//             })}
//           </select>

//           <input type="date" className="input" value={date}
//             min={new Date().toISOString().split("T")[0]}
//             onChange={(e) => setDate(e.target.value)} />

//           <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//           <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

//           <select className="input" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))}>
//             <option value={30}>30 min</option>
//             <option value={60}>60 min</option>
//             <option value={90}>90 min</option>
//           </select>

//           <select className="input" value={sessionType} onChange={(e) => setSessionType(e.target.value as SessionType)}>
//             <option value="ONE_TO_ONE">1-to-1</option>
//             <option value="GROUP">Group</option>
//           </select>

//           {sessionType === "GROUP" && (
//             <input type="number" min={2} className="input md:col-span-2"
//               value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} />
//           )}

//           <button onClick={addSlot} disabled={submitting}
//             className="md:col-span-7 px-4 py-2 bg-[#004B4B] text-white rounded-lg">
//             {submitting ? "Adding..." : "Add Availability"}
//           </button>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="bg-white border rounded-xl p-6">
//         <h2 className="font-semibold text-[#004B4B] mb-4">
//           Scheduled Availability
//         </h2>

//         {loading ? (
//           <p>Loading…</p>
//         ) : (
//           Object.keys(grouped).map((date) => (
//             <div key={date} className="border rounded-lg p-4 mb-4">
//               <p className="font-medium mb-2">{formatDate(date)}</p>

//               {grouped[date].map((s) => (
//                 <div key={s.id} className="flex justify-between items-center border px-3 py-2 mb-2">
//                   <span className="text-sm">
//                     <strong>{s.subject}</strong>
//                     {s.level && ` · ${s.level}`} <br />
//                     {s.startTime} – {s.endTime}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";

type SessionType = "ONE_TO_ONE" | "GROUP";

type Slot = {
  id: string;
  date: string;
  subject: string;
  level?: string | null;
  startTime: string;
  endTime: string;
  durationMin: number;
  sessionType: SessionType;
  maxStudents?: number | null;
};

/* =======================
   HELPERS
======================= */

function parseSubject(s: string) {
  const [subject, level] = s.split("|");
  return { subject, level };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* =======================
   COMPONENT
======================= */

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:00");
  const [durationMin, setDurationMin] = useState(60);
  const [sessionType, setSessionType] =
    useState<SessionType>("ONE_TO_ONE");
  const [maxStudents, setMaxStudents] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     GROUP BY DATE
  ======================= */

  const grouped = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    slots.forEach((s) => (map[s.date] ||= []).push(s));
    return map;
  }, [slots]);

  /* =======================
     LOAD DATA
  ======================= */

  async function loadData() {
    setLoading(true);
    try {
      const [slotRes, tutorRes] = await Promise.all([
        fetch("/api/tutor/availability", { cache: "no-store" }),
        fetch("/api/tutor/profile"),
      ]);

      if (!slotRes.ok || !tutorRes.ok) {
        throw new Error("Failed to load data");
      }

      const slotData = await slotRes.json();
      const tutorData = await tutorRes.json();

      setSlots(slotData.slots || []);
      setSubjects(tutorData?.tutor?.subjects || []);
      setSubject(tutorData?.tutor?.subjects?.[0] || "");
    } catch (err) {
      console.error(err);
      setSlots([]);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* =======================
     ADD SLOT
  ======================= */

  async function addSlot() {
    if (!date || !subject) {
      alert("Please select subject and date");
      return;
    }

    const { subject: parsedSubject, level } = parseSubject(subject);

    setSubmitting(true);
    try {
      const res = await fetch("/api/tutor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: parsedSubject,
          level: level || null,
          date,
          startTime,
          endTime,
          durationMin,
          sessionType,
          maxStudents: sessionType === "GROUP" ? maxStudents : null,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        alert(data?.error || "Failed to add availability");
        return;
      }

      await loadData();
      setDate("");
    } finally {
      setSubmitting(false);
    }
  }

  /* =======================
     DELETE SLOT
  ======================= */

  async function deleteSlot(id: string) {
    if (!confirm("Delete this availability slot?")) return;

    const res = await fetch(`/api/tutor/availability?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete availability");
      return;
    }

    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  /* =======================
     UI
  ======================= */

  return (
    <div className="space-y-8">

      {/* ADD FORM */}
      <div className="bg-white border rounded-xl p-6">
        <h1 className="text-xl font-semibold text-[#004B4B]">
          Availability & Schedule
        </h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-7 gap-4">

          {/* SUBJECT */}
          <select
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((s) => {
              const { subject, level } = parseSubject(s);
              return (
                <option key={s} value={s}>
                  {subject} {level && `(${level})`}
                </option>
              );
            })}
          </select>

          {/* DATE */}
          <input
            type="date"
            className="input"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* START */}
          <input
            type="time"
            className="input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          {/* END */}
          <input
            type="time"
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          {/* DURATION */}
          <select
            className="input"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
          >
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
          </select>

          {/* SESSION TYPE */}
          <select
            className="input"
            value={sessionType}
            onChange={(e) =>
              setSessionType(e.target.value as SessionType)
            }
          >
            <option value="ONE_TO_ONE">1-to-1</option>
            <option value="GROUP">Group</option>
          </select>

          {sessionType === "GROUP" && (
            <input
              type="number"
              min={2}
              className="input md:col-span-2"
              value={maxStudents}
              onChange={(e) =>
                setMaxStudents(Number(e.target.value))
              }
            />
          )}

          <button
            onClick={addSlot}
            disabled={submitting}
            className="md:col-span-7 px-4 py-2 bg-[#004B4B] text-white rounded-lg"
          >
            {submitting ? "Adding..." : "Add Availability"}
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-[#004B4B] mb-4">
          Scheduled Availability
        </h2>

        {loading ? (
          <p>Loading…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-gray-500">No availability added yet.</p>
        ) : (
          Object.keys(grouped).map((date) => (
            <div key={date} className="border rounded-lg p-4 mb-4">
              <p className="font-medium mb-2">{formatDate(date)}</p>

              {grouped[date].map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center border px-4 py-2 mb-2 rounded-md"
                >
                <span className="text-sm">
  <strong>{s.subject}</strong>
  {s.level && ` · ${s.level}`}
  <span
    className={`ml-2 px-2 py-[2px] rounded-full text-xs font-medium ${
      s.sessionType === "ONE_TO_ONE"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {s.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
  </span>
  <br />
  {s.startTime} – {s.endTime}
</span>



                  <button
                    onClick={() => deleteSlot(s.id)}
                    className="text-xs px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
