// "use client";

// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function ProfilePage() {
//   const { data: session, update } = useSession();
//   const user = session?.user;

//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     completedSessions: 0,
//     totalPayments: 0,
//   });

//   const [editMode, setEditMode] = useState(false);

//   const [form, setForm] = useState({
//     name: user?.name ?? "",
//     phone: user?.phone ?? "",
//     grade: user?.grade ?? "",
//   });

//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);

//   /* ================= FETCH STATS ================= */
//   useEffect(() => {
//     async function fetchStats() {
//       const res = await fetch("/api/profile/stats");
//       const data = await res.json();
//       setStats(data);
//     }
//     fetchStats();
//   }, []);

//   if (!user) return <div>Loading...</div>;

//   /* ================= SAVE PROFILE ================= */
//   const saveProfile = async () => {
//     const res = await fetch("/api/profile/update", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//       await update();
//       setEditMode(false);
//       toast.success("Profile updated");
//     } else {
//       toast.error("Failed to update");
//     }
//   };

//   /* ================= HANDLE IMAGE UPLOAD ================= */
//   const handleImageChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 1024 * 1024) {
//       toast.error("Image must be less than 1MB");
//       return;
//     }

//     setPreview(URL.createObjectURL(file));
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch("/api/profile/upload-image", {
//       method: "POST",
//       body: formData,
//     });

//     setUploading(false);

//     const data = await res.json();

//     if (data.success) {
//       await update();
//       toast.success("Profile photo updated!");
//     } else {
//       toast.error("Upload failed");
//       setPreview(null);
//     }
//   };

//   return (
//     <div className="space-y-8">

//       {/* ================= HEADER ================= */}
//       <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6">

//         {/* AVATAR */}
//         <div className="relative">
//           {preview ? (
//             <img
//               src={preview}
//               className="h-24 w-24 rounded-full object-cover border"
//             />
//           ) : user.image ? (
//             <img
//               src={user.image}
//               className="h-24 w-24 rounded-full object-cover border"
//             />
//           ) : (
//             <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-[#006A6A]">
//               {(
//                 user?.name?.charAt(0) ||
//                 user?.email?.charAt(0) ||
//                 "?"
//               ).toUpperCase()}
//             </div>
//           )}

//           {editMode && (
//             <label className="absolute bottom-0 right-0 bg-[#006A6A] text-white text-xs px-2 py-1 rounded cursor-pointer">
//               Change
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           )}
//         </div>

//         {/* USER INFO */}
//         <div className="flex-1">
//           <h1 className="text-2xl font-bold text-[#004B4B]">
//             {user.name}
//           </h1>
//           <p className="text-gray-500">{user.email}</p>
//           <p className="text-sm text-gray-400 mt-1">
//             Member since{" "}
//             {user.createdAt
//               ? new Date(user.createdAt).toLocaleDateString()
//               : "—"}
//           </p>

//           {uploading && (
//             <p className="text-xs text-gray-500 mt-2">
//               Uploading photo...
//             </p>
//           )}
//         </div>

//         {/* EDIT BUTTON */}
//         {!editMode && (
//           <button
//             onClick={() => setEditMode(true)}
//             className="bg-[#006A6A] text-white px-4 py-2 rounded-md"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-md">
//           <p className="text-sm text-gray-500">Total Bookings</p>
//           <p className="text-2xl font-bold text-[#006A6A]">
//             {stats.totalBookings}
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-md">
//           <p className="text-sm text-gray-500">Completed Sessions</p>
//           <p className="text-2xl font-bold text-[#006A6A]">
//             {stats.completedSessions}
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-md">
//           <p className="text-sm text-gray-500">Total Payments</p>
//           <p className="text-2xl font-bold text-[#006A6A]">
//             Rs {stats.totalPayments}
//           </p>
//         </div>
//       </div>

//       {/* ================= PERSONAL INFO ================= */}
//       <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
//         <h2 className="text-lg font-semibold text-[#004B4B]">
//           Personal Information
//         </h2>

