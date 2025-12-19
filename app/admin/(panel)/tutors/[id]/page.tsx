"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminTutorViewPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FETCH TUTOR DETAILS
  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/tutors/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setTutor(data.tutor);
        setLoading(false);
      });
  }, [id]);

  async function updateStatus(status: string) {
    const res = await fetch("/api/admin/tutors/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorId: id, status }),
    });

    if (res.ok) {
      alert("Tutor status updated!");
      window.location.reload();
    } else {
      alert("Error updating status");
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!tutor) return <div className="p-8">Tutor not found.</div>;

  return (
    <div className="p-10 bg-[#F2EFE7] min-h-screen text-[#004B4B]">
      
      <Link href="/admin/tutors">
        <button className="mb-6 px-4 py-2 bg-gray-600 text-white rounded">
          ← Back
        </button>
      </Link>

      <div className="bg-white p-6 shadow rounded-lg">
        
        <div className="flex items-center gap-6">
          <img
            src={tutor.photo || "/default-user.png"}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{tutor.name}</h1>
            <p className="text-gray-600">{tutor.email}</p>
            <p className="text-gray-600">{tutor.phone}</p>
          </div>

          {/* STATUS */}
          <span
            className={`ml-auto px-4 py-1 text-white rounded ${
              tutor.status === "APPROVED"
                ? "bg-green-600"
                : tutor.status === "PENDING"
                ? "bg-yellow-600"
                : tutor.status === "SUSPENDED"
                ? "bg-red-600"
                : "bg-gray-600"
            }`}
          >
            {tutor.status}
          </span>
        </div>

        {/* SUBJECTS */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Subjects</h2>
          <div className="flex gap-2 flex-wrap">
            {tutor.subjects?.map((s: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#004B4B] text-white rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-1">Experience</h2>
          <p>{tutor.experience || "Not provided"}</p>
        </div>

        {/* BIO */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-1">Bio</h2>
          <p>{tutor.bio || "No bio available"}</p>
        </div>

        {/* DOCUMENTS */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-lg mb-1">CV Document</h2>
            {tutor.cvUrl ? (
              <a href={tutor.cvUrl} target="_blank" className="text-blue-700 underline">
                View CV
              </a>
            ) : (
              <p>No CV uploaded</p>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">ID Document</h2>
            {tutor.idUrl ? (
              <a href={tutor.idUrl} target="_blank" className="text-blue-700 underline">
                View ID
              </a>
            ) : (
              <p>No ID uploaded</p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex gap-4">
          {tutor.status === "PENDING" && (
            <button
              onClick={() => updateStatus("APPROVED")}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Approve
            </button>
          )}

          {tutor.status !== "SUSPENDED" && (
            <button
              onClick={() => updateStatus("SUSPENDED")}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Suspend
            </button>
          )}

          {tutor.status === "SUSPENDED" && (
            <button
              onClick={() => updateStatus("APPROVED")}
              className="px-4 py-2 bg-orange-600 text-white rounded"
            >
              Reinstate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
