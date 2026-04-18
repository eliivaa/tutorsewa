"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ================= TYPES ================= */

type BookingStatus =
  | "REQUESTED"
  | "PAYMENT_PENDING"
  | "READY"
  | "COMPLETED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

type SessionType = "ONE_TO_ONE" | "GROUP";

interface Booking {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  sessionType: SessionType;

  bookingDate: string;
  startTime: string;

  subject: string;
  level?: string;

  meetingRoom?: string | null;
  paymentDueAt?: string;

  tutorId: string;

  tutor: {
  name: string;
  photo?: string | null;
  rate?: number | null;
  avgRating?: number | null;
  reviewCount?: number;
  
};
}

/* ================= HELPERS ================= */

function getRemainingTime(due: string) {
  const now = new Date().getTime();
  const end = new Date(due).getTime();

  const diff = end - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${mins}m left`;
}

function getStatusBadge(status: BookingStatus, paymentStatus: PaymentStatus) {
  if (status === "CANCELLED")
    return { text: "CANCELLED", className: "bg-red-100 text-red-700" };

  if (status === "REJECTED")
    return { text: "REJECTED", className: "bg-red-100 text-red-700" };

  if (status === "COMPLETED")
    return { text: "COMPLETED", className: "bg-green-100 text-green-700" };

  if (status === "EXPIRED")
    return { text: "EXPIRED", className: "bg-gray-200 text-gray-600" };

  if (paymentStatus === "PARTIALLY_PAID")
    return { text: "HALF PAID", className: "bg-yellow-100 text-yellow-800" };

  if (paymentStatus === "FULLY_PAID" && status !== "READY")
    return { text: "CONFIRMED", className: "bg-green-100 text-green-700" };

  if (status === "READY")
    return { text: "LIVE", className: "bg-purple-100 text-purple-700" };

  if (status === "PAYMENT_PENDING")
    return { text: "PAYMENT REQUIRED", className: "bg-yellow-100 text-yellow-700" };

  return {
    text: status.replace("_", " "),
    className: "bg-gray-100 text-gray-700",
  };
}

/* ================= PAGE ================= */

export default function SessionDetailsPage() {
  const router = useRouter();
  const params = useParams() as { id?: string | string[] };

const id = params?.id
  ? Array.isArray(params.id)
    ? params.id[0]
    : params.id
  : undefined;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const [review, setReview] = useState<any>(null);
const [editing, setEditing] = useState(false);
const [comment, setComment] = useState("");
const [rating, setRating] = useState(5);

useEffect(() => {
  if (!booking?.id) return;

  fetch(`/api/review/${booking.id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.review) {
        setReview(data.review);
        setComment(data.review.comment);
        setRating(data.review.rating);
      }
    });
}, [booking]);

  useEffect(() => {
    fetch(`/api/bookings/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setBooking(data.booking))
      .finally(() => setLoading(false));
  }, [id]);

  async function cancelBooking() {
    if (!booking) return;

    const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    alert("Booking cancelled");
    router.push("/dashboard/sessions");
  }

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>Session not found</p>;

  const badge = getStatusBadge(booking.status, booking.paymentStatus);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold text-[#004B4B]">
          Session Details
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 bg-white border rounded-xl p-6 space-y-4">

          <div className="flex items-center gap-4">
            {booking.tutor.photo ? (
              <img
                src={booking.tutor.photo}
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                {booking.tutor.name.charAt(0)}
              </div>
            )}

            <div>
              <p className="font-semibold text-lg">
                {booking.tutor.name}
              </p>
              <p className="text-sm text-gray-500">
                {booking.subject} {booking.level ? `| ${booking.level}` : ""}
              </p>

              <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
  <span className="text-yellow-500 font-medium">
    ⭐ {booking.tutor.avgRating ?? "—"}
  </span>
  <span className="text-gray-500">
    ({booking.tutor.reviewCount ?? 0} reviews)
  </span>
</div>

<p className="text-sm text-[#004B4B] mt-1 font-medium">
  Rs {booking.tutor.rate ?? "—"}/hr
</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              📅 {new Date(booking.bookingDate).toLocaleDateString()}
            </p>
            <p>
              ⏰ {new Date(booking.startTime).toLocaleTimeString()}
            </p>
            <p>
              🎓 {booking.sessionType === "ONE_TO_ONE" ? "1-to-1" : "Group"}
            </p>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white border rounded-xl p-6 space-y-4">

          {/* STATUS */}
          <div>
  <span className={`px-3 py-1 rounded-full text-sm ${badge.className}`}>
    {badge.text}
  </span>

{booking.status === "EXPIRED" && (
  <p className="text-xs text-gray-500 mt-2">
    This session expired because the scheduled time has passed and it was not completed.
    If you had a payment, it has been handled according to the platform policy.
  </p>
)}

  {/* ADD EXPLANATION */}
 {booking.paymentStatus === "PARTIALLY_PAID" &&
  booking.status === "COMPLETED" && (
    <p className="text-xs text-gray-500 mt-1">
      Complete remaining payment within 12 hrs after session completion.
    </p>
)}

  {booking.status === "READY" && (
    <p className="text-xs text-gray-500 mt-1">
      Session is live. You can join now.
    </p>
  )}
</div>

          {/* JOIN */}
          {booking.status === "READY" &&
            booking.meetingRoom && (
              <button
                onClick={() =>
                  router.push(`/session/${booking.meetingRoom}?role=student`)
                }
                className="w-full bg-[#004B4B] text-white py-2 rounded font-medium"
              >
                Join Session
              </button>
          )}

          {/* PAYMENT */}
          {booking.paymentStatus === "PARTIALLY_PAID" && (
            <button
              onClick={() =>
                router.push(`/dashboard/payments/${booking.id}`)
              }
              className="w-full bg-yellow-500 text-white py-2 rounded"
            >
              Complete Payment
            </button>
          )}

          {/* DEADLINE */}
          {booking.paymentStatus === "PARTIALLY_PAID" &&
            booking.paymentDueAt && (
              <p className="text-xs text-red-500">
                ⏳ {getRemainingTime(booking.paymentDueAt)}
              </p>
          )}

          {/* REVIEW */}
          {booking.status === "COMPLETED" && (
            <button
              onClick={() =>
                router.push(`/dashboard/review/${booking.id}`)
              }
              className="w-full bg-[#E6F9F5] text-[#004B4B] py-2 rounded"
            >
              Write Review
            </button>
          )}

           {booking.status === "COMPLETED" && (
  <div className="bg-white border rounded-xl p-6 space-y-4">

    <h2 className="font-semibold text-[#004B4B]">
      Your Review
    </h2>

    {/* IF REVIEW EXISTS */}
    {review && !editing && (
      <>
        <p className="text-yellow-500">
          {"★".repeat(review.rating)}
        </p>

        <p className="text-sm text-gray-700">
          {review.comment}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600"
          >
            Edit
          </button>

          <button
            onClick={async () => {
              await fetch("/api/review", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tutorId: booking.tutorId }),
              });

              setReview(null);
            }}
            className="text-sm text-red-500"
          >
            Delete
          </button>
        </div>
      </>
    )}

    {/* WRITE / EDIT */}
    {(!review || editing) && (
      <>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min={1}
          max={5}
          className="border px-2 py-1 w-16"
        />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Write your review..."
        />

        <button
          onClick={async () => {
            const res = await fetch("/api/review", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bookingId: booking.id,
    rating,
    comment,
  }),
});

            if (res.ok) {
              setEditing(false);
              location.reload(); // quick refresh
            }
          }}
          className="bg-[#004B4B] text-white px-4 py-2 rounded"
        >
          {review ? "Update Review" : "Submit Review"}
        </button>
      </>
    )}
  </div>
)}


          {/* WAITING */}
        {!booking.meetingRoom &&
  booking.paymentStatus !== "UNPAID" &&
  ["READY", "PAYMENT_PENDING"].includes(booking.status) && (
              <p className="text-xs text-gray-500">
  The tutor has not started the session yet.
</p>
          )}

          {/* CANCEL */}
         {!["COMPLETED", "CANCELLED", "EXPIRED"].includes(booking.status) && (
              <button
  onClick={() => setConfirmCancel(true)}
  className="w-full border border-red-400 text-red-500 py-2 rounded"
>
  Cancel Booking
</button>
          )}

        </div>
      </div>

     
    
    {/* CANCEL MODAL */}
{confirmCancel && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">

      <h2 className="text-lg font-semibold text-[#004B4B] mb-2">
        Cancel Booking?
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to cancel this booking?
      </p>

      <div className="text-xs text-gray-500 space-y-1 mb-5">
        <p>• More than 12 hours before → Full refund</p>
        <p>• Within 12 hours → 50% refund</p>
        <p>• After session starts → No refund</p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirmCancel(false)}
          className="px-3 py-1 text-sm rounded bg-gray-200"
        >
          No
        </button>

        <button
          onClick={async () => {
            if (!booking) return;

            await cancelBooking(); // your existing function
            setConfirmCancel(false);
          }}
          className="px-3 py-1 text-sm rounded bg-red-500 text-white"
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}