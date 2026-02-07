// "use client";

// import { useEffect, useMemo, useState } from "react";

// type Student = {
//   id: string;
//   name: string | null;
//   email: string;
//   phone: string | null;
//   grade: string | null;
//   image: string | null;
//   createdAt: string;
//   status: "ACTIVE" | "SUSPENDED";
// };


// type ApiResp = {
//   students: Student[];
//   pagination: {
//     total: number;
//     page: number;
//     pageSize: number;
//     totalPages: number;
//   };
// };

// function formatDate(d: string) {
//   return new Date(d).toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "long",
//     day: "2-digit",
//   });
// }

// function initials(name?: string | null) {
//   if (!name) return "?";
//   const parts = name.split(" ");
//   return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
// }

// export default function AdminStudentsPage() {
//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState<"all" | "active" | "suspended">("all");

//   const [data, setData] = useState<ApiResp | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [actionId, setActionId] = useState<string | null>(null);

//   async function load() {
//     setLoading(true);
//     const res = await fetch(
//       `/api/admin/students?q=${q}&status=${status}&page=1&pageSize=50`
//     );
//     const json = await res.json();
//     setData(json);
//     setLoading(false);
//   }

//   useEffect(() => {
//     load();
//   }, [q, status]);

//   async function toggleSuspend(s: Student) {
//     setActionId(s.id);
//     await fetch(`/api/admin/students/${s.id}/status`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//   isSuspended: s.status === "ACTIVE",
// })

//     });
//     setActionId(null);
//     load();
//   }

//   const total = data?.pagination?.total ?? 0;


//   const showingText = useMemo(() => {
//   if (!data?.pagination) return "";
//   return `Showing ${data.students.length} of ${data.pagination.total} students`;
// }, [data]);


//   return (
//     <div className="space-y-6 text-[#004B4B]">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold">Student Management</h1>
//         <p className="text-sm text-gray-600">
//           Search, filter, and manage student accounts
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="flex items-center gap-3">
//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           placeholder="Search students..."
//           className="border px-3 py-2 rounded w-72"
//         />

//         {["all", "active", "suspended"].map((s) => (
//           <button
//             key={s}
//             onClick={() => setStatus(s as any)}
//             className={`px-4 py-2 rounded border text-sm ${
//               status === s
//                 ? "bg-white border-[#48A6A7] text-[#004B4B]"
//                 : "text-gray-600"
//             }`}
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="bg-white border rounded-xl overflow-hidden">
//         <div className="px-5 py-4 flex justify-between">
//           <h2 className="font-semibold">
//             All Students ({total})
//           </h2>
//           <span className="text-xs text-gray-500">{showingText}</span>
//         </div>

//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="px-6 py-3 text-left">Student</th>
//               <th className="px-6 py-3 text-left">Level</th>
//               <th className="px-6 py-3 text-left">Email / Contact</th>
//               <th className="px-6 py-3 text-left">Joined</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-right">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="px-6 py-6 text-gray-500">
//                   Loading...
//                 </td>
//               </tr>
//             ) : data?.students.length ? (
//               data.students.map((s) => (
//                 <tr key={s.id} className="border-t hover:bg-gray-50">
//                   {/* Student */}
//                   <td className="px-6 py-4 flex items-center gap-3">
//                     {s.image ? (
//                       <img
//                         src={s.image}
//                         className="w-10 h-10 rounded-full object-cover border"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
//                         {initials(s.name)}
//                       </div>
//                     )}
//                     <span className="font-semibold">
//                       {s.name || "Unnamed"}
//                     </span>
//                   </td>

//                   {/* Level */}
//                   <td className="px-6 py-4">
//                     {s.grade || "—"}
//                   </td>

//                   {/* Contact */}
//                   <td className="px-6 py-4">
//                     <div>{s.email}</div>
//                     <div className="text-xs text-gray-500">
//                       {s.phone || "—"}
//                     </div>
//                   </td>

