// // "use client";

// // import { useEffect, useMemo, useState } from "react";

// // type DayOfWeek =
// //   | "MONDAY"
// //   | "TUESDAY"
// //   | "WEDNESDAY"
// //   | "THURSDAY"
// //   | "FRIDAY"
// //   | "SATURDAY"
// //   | "SUNDAY";

// // type Slot = {
// //   id: string;
// //   dayOfWeek: DayOfWeek;
// //   startTime: string; // HH:MM
// //   endTime: string;   // HH:MM
// //   durationMin: number;
// //   isActive: boolean;
// // };

// // const DAY_LABEL: Record<DayOfWeek, string> = {
// //   MONDAY: "Monday",
// //   TUESDAY: "Tuesday",
// //   WEDNESDAY: "Wednesday",
// //   THURSDAY: "Thursday",
// //   FRIDAY: "Friday",
// //   SATURDAY: "Saturday",
// //   SUNDAY: "Sunday",
// // };

// // export default function TutorAvailabilityPage() {
// //   const [slots, setSlots] = useState<Slot[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // form
// //   const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
// //   const [startTime, setStartTime] = useState("17:00");
// //   const [endTime, setEndTime] = useState("20:00");
// //   const [durationMin, setDurationMin] = useState(60);

// //   const grouped = useMemo(() => {
// //     const map: Record<string, Slot[]> = {};
// //     for (const s of slots) {
// //       (map[s.dayOfWeek] ||= []).push(s);
// //     }
// //     return map as Record<DayOfWeek, Slot[]>;
// //   }, [slots]);

// //   async function loadSlots() {
// //     setLoading(true);
// //     try {
// //       const res = await fetch("/api/tutor/availability", { cache: "no-store" });

// //       // if server returns html or empty, this prevents JSON crash
// //       const text = await res.text();
// //       const data = text ? JSON.parse(text) : null;

// //       if (!res.ok) {
// //         alert(data?.error || "Failed to load availability");
// //         setSlots([]);
// //         return;
// //       }

// //       setSlots(data?.slots || []);
// //     } catch (e) {
// //       console.error(e);
// //       alert("Failed to load availability (server error)");
// //       setSlots([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     loadSlots();
// //   }, []);

// //   async function addSlot() {
// //     try {
// //       const res = await fetch("/api/tutor/availability", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ dayOfWeek, startTime, endTime, durationMin }),
// //       });

// //       const text = await res.text();
// //       const data = text ? JSON.parse(text) : null;

// //       if (!res.ok) {
// //         alert(data?.error || "Failed to add availability");
// //         return;
// //       }

// //       await loadSlots();
// //     } catch (e) {
// //       console.error(e);
// //       alert("Failed to add availability");
// //     }
// //   }

// //   async function deleteSlot(id: string) {
// //     if (!confirm("Delete this slot?")) return;

// //     try {
// //       const res = await fetch(`/api/tutor/availability?id=${id}`, {
// //         method: "DELETE",
// //       });

// //       const text = await res.text();
// //       const data = text ? JSON.parse(text) : null;

// //       if (!res.ok) {
// //         alert(data?.error || "Failed to delete slot");
// //         return;
// //       }

// //       await loadSlots();
// //     } catch (e) {
// //       console.error(e);
// //       alert("Failed to delete slot");
// //     }
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="bg-white border rounded-xl p-6">
// //         <h1 className="text-xl font-semibold text-[#004B4B]">Availability & Schedule</h1>
// //         <p className="text-sm text-gray-600 mt-1">
// //           Set your weekly availability. Students can only book inside these slots.
// //         </p>

// //         {/* Add form */}
// //         <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
// //           <div className="md:col-span-1">
// //             <label className="text-xs text-gray-600">Day</label>
// //             <select
// //               className="w-full border rounded-lg px-3 py-2"
// //               value={dayOfWeek}
// //               onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
// //             >
// //               {Object.keys(DAY_LABEL).map((d) => (
// //                 <option key={d} value={d}>
// //                   {DAY_LABEL[d as DayOfWeek]}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label className="text-xs text-gray-600">Start</label>
// //             <input
// //               className="w-full border rounded-lg px-3 py-2"
// //               value={startTime}
// //               onChange={(e) => setStartTime(e.target.value)}
// //               placeholder="17:00"
// //             />
// //           </div>

// //           <div>
// //             <label className="text-xs text-gray-600">End</label>
// //             <input
// //               className="w-full border rounded-lg px-3 py-2"
// //               value={endTime}
// //               onChange={(e) => setEndTime(e.target.value)}
// //               placeholder="20:00"
// //             />
// //           </div>

