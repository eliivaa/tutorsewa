// "use client";

// import { useEffect, useState } from "react";

// type Row = {
//   id: string;
//   student: string;
//   subject: string;
//   sessionType: string;
//   totalAmount: number;
//   tutorEarning: number;
//   status: "PAID" | "PENDING";
//   paidAt?: string | null;
// };

// export default function TutorEarningsPage() {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/tutor/earnings")
//       .then((res) => res.json())
//       .then((data) => setRows(data.rows || []))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return <p className="text-gray-500 text-sm">Loading earnings...</p>;
//   }

//   return (
//     <div className="space-y-6 text-[#004B4B]">
//       <div>
//         <h1 className="text-2xl font-bold">My Earnings</h1>
//         <p className="text-sm text-gray-600">
//           Session-wise payment details
//         </p>
//       </div>

//       <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
//         <table className="w-full text-sm">
//           <thead className="bg-[#F2EFE7]">
//             <tr>
//               <th className="px-6 py-3 text-left">Student</th>
//               <th className="px-6 py-3 text-left">Subject</th>
//               <th className="px-6 py-3 text-left">Session</th>
//               <th className="px-6 py-3 text-left">Total</th>
//               <th className="px-6 py-3 text-left">My Earnings(85%)</th>
//               <th className="px-6 py-3 text-left">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((r) => (
//               <tr key={r.id} className="border-t hover:bg-gray-50">
//                 <td className="px-6 py-3">{r.student}</td>
//                 <td className="px-6 py-3">{r.subject}</td>
//                 <td className="px-6 py-3">
//                   {r.sessionType === "GROUP"
//                     ? "Group Session"
//                     : "1-to-1 Session"}
//                 </td>
//                 <td className="px-6 py-3 font-semibold">
//                   NPR {r.totalAmount}
//                 </td>
//                 <td className="px-6 py-3 text-green-700 font-semibold">
//                   NPR {r.tutorEarning}
//                 </td>
//                 <td className="px-6 py-3">
//                   {r.status === "PAID" ? (
//                     <div className="text-green-600 font-semibold">
//                       Paid ✔
//                       {r.paidAt && (
//                         <div className="text-xs text-gray-500">
//                           {new Date(r.paidAt).toLocaleDateString()}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="text-yellow-600 font-semibold">
//                       Pending
//                     </span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  student: string;
  subject: string;
  sessionType: string;
  totalAmount: number;
  tutorEarning: number;
  status: "PAID" | "PENDING";
  paidAt?: string | null;
};

export default function TutorEarningsPage() {
  const [data, setData] = useState<{
    summary: { totalEarned: number };
    rows: Row[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tutor/earnings")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading earnings...</p>;
  }

  if (!data) return null;

  return (
    <div className="space-y-8 text-[#004B4B]">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">My Earnings</h1>
        <p className="text-sm text-gray-600">
          Session-wise payment details
        </p>
      </div>

      {/* 🔢 SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Earnings (Paid)
          </p>
          <p className="text-2xl font-bold mt-1 text-[#004B4B]">
            NPR {data.summary.totalEarned}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Only sessions already paid by admin
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#F2EFE7]">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Session</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">
                My Earnings (85%)
              </th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{r.student}</td>
                <td className="px-6 py-3">{r.subject}</td>
                <td className="px-6 py-3">
                  {r.sessionType === "GROUP"
                    ? "Group Session"
                    : "1-to-1 Session"}
                </td>
                <td className="px-6 py-3 font-semibold">
                  NPR {r.totalAmount}
                </td>
                <td className="px-6 py-3 text-green-700 font-semibold">
                  NPR {r.tutorEarning}
                </td>
                <td className="px-6 py-3">
                  {r.status === "PAID" ? (
                    <div className="text-green-600 font-semibold">
                      Paid ✔
                      {r.paidAt && (
                        <div className="text-xs text-gray-500">
                          {new Date(r.paidAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
