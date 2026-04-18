"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  seller: {
    name?: string;
    email?: string;
  };
};

export default function AdminThriftPage() {
  const [items, setItems] = useState<ThriftItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<ThriftItem | null>(null);
  const [reason, setReason] = useState("");

  /* ================= FETCH REPORTED ITEMS ================= */

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/thrift");
      const data = await res.json();
      setItems(data || []);
    } catch {
      alert("Failed to load reported items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!selectedItem) return;
    if (!reason.trim()) return alert("Please provide a reason");

    try {
      const res = await fetch("/api/admin/thrift/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          reason,
        }),
      });

      if (res.ok) {
        alert("Item removed successfully");
        setSelectedItem(null);
        setReason("");
        fetchItems();
      } else {
        alert("Failed to delete item");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-[#004B4B]">
        Reported Thrift Items
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No reported items</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-[#F2EFE7] text-[#004B4B]">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Details</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">

                  <td className="p-3">
                    {item.image ? (
                      <Image
                        src={item.image}
                        width={50}
                        height={50}
                        alt=""
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="p-3 font-medium">{item.title}</td>

                  <td className="p-3 text-xs text-gray-600">
                    {item.subject} • {item.condition} • Class {item.grade}
                    <br />
                    📍 {item.location || "Unknown"}
                    <br />
                    📞 {item.contact}
                  </td>

                  <td className="p-3 text-xs">
                    {item.seller?.name}
                    <br />
                    {item.seller?.email}
                  </td>

                  <td className="p-3 font-semibold text-[#006A6A]">
                    Rs. {item.price}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Review / Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL ================= */}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">

            <h2 className="text-lg font-semibold text-[#004B4B]">
              Remove Listing
            </h2>

            <p className="text-sm text-gray-600">
              You are removing: <b>{selectedItem.title}</b>
            </p>

            <textarea
              placeholder="Enter reason for removal..."
              className="w-full border p-2 rounded-md text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setReason("");
                }}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}