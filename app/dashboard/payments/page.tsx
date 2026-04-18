// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CreditCard, CheckCircle, Clock } from "lucide-react";

// type Payment = {
//   paidAmount: number;
//   status: "PENDING" | "HALF_PAID" | "FULL_PAID" | "FAILED"| "REMAINING_DUE";
// };

// type PaymentBooking = {
//   id: string;
//   subject: string;
//   tutor: {
//     name: string;
//   };
//   totalAmount: number;
//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
//   payments: Payment[];
// };

// export default function PaymentsPage() {
//   const router = useRouter();
//   const [bookings, setBookings] = useState<PaymentBooking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchBookings() {
//       try {
//         const res = await fetch("/api/bookings/student", {
          
//         });

//         if (!res.ok) {
//           console.error("Booking fetch failed:", await res.text());
//           return;
//         }

//         const data = await res.json();
//         setBookings(data.bookings || []);
//       } catch (err) {
//         console.error("FETCH ERROR:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookings();
//   }, []);

//   if (loading) {
//     return <div className="text-gray-600">Loading payment information...</div>;
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-semibold text-[#004B4B]">Payments</h1>
//         <p className="text-gray-600 text-sm mt-1">
//           View your bookings and complete pending payments
//         </p>
//       </div>

//       <div className="bg-white rounded-2xl border overflow-hidden">
//         {bookings.length === 0 ? (
//           <div className="p-6 text-gray-500">No payment records found.</div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-[#F5F7FA] text-gray-600">
//               <tr>
//                 <th className="text-left px-6 py-4">Subject</th>
//                 <th className="text-left px-6 py-4">Tutor</th>
//                 <th className="text-left px-6 py-4">Amount</th>
//                 <th className="text-left px-6 py-4">Status</th>
//                 <th className="text-right px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {bookings.map((b) => {
//                 const totalPaid = b.payments
//                  .filter(
//   (p) =>
//     p.status === "HALF_PAID" ||
//     p.status === "FULL_PAID" ||
//     p.status === "REMAINING_DUE"   
// )
//                   .reduce((sum, p) => sum + Number(p.paidAmount), 0);

//                 const remainingAmount = Math.max(
//                   b.totalAmount - totalPaid,
//                   0
//                 );

//                 return (
//                   <tr key={b.id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4 font-medium text-[#004B4B]">
//                       {b.subject}
//                     </td>

//                     <td className="px-6 py-4 text-gray-700">
//                       {b.tutor?.name}
//                     </td>

//                     <td className="px-6 py-4 font-semibold">
//                       {b.paymentStatus === "FULLY_PAID" ? (
//                         <span className="text-green-700">
//                           NPR {b.totalAmount}
//                         </span>
//                       ) : b.paymentStatus === "PARTIALLY_PAID" ? (
//                         <span className="text-yellow-700">
//                           Remaining: NPR {remainingAmount}
//                         </span>
//                       ) : (
//                         <>NPR {b.totalAmount}</>
//                       )}
//                     </td>

//                     <td className="px-6 py-4">
//                       <StatusBadge paymentStatus={b.paymentStatus} />
//                     </td>

//                     <td className="px-6 py-4 text-right">
//                       {b.paymentStatus !== "FULLY_PAID" ? (
//                         <button
//                           onClick={() =>
//                             router.push(`/dashboard/payments/${b.id}`)
//                           }
//                           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#48A6A7] text-white text-xs font-semibold"
//                         >
//                           <CreditCard size={14} />
//                           Pay Now
//                         </button>
//                       ) : (
//                         <span className="text-gray-400 text-xs">—</span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= STATUS BADGE ================= */

// function StatusBadge({
//   paymentStatus,
// }: {
//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
// }) {
//   if (paymentStatus === "PARTIALLY_PAID") {
//     return (
//       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
//         <Clock size={14} />
//         Half Paid
//       </span>
//     );
//   }

//   if (paymentStatus === "FULLY_PAID") {
//     return (
//       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
//         <CheckCircle size={14} />
//         Fully Paid
//       </span>
//     );
//   }

//   return (
//     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
//       <Clock size={14} />
//       Pending
//     </span>
//   );
// }



// mock test


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CreditCard, CheckCircle, Clock } from "lucide-react";

// type Payment = {
//   paidAmount: number;
//   status: "PENDING" | "HALF_PAID" | "FULL_PAID" | "FAILED"| "REMAINING_DUE";
// };

// type PaymentBooking = {
//   id: string;
//   subject: string;
//   tutor: {
//     name: string;
//   };
//   totalAmount: number;
//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
//   payments: Payment[];
//   status: "REQUESTED" | "PAYMENT_PENDING" | "READY" | "COMPLETED" | "EXPIRED" | "CANCELLED";
//   startTime: string;
// };