//         {!editMode ? (
//           <>
//             <p><strong>Name:</strong> {user.name}</p>
//             <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
//             <p><strong>Grade:</strong> {user.grade || "Not set"}</p>
//             <p><strong>Login Type:</strong> {user.loginType}</p>
//           </>
//         ) : (
//           <>
//             <input
//               className="border p-2 w-full"
//               value={form.name}
//               onChange={(e) =>
//                 setForm({ ...form, name: e.target.value })
//               }
//             />

//             <input
//               className="border p-2 w-full"
//               value={form.phone}
//               onChange={(e) =>
//                 setForm({ ...form, phone: e.target.value })
//               }
//             />

//             <input
//               className="border p-2 w-full"
//               value={form.grade}
//               onChange={(e) =>
//                 setForm({ ...form, grade: e.target.value })
//               }
//             />

//             <div className="flex gap-3">
//               <button
//                 onClick={saveProfile}
//                 className="bg-[#006A6A] text-white px-4 py-2 rounded-md"
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   setPreview(null);
//                 }}
//                 className="text-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedSessions: 0,
    totalPayments: 0,
  });

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    grade: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  /* ================= INIT FORM WHEN USER LOADS ================= */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        grade: user.grade ?? "",
      });
    }
  }, [user]);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/profile/stats");
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!user) return <div>Loading...</div>;

  /* ================= VALIDATION + SAVE ================= */
  const saveProfile = async () => {
    const trimmedName = form.name.trim();

    // ✅ First & Last name validation
    if (trimmedName.split(" ").length < 2) {
      toast.error("Please enter both First and Last name");
      return;
    }

    // ✅ Phone validation (10 digits only)
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await update();
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  /* ================= HANDLE IMAGE UPLOAD ================= */
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/profile/upload-image", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    const data = await res.json();

    if (data.success) {
      await update();
      toast.success("Profile photo updated!");
    } else {
      toast.error("Upload failed");
      setPreview(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6">

        {/* AVATAR */}
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              className="h-24 w-24 rounded-full object-cover border"
            />
          ) : user.image ? (
            <img
              src={user.image}
              className="h-24 w-24 rounded-full object-cover border"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-[#006A6A]">
              {(
                user?.name?.charAt(0) ||
                user?.email?.charAt(0) ||
                "?"
              ).toUpperCase()}
            </div>
          )}

          {editMode && (
            <label className="absolute bottom-0 right-0 bg-[#006A6A] text-white text-xs px-2 py-1 rounded cursor-pointer">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* USER INFO */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#004B4B]">
            {user.name}
          </h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 mt-1">
            Member since{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"}
          </p>

          {uploading && (
            <p className="text-xs text-gray-500 mt-2">
              Uploading photo...
            </p>
          )}
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-[#006A6A] text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-[#006A6A]">
            {stats.totalBookings}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-gray-500">Completed Sessions</p>
          <p className="text-2xl font-bold text-[#006A6A]">
            {stats.completedSessions}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-gray-500">Total Payments</p>
          <p className="text-2xl font-bold text-[#006A6A]">
            Rs {stats.totalPayments}
          </p>
        </div>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#004B4B]">
          Personal Information
        </h2>

        {!editMode ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
            <p><strong>Grade:</strong> {user.grade || "Not set"}</p>
            <p><strong>Login Type:</strong> {user.loginType}</p>
          </>
        ) : (
          <>
            <input
              className="border p-2 w-full rounded"
              placeholder="Enter First and Last Name)"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Enter 10 digit phone number"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Enter your level / grade"
              value={form.grade}
              onChange={(e) =>
                setForm({ ...form, grade: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                className="bg-[#006A6A] text-white px-4 py-2 rounded-md"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditMode(false);
                  setPreview(null);
                  setForm({
                    name: user.name ?? "",
                    phone: user.phone ?? "",
                    grade: user.grade ?? "",
                  });
                }}
                className="text-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}