// // app/dashboard/thrift/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// type ThriftItem = {
//   id: string;
//   title: string;
//   subject?: string;
//   condition?: string;
//   grade?: string;
//   price: number;
//   contact: string;
//   image?: string;
//   isSold: boolean;
//   sellerId: string;
//   createdAt: string;
//   seller: {
//     id: string;
//     name?: string;
//   };
// };


// export default function ThriftPage() {
//   const { data: session } = useSession();
//   const [items, setItems] = useState<ThriftItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     title: "",
//     subject: "",
//     condition: "",
//     grade: "",
//     price: "",
//     contact: "",
//   });

//   const fetchItems = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("/api/thrift/items", { cache: "no-store" });
//       const data = await res.json();

//       if (Array.isArray(data)) setItems(data);
//       else if (Array.isArray((data as any).items)) setItems((data as any).items);
//       else setItems([]);

//     } catch (err) {
//       console.error("Failed to load thrift items:", err);
//       toast.error("Failed to load thrift items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 1_000_000) return toast.error("Image ≤ 1MB allowed");

//     setPreview(URL.createObjectURL(file));
//     setUploading(true);

//     const fd = new FormData();
//     fd.append("file", file);

//     try {
//       const res = await fetch("/api/thrift/upload-image", {
//         method: "POST",
//         body: fd,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setImageUrl(data.url);
//         toast.success("Image uploaded");
//       } else {
//         toast.error(data.error || "Upload failed");
//         setPreview(null);
//       }
//     } catch (err) {
//       toast.error("Upload failed");
//       setPreview(null);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!session?.user) return toast.error("Login required");

//     if (!form.title || !form.subject || !form.condition || !form.grade || !form.price || !form.contact) {
//       return toast.error("All fields are required");
//     }

//     setSubmitting(true);

//     const fd = new FormData();
//     fd.append("title", form.title);
//     fd.append("subject", form.subject);
//     fd.append("condition", form.condition);
//     fd.append("grade", form.grade);
//     fd.append("price", form.price);
//     fd.append("contact", form.contact);
//     if (imageUrl) fd.append("image", imageUrl);

//     try {
//       const res = await fetch("/api/thrift/create", {
//         method: "POST",
//         body: fd,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Book posted!");
//         setForm({
//           title: "",
//           subject: "",
//           condition: "",
//           grade: "",
//           price: "",
//           contact: "",
//         });
//         setPreview(null);
//         setImageUrl(null);
//         fetchItems();
//       } else {
//         toast.error(data.error || "Something went wrong");
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="space-y-6 pb-8">
//       <h1 className="text-2xl font-bold text-[#006A6A]">Thrift Section – Used Books</h1>
//       <p className="text-sm text-gray-600">Sell and buy used reference books and guides.</p>

//       <div className="grid lg:grid-cols-2 gap-6">

//         {/* Post book form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white border border-[#48A6A7]/30 p-5 rounded-xl space-y-4 shadow-sm"
//         >
//           <h2 className="font-semibold text-[#004B4B]">Post a Book</h2>

//           <input
//             placeholder="Book Title *"
//             className="border rounded-md p-2 w-full"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             required
//           />

//           <div className="grid grid-cols-2 gap-3">
//             <input
//               placeholder="Subject *"
//               className="border rounded-md p-2 w-full"
//               value={form.subject}
//               onChange={(e) => setForm({ ...form, subject: e.target.value })}
//               required
//             />

//             <select
//               className="border rounded-md p-2 w-full"
//               value={form.condition}
//               onChange={(e) => setForm({ ...form, condition: e.target.value })}
//               required
//             >
//               <option value="">Condition *</option>
//               <option value="Like New">Like New</option>
//               <option value="Good">Good</option>
//               <option value="Used">Used</option>
//             </select>
//           </div>