// export default function PaymentsPage() {
//   const router = useRouter();
//   const [pending, setPending] = useState<PaymentBooking[]>([]);
// const [history, setHistory] = useState<PaymentBooking[]>([]);
// const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<"ALL" | "HALF" | "FULL">("ALL");

//   useEffect(() => {
//     async function fetchBookings() {
//       try {
//         const res = await fetch("/api/bookings/student", {
          
//         });

//         if (!res.ok) {
//           console.error("Booking fetch failed:", await res.text());
//           return;
//         }

//         const data = await res.json();
//         setPending(data.pending || []);
// setHistory(data.history || []);
//       } catch (err) {
//         console.error("FETCH ERROR:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookings();
//   }, []);

//   if (loading) {
//     return <div className="text-gray-600">Loading payment information...</div>;
//   }

//  const dataToShow = activeTab === "pending" ? pending : history;

// const filtered = dataToShow.filter((b) => {
//   if (activeTab === "pending") {
//     return (
//       b.paymentStatus === "UNPAID" ||
//       (b.paymentStatus === "PARTIALLY_PAID" &&
//         b.status !== "COMPLETED" &&
//         b.status !== "EXPIRED")
//     );
//   }

//   if (activeTab === "history") {
//     return (
//       b.paymentStatus === "FULLY_PAID" ||
//       (b.paymentStatus === "PARTIALLY_PAID" &&
//         (b.status === "COMPLETED" || b.status === "EXPIRED"))
//     );
//   }

