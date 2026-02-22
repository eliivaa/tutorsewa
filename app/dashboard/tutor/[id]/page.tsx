"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Link from "next/link";

interface TutorProfile {
  id: string;
  name: string;
  photo?: string | null;
  bio?: string | null;
  subjects: string[];
  experience?: string | null;
  rate?: number | null;
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
;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [showLockedModal, setShowLockedModal] = useState(false);


  // review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);

  /* ================= FETCH TUTOR ================= */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/tutor/${id}`)
      .then((res) => res.json())
      .then(setTutor)
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= FETCH REVIEWS ================= */
  const loadReviews = async () => {
    const res = await fetch(`/api/tutor/${id}/reviews`);
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  /* ================= DETECT MY REVIEW ================= */
  useEffect(() => {
    if (!userId) return;

    const myReview = reviews.find((r) => r.user?.id === userId);


    if (myReview) {
      setEditing(true);
      setRating(myReview.rating);
      setComment(myReview.comment);
    } else {
      setEditing(false);
      setRating(5);
      setComment("");
    }
  }, [reviews, userId]);

  /* ================= SUBMIT / UPDATE REVIEW ================= */
  async function submitReview() {
    if (!userId) {
      alert("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorId: id,
        rating,
        comment,
      }),
    });

    loadReviews();
  }

  /* ================= DELETE REVIEW ================= */
  async function deleteReview() {
    if (!userId) return;

    await fetch("/api/review", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorId: id }),
    });

    setEditing(false);
    setRating(5);
    setComment("");
    loadReviews();
  }

  if (loading) {
    return <p className="p-8 text-[#004B4B]">Loading tutor profile...</p>;
  }

  if (!tutor) {
    return <p className="p-8 text-red-600">Tutor not found.</p>;
  }

  const avgRating =
    reviews.length === 0
      ? "—"
      : (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ================= TOP SECTION ================= */}
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
              {tutor.name.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-lg font-semibold text-[#004B4B]">
              {tutor.name}
            </h1>

            <p className="text-sm text-yellow-600">
              ⭐ {avgRating}{" "}
              <span className="text-gray-500">
                ({reviews.length} reviews)
              </span>
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {tutor.subjects.map((s, i) => {
                const [subject, level] = s.split("|");
                return (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-[#4CB6B6] text-white rounded-full"
                  >
                    {subject} {level && `(${level})`}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

<button
  onClick={async () => {
    const res = await fetch(`/api/messages/start?tutorId=${tutor.id}`);

    let data: any = null;

    try {
      data = await res.json();
    } catch {
      alert("Server error. Please refresh.");
      return;
    }

    
    // 🚫 tutor never accepted any booking
if (!data.allowed) {
  setShowLockedModal(true);
  return;
}


    // ✅ open chat
    router.push(`/dashboard/messages?conversationId=${data.conversationId}`);
  }}
  className="px-4 py-2 text-sm border rounded-lg hover:bg-[#E6F9F5]"
>
  💬 Message Tutor
</button>


      </div>

      {/* ================= ABOUT ================= */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-1">About the tutor</h2>
        <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
          {tutor.bio ||
            "Experienced tutor passionate about making complex subjects easy to understand."}
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-5 md:col-span-1">
          <h2 className="font-semibold mb-1">Qualifications</h2>
          <p className="text-sm text-gray-700">
            {tutor.experience || "2 years teaching experience"}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-5 md:col-span-2 flex justify-between items-center">
          <div>
            <h2 className="font-semibold mb-1">Booking</h2>
            <p className="font-semibold text-[#004B4B]">
              Rs {tutor.rate ?? 1200}/hr
            </p>
            <p className="text-sm text-gray-600">
              Choose session type, date and time on next step
            </p>
          </div>

      <Link href={`/dashboard/tutor/${tutor.id}/book`}>
  <button
    className="
      px-5 py-2.5
      border border-[#4CB6B6]
      rounded-lg
      text-sm font-medium
      text-[#004B4B]
      transition-all duration-200
      hover:bg-[#E6F9F5]
      hover:shadow-md
      hover:-translate-y-[1px]
      active:scale-95
      flex items-center gap-2
    "
  >
    📅 Book a session
  </button>
</Link>

        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-3">Students Reviews</h2>

        {/* REVIEW FORM */}
        {userId ? (
          <div className="max-w-xl mb-6">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-xl ${
                    n <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full border rounded p-2 text-sm"
              placeholder="Write your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={submitReview}
                className="px-4 py-1 bg-[#4CB6B6] text-white rounded"
              >
                {editing ? "Update Review" : "Submit Review"}
              </button>

              {editing && (
                <button
                  onClick={deleteReview}
                  className="px-4 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Please login to write a review.
          </p>
        )}

        {/* REVIEWS LIST */}
        <div className="space-y-3 max-w-2xl">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded-lg p-3">
              <p className="text-sm font-medium">
                ⭐ {r.rating} — {r.comment}
              </p>
              <p className="text-xs text-gray-500">
  {r.user?.name ?? "Anonymous"}
</p>

            </div>
          ))}
        </div>
        {/* 🔒 CHAT LOCK MODAL */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white w-[380px] rounded-2xl shadow-xl p-6 text-center space-y-4">

            <div className="text-red-500 text-4xl">🔒</div>

            <h2 className="text-lg font-semibold text-[#004B4B]">
              Messaging Locked
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              You can only chat with this tutor after the tutor accepts your booking request.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLockedModal(false)}
                className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>

              <Link href={`/dashboard/tutor/${tutor.id}/book`}>
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="px-5 py-2 bg-[#4CB6B6] text-white rounded-lg hover:bg-[#3aa5a5]"
                >
                  Book Session
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}

      </div>
    </div>
  );
}