//           <input
//             placeholder="Class / Grade (example: 10, 11, 12) *"
//             className="border rounded-md p-2 w-full"
//             value={form.grade}
//             onChange={(e) => setForm({ ...form, grade: e.target.value })}
//             required
//           />

//           <div className="grid grid-cols-2 gap-3">
//             <input
//   type="number"
//   inputMode="numeric"
//   className="border rounded-md p-2 w-full 
//     [&::-webkit-inner-spin-button]:appearance-none 
//     [&::-webkit-outer-spin-button]:appearance-none"
//   value={form.price}
//   onChange={(e) => setForm({ ...form, price: e.target.value })}
//   placeholder="Price *"
//   required
// />

//             <input
//               placeholder="Contact *"
//               className="border rounded-md p-2 w-full"
//               value={form.contact}
//               onChange={(e) => setForm({ ...form, contact: e.target.value })}
//               required
//             />
//           </div>

//           <label className="cursor-pointer border border-dashed px-3 py-1 rounded-md text-sm text-[#006A6A]">
//             {uploading ? "Uploading..." : "Upload Image *"}
//             <input
//               type="file"
//               className="hidden"
//               onChange={handleImageChange}
//               required={!imageUrl}
//             />
//           </label>

//           {preview && (
//             <Image
//               src={preview}
//               width={80}
//               height={80}
//               alt="Preview"
//               className="rounded-md object-cover border"
//             />
//           )}

//           <button
//             type="submit"
//             disabled={submitting}
//             className="bg-[#006A6A] w-full text-white rounded-md py-2 hover:bg-[#005454]"
//           >
//             {submitting ? "Posting..." : "Post Book"}
//           </button>
//         </form>

//         {/* Listing panel */}
//         <div className="bg-white border border-[#48A6A7]/30 p-5 rounded-xl shadow-sm">
//           <div className="flex justify-between mb-3">
//             <h2 className="font-semibold text-[#004B4B]">Available Books</h2>
//             <p className="text-xs text-gray-500">{items.length} listed</p>
//           </div>

//           {loading ? (
//             <p>Loading...</p>
//           ) : items.length === 0 ? (
//             <p className="text-sm text-gray-500 bg-[#F2EFE7] p-3 rounded-md">
//               No books posted yet.
//             </p>
//           ) : (
//             <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
//               {items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center gap-3 border p-3 rounded-lg bg-[#F9FAFB]"
//                 >
//                   {item.image ? (
//                     <Image
//                       src={item.image}
//                       width={48}
//                       height={48}
//                       alt={item.title}
//                       className="rounded-md object-cover"
//                     />
//                   ) : (
//                     <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] rounded-md">
//                       No Img
//                     </div>
//                   )}

//                   <div className="flex-1">
//                     <p className="font-semibold text-sm text-[#004B4B]">
//                       {item.title}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {item.subject} • {item.condition}
//                       {item.grade && ` • Class ${item.grade}`}
//                     </p>

//                     <p className="text-[11px] text-gray-500 mt-1">
//                       Seller: {item.seller?.name || "Unknown"}
//                     </p>
//                   </div>

//                   {/* RIGHT BUTTONS */}
//                  <div className="flex flex-col items-end gap-2 min-w-[90px]">

//   <p className="font-semibold text-[#006A6A] text-sm">
//     Rs {item.price}
//   </p>

//   {/* SOLD Badge */}
//   {item.isSold && (
//     <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
//       Sold
//     </span>
//   )}

//   {/* Buyer View */}
//   {!item.isSold && session?.user?.id !== item.seller.id && (
//     <>
//      <p className="text-[11px] font-medium text-[#006A6A]">
//   📞 {item.contact}
// </p>

//       <button
//         onClick={async () => {
//           const res = await fetch("/api/thrift/chat/start", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ itemId: item.id }),
//           });

//           const data = await res.json();