// //           <div>
// //             <label className="text-xs text-gray-600">Duration</label>
// //             <select
// //               className="w-full border rounded-lg px-3 py-2"
// //               value={durationMin}
// //               onChange={(e) => setDurationMin(Number(e.target.value))}
// //             >
// //               <option value={30}>30 min</option>
// //               <option value={60}>60 min</option>
// //               <option value={90}>90 min</option>
// //             </select>
// //           </div>

// //           <button
// //             onClick={addSlot}
// //             className="px-4 py-2 rounded-lg bg-[#4CB6B6] text-white font-medium hover:bg-[#3fa7a7] transition"
// //           >
// //             Add Availability
// //           </button>
// //         </div>
// //       </div>

// //       {/* List */}
// //       <div className="bg-white border rounded-xl p-6">
// //         <h2 className="font-semibold text-[#004B4B] mb-3">Your Weekly Slots</h2>

// //         {loading ? (
// //           <p className="text-sm text-gray-500">Loading...</p>
// //         ) : slots.length === 0 ? (
// //           <p className="text-sm text-gray-500">No availability set yet.</p>
// //         ) : (
// //           <div className="space-y-3">
// //             {(Object.keys(DAY_LABEL) as DayOfWeek[]).map((d) => {
// //               const daySlots = grouped[d] || [];
// //               if (daySlots.length === 0) return null;

// //               return (
// //                 <div key={d} className="border rounded-xl p-4">
// //                   <p className="font-medium text-[#004B4B]">{DAY_LABEL[d]}</p>

// //                   <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
// //                     {daySlots.map((s) => (
// //                       <div
// //                         key={s.id}
// //                         className="flex items-center justify-between border rounded-lg px-3 py-2"
// //                       >
// //                         <div className="text-sm">
// //                           <span className="font-medium">{s.startTime}</span> –{" "}
// //                           <span className="font-medium">{s.endTime}</span>{" "}
// //                           <span className="text-gray-500">({s.durationMin}m)</span>
// //                         </div>

// //                         <button
// //                           onClick={() => deleteSlot(s.id)}
// //                           className="text-xs px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
// //                         >
// //                           Delete
// //                         </button>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useMemo, useState } from "react";

// /* =======================
//    TYPES
// ======================= */

// type DayOfWeek =
//   | "MONDAY"
//   | "TUESDAY"
//   | "WEDNESDAY"
//   | "THURSDAY"
//   | "FRIDAY"
//   | "SATURDAY"
//   | "SUNDAY";

// type SessionType = "ONE_TO_ONE" | "GROUP";

// type Slot = {
//   id: string;
//   dayOfWeek: DayOfWeek;
//   startTime: string;
//   endTime: string;
//   durationMin: number;
//   sessionType: SessionType;
//   maxStudents?: number | null;
//   isActive: boolean;
// };

// /* =======================
//    CONSTANTS
// ======================= */

// const DAY_LABEL: Record<DayOfWeek, string> = {
//   MONDAY: "Monday",
//   TUESDAY: "Tuesday",
//   WEDNESDAY: "Wednesday",
//   THURSDAY: "Thursday",
//   FRIDAY: "Friday",
//   SATURDAY: "Saturday",
//   SUNDAY: "Sunday",
// };

// export default function TutorAvailabilityPage() {
//   const [slots, setSlots] = useState<Slot[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* =======================
//      FORM STATE
//   ======================= */

//   const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
//   const [startTime, setStartTime] = useState("17:00");
//   const [endTime, setEndTime] = useState("20:00");
//   const [durationMin, setDurationMin] = useState(60);
//   const [sessionType, setSessionType] =
//     useState<SessionType>("ONE_TO_ONE");
//   const [maxStudents, setMaxStudents] = useState(5);

//   /* =======================
//      GROUPED VIEW
//   ======================= */

//   const grouped = useMemo(() => {
//     const map: Record<string, Slot[]> = {};
//     for (const s of slots) {
//       (map[s.dayOfWeek] ||= []).push(s);
//     }
//     return map as Record<DayOfWeek, Slot[]>;
//   }, [slots]);

//   /* =======================
//      LOAD AVAILABILITY
//   ======================= */

//   async function loadSlots() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/tutor/availability", {
//         cache: "no-store",
//       });

//       const text = await res.text();
//       const data = text ? JSON.parse(text) : null;

//       if (!res.ok) {
//         alert(data?.error || "Failed to load availability");
//         setSlots([]);
//         return;
//       }

//       setSlots(data?.slots || []);
//     } catch (e) {
//       console.error(e);
//       alert("Failed to load availability");
//       setSlots([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadSlots();
//   }, []);

//   /* =======================
//      ADD SLOT
//   ======================= */

