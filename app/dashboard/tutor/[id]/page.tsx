"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface TutorProfile {
  id: string;
  name: string;
  photo?: string | null;
  bio?: string | null;
  subjects?: string[];
  experience?: string | null;
  rate?: number | null;
  avgRating?: string | null;
  reviewCount?: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string | null;
  };
}

export default function TutorProfilePage() {

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  /* ================= FETCH TUTOR ================= */

  useEffect(() => {
    if (!id) return;

    fetch(`/api/tutor/${id}`)
      .then(res => res.json())
      .then(data => setTutor(data))
      .finally(() => setLoading(false));

  }, [id]);

  useEffect(() => {
  async function loadMyBooking() {
    if (!id || !userId) return;

    const res = await fetch(`/api/bookings/student`, {
      credentials: "include",
    });

    const data = await res.json();

    // 🔥 find latest completed booking for this tutor
  const allBookings = [
  ...(data.pending || []),
  ...(data.history || []),
];

const completed = allBookings.find(
  (b: any) =>
    b.tutor?.id === id && b.status === "COMPLETED"
);

    if (completed) {
      setSelectedBookingId(completed.id);
    }
  }

  loadMyBooking();
}, [id, userId]);


  /* ================= FETCH REVIEWS ================= */

  const loadReviews = async () => {

    if (!id) return;

    const res = await fetch(`/api/tutor/${id}/reviews`);
    const data = await res.json();

    setReviews(data.reviews || []);
  };

  useEffect(() => {
    loadReviews();
  }, [id]);


  /* ================= SUBMIT REVIEW ================= */

  async function submitReview() {

    if (!userId) {
      alert("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    const res = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
  tutorId: id,
  bookingId: selectedBookingId, // 🔥 MUST ADD
  rating,
  comment
})
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "You can review only after session completion.");
      return;
    }

    alert("Review submitted successfully ");

    loadReviews();
  }

  /* ================= DELETE REVIEW ================= */

  async function deleteReview() {

    if (!userId) return;

    await fetch("/api/review", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tutorId: id
      })
    });

    setComment("");
    setRating(5);

    loadReviews();
  }

  if (loading || !tutor) {
    return (
      <p className="p-8 text-[#004B4B]">
        Loading tutor profile...
      </p>
    );
  }

  const initial = tutor.name?.charAt(0) || "?";
return (
  <div className="p-6 max-w-6xl mx-auto space-y-6">

  <button
  onClick={() => router.push("/dashboard/browse")}
  className="flex items-center gap-2 text-sm font-semibold text-[#004B4B] hover:text-black transition mb-2"
>
  <span className="text-2xl font-bold leading-none">←</span>
  Back to Browse
</button>

      {/* TOP CARD */}

      <div className="bg-white border rounded-xl p-5 flex items-center justify-between">

        <div className="flex items-center gap-4">

          {tutor.photo ? (
            <img
              src={tutor.photo}
              className="w-16 h-16 rounded-full object-cover border"
              alt={tutor.name}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#E6F9F5] flex items-center justify-center text-xl font-bold text-[#004B4B]">
              {initial}
            </div>
          )}

          <div>

            <h1 className="text-lg font-semibold text-[#004B4B]">
              {tutor.name}
            </h1>

            <p className="text-sm text-yellow-600">
              ⭐ {tutor.avgRating ?? "—"}
              <span className="text-gray-500">
                {" "}({tutor.reviewCount ?? 0} reviews)
              </span>
            </p>

           <div className="flex gap-2 mt-2 flex-wrap">
  {(tutor.subjects ?? []).map((s, i) => {
    if (typeof s !== "string") return null;

    const [subject, level] = s.split("|");

    return (
      <span
        key={i}
        className="px-3 py-1 text-xs bg-[#4CB6B6]/90 text-white rounded-full"
      >
        {subject}
        {level && ` (${level})`}
      </span>
    );
  })}
</div>

          </div>

        </div>

        <button
          onClick={async () => {

            const res = await fetch(`/api/messages/start?tutorId=${tutor.id}`);
            const data = await res.json();

            if (!data.allowed) {
              setShowLockedModal(true);
              return;
            }

            router.push(`/dashboard/messages?conversationId=${data.conversationId}`);

          }}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-[#E6F9F5]"
        >
          💬 Message Tutor
        </button>

      </div>

      {/* ABOUT */}

      <div className="bg-white border rounded-xl p-5">

        <h2 className="font-semibold mb-1">About the tutor</h2>

        <p className="text-sm text-gray-700 max-w-3xl">
          {tutor.bio || "Experienced tutor passionate about teaching."}
        </p>

      </div>

      {/* BOOKING */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-xl p-5">

          <h2 className="font-semibold mb-1">Qualifications</h2>

          <p className="text-sm text-gray-700">
            {tutor.experience || "2 years teaching experience"}
          </p>

        </div>

      <div className="bg-white border rounded-xl p-5 md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

  {/* LEFT */}
  <div>
    <h2 className="font-semibold mb-1">Booking</h2>

    <p className="font-semibold text-[#004B4B]">
      Rs {tutor.rate ?? 1200}/hr
    </p>

    <p className="text-s text-gray-500 mt-1">
      Choose session type, date and time on next step
    </p>

    {/* ✅ SESSION TYPE UI */}
    <div className="flex gap-2 mt-3">
      <span className="px-3 py-1 text-m rounded-full bg-blue-100 text-blue-700">
        1-to-1
      </span>
      <p className="text-s text-gray-500 mt-1">OR</p>
      <span className="px-3 py-1 text-m rounded-full bg-green-100 text-green-700">
        Group
      </span>
    </div>
  </div>

  {/* RIGHT */}
  <Link href={`/dashboard/tutor/${tutor.id}/book`}>
    <button className="px-5 py-2 border border-[#4CB6B6] rounded-lg text-sm text-[#004B4B] hover:bg-[#E6F9F5]">
      📅 Book a session
    </button>
  </Link>

</div>

      </div>

     {/* REVIEWS */}

     

<div className="bg-white border rounded-xl p-5">

  <h2 className="font-semibold mb-4">Student Reviews</h2>

<p className="text-sm text-gray-500 mb-3">
  Reviews are submitted only after completed sessions.
</p>

  {reviews.length === 0 ? (
    <p className="text-sm text-gray-500">
      No reviews yet.
    </p>
  ) : (
    <div className="space-y-4 max-w-2xl">

      {reviews.map((r) => (
        <div
          key={r.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >

          {/* TOP */}
          <div className="flex justify-between items-center">

            <p className="font-semibold text-[#004B4B]">
              {r.user?.name ?? "Anonymous"}
            </p>

            <div className="text-yellow-500 text-sm">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

          </div>

          {/* COMMENT */}
          <p className="text-sm mt-2 text-gray-700 leading-relaxed">
            {r.comment}
          </p>

        </div>
      ))}

    </div>
  )}

</div>
     

        </div>

    
  );
}