//           if (data.conversationId) {
//             window.location.href = `/dashboard/messages?thrift=${data.conversationId}`;
//           }
//         }}
//         className="text-[11px] px-3 py-1 rounded-md bg-[#006A6A] text-white hover:bg-[#005454] transition"
//       >
//         Chat
//       </button>
//     </>
//   )}

//   {/* Seller Controls */}
//   {session?.user?.id === item.seller.id && !item.isSold && (
//     <button
//       onClick={async () => {
//         await fetch("/api/thrift/sold", {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ itemId: item.id }),
//         });
//         fetchItems();
//       }}
//       className="text-[11px] px-3 py-1 border border-[#006A6A] text-[#006A6A] rounded-md hover:bg-[#006A6A] hover:text-white transition"
//     >
//       Mark Sold
//     </button>
//   )}

//   {session?.user?.id === item.seller.id && (
//     <button
//       onClick={async () => {
//         await fetch("/api/thrift/delete", {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ itemId: item.id }),
//         });
//         fetchItems();
//       }}
//       className="text-[11px] px-3 py-1 border border-red-300 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
//     >
//       Remove
//     </button>
//   )}

// </div>


//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }



// app/dashboard/thrift/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// type ThriftItem = {
//   id: string;
//   title: string;
//   subject?: string;
//   condition?: string;
//   grade?: string;
//   price: number;
//   contact: string;
//   location?: string;
//   image?: string;
//   isSold: boolean;
//   sellerId: string;
//   createdAt: string;
//   seller: {
//     id: string;
//     name?: string;
//   };
// };

// export default function ThriftPage() {
//   const { data: session } = useSession();

//   const [items, setItems] = useState<ThriftItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

//   const [form, setForm] = useState({
//     title: "",
//     subject: "",
//     condition: "",
//     grade: "",
//     price: "",
//     contact: "",
//     location: "",
//   });

//   const [filter, setFilter] = useState({
//     subject: "",
//     grade: "",
//     location: "",
//     price: "",
//   });

//   const fetchItems = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("/api/thrift/items", { cache: "no-store" });
//       const data = await res.json();

//       if (Array.isArray(data)) setItems(data);
//       else if (Array.isArray((data as any).items)) setItems((data as any).items);
//       else setItems([]);
//     } catch (err) {
//       toast.error("Failed to load thrift items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 1_000_000) return toast.error("Image ≤ 1MB allowed");

//     setPreview(URL.createObjectURL(file));
//     setUploading(true);

//     const fd = new FormData();
//     fd.append("file", file);

//     try {
//       const res = await fetch("/api/thrift/upload-image", {
//         method: "POST",
//         body: fd,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setImageUrl(data.url);
//         toast.success("Image uploaded");
//       } else {
//         toast.error(data.error || "Upload failed");
//         setPreview(null);
//       }
//     } catch {
//       toast.error("Upload failed");
//       setPreview(null);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!session?.user) return toast.error("Login required");

//     if (
//       !form.title ||
//       !form.subject ||
//       !form.condition ||
//       !form.grade ||
//       !form.price ||
//       !form.contact ||
//       !form.location
//     ) {
//       return toast.error("All fields required");
//     }

//     setSubmitting(true);

//     const fd = new FormData();
//     fd.append("title", form.title);
//     fd.append("subject", form.subject);
//     fd.append("condition", form.condition);
//     fd.append("grade", form.grade);
//     fd.append("price", form.price);
//     fd.append("contact", form.contact);
//     fd.append("location", form.location);
//     if (imageUrl) fd.append("image", imageUrl);

//     const res = await fetch("/api/thrift/create", {
//       method: "POST",
//       body: fd,
//     });

//     const data = await res.json();

//     if (res.ok) {
//       toast.success("Book posted!");
//       setForm({
//         title: "",
//         subject: "",
//         condition: "",
//         grade: "",
//         price: "",
//         contact: "",
//         location: "",
//       });
//       setPreview(null);
//       setImageUrl(null);
//       fetchItems();
//     } else {
//       toast.error(data.error || "Error");
//     }

