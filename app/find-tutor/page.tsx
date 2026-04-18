"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Users,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

/* ======================
   TYPES
====================== */
interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  photo?: string | null;
  bio?: string | null;
  rate?: number | null;
  avgRating?: string | null;
  reviewCount?: number;
}

/* ======================
   PAGE
====================== */
export default function FindTutorPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("ALL");
 const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
 
  /* ======================
     FETCH TUTORS
  ====================== */
  useEffect(() => {
    async function loadTutors() {
      try {
        const res = await fetch("/api/tutor/list", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load tutors");
        }

        setTutors(data.tutors || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadTutors();
  }, []);

  /* ======================
     FILTERED LIST
  ====================== */
  const filteredTutors = useMemo(() => {
    let list = [...tutors];

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter((t) => {
        const nameMatch = t.name.toLowerCase().includes(q);

        const subjectMatch = (t.subjects ?? []).some((s) =>
          s.split("|")[0].toLowerCase().includes(q)
        );

        return nameMatch || subjectMatch;
      });
    }

    if (priceFilter !== "ALL") {
      list = list.filter((t) => {
        const rate = t.rate ?? 0;

        switch (priceFilter) {
          case "100-500":
            return rate >= 100 && rate <= 500;
          case "500-1000":
            return rate > 500 && rate <= 1000;
          case "1000-1200":
            return rate > 1000 && rate <= 1200;
          case "1200+":
            return rate > 1200;
          default:
            return true;
        }
      });
    }

    return list;
  }, [tutors, search, priceFilter]);

  /* ======================
     LOADING / ERROR
  ====================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-72 bg-gray-200 rounded-lg" />
            <div className="h-5 w-[520px] bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white rounded-2xl border" />
              ))}
            </div>
            <div className="h-14 w-full max-w-2xl bg-white rounded-xl border mt-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-white rounded-2xl border" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ======================
          HERO
      ====================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#E6F9F5] text-[#006A6A] px-4 py-1 text-sm font-medium">
              Find trusted tutors before you sign up
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight text-[#004B4B]">
              Find the perfect tutor for your learning journey
            </h1>

            <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl leading-7">
              Explore qualified tutors, compare subjects, pricing, and student
              reviews, and choose the right learning partner for your goals.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="bg-[#006A6A] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#005454] transition"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="border border-[#006A6A] text-[#006A6A] px-5 py-3 rounded-xl font-medium hover:bg-[#006A6A] hover:text-white transition"
              >
                Log In
              </Link>
            </div>

            <p className="mt-6 italic text-sm text-gray-500">
              “A great tutor doesn’t just teach — they inspire confidence,
              curiosity, and growth.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="w-11 h-11 rounded-xl bg-[#E6F9F5] flex items-center justify-center mb-4">
                <Users size={22} className="text-[#006A6A]" />
              </div>
              <h3 className="font-semibold text-[#004B4B]">Trusted Tutors</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">
                Browse tutors across multiple subjects and learning levels.
              </p>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="w-11 h-11 rounded-xl bg-[#FFF7E6] flex items-center justify-center mb-4">
                <Star size={22} className="text-[#D97706]" />
              </div>
              <h3 className="font-semibold text-[#004B4B]">Verified Reviews</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">
                Reviews are shown from completed sessions only.
              </p>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center mb-4">
                <BookOpen size={22} className="text-[#2563EB]" />
              </div>
              <h3 className="font-semibold text-[#004B4B]">Flexible Learning</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">
                Choose from one-to-one or group learning sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================
          TRUST BAR
      ====================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-6">
        <div className="bg-white border rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center shadow-sm">
          <div>
            <h3 className="text-2xl font-bold text-[#006A6A]">
              {tutors.length}+
            </h3>
            <p className="text-sm text-gray-500 mt-1">Available Tutors</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#006A6A]">1-to-1 & Group</h3>
            <p className="text-sm text-gray-500 mt-1">Flexible session types</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#006A6A]">Student-first</h3>
            <p className="text-sm text-gray-500 mt-1">
              Transparent reviews and pricing
            </p>
          </div>
        </div>
      </section>

      {/* ======================
          SEARCH + FILTER
      ====================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold text-[#004B4B]">
                Explore Tutors
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Search by tutor name, subject, or compare pricing.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full lg:max-w-md bg-[#F8FAFC] border rounded-xl px-4 py-3">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search by tutor or subject"
                className="w-full outline-none text-sm bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: "All", value: "ALL" },
              { label: "Rs 100 - 500", value: "100-500" },
              { label: "Rs 500 - 1000", value: "500-1000" },
              { label: "Rs 1000 - 1200", value: "1000-1200" },
              { label: "Rs 1200+", value: "1200+" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPriceFilter(item.value)}
                className={`px-4 py-2 text-sm rounded-full border transition ${
                  priceFilter === item.value
                    ? "bg-[#4CB6B6] text-white border-[#4CB6B6]"
                    : "bg-white text-gray-600 hover:border-[#4CB6B6]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================
          RESULTS
      ====================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-[#004B4B]">
              {filteredTutors.length}
            </span>{" "}
            tutor{filteredTutors.length !== 1 && "s"}
          </p>

          <Link
            href="/register"
            className="hidden md:inline-flex text-sm font-medium text-[#006A6A] hover:underline"
          >
            Sign up to book a session
          </Link>
        </div>

        {filteredTutors.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F9F5] mx-auto flex items-center justify-center">
              <GraduationCap className="text-[#006A6A]" size={28} />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#004B4B]">
              No tutors found
            </h3>
            <p className="text-gray-500 mt-2">
              Try changing your search or price filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <Link
                key={tutor.id}
                href={`/tutor/${tutor.id}`}
                className="group block"
              >
                <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#4CB6B6] transition h-full">
                  {/* TOP */}
                  <div className="flex gap-4">
                    {tutor.photo ? (
                      <img
                        src={tutor.photo}
                        alt={tutor.name}
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#E6F9F5] flex items-center justify-center font-bold text-[#004B4B] text-lg">
                        {tutor.name.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#004B4B] text-base truncate">
                        {tutor.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {(tutor.subjects ?? [])
                          .filter((s) => typeof s === "string")
                          .map((s) => s.split("|")[0])
                          .join(", ") || "No subjects"}
                      </p>

                      <p className="text-sm text-yellow-600 mt-2">
                        ⭐ {tutor.avgRating ?? "—"}{" "}
                        <span className="text-gray-400">
                          ({tutor.reviewCount ?? 0} reviews)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* BIO */}
                  <p className="text-sm text-gray-600 mt-4 line-clamp-3 leading-6 min-h-[72px]">
                    {tutor.bio ??
                      "Experienced tutor passionate about helping students learn with confidence and clarity."}
                  </p>

                  {/* FOOTER */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-[#004B4B] font-semibold">
                      Rs {tutor.rate ?? "—"}/hr
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#006A6A] group-hover:gap-2 transition-all">
                      View Profile <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-[#006A6A] rounded-3xl px-6 md:px-10 py-10 text-center text-white">
          <h3 className="text-2xl font-bold">
            Ready to start learning with the right tutor?
          </h3>
          <p className="mt-3 text-white/85 max-w-2xl mx-auto">
            Create your account to book sessions, message tutors, and manage
            your learning journey with TutorSewa.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="bg-white text-[#006A6A] px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Register Now
            </Link>

            <Link
              href="/login"
              className="border border-white text-white px-5 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#006A6A] transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}