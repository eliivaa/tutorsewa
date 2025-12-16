"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    grade: user?.grade ?? "",
  });

  if (!user) return <div>Loading...</div>;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024)
      return toast.error("Image must be less than 1MB");

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/profile/upload-image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    setUploading(false);

    const data = await res.json();

    if (data.success) {
      await update();
      toast.success("Profile photo updated!");
    } else {
      toast.error("Upload failed");
    }
  };

  const saveProfile = async () => {
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include"
    });

    if (res.ok) {
      await update();
      setEditMode(false);
      toast.success("Profile updated");
    } else {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#006A6A]">My Profile</h1>

      <div className="bg-white rounded-xl p-6 shadow-md max-w-2xl">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          {preview ? (
            <img src={preview} className="h-20 w-20 rounded-full object-cover border" />
          ) : user.image ? (
            <img src={user.image} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-[#006A6A]">
              {(user.name?.charAt(0) || user.email?.charAt(0) || "?").toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>

            {editMode && (
              <label className="block cursor-pointer mt-2 text-[#006A6A]">
                Change photo
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}

            {uploading && <p className="text-xs text-gray-500">Uploading...</p>}

          </div>
        </div>

        <hr className="my-4" />

        {!editMode ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
            <p><strong>Level:</strong> {user.grade || "Not set"}</p>

            <button onClick={() => setEditMode(true)} className="mt-4 bg-[#006A6A] text-white px-4 py-2 rounded-md">
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              className="border p-2 w-full mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-3"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-3"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />

            <button onClick={saveProfile} className="bg-[#006A6A] text-white px-5 py-2 rounded-md">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="ml-3 text-gray-700">
              Cancel
            </button>
          </>
        )}

      </div>
    </div>
  );
}