//     setSubmitting(false);
//   };

// const filteredItems = items.filter((item) => {
//   /* ================= SEARCH (subject, grade, location) ================= */
//   if (search.trim()) {
//     const query = search.toLowerCase();

//     const matchesSearch =
//       item.subject?.toLowerCase().includes(query) ||
//       item.grade?.toLowerCase().includes(query) ||
//       item.location?.toLowerCase().includes(query);

//     if (!matchesSearch) return false;
//   }

//   /* ================= PRICE FILTER (UNCHANGED) ================= */
//   if (filter.price) {
//     if (filter.price === "0-100" && item.price > 100) return false;

//     if (
//       filter.price === "200-500" &&
//       (item.price < 200 || item.price > 500)
//     )
//       return false;

//     if (filter.price === "500+" && item.price < 500) return false;
//   }

//   return true;
// });

//   return (
//     <div className="space-y-6 pb-8">
//       <h1 className="text-2xl font-bold text-[#006A6A]">
//         Thrift Section – Used Books
//       </h1>

//       {/* FILTER BAR */}
//      <div className="bg-white border border-[#48A6A7]/30 p-4 rounded-xl shadow-sm">
//   <div className="flex items-center gap-3 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#006A6A]">

//     <span className="text-gray-400 text-sm">🔍</span>

//     <input
//       type="text"
//       placeholder="Search by subject, grade or location..."
//       className="w-full outline-none text-sm"
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//     />

// </div>

//         <select className="border px-3 py-2 rounded-md text-sm"
//           onChange={(e) => setFilter({ ...filter, price: e.target.value })}>
//           <option value="">Any Price</option>
//           <option value="0-500">Below 500</option>
//           <option value="500-1000">500-1000</option>
//           <option value="1000+">1000+</option>
//         </select>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">

//         {/* FORM */}
//         <form onSubmit={handleSubmit}
//           className="bg-white p-5 rounded-xl space-y-4 shadow-sm">

//           <h2 className="font-semibold text-[#004B4B]">Post a Book</h2>

//           <input placeholder="Title *" className="border p-2 w-full"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })} />

//           <input placeholder="Subject *" className="border p-2 w-full"
//             value={form.subject}
//             onChange={(e) => setForm({ ...form, subject: e.target.value })} />

//           <input placeholder="Grade *" className="border p-2 w-full"
//             value={form.grade}
//             onChange={(e) => setForm({ ...form, grade: e.target.value })} />

//           <input placeholder="Location (Kathmandu) *" className="border p-2 w-full"
//             value={form.location}
//             onChange={(e) => setForm({ ...form, location: e.target.value })} />

//           <input type="number" className="border p-2 w-full"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//             placeholder="Price" />

//           <input placeholder="Contact *" className="border p-2 w-full"
//             value={form.contact}
//             onChange={(e) => setForm({ ...form, contact: e.target.value })} />

//           <input type="file" onChange={handleImageChange} />

//           <button className="bg-[#006A6A] text-white w-full py-2 rounded">
//             {submitting ? "Posting..." : "Post"}
//           </button>
//         </form>

//         {/* LISTING PANEL */}
// <div className="bg-white border border-[#48A6A7]/30 p-5 rounded-xl shadow-sm">
//   <div className="flex justify-between mb-3">
//     <h2 className="font-semibold text-[#004B4B]">Available Books</h2>
//     <p className="text-xs text-gray-500">{filteredItems.length} listed</p>
//   </div>

