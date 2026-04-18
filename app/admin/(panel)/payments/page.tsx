"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  student: string;
  tutor: string;
  subject: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
    cancelledBy?: string | null;
};

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 13; 

 useEffect(() => {
  fetch("/api/admin/payments")
    .then((res) => res.json())
    .then((data) => {
      setRows(data.rows || []);
      setCurrentPage(1); 
    })
    .finally(() => setLoading(false));
}, []);


  if (loading) {
    return (
      <p className="text-gray-500 text-sm">
        Loading payment records...
      </p>
    );
  }
  const totalRows = rows.length;
const totalPages = Math.ceil(totalRows / rowsPerPage);

const startIndex = (currentPage - 1) * rowsPerPage;
const paginatedRows = rows.slice(
  startIndex,
  startIndex + rowsPerPage
);

  return (
    <div className="space-y-6 text-[#004B4B]">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-gray-600">
          Student payment history and remaining balances
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">

        
        <table className="w-full text-sm">
          <thead className="bg-[#F2EFE7]">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Tutor</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Paid</th>
              <th className="px-6 py-3 text-left">Remaining</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{r.student}</td>
                <td className="px-6 py-3">{r.tutor}</td>
                <td className="px-6 py-3">{r.subject}</td>
                <td className="px-6 py-3 text-gray-500">
                  {new Date(r.date).toLocaleString()}
                </td>
                <td className="px-6 py-3 font-semibold">
                  NPR {r.totalAmount}
                </td>
                <td className="px-6 py-3 text-green-700">
                  NPR {r.paidAmount}
                </td>
               <td className="px-6 py-3 text-red-600">
  {r.paymentStatus === "REFUNDED"
    ? "-"
    : `NPR ${r.remainingAmount}`}
</td>
                <td className="px-6 py-3">
  <StatusBadge status={r.paymentStatus} />

  {/* ✅ ADD THIS JUST BELOW */}
  {r.cancelledBy && (
    <div className="text-xs text-gray-500 mt-1">
      Cancelled by {r.cancelledBy}
    </div>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
        
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

function StatusBadge({ status }: { status: string }) {

  if (status === "REFUNDED") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Refunded
      </span>
    );
  }

  if (status === "FULLY_PAID") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        Fully Paid
      </span>
    );
  }

  if (status === "PARTIALLY_PAID") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        Partially Paid
      </span>
    );
  }

  if (status === "REFUNDED") {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      Refunded
    </span>
  );
}
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
      Unpaid
    </span>
  );
}