//   return true;
// });

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-semibold text-[#004B4B]">Payments</h1>
//         <p className="text-gray-600 text-sm mt-1">
//           View your bookings and complete pending payments
//         </p>
//       </div>

// <div className="flex gap-4 border-b pb-2">
//   <button
//     onClick={() => setActiveTab("pending")}
//     className={`px-4 py-2 rounded-t-lg text-sm font-semibold ${
//       activeTab === "pending"
//         ? "bg-[#48A6A7] text-white"
//         : "text-gray-500"
//     }`}
//   >
//     Pending Payments
//   </button>

//   <button
//     onClick={() => setActiveTab("history")}
//     className={`px-4 py-2 rounded-t-lg text-sm font-semibold ${
//       activeTab === "history"
//         ? "bg-[#48A6A7] text-white"
//         : "text-gray-500"
//     }`}
//   >
//     Payment History
//   </button>
// </div>


//       <div className="bg-white rounded-2xl border overflow-hidden">
//         { filtered.length === 0 ? (
//           <div className="p-6 text-gray-500">No payment records found.</div>
//         ) : (
          
//           <table className="w-full text-sm">
//             <thead className="bg-[#F5F7FA] text-gray-600">
//               <tr>
//                 <th className="text-left px-6 py-4">Subject</th>
//                 <th className="text-left px-6 py-4">Tutor</th>
//                 <th className="text-left px-6 py-4">Session</th>
//                 <th className="text-left px-6 py-4">Amount</th>
//                 <th className="text-left px-6 py-4">Status</th>
//                 <th className="text-left px-6 py-4">Stage</th>
//                 <th className="text-right px-6 py-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//              {filtered.map((b) => {
//                 const totalPaid = b.payments
//                  .filter(
//   (p) =>
//     p.status === "HALF_PAID" ||
//     p.status === "FULL_PAID" ||
//     p.status === "REMAINING_DUE"   
// )
//                   .reduce((sum, p) => sum + Number(p.paidAmount), 0);

//                 const remainingAmount = Math.max(
//                   b.totalAmount - totalPaid,
//                   0
//                 );

//                 return (
//                   <tr key={b.id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4 font-medium text-[#004B4B]">
//                       {b.subject}
//                     </td>

//                     <td className="px-6 py-4 text-gray-700">
//                       {b.tutor?.name}
//                     </td>

// <td className="px-6 py-4 text-gray-600 text-xs">
//   {new Date(b.startTime).toLocaleDateString()} <br />
//   {new Date(b.startTime).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   })}
// </td>
//                     <td className="px-6 py-4 font-semibold">
//                       {b.paymentStatus === "FULLY_PAID" ? (
//                         <span className="text-green-700">
//                           NPR {b.totalAmount}
//                         </span>
//                       ) : b.paymentStatus === "PARTIALLY_PAID" ? (
//                         <span className="text-yellow-700">
//                           Remaining: NPR {remainingAmount}
//                         </span>
//                       ) : (
//                         <>NPR {b.totalAmount}</>
//                       )}
//                     </td>

//                     <td className="px-6 py-4">
//                       <StatusBadge paymentStatus={b.paymentStatus} />
//                     </td>

// <td className="px-6 py-4">
//   <StageBadge stage={getPaymentStage(b)} />
// </td>

//                     <td className="px-6 py-4 text-right">
//                      {b.paymentStatus !== "FULLY_PAID" ? (
//   <div className="flex justify-end gap-2">

//     {/* REAL PAYMENT */}
//     <button
//       onClick={() =>
//         router.push(`/dashboard/payments/${b.id}`)
//       }
//       className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#48A6A7] text-white text-xs font-semibold"
//     >
//       <CreditCard size={14} />
//       Pay Now
//     </button>

//     {/* 🔥 MOCK PAYMENT */}
//     <button
//       onClick={async () => {
//         try {
//           const res = await fetch("/api/payments/mock", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ bookingId: b.id }),
//           });

//           const data = await res.json();

//           if (!res.ok) {
//             alert(data.error || "Mock failed");
//             return;
//           }

//           alert("Mock payment success ✅");

//           // 🔄 reload list
//           window.location.reload();

//         } catch (err) {
//           console.error("MOCK ERROR:", err);
//           alert("Mock payment failed");
//         }
//       }}
//       className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300"
//     >
//       Mock Pay
//     </button>

//   </div>
// ) : (
//   <span className="text-gray-400 text-xs">—</span>
// )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= STATUS BADGE ================= */

// function StatusBadge({
//   paymentStatus,
// }: {
//   paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
// }) {
//   if (paymentStatus === "PARTIALLY_PAID") {
//     return (
//       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
//         <Clock size={14} />
//         Half Paid
//       </span>
//     );
//   }

//   if (paymentStatus === "FULLY_PAID") {
//     return (
//       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
//         <CheckCircle size={14} />
//         Fully Paid
//       </span>
//     );
//   }

//   return (
//     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
//       <Clock size={14} />
//       Pending
//     </span>
//   );
// }
// function getPaymentStage(b: any) {
//   if (b.paymentStatus === "FULLY_PAID") return "Completed";

//   if (b.paymentStatus === "PARTIALLY_PAID") {
//     if (b.status === "COMPLETED" || b.status === "EXPIRED") {
//       return "Overdue";
//     }
//     return "Before Session";
//   }

//   return "Pending";
// }
// function StageBadge({ stage }: { stage: string }) {
//   if (stage === "Overdue") {
//     return (
//       <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
//         Overdue
//       </span>
//     );
//   }

//   if (stage === "Before Session") {
//     return (
//       <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
//         Before Session
//       </span>
//     );
//   }

//   if (stage === "Completed") {
//     return (
//       <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
//         Completed
//       </span>
//     );
//   }

//   return (
//     <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
//       Pending
//     </span>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

type Payment = {
  paidAmount: number;
  status: "PENDING" | "HALF_PAID" | "FULL_PAID" | "FAILED"| "REMAINING_DUE";
};

type PaymentBooking = {
  id: string;
  subject: string;
  tutor: {
    name: string;
  };
  totalAmount: number;
  paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
  payments: Payment[];
  status: "REQUESTED" | "PAYMENT_PENDING" | "READY" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  startTime: string;
};

export default function PaymentsPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PaymentBooking[]>([]);
const [history, setHistory] = useState<PaymentBooking[]>([]);
const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "HALF" | "FULL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 9;

  useEffect(() => {
    async function fetchBookings() {
      try {
       const res = await fetch("/api/bookings/student", {
  credentials: "include",
});



        if (!res.ok) {
          console.error("Booking fetch failed:", await res.text());
          return;
        }



        const data = await res.json();
        console.log("PAYMENTS API RESPONSE:", data);
        const allBookings = data.bookings || [];

const pendingData = allBookings.filter(
  (b: any) => b.paymentStatus !== "FULLY_PAID"
);

const historyData = allBookings.filter(
  (b: any) => b.paymentStatus === "FULLY_PAID"
);

setPending(pendingData);
setHistory(historyData);

      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
 }, []);

useEffect(() => {
  setCurrentPage(1);
}, [activeTab]);


  if (loading) {
    return <div className="text-gray-600">Loading payment information...</div>;
  }

const dataToShow = activeTab === "pending" ? pending : history;

const filtered =
  activeTab === "pending"
    ? dataToShow.filter((b) => b.paymentStatus !== "FULLY_PAID")
    : dataToShow;
    
    const totalRows = filtered.length;
const totalPages = Math.ceil(totalRows / rowsPerPage);

const startIndex = (currentPage - 1) * rowsPerPage;
const paginatedData = filtered.slice(
  startIndex,
  startIndex + rowsPerPage
);

async function mockPay(id: string, mode: "HALF" | "FULL") {
  try {
    const res = await fetch("/api/payments/mock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: id,
        payMode: mode,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Mock failed");
      return;
    }

    alert("Mock payment success ✅");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Mock failed");
  }
}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#004B4B]">Payments</h1>
        <p className="text-gray-600 text-sm mt-1">
          View your bookings and complete pending payments
        </p>
      </div>

<div className="flex gap-4 border-b pb-2">
  <button
    onClick={() => setActiveTab("pending")}
    className={`px-4 py-2 rounded-t-lg text-sm font-semibold ${
      activeTab === "pending"
        ? "bg-[#48A6A7] text-white"
        : "text-gray-500"
    }`}
  >
    Pending Payments
  </button>

  <button
    onClick={() => setActiveTab("history")}
    className={`px-4 py-2 rounded-t-lg text-sm font-semibold ${
      activeTab === "history"
        ? "bg-[#48A6A7] text-white"
        : "text-gray-500"
    }`}
  >
    Payment History
  </button>
</div>


      <div className="bg-white rounded-2xl border overflow-hidden">
        { filtered.length === 0 ? (
          <div className="p-6 text-gray-500">No payment records found.</div>
        ) : (
          
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FA] text-gray-600">
              <tr>
                <th className="text-left px-6 py-4">Subject</th>
                <th className="text-left px-6 py-4">Tutor</th>
                <th className="text-left px-6 py-4">Session</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Stage</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
             {paginatedData.map((b) => {
                const totalPaid = b.payments
                 .filter(
  (p) =>
    p.status === "HALF_PAID" ||
    p.status === "FULL_PAID" ||
    p.status === "REMAINING_DUE"   
)
                  .reduce((sum, p) => sum + Number(p.paidAmount), 0);

                const remainingAmount = Math.max(
                  b.totalAmount - totalPaid,
                  0
                );

                return (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#004B4B]">
                      {b.subject}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {b.tutor?.name}
                    </td>

<td className="px-6 py-4 text-gray-600 text-xs">
  {new Date(b.startTime).toLocaleDateString()} <br />
  {new Date(b.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>
                    <td className="px-6 py-4 font-semibold">
                      {b.paymentStatus === "FULLY_PAID" ? (
                        <span className="text-green-700">
                          NPR {b.totalAmount}
                        </span>
                      ) : b.paymentStatus === "PARTIALLY_PAID" ? (
                        <span className="text-yellow-700">
                          Remaining: NPR {remainingAmount}
                        </span>
                      ) : (
                        <>NPR {b.totalAmount}</>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge paymentStatus={b.paymentStatus} />
                    </td>

<td className="px-6 py-4">
  <StageBadge stage={getPaymentStage(b)} />
</td>

                    <td className="px-6 py-4 text-right">
                     {b.paymentStatus !== "FULLY_PAID" ? (
  <div className="flex justify-end gap-2">

    {/* REAL PAYMENT */}
    <button
      onClick={() =>
        router.push(`/dashboard/payments/${b.id}`)
      }
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#48A6A7] text-white text-xs font-semibold"
    >
      <CreditCard size={14} />
      Pay Now
    </button>

    {/* 🔥 MOCK PAYMENT */}
    {b.paymentStatus === "UNPAID" && (
  <div className="flex gap-2">

    <button
      onClick={() => mockPay(b.id, "HALF")}
      className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs"
    >
      Mock Half
    </button>

    <button
      onClick={() => mockPay(b.id, "FULL")}
      className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs"
    >
      Mock Full
    </button>

  </div>
)}

{b.paymentStatus === "PARTIALLY_PAID" && (
  <button
    onClick={() => mockPay(b.id, "FULL")}
    className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs"
  >
    Mock Remaining
  </button>
)}

  </div>
) : (
  <span className="text-gray-400 text-xs">—</span>
)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
  <div className="flex justify-between items-center mt-4 text-sm">
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 rounded-full border disabled:opacity-50"
    >
      Prev
    </button>

    <span className="text-gray-600">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      className="px-4 py-2 rounded-full border disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({
  paymentStatus,
}: {
  paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
}) {
  if (paymentStatus === "PARTIALLY_PAID") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        <Clock size={14} />
        Half Paid
      </span>
    );
  }

  if (paymentStatus === "FULLY_PAID") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        <CheckCircle size={14} />
        Fully Paid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
      <Clock size={14} />
      Pending
    </span>
  );
}
function getPaymentStage(b: any) {
  if (b.paymentStatus === "FULLY_PAID") return "Completed";

  if (b.paymentStatus === "PARTIALLY_PAID") {
    if (b.status === "COMPLETED" || b.status === "EXPIRED") {
      return "Overdue";
    }
    return "Before Session";
  }

  return "Pending";
}
function StageBadge({ stage }: { stage: string }) {
  if (stage === "Overdue") {
    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
        Overdue
      </span>
    );
  }

  if (stage === "Before Session") {
    return (
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
        Before Session
      </span>
    );
  }

  if (stage === "Completed") {
    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        Completed
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
      Pending
    </span>
  );
}