//   {loading ? (
//     <p>Loading...</p>
//   ) : filteredItems.length === 0 ? (
//     <p className="text-sm text-gray-500 bg-[#F2EFE7] p-3 rounded-md">
//       No matching books found.
//     </p>
//   ) : (
//     <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
//       {filteredItems.map((item) => (
//         <div
//           key={item.id}
//           className="flex items-center gap-3 border p-3 rounded-lg bg-[#F9FAFB]"
//         >
//           {/* IMAGE */}
//           {item.image ? (
//             <Image
//               src={item.image}
//               width={48}
//               height={48}
//               alt={item.title}
//               className="rounded-md object-cover"
//             />
//           ) : (
//             <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] rounded-md">
//               No Img
//             </div>
//           )}

//           {/* DETAILS */}
//           <div className="flex-1">
//             <p className="font-semibold text-sm text-[#004B4B]">
//               {item.title}
//             </p>

//             <p className="text-xs text-gray-500">
//               {item.subject} • {item.condition}
//               {item.grade && ` • Class ${item.grade}`}
//             </p>

//             <p className="text-[11px] text-gray-500 mt-1">
//               📍 {item.location || "Unknown"}
//             </p>

//             <p className="text-[11px] text-gray-500">
//               Seller: {item.seller?.name || "Unknown"}
//             </p>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex flex-col items-end gap-2 min-w-[90px]">

//             <p className="font-semibold text-[#006A6A] text-sm">
//               Rs. {item.price}
//             </p>

//             {/* SOLD BADGE */}
//             {item.isSold && (
//               <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
//                 Sold
//               </span>
//             )}

//             {/* BUYER VIEW */}
//             {!item.isSold && session?.user?.id !== item.seller.id && (
//               <>
//                 <p className="text-[11px] font-medium text-[#006A6A]">
//                   📞 {item.contact}
//                 </p>

//                 <button
//                   onClick={async () => {
//                     const res = await fetch("/api/thrift/chat/start", {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({ itemId: item.id }),
//                     });

//                     const data = await res.json();

//                     if (data.conversationId) {
//                       window.location.href = `/dashboard/messages?thrift=${data.conversationId}`;
//                     }
//                   }}
//                   className="text-[11px] px-3 py-1 rounded-md bg-[#006A6A] text-white hover:bg-[#005454] transition"
//                 >
//                   Chat
//                 </button>
//               </>
//             )}

//             {/* SELLER CONTROLS */}
//             {session?.user?.id === item.seller.id && !item.isSold && (
//               <button
//                 onClick={async () => {
//                   await fetch("/api/thrift/sold", {
//                     method: "PATCH",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ itemId: item.id }),
//                   });
//                   fetchItems();
//                 }}
//                 className="text-[11px] px-3 py-1 border border-[#006A6A] text-[#006A6A] rounded-md hover:bg-[#006A6A] hover:text-white transition"
//               >
//                 Mark Sold
//               </button>
//             )}

//             {session?.user?.id === item.seller.id && (
//               <button
//                 onClick={async () => {
//                   await fetch("/api/thrift/delete", {
//                     method: "DELETE",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ itemId: item.id }),
//                   });
//                   fetchItems();
//                 }}
//                 className="text-[11px] px-3 py-1 border border-red-300 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
//               >
//                 Remove
//               </button>
//             )}

//           </div>
//         </div>
//       ))}
//     </div>
//   )}
// </div>

// </div>
// </div>
// );
// }


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";

type ThriftItem = {
  id: string;
  title: string;
  subject?: string;
  condition?: string;
  grade?: string;
  price: number;
  contact: string;
  location?: string;
  image?: string;
  isSold: boolean;
  sellerId: string;
  createdAt: string;
  seller: {
    id: string;
    name?: string;
  };
};

