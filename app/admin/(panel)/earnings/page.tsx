"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  student: string;
  tutor: string;
  subject: string;
  amount: number;
  adminCommission: number;
  tutorEarning: number;
  tutorPaid: boolean;
  tutorPaidAt?: string | null;
  bookingStatus: string; // e.g. COMPLETED, CONFIRMED
  date: string;
   refunded?: boolean;
  cancelledBy?: string | null;
};

export default function AdminEarningsPage() {
  const [data, setData] = useState<{
    summary: {
      totalRevenue: number;
      adminEarnings: number;
      tutorEarnings: number;
    };
    rows: Row[];
  } | null>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 9;
const [filter, setFilter] = useState<
  "ALL" | "PENDING" | "READY" | "PAID" | "CANCELLED"
>("ALL");

 function loadData() {
  fetch("/api/admin/earnings")
    .then((res) => res.json())
    .then((res) => {
      setData(res);
      setCurrentPage(1); 
    });
}

  useEffect(() => {
    loadData();
  }, []);

 async function payTutor(bookingId: string) {
    try {
      setLoadingId(bookingId);

      const res = await fetch("/api/admin/earnings/pay-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to pay tutor");
        return;
      }

      loadData(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  if (!data) {
    return (
      <p className="text-gray-500 text-sm">
        Loading earnings information...
      </p>
    );
  }

// ✅ FILTER LOGIC
const filteredRows = data.rows.filter((r) => {
  if (filter === "ALL") return true;

  if (filter === "CANCELLED") return r.refunded;

  if (filter === "PAID") return r.tutorPaid;

  if (filter === "READY")
    return (
      !r.tutorPaid &&
      r.bookingStatus === "COMPLETED" &&
      !r.refunded
    );

  if (filter === "PENDING")
    return (
      !r.tutorPaid &&
      r.bookingStatus !== "COMPLETED" &&
      !r.refunded
    );

  return true;
});

// PAGINATION ON FILTERED DATA
const totalRows = filteredRows.length;
const totalPages = Math.ceil(totalRows / rowsPerPage);

const startIndex = (currentPage - 1) * rowsPerPage;

const paginatedRows = filteredRows.slice(
  startIndex,
  startIndex + rowsPerPage
);


  return (
    <div className="space-y-8 text-[#004B4B]">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Earnings Overview</h1>
        <p className="text-sm text-gray-600">
          Admin commission & tutor payouts
        </p>

        <div className="flex gap-2 mt-4 flex-wrap">
  {[
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Waiting" },
    { key: "READY", label: "Pay Tutor" },
    { key: "PAID", label: "Paid" },
    { key: "CANCELLED", label: "Cancelled" },
  ].map((f) => (
    <button
      key={f.key}
      onClick={() => setFilter(f.key as any)}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
        filter === f.key
          ? "bg-[#004B4B] text-white"
          : "bg-white text-gray-600"
      }`}
    >
      {f.label}
    </button>
  ))}
</div>

      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={`NPR ${data.summary.totalRevenue}`}
        />
        <SummaryCard
          title="Admin Earnings (15%)"
          value={`NPR ${data.summary.adminEarnings}`}
        />
        <SummaryCard
          title="Tutor Earnings (85%)"
          value={`NPR ${data.summary.tutorEarnings}`}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#F2EFE7]">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Tutor</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Paid</th>
              <th className="px-6 py-3 text-left">Tutor (85%)</th>
              <th className="px-6 py-3 text-left">Admin (15%)</th>
             <th className="px-6 py-3 text-left">Tutor Payment</th>
<th className="px-6 py-3 text-left">Booking Status</th>
<th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
           {paginatedRows.map((r) => {
              const canPay =
  !r.tutorPaid &&
  r.bookingStatus === "COMPLETED" &&
  r.amount > 0;

              return (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{r.student}</td>
                  <td className="px-6 py-3">{r.tutor}</td>
                  <td className="px-6 py-3">{r.subject}</td>
                  <td className="px-6 py-3 font-semibold">
                    NPR {r.amount}
                  </td>
                  <td className="px-6 py-3 text-blue-700">
                    NPR {r.tutorEarning}
                  </td>
                  <td className="px-6 py-3 text-green-700">
                    NPR {r.adminCommission}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-3">
            {r.tutorPaid ? (
  <div className="text-green-600 font-semibold">
    Paid ✔
    {r.tutorPaidAt ? (
      <div className="text-xs text-gray-500">
        Paid on {new Date(r.tutorPaidAt).toLocaleDateString()}
      </div>
    ) : (
      <div className="text-xs text-gray-500">
        Paid date not recorded
      </div>
    )}
  </div>
) : (
  <span className="text-yellow-600 font-semibold">Pending</span>
)}

</td>

<td className="px-6 py-3">
  {r.refunded ? (
    <div className="text-red-600 font-semibold">
      Refunded
      {r.cancelledBy && (
        <div className="text-xs text-gray-500">
          Cancelled by {r.cancelledBy}
        </div>
      )}
    </div>
  ) : r.bookingStatus === "COMPLETED" ? (
    <span className="text-green-600 font-semibold">Completed</span>
  ) : (
    <span className="text-gray-500">Active</span>
  )}
</td>

                  {/* ACTION */}
                  <td className="px-6 py-3 text-right">
  {r.refunded ? (
    <span className="text-red-500 text-xs font-semibold">
      Cancelled
    </span>
  ) : !r.tutorPaid ? (
    <button
      disabled={
        loadingId === r.id ||
        r.bookingStatus !== "COMPLETED"
      }
      onClick={() => {
        if (r.bookingStatus !== "COMPLETED") {
          alert(
            "Tutor has not completed the session yet. You can only pay after completion."
          );
          return;
        }
        payTutor(r.id);
      }}
      className="px-4 py-2 rounded-full bg-[#004B4B] text-white text-xs font-semibold disabled:opacity-50"
    >
      {loadingId === r.id
        ? "Processing..."
        : r.bookingStatus !== "COMPLETED"
        ? "Waiting for completion"
        : "Pay Tutor"}
    </button>
  ) : (
    <span className="text-gray-400 text-xs">—</span>
  )}
</td>
                </tr>
              );
            })}
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

/* ================= HELPER ================= */

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
