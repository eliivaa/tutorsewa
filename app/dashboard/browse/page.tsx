"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

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
   COMPONENT
====================== */
export default function BrowseTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filtered, setFiltered] = useState<Tutor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("ALL");

  /* ======================
     FETCH TUTORS
  ====================== */
  useEffect(() => {
    async function loadTutors() {
      try {
        const res = await fetch("/api/tutor/list");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load tutors");

        setTutors(data.tutors || []);
        setFiltered(data.tutors || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTutors();
  }, []);

  /* ======================
     SEARCH + PRICE FILTER
  ====================== */
  useEffect(() => {
    let list = [...tutors];

    /* ===== SEARCH ===== */
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

    /* ===== PRICE FILTER ===== */
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

    setFiltered(list);
  }, [search, priceFilter, tutors]);

  /* ======================
     STATES
  ====================== */
  if (loading) return <p className="p-6 text-[#004B4B]">Loading tutors...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="px-6 pb-10">
      <h1 className="text-2xl font-bold text-[#004B4B] mb-6">
        Browse Tutors
      </h1>

      {/* ======================
          SEARCH + FILTER
      ====================== */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        
        {/* SEARCH */}
        <div className="flex items-center gap-2 w-full max-w-md bg-white border rounded-lg px-4 py-2 shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by tutor or subject"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

       {/* PRICE FILTER CHIPS */}

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
      className={`px-3 py-1.5 text-sm rounded-full border transition 
        ${
          priceFilter === item.value
            ? "bg-[#4CB6B6] text-white border-[#4CB6B6]"
            : "bg-white text-gray-600 hover:border-[#4CB6B6]"
        }`}
    >
      {item.label}
    </button>
  ))}
</div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-gray-600">No tutors found.</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tutor) => (
          <Link
            key={tutor.id}
            href={`/dashboard/tutor/${tutor.id}`}
            className="block"
          >
            <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#4CB6B6] transition cursor-pointer">
              
              {/* TOP */}
              <div className="flex gap-3">
                {tutor.photo ? (
                  <img
                    src={tutor.photo}
                    alt={tutor.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#E6F9F5] flex items-center justify-center font-bold text-[#004B4B]">
                    {tutor.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h2 className="text-sm font-semibold text-[#004B4B]">
                    {tutor.name}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {(tutor.subjects ?? [])
                      .filter((s) => typeof s === "string")
                      .map((s: string) => s.split("|")[0])
                      .join(", ") || "No subjects"}
                  </p>

                  <p className="text-xs text-yellow-600 mt-1">
                    ⭐ {tutor.avgRating ?? "—"}{" "}
                    <span className="text-gray-400">
                      ({tutor.reviewCount ?? 0} reviews)
                    </span>
                  </p>
                </div>
              </div>

              {/* BIO */}
              <p className="text-xs text-gray-600 mt-3 line-clamp-3">
                {tutor.bio ??
                  "Experienced tutor passionate about making complex subjects easy to understand."}
              </p>

              {/* RATE */}
              <div className="mt-4 text-sm font-semibold text-[#004B4B]">
                Rs {tutor.rate ?? "—"}/hr
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}