export default function ThriftPage() {
  const { data: session } = useSession();

  const [items, setItems] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    condition: "",
    grade: "",
    price: "",
    contact: "",
    location: "",
  });

  const [filter, setFilter] = useState({
    price: "",
  });

  /* ================= FETCH ================= */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/thrift/items", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) setItems(data);
      else if (Array.isArray((data as any).items)) setItems((data as any).items);
      else setItems([]);
    } catch {
      toast.error("Failed to load thrift items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ================= IMAGE ================= */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1_000_000) return toast.error("Image ≤ 1MB allowed");

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/thrift/upload-image", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setImageUrl(data.url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
        setPreview(null);
      }
    } catch {
      toast.error("Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) return toast.error("Login required");

    if (
      !form.title ||
      !form.subject ||
      !form.condition ||
      !form.grade ||
      !form.price ||
      !form.contact ||
      !form.location
    ) {
      return toast.error("All fields required");
    }

    /* ===== PHONE VALIDATION ===== */
    const validPrefixes = [
      "984","985","986","974","975",
      "980","981","982","970",
      "961","962",
    ];

    const isValidPhone =
      /^9\d{9}$/.test(form.contact) &&
      validPrefixes.some(p => form.contact.startsWith(p));

    if (!isValidPhone) {
      return toast.error("Enter valid Nepal number (98XXXXXXXX)");
    }

    setSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subject", form.subject);
    fd.append("condition", form.condition);
    fd.append("grade", form.grade);
    fd.append("price", form.price);
    fd.append("contact", form.contact);
    fd.append("location", form.location);
    if (imageUrl) fd.append("image", imageUrl);

    const res = await fetch("/api/thrift/create", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Book posted!");
      setForm({
        title: "",
        subject: "",
        condition: "",
        grade: "",
        price: "",
        contact: "",
        location: "",
      });
      setPreview(null);
      setImageUrl(null);
      fetchItems();
    } else {
      toast.error(data.error || "Error");
    }

    setSubmitting(false);
  };

  /* ================= FILTER ================= */
  const filteredItems = items.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();

      const match =
        item.subject?.toLowerCase().includes(q) ||
        item.grade?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q);

      if (!match) return false;
    }

    if (filter.price) {
      if (filter.price === "0-500" && item.price > 500) return false;
      if (filter.price === "500-1000" && (item.price < 500 || item.price > 1000)) return false;
      if (filter.price === "1000+" && item.price < 1000) return false;
    }

    return true;
  });
const reportItem = async (itemId: string) => {
  try {
    const res = await fetch("/api/thrift/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to report");
      return;
    }

    // ✅ SHOW TOAST FIRST
    toast.success("Report sent successfully");

    // then refresh list
    fetchItems();

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

  return (
    <div className="space-y-6 pb-8">

      <h1 className="text-2xl font-bold text-[#006A6A]">
        Thrift Section – Used Books
      </h1>

      {/* SEARCH + PRICE */}
      <div className="bg-white border p-4 rounded-xl shadow-sm space-y-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <span>🔍</span>
          <input
            placeholder="Search subject, grade, location..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-md text-sm"
          onChange={(e) => setFilter({ price: e.target.value })}
        >
          <option value="">Any Price</option>
          <option value="0-500">Below 500</option>
          <option value="500-1000">500-1000</option>
          <option value="1000+">1000+</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl space-y-4 shadow-sm">

          <h2 className="font-semibold text-[#004B4B]">Post a Book</h2>

          <input placeholder="Title *" className="border p-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <input placeholder="Subject *" className="border p-2 w-full"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })} />

          <select
            className="border p-2 w-full"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="">Condition *</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Used">Used</option>
          </select>

          <input placeholder="Grade *" className="border p-2 w-full"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })} />

          <input placeholder="Location *" className="border p-2 w-full"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <input placeholder="Price*" className="border p-2 w-full"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })} />

          <input
            placeholder="Contact (98XXXXXXXX)"
            className="border p-2 w-full"
            value={form.contact}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setForm({ ...form, contact: val });
            }}
            maxLength={10}
          />

          <label className="cursor-pointer border border-dashed px-3 py-2 rounded-md text-sm text-[#006A6A]">
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" className="hidden" onChange={handleImageChange} />
          </label>

          {preview && <Image src={preview} width={80} height={80} alt="" />}

          <button className="bg-[#006A6A] text-white w-full py-2 rounded">
            {submitting ? "Posting..." : "Post"}
          </button>
        </form>

      {/* Listing panel */}