//   async function addSlot() {
//     try {
//       const res = await fetch("/api/tutor/availability", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           dayOfWeek,
//           startTime,
//           endTime,
//           durationMin,
//           sessionType,
//           maxStudents:
//             sessionType === "GROUP" ? maxStudents : null,
//         }),
//       });

//       const text = await res.text();
//       const data = text ? JSON.parse(text) : null;

//       if (!res.ok) {
//         alert(data?.error || "Failed to add availability");
//         return;
//       }

//       await loadSlots();
//     } catch (e) {
//       console.error(e);
//       alert("Failed to add availability");
//     }
//   }

//   /* =======================
//      DELETE SLOT
//   ======================= */

//   async function deleteSlot(id: string) {
//     if (!confirm("Delete this slot?")) return;

//     try {
//       const res = await fetch(`/api/tutor/availability?id=${id}`, {
//         method: "DELETE",
//       });

//       const text = await res.text();
//       const data = text ? JSON.parse(text) : null;

//       if (!res.ok) {
//         alert(data?.error || "Failed to delete slot");
//         return;
//       }

//       await loadSlots();
//     } catch (e) {
//       console.error(e);
//       alert("Failed to delete slot");
//     }
//   }

//   /* =======================
//      UI
//   ======================= */

//   return (
//     <div className="space-y-6">

//       {/* ADD FORM */}
//       <div className="bg-white border rounded-xl p-6">
//         <h1 className="text-xl font-semibold text-[#004B4B]">
//           Availability & Schedule
//         </h1>
//         <p className="text-sm text-gray-600 mt-1">
//           Define when and how students can book your sessions.
//         </p>

//         <div className="mt-5 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">

//           {/* DAY */}
//           <div>
//             <label className="text-xs text-gray-600">Day</label>
//             <select
//               className="w-full border rounded-lg px-3 py-2"
//               value={dayOfWeek}
//               onChange={(e) =>
//                 setDayOfWeek(e.target.value as DayOfWeek)
//               }
//             >
//               {Object.keys(DAY_LABEL).map((d) => (
//                 <option key={d} value={d}>
//                   {DAY_LABEL[d as DayOfWeek]}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* START */}
//           <div>
//             <label className="text-xs text-gray-600">Start</label>
//             <input
//               className="w-full border rounded-lg px-3 py-2"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//             />
//           </div>

//           {/* END */}
//           <div>
//             <label className="text-xs text-gray-600">End</label>
//             <input
//               className="w-full border rounded-lg px-3 py-2"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//             />
//           </div>

//           {/* DURATION */}
//           <div>
//             <label className="text-xs text-gray-600">Duration</label>
//             <select
//               className="w-full border rounded-lg px-3 py-2"
//               value={durationMin}
//               onChange={(e) =>
//                 setDurationMin(Number(e.target.value))
//               }
//             >
//               <option value={30}>30 min</option>
//               <option value={60}>60 min</option>
//               <option value={90}>90 min</option>
//             </select>
//           </div>

//           {/* SESSION TYPE */}
//           <div>
//             <label className="text-xs text-gray-600">Session Type</label>
//             <select
//               className="w-full border rounded-lg px-3 py-2"
//               value={sessionType}
//               onChange={(e) =>
//                 setSessionType(e.target.value as SessionType)
//               }
//             >
//               <option value="ONE_TO_ONE">1-to-1</option>
//               <option value="GROUP">Group</option>
//             </select>
//           </div>

//           {/* MAX STUDENTS */}
//           {sessionType === "GROUP" && (
//             <div>
//               <label className="text-xs text-gray-600">
//                 Max Students
//               </label>
//               <input
//                 type="number"
//                 min={2}
//                 max={10}
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={maxStudents}
//                 onChange={(e) =>
//                   setMaxStudents(Number(e.target.value))
//                 }
//               />
//             </div>
//           )}

//           <button
//             onClick={addSlot}
//             className="md:col-span-6 px-4 py-2 rounded-lg bg-[#4CB6B6] text-white font-medium hover:bg-[#3fa7a7]"
//           >
//             Add Availability
//           </button>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="bg-white border rounded-xl p-6">
//         <h2 className="font-semibold text-[#004B4B] mb-3">
//           Your Weekly Slots
//         </h2>

