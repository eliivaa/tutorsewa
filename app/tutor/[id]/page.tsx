"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ================= TYPES ================= */

interface Tutor {
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
    name: string | null;
  };
}

/* ================= PAGE ================= */

export default function PublicTutorProfile() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params?.id;

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const tutorRes = await fetch(`/api/tutor/${id}`);
        const tutorData = await tutorRes.json();

        const reviewRes = await fetch(`/api/tutor/${id}/reviews`);
        const reviewData = await reviewRes.json();

        setTutor(tutorData);
        setReviews(reviewData.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading || !tutor) {
    return (
      <p className="p-8 text-[#004B4B]">
        Loading tutor profile...
      </p>
    );
  }

  const initial = tutor.name?.charAt(0) || "?";

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* BACK */}
      <button
        onClick={() => router.push("/find-tutor")}
        className="flex items-center gap-2 text-sm font-semibold text-[#004B4B]"
      >
        ← Back to Tutors
      </button>

      {/* TOP CARD */}
      <div className="bg-white border rounded-xl p-5 flex items-center justify-between">

        <div className="flex items-center gap-4">

          {tutor.photo ? (
            <img
              src={tutor.photo}
              className="w-16 h-16 rounded-full object-cover border"
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
              ⭐ {tutor.avgRating ?? "—"}{" "}
              <span className="text-gray-500">
                ({tutor.reviewCount ?? 0} reviews)
              </span>
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {(tutor.subjects ?? []).map((s, i) => {
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

        {/* CTA */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 border rounded-lg"
          >
            Login to Message
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 bg-[#006A6A] text-white rounded-lg"
          >
            Register to Book
          </button>
        </div>

      </div>

      {/* ABOUT */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-2">About the tutor</h2>
        <p className="text-sm text-gray-700">
          {tutor.bio || "Experienced tutor passionate about teaching."}
        </p>
      </div>

      {/* EXPERIENCE */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-2">Qualifications</h2>
        <p className="text-sm text-gray-700">
          {tutor.experience || "2 years teaching experience"}
        </p>
      </div>

      {/* PRICING */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-semibold mb-2">Pricing</h2>
        <p className="text-lg font-semibold text-[#004B4B]">
          Rs {tutor.rate ?? 1200}/hr
        </p>
        <p className="text-sm text-gray-500 mt-1">
          1-to-1 and group sessions available after registration
        </p>
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
                className="border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between">

                  <p className="font-semibold text-[#004B4B]">
                    {r.user?.name ?? "Anonymous"}
                  </p>

                  <div className="text-yellow-500 text-sm">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>

                </div>

                <p className="text-sm mt-2 text-gray-700">
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