<div className="bg-white border border-[#48A6A7]/30 p-5 rounded-xl shadow-sm">
  <div className="flex justify-between mb-3">
    <h2 className="font-semibold text-[#004B4B]">Available Books</h2>
    <p className="text-xs text-gray-500">{filteredItems.length} listed</p>
  </div>

  {loading ? (
    <p>Loading...</p>
  ) : filteredItems.length === 0 ? (
    <p className="text-sm text-gray-500 bg-[#F2EFE7] p-3 rounded-md">
      No books posted yet.
    </p>
  ) : (
    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 border p-3 rounded-lg bg-[#F9FAFB]"
        >
          {item.image ? (
            <Image
  src={item.image}
  width={48}
  height={48}
  alt={item.title}
  className="rounded-md object-cover cursor-pointer hover:scale-105 transition"
  onClick={() => setSelectedImage(item.image || null)}
/>

          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] rounded-md">
              No Img
            </div>
          )}

          <div className="flex-1">
            <p className="font-semibold text-sm text-[#004B4B]">
              {item.title}
            </p>

            <p className="text-xs text-gray-500">
              {item.subject} • {item.condition}
              {item.grade && ` • Class ${item.grade}`}
            </p>

            <p className="text-[11px] text-gray-500 mt-1">
              📍 {item.location || "Unknown"}
            </p>

            <p className="text-[11px] text-gray-500">
              Seller: {item.seller?.name || "Unknown"}
            </p>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-col items-end gap-2 min-w-[90px]">
            <p className="font-semibold text-[#006A6A] text-sm">
              Rs. {item.price}
            </p>

            {/* SOLD Badge */}
            {item.isSold && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                Sold
              </span>
            )}

            {/* Buyer View */}
            {!item.isSold && session?.user?.id !== item.seller.id && (
              <>
                <p className="text-[11px] font-medium text-[#006A6A]">
                  📞 {item.contact}
                </p>

                <button
                  onClick={async () => {
                    const res = await fetch("/api/thrift/chat/start", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ itemId: item.id }),
                    });

                    const data = await res.json();

                    if (data.conversationId) {
                      window.location.href = `/dashboard/messages?thrift=${data.conversationId}`;
                    }
                  }}
                  className="text-[11px] px-3 py-1 rounded-md bg-[#006A6A] text-white hover:bg-[#005454] transition"
                >
                  Chat
                </button>
              </>

              
            )}

            {/* Seller Controls */}
            {session?.user?.id === item.seller.id && !item.isSold && (
              <button
                onClick={async () => {
                  await fetch("/api/thrift/sold", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: item.id }),
                  });
                  fetchItems();
                }}
                className="text-[11px] px-3 py-1 border border-[#006A6A] text-[#006A6A] rounded-md hover:bg-[#006A6A] hover:text-white transition"
              >
                Mark Sold
              </button>
            )}

            {session?.user?.id === item.seller.id && (
              <button
                onClick={async () => {
                  await fetch("/api/thrift/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itemId: item.id }),
                  });
                  fetchItems();
                }}
                className="text-[11px] px-3 py-1 border border-red-300 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
              >
                Remove
              </button>
            )}
            
            <button
  onClick={() => reportItem(item.id)}
  className="text-[11px] px-3 py-1 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
>
  Report
</button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </div>
      {selectedImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <div className="relative max-w-3xl w-full px-4">
      
      {/* CLOSE BUTTON */}
      <button
        className="absolute top-2 right-2 text-white text-xl"
        onClick={() => setSelectedImage(null)}
      >
        ✕
      </button>

      {/* BIG IMAGE */}
      <img
        src={selectedImage}
        alt="Preview"
        className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
      />
    </div>
  </div>
)}
    </div>
    
  );
}