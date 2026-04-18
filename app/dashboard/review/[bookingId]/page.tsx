"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import animationData from "@/public/Overview.json";

/* ================= TYPES ================= */

type Booking = {
  id: string;
  tutorId: string;
  tutor?: {
    name: string;
    photo?: string | null;
  };
};

/* ================= PAGE ================= */

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH BOOKING ================= */

  useEffect(() => {
    async function loadBooking() {
      if (!params?.bookingId) return;

      try {
        const res = await fetch(`/api/bookings/${params.bookingId}`);
        const data = await res.json();
        setBooking(data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [params?.bookingId]);

  /* ================= SUBMIT REVIEW ================= */

  async function submitReview() {
    if (!booking) {
      alert("Session not loaded yet");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId: booking.tutorId,
          bookingId: params?.bookingId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert("Review submitted successfully ✅");
      router.push("/dashboard/sessions");

    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <p className="p-8 text-[#004B4B]">
        Loading review page...
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/dashboard/sessions")}
        className="flex items-center gap-2 text-sm font-semibold text-[#004B4B] hover:text-black"
      >
        <span className="text-2xl font-bold leading-none">←</span>
        Back
      </button>

      {/* CARD */}
      <div className="bg-white border rounded-xl p-6 space-y-5 relative overflow-hidden">

        {/* 🔥 LOTTIE (SUBTLE DECORATION) */}
       <div className="absolute right-4 top-4 opacity-70 pointer-events-none">
  <Lottie
    animationData={animationData}
    loop
    className="w-[180px] md:w-[220px]"
  />
</div>

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold text-[#004B4B]">
            Leave a Review
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {booking?.tutor?.name
              ? `Reviewing session with ${booking.tutor.name}`
              : "Review your session"}
          </p>
        </div>

        {/* RATING */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={`text-2xl transition ${
                n <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* COMMENT */}
        <textarea
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#004B4B]"
          rows={4}
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={submitReview}
          disabled={submitting}
          className="px-5 py-2 rounded-full bg-[#004B4B] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>

      </div>

    </div>
  );
}