//                   {/* Joined */}
//                   <td className="px-6 py-4">
//                     {formatDate(s.createdAt)}
//                   </td>

//                   {/* Status */}
//                   <td className="px-6 py-4">
//                    {s.status === "SUSPENDED" ? (
//   <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
//     Suspended
//   </span>
// ) : (
//   <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
//     Active
//   </span>
// )}

//                   </td>

//                   {/* Action */}
//                   <td className="px-6 py-4 text-right">
//                     <button
//   disabled={actionId === s.id}
//   onClick={() => toggleSuspend(s)}
//   className={`text-sm font-semibold ${
//     s.status === "SUSPENDED"
//       ? "text-green-700"
//       : "text-red-700"
//   }`}
// >
//   {actionId === s.id
//     ? "Updating..."
//     : s.status === "SUSPENDED"
//     ? "Activate"
//     : "Suspend"}
// </button>

//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="px-6 py-6 text-gray-500">
//                   No students found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  grade: string | null;
  image: string | null;
  createdAt: string;
  status: "ACTIVE" | "SUSPENDED";
};


type ApiResp = {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function initials(name?: string | null) {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function AdminStudentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "suspended">("all");

  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(
      `/api/admin/students?q=${q}&status=${status}&page=1&pageSize=50`
    );
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [q, status]);

  async function toggleSuspend(s: Student) {
    setActionId(s.id);
    await fetch(`/api/admin/students/${s.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  isSuspended: s.status === "ACTIVE",
})

    });
    setActionId(null);
    load();
  }

  const total = data?.pagination?.total ?? 0;


  const showingText = useMemo(() => {
  if (!data?.pagination) return "";
  return `Showing ${data.students.length} of ${data.pagination.total} students`;
}, [data]);


  return (
    <div className="space-y-6 text-[#004B4B]">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Student Management</h1>
        <p className="text-sm text-gray-600">
          Search, filter, and manage student accounts
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search students..."
          className="border px-3 py-2 rounded w-72"
        />

        {["all", "active", "suspended"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s as any)}
            className={`px-4 py-2 rounded border text-sm ${
              status === s
                ? "bg-white border-[#48A6A7] text-[#004B4B]"
                : "text-gray-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-4 flex justify-between">
          <h2 className="font-semibold">
            All Students ({total})
          </h2>
          <span className="text-xs text-gray-500">{showingText}</span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Level</th>
              <th className="px-6 py-3 text-left">Email / Contact</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

         <tbody>
  {loading ? (
    <tr>
      <td colSpan={6} className="px-6 py-6 text-gray-500">
        Loading...
      </td>
    </tr>
  ) : data?.students?.length ? (
    data.students.map((s) => (
      <tr key={s.id} className="border-t hover:bg-gray-50">
        {/* Student */}
        <td className="px-6 py-4 flex items-center gap-3">
          {s.image ? (
            <img
              src={s.image}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
              {initials(s.name)}
            </div>
          )}
          <span className="font-semibold">{s.name || "Unnamed"}</span>
        </td>

        <td className="px-6 py-4">{s.grade || "—"}</td>

        <td className="px-6 py-4">
          <div>{s.email}</div>
          <div className="text-xs text-gray-500">{s.phone || "—"}</div>
        </td>

        <td className="px-6 py-4">{formatDate(s.createdAt)}</td>

        <td className="px-6 py-4">
          {s.status === "SUSPENDED" ? (
            <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
              Suspended
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
              Active
            </span>
          )}
        </td>

        <td className="px-6 py-4 text-right">
          <button
            disabled={actionId === s.id}
            onClick={() => toggleSuspend(s)}
            className={`text-sm font-semibold ${
              s.status === "SUSPENDED"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {actionId === s.id
              ? "Updating..."
              : s.status === "SUSPENDED"
              ? "Activate"
              : "Suspend"}
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="px-6 py-6 text-gray-500">
        No students found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
