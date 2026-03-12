"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TutorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    subjects: [] as string[],
    rate: "",
    experience: "",
    level: "",
    photo: "",
  });

  const [newSubject, setNewSubject] = useState("");

  /* =========================
   REVIEWS STATE
========================= */
const [reviews, setReviews] = useState<any[]>([]);
const [avgRating, setAvgRating] = useState(0);
const [reviewCount, setReviewCount] = useState(0);

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    fetch("/api/tutor/me")
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          subjects: data.subjects || [],
          rate: data.rate?.toString() || "",
          experience: data.experience || "",
          level: data.level || "",
          photo: data.photo || "",
        });
        setLoading(false);
      });
  }, []);


  /* =========================
   LOAD REVIEWS
========================= */
useEffect(() => {
  async function loadReviews() {
    const res = await fetch("/api/tutor/my-reviews");
    const data = await res.json();

    if (res.ok) {
      setReviews(data.reviews || []);
      setAvgRating(data.averageRating || 0);
      setReviewCount(data.reviewCount || 0);
    }
  }

  loadReviews();
}, []);

  /* =========================
     PHOTO UPLOAD
  ========================= */
  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1_000_000) {
      toast.error("Image must be under 1MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/tutor/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForm(prev => ({ ...prev, photo: data.photo }));
      toast.success("Profile photo updated");
    } catch {
      toast.error("Photo upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const saveProfile = async () => {
    setSaving(true);

    const res = await fetch("/api/tutor/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rate: Number(form.rate),
      }),
    });

    setSaving(false);

    res.ok
      ? toast.success("Profile updated successfully")
      : toast.error("Failed to update profile");
  };

  /* =========================
     SUBJECT HANDLERS
  ========================= */
  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (form.subjects.includes(newSubject.trim())) return;

    setForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject.trim()],
    }));
    setNewSubject("");
  };

  const removeSubject = (subject: string) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject),
    }));
  };

  if (loading) return <p className="p-8">Loading profile...</p>;

 return (
  
 <div className="w-full px-12 py-10 flex gap-10 items-start">

    {/* ================= LEFT: EDIT PROFILE BOX ================= */}
       <div className="flex-[3] bg-white rounded-2xl shadow-lg p-10">

      <h1 className="text-2xl font-bold text-[#004B4B] mb-6">
        Edit Profile
      </h1>

      {/* PROFILE PHOTO */}
      <div className="flex items-center gap-5 mb-6">
        {preview || form.photo ? (
          <img
            src={preview || form.photo}
            className="h-24 w-24 rounded-full object-cover border"
            alt="Profile"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-[#004B4B]">
            {form.name.charAt(0).toUpperCase()}
          </div>
        )}

        <label className="cursor-pointer text-[#004B4B] font-medium">
          {uploading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
      </div>

      <Input
        label="Full Name"
        value={form.name}
        onChange={v => setForm({ ...form, name: v })}
      />

      <Textarea
        label="Bio"
        value={form.bio}
        onChange={v => setForm({ ...form, bio: v })}
      />

      <Input
        label="Hourly Rate (Rs)"
        type="text"
        value={form.rate}
        onChange={(v) => {
          if (/^\d*$/.test(v)) {
            setForm({ ...form, rate: v });
          }
        }}
      />

      <Input
        label="Experience"
        value={form.experience}
        onChange={v => setForm({ ...form, experience: v })}
      />

      {/* SUBJECTS */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Subjects</label>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Add subject"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
          />
          <button
            onClick={addSubject}
            className="px-4 bg-[#004B4B] text-white rounded"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {form.subjects.map((s) => (
            <span
              key={s}
              className="px-3 py-1 bg-[#E6F9F5] text-[#004B4B] rounded-full flex gap-2"
            >
              {s}
              <button
                onClick={() => removeSubject(s)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={saveProfile}
        disabled={saving}
        className="px-6 py-3 bg-[#004B4B] text-white rounded-lg"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>

    </div>

    {/* ================= RIGHT: REVIEWS BOX ================= */}
    <div className="flex-[2] bg-white rounded-2xl shadow-lg p-8 sticky top-8">

      <h2 className="text-lg font-bold text-[#004B4B] mb-4">
        Student Reviews
      </h2>

      <p className="text-lg font-semibold text-yellow-600 mb-4">
        ⭐ {avgRating.toFixed(1)} out of 5
        <span className="text-gray-500 text-sm ml-2">
          ({reviewCount})
        </span>
      </p>

      {reviews.length === 0 && (
        <p className="text-sm text-gray-500">
          No reviews yet.
        </p>
      )}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {reviews.map((r, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm text-[#004B4B]">
                {r.user?.name || "Anonymous"}
              </p>

              <div className="text-yellow-500 text-sm">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
            </div>

            <p className="text-sm text-gray-700 mt-2">
              {r.comment}
            </p>

            <p className="text-xs text-green-600 mt-2">
              ✔ Verified Student
            </p>
          </div>
        ))}
      </div>

    </div>

  </div>
);
    
  
}

/* ================= COMPONENTS ================= */

function Input({ label, value, onChange, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        className="w-full border rounded p-2 mt-1"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        rows={4}
        className="w-full border rounded p-2 mt-1"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