//         {loading ? (
//           <p className="text-sm text-gray-500">Loading…</p>
//         ) : slots.length === 0 ? (
//           <p className="text-sm text-gray-500">
//             No availability set yet.
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {(Object.keys(DAY_LABEL) as DayOfWeek[]).map((d) => {
//               const daySlots = grouped[d] || [];
//               if (daySlots.length === 0) return null;

//               return (
//                 <div key={d} className="border rounded-xl p-4">
//                   <p className="font-medium text-[#004B4B]">
//                     {DAY_LABEL[d]}
//                   </p>

//                   <div className="mt-2 space-y-2">
//                     {daySlots.map((s) => (
//                       <div
//                         key={s.id}
//                         className="flex justify-between items-center border rounded-lg px-3 py-2"
//                       >
//                         <div className="text-sm">
//                           <strong>{s.startTime}</strong> –{" "}
//                           <strong>{s.endTime}</strong>{" "}
//                           <span className="text-gray-500">
//                             ({s.durationMin}m ·{" "}
//                             {s.sessionType === "GROUP"
//                               ? `Group (${s.maxStudents})`
//                               : "1-to-1"}
//                             )
//                           </span>
//                         </div>

//                         <button
//                           onClick={() => deleteSlot(s.id)}
//                           className="text-xs px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";

/* =======================
   TYPES
======================= */
type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type SessionType = "ONE_TO_ONE" | "GROUP";

type Slot = {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  durationMin: number;
  sessionType: SessionType;
  maxStudents?: number | null;
  isActive: boolean;
};

/* =======================
   CONSTANTS
======================= */
const DAY_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     FORM STATE
  ======================= */
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:00");
  const [durationMin, setDurationMin] = useState(60);
  const [sessionType, setSessionType] =
    useState<SessionType>("ONE_TO_ONE");
  const [maxStudents, setMaxStudents] = useState(5);

  /* =======================
     GROUP BY DAY
  ======================= */
  const grouped = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    slots.forEach((s) => {
      (map[s.dayOfWeek] ||= []).push(s);
    });
    return map as Record<DayOfWeek, Slot[]>;
  }, [slots]);

  /* =======================
     LOAD SLOTS
  ======================= */
  async function loadSlots() {
    setLoading(true);
    try {
      const res = await fetch("/api/tutor/availability", {
        cache: "no-store",
      });
      const data = await res.json();
      setSlots(data?.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  /* =======================
     ADD SLOT
  ======================= */
  async function addSlot() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/tutor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayOfWeek,
          startTime,
          endTime,
          durationMin,
          sessionType,
          maxStudents: sessionType === "GROUP" ? maxStudents : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to add availability");
        return;
      }

      await loadSlots();
    } finally {
      setSubmitting(false);
    }
  }

  /* =======================
     DELETE SLOT
  ======================= */
  async function deleteSlot(id: string) {
    if (!confirm("Delete this availability slot?")) return;

    await fetch(`/api/tutor/availability?id=${id}`, {
      method: "DELETE",
    });

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
        <p className="text-sm text-gray-600 mt-1">
          Define when and how students can book your sessions.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-6 gap-4">

          {/* DAY */}
          <select
            className="input"
            value={dayOfWeek}
            onChange={(e) =>
              setDayOfWeek(e.target.value as DayOfWeek)
            }
          >
            {Object.keys(DAY_LABEL).map((d) => (
              <option key={d} value={d}>
                {DAY_LABEL[d as DayOfWeek]}
              </option>
            ))}
          </select>

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
            onChange={(e) =>
              setDurationMin(Number(e.target.value))
            }
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

          {/* MAX STUDENTS */}
          {sessionType === "GROUP" && (
            <input
              type="number"
              min={2}
              max={20}
              className="input"
              value={maxStudents}
              onChange={(e) =>
                setMaxStudents(Number(e.target.value))
              }
            />
          )}

        <button
  onClick={addSlot}
  disabled={submitting}
  className="md:col-span-6 px-4 py-2 rounded-lg bg-[#4CB6B6] text-white font-medium hover:bg-[#3fa7a7] disabled:opacity-50"
>
  {submitting ? "Adding..." : "Add Availability"}
</button>

        </div>
      </div>

      {/* LIST */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-[#004B4B] mb-4">
          Weekly Availability
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-gray-500">
            No availability set yet.
          </p>
        ) : (
          <div className="space-y-4">
            {(Object.keys(DAY_LABEL) as DayOfWeek[]).map((d) => {
              const daySlots = grouped[d] || [];
              if (!daySlots.length) return null;

              return (
                <div key={d} className="border rounded-lg p-4">
                  <p className="font-medium text-[#004B4B] mb-2">
                    {DAY_LABEL[d]}
                  </p>

                  <div className="space-y-2">
                    {daySlots.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between items-center border rounded-md px-3 py-2"
                      >
                        <span className="text-sm">
                          <strong>{s.startTime}</strong> –{" "}
                          <strong>{s.endTime}</strong>{" "}
                          <span className="text-gray-500">
                            ({s.durationMin}m ·{" "}
                            {s.sessionType === "GROUP"
                              ? `Group (${s.maxStudents})`
                              : "1-to-1"}
                            )
                          </span>
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
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
