// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// /* ===================== TYPES ===================== */
// type TutorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

// interface Tutor {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   subjects: string[];
//   experience?: string | null;
//   photo?: string | null;
//   status: TutorStatus;
// }

// /* ===================== PAGE ===================== */
// export default function AdminTutorManagement() {
//   const [tutors, setTutors] = useState<Tutor[]>([]);
//   const [filter, setFilter] = useState<"ALL" | TutorStatus>("ALL");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchTutors() {
//       try {
//         const res = await fetch("/api/admin/tutors", {
//           method: "GET",
//           cache: "no-store",
//         });
//         const data = await res.json();
//         setTutors(data.tutors || []);
//       } catch {
//         alert("Failed to load tutors");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTutors();
//   }, []);

//   async function updateStatus(id: string, status: TutorStatus) {
//     const res = await fetch("/api/admin/tutors/update-status", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ tutorId: id, status }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.error || "Failed to update status");
//       return;
//     }

//     setTutors((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, status } : t))
//     );

//     alert(data.message);
//   }

//   const filteredTutors = tutors.filter((t) => {
//     const matchesStatus = filter === "ALL" || t.status === filter;
//     const matchesSearch =
//       t.name.toLowerCase().includes(search.toLowerCase()) ||
//       t.email.toLowerCase().includes(search.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-lg animate-pulse">Loading tutors...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 bg-[#F2EFE7] min-h-screen text-[#004B4B]">
//       <h1 className="text-3xl font-bold mb-6">Tutor Management</h1>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-4 gap-4 mb-8">
//         <StatBox label="Total Tutors" value={tutors.length} />
//         <StatBox label="Approved" value={tutors.filter(t => t.status === "APPROVED").length} />
//         <StatBox label="Pending" value={tutors.filter(t => t.status === "PENDING").length} />
//         <StatBox label="Suspended" value={tutors.filter(t => t.status === "SUSPENDED").length} />
//       </div>

//       {/* SEARCH + FILTER */}
//       <div className="flex justify-between mb-4">
//         <input
//           className="px-4 py-2 border rounded w-1/3"
//           placeholder="Search tutors by name or email..."
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <div className="flex gap-2">
//           {["ALL", "PENDING", "APPROVED", "SUSPENDED", "REJECTED"].map((s) => (
//             <FilterButton
//               key={s}
//               label={s}
//               active={filter === s}
//               onClick={() => setFilter(s as any)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* TABLE */}
//       <table className="w-full bg-white shadow rounded">
//         <thead className="bg-[#EFEAE2]">
//           <tr>
//             <th className="p-3">Tutor</th>
//             <th className="p-3">Contact</th>
//             <th className="p-3">Subjects</th>
//             <th className="p-3">Experience</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredTutors.map((t) => (
//             <tr key={t.id} className="border-b">
//               <td className="p-3 flex gap-2 items-center">
//                 <img
//                   src={t.photo || "/default-user.png"}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 {t.name}
//               </td>

//               <td className="p-3">
//                 <div>{t.email}</div>
//                 <div className="text-sm text-gray-600">{t.phone}</div>
//               </td>

//              <td className="p-3">
//   <div className="flex flex-wrap gap-1">
//     {t.subjects.map((s, i) => {
//       const [subject, level] = s.split("|");
//       return (
//         <span
//           key={i}
//           className="px-2 py-1 text-xs bg-[#E6F9F5] text-[#004B4B] rounded"
//         >
//           {subject} ({level})
//         </span>
//       );
//     })}
//   </div>
// </td>

//               <td className="p-3">{t.experience || "—"}</td>
//               <td className="p-3"><StatusBadge status={t.status} /></td>

//               <td className="p-3 flex gap-2">
//                 <Link href={`/admin/tutors/${t.id}`}>
//                   <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 border">
//                     View
//                   </button>
//                 </Link>

//                 {t.status === "PENDING" && (
//                   <>
//                     <ActionButton label="Approve" color="green" onClick={() => updateStatus(t.id, "APPROVED")} />
//                     <ActionButton label="Reject" color="gray" onClick={() => updateStatus(t.id, "REJECTED")} />
//                   </>
//                 )}

//                 {t.status !== "SUSPENDED" && t.status !== "REJECTED" && (
//                   <ActionButton label="Suspend" color="red" onClick={() => updateStatus(t.id, "SUSPENDED")} />
//                 )}

//                 {t.status === "SUSPENDED" && (
//                   <ActionButton label="Reinstate" color="orange" onClick={() => updateStatus(t.id, "APPROVED")} />
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /* ===================== COMPONENTS ===================== */

// function StatBox({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="bg-white shadow p-4 rounded">
//       <div className="text-sm">{label}</div>
//       <div className="text-2xl font-bold">{value}</div>
//     </div>
//   );
// }

// function FilterButton({
//   label,
//   active,
//   onClick,
// }: {
//   label: string;
//   active: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded border ${
//         active ? "bg-[#004B4B] text-white" : "bg-white"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// function StatusBadge({ status }: { status: TutorStatus }) {
//   const styles: Record<TutorStatus, string> = {
//     APPROVED: "bg-green-100 text-green-700 border border-green-300",
//     PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-300",
//     SUSPENDED: "bg-red-100 text-red-700 border border-red-300",
//     REJECTED: "bg-gray-200 text-gray-700 border border-gray-400",
//   };

