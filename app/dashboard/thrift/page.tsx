// app/dashboard/thrift/page.tsx

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
  image?: string;
  createdAt: string;
  seller: {
    name?: string;
    grade?: string;
    image?: string;
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

  const [form, setForm] = useState({
    title: "",
    subject: "",
    condition: "",
    grade: "",
    price: "",
    contact: "",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/thrift/items", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) setItems(data);
      else if (Array.isArray((data as any).items)) setItems((data as any).items);
      else setItems([]);

    } catch (err) {
      console.error("Failed to load thrift items:", err);
      toast.error("Failed to load thrift items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
        toast.error(data.error || "Upload failed");
        setPreview(null);
      }
    } catch (err) {
      toast.error("Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) return toast.error("Login required");

    if (!form.title || !form.subject || !form.condition || !form.grade || !form.price || !form.contact) {
      return toast.error("All fields are required");
    }

    setSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subject", form.subject);
    fd.append("condition", form.condition);
    fd.append("grade", form.grade);
    fd.append("price", form.price);
    fd.append("contact", form.contact);
    if (imageUrl) fd.append("image", imageUrl);

    try {
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
        });
        setPreview(null);
        setImageUrl(null);
        fetchItems();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold text-[#006A6A]">Thrift Section – Used Books</h1>
      <p className="text-sm text-gray-600">Sell and buy used reference books and guides.</p>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Post book form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#48A6A7]/30 p-5 rounded-xl space-y-4 shadow-sm"
        >
          <h2 className="font-semibold text-[#004B4B]">Post a Book</h2>

          <input
            placeholder="Book Title *"
            className="border rounded-md p-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Subject *"
              className="border rounded-md p-2 w-full"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />

            <select
              className="border rounded-md p-2 w-full"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              required
            >
              <option value="">Condition *</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <input
            placeholder="Class / Grade (example: 10, 11, 12) *"
            className="border rounded-md p-2 w-full"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              className="border rounded-md p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price (Rs) *"
              required
            />

            <input
              placeholder="Contact *"
              className="border rounded-md p-2 w-full"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              required
            />
          </div>

          <label className="cursor-pointer border border-dashed px-3 py-1 rounded-md text-sm text-[#006A6A]">
            {uploading ? "Uploading..." : "Upload Image *"}
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              required={!imageUrl}
            />
          </label>

          {preview && (
            <Image
              src={preview}
              width={80}
              height={80}
              alt="Preview"
              className="rounded-md object-cover border"
            />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#006A6A] w-full text-white rounded-md py-2 hover:bg-[#005454]"
          >
            {submitting ? "Posting..." : "Post Book"}
          </button>
        </form>

        {/* Listing panel */}
        <div className="bg-white border border-[#48A6A7]/30 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between mb-3">
            <h2 className="font-semibold text-[#004B4B]">Available Books</h2>
            <p className="text-xs text-gray-500">{items.length} listed</p>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500 bg-[#F2EFE7] p-3 rounded-md">
              No books posted yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {items.map((item) => (
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
                      className="rounded-md object-cover"
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
                      Seller: {item.seller?.name || "Unknown"}
                    </p>
                  </div>

                  {/* RIGHT BUTTONS */}
                  <div className="text-right text-xs space-y-1">

                    <p className="font-bold text-[#006A6A]">Rs {item.price}</p>

                    {/* Contact Button */}
                    <a
                      href={`tel:${item.contact}`}
                      className="border px-2 py-1 rounded-md text-[#006A6A] hover:bg-[#006A6A] hover:text-white block"
                    >
                      Contact
                    </a>

                    {/* Chat Button */}
                    <button
                      onClick={() => {
                        window.location.href = `/dashboard/thrift/chat?item=${item.id}`;
                      }}
                      className="border px-2 py-1 rounded-md text-white bg-[#006A6A] hover:bg-[#005454] w-full"
                    >
                      Chat
                    </button>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
