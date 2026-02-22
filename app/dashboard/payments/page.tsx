"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

type Payment = {
  paidAmount: number;
  status: "PENDING" | "HALF_PAID" | "FULL_PAID" | "FAILED";
};

type PaymentBooking = {
  id: string;
  subject: string;
  tutor: {
    name: string;
  };
  totalAmount: number;
  status: string; // BookingStatus (not used for payment label)
  paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";
  payments: Payment[];
};

export default function PaymentsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<PaymentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings/student")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading payment information...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#004B4B]">Payments</h1>
        <p className="text-gray-600 text-sm mt-1">
          View your bookings and complete pending payments
        </p>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-6 text-gray-500">No payment records found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FA] text-gray-600">
              <tr>
                <th className="text-left px-6 py-4">Subject</th>
                <th className="text-left px-6 py-4">Tutor</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => {
                /* ===== SAFE AMOUNT CALCULATION ===== */
                const totalPaid = b.payments
  .filter(p => p.status === "HALF_PAID" || p.status === "FULL_PAID")
  .reduce((sum, p) => sum + Number(p.paidAmount), 0);

const remainingAmount = Math.max(b.totalAmount - totalPaid, 0);


                return (
                  <tr key={b.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#004B4B]">
                      {b.subject}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {b.tutor?.name}
                    </td>

                    {/* ===== AMOUNT COLUMN ===== */}
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

                    {/* ===== STATUS BADGE ===== */}
                    <td className="px-6 py-4">
                      <StatusBadge paymentStatus={b.paymentStatus} />
                    </td>

                    {/* ===== ACTION ===== */}
                    <td className="px-6 py-4 text-right">
                      {b.paymentStatus !== "FULLY_PAID" ? (
                        <button
                          onClick={() =>
                            router.push(`/dashboard/payments/${b.id}`)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-[#48A6A7] text-white text-xs font-semibold"
                        >
                          <CreditCard size={14} />
                          Pay Now
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
        )}
      </div>
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