//   return (
//     <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${styles[status]}`}>
//       {status}
//     </span>
//   );
// }

// function ActionButton({
//   label,
//   color,
//   onClick,
// }: {
//   label: string;
//   color: "green" | "red" | "orange" | "gray";
//   onClick: () => void;
// }) {
//   const styles: Record<string, string> = {
//     green: "bg-green-100 text-green-700 border",
//     red: "bg-red-100 text-red-700 border",
//     orange: "bg-orange-100 text-orange-700 border",
//     gray: "bg-gray-200 text-gray-700 border",
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-full font-medium transition ${styles[color]}`}
//     >
//       {label}
//     </button>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ===================== TYPES ===================== */
type TutorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  experience?: string | null;
  photo?: string | null;
  status: TutorStatus;
}

/* ===================== PAGE ===================== */
export default function AdminTutorManagement() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filter, setFilter] = useState<"ALL" | TutorStatus>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutors() {
      try {
        const res = await fetch("/api/admin/tutors", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        setTutors(data.tutors || []);
      } catch {
        alert("Failed to load tutors");
      } finally {
        setLoading(false);
      }
    }

    fetchTutors();
  }, []);

  async function updateStatus(id: string, status: TutorStatus) {
    const res = await fetch("/api/admin/tutors/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorId: id, status }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update status");
      return;
    }

    setTutors((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );

    alert(data.message);
  }

  const filteredTutors = tutors.filter((t) => {
    const matchesStatus = filter === "ALL" || t.status === filter;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg animate-pulse">Loading tutors...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F2EFE7] min-h-screen text-[#004B4B]">
      <h1 className="text-3xl font-bold mb-6">Tutor Management</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatBox label="Total Tutors" value={tutors.length} />
        <StatBox label="Approved" value={tutors.filter(t => t.status === "APPROVED").length} />
        <StatBox label="Pending" value={tutors.filter(t => t.status === "PENDING").length} />
        <StatBox label="Suspended" value={tutors.filter(t => t.status === "SUSPENDED").length} />
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex justify-between mb-4">
        <input
          className="px-4 py-2 border rounded w-1/3"
          placeholder="Search tutors by name or email..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "SUSPENDED", "REJECTED"].map((s) => (
            <FilterButton
              key={s}
              label={s}
              active={filter === s}
              onClick={() => setFilter(s as any)}
            />
          ))}
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-[#EFEAE2]">
          <tr>
            <th className="p-3">Tutor</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Subjects</th>
            <th className="p-3">Experience</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTutors.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-3 flex gap-2 items-center">
                <img
                  src={t.photo || "/default-user.png"}
                  className="w-10 h-10 rounded-full"
                />
                {t.name}
              </td>

              {/* ✅ CONTACT: ONLY PHONE */}
              <td className="p-3">
                <div className="text-sm">{t.phone}</div>
              </td>

              {/* ✅ SUBJECTS: ONLY SUBJECT NAME */}
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {t.subjects.map((s, i) => {
                    const subject = s.split("|")[0];
                    return (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-[#E6F9F5] text-[#004B4B] rounded"
                      >
                        {subject}
                      </span>
                    );
                  })}
                </div>
              </td>

              <td className="p-3">{t.experience || "—"}</td>
              <td className="p-3">
                <StatusBadge status={t.status} />
              </td>

              <td className="p-3 flex gap-2">
                <Link href={`/admin/tutors/${t.id}`}>
                  <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 border">
                    View
                  </button>
                </Link>

                {t.status === "PENDING" && (
                  <>
                    <ActionButton label="Approve" color="green" onClick={() => updateStatus(t.id, "APPROVED")} />
                    <ActionButton label="Reject" color="gray" onClick={() => updateStatus(t.id, "REJECTED")} />
                  </>
                )}

                {t.status !== "SUSPENDED" && t.status !== "REJECTED" && (
                  <ActionButton label="Suspend" color="red" onClick={() => updateStatus(t.id, "SUSPENDED")} />
                )}

                {t.status === "SUSPENDED" && (
                  <ActionButton label="Reinstate" color="orange" onClick={() => updateStatus(t.id, "APPROVED")} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===================== COMPONENTS ===================== */

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded border ${
        active ? "bg-[#004B4B] text-white" : "bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: TutorStatus }) {
  const styles: Record<TutorStatus, string> = {
    APPROVED: "bg-green-100 text-green-700 border border-green-300",
    PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    SUSPENDED: "bg-red-100 text-red-700 border border-red-300",
    REJECTED: "bg-gray-200 text-gray-700 border border-gray-400",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function ActionButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: "green" | "red" | "orange" | "gray";
  onClick: () => void;
}) {
  const styles: Record<string, string> = {
    green: "bg-green-100 text-green-700 border",
    red: "bg-red-100 text-red-700 border",
    orange: "bg-orange-100 text-orange-700 border",
    gray: "bg-gray-200 text-gray-700 border",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium transition ${styles[color]}`}
    >
      {label}
    </button>
  );
}
