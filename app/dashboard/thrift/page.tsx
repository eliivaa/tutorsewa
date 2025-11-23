"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";

export default function ThriftPage() {
  const [bookTitle, setBookTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-5">Thrift Section</h1>

      <div className="bg-[#F5F2EA] p-6 rounded-xl mb-8">

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <label>Book Title</label>
            <input 
              type="text"
              className="w-full border p-2 mt-1 rounded"
              placeholder="Enter book title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Subject/Level</label>
            <input 
              type="text"
              className="w-full border p-2 mt-1 rounded"
              placeholder="Select subject and level"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label>Condition</label>
            <textarea
              className="w-full border p-2 mt-1 rounded"
              rows={3}
              placeholder="Describe book condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
          </div>

          <div>
            <label>Price</label>
            <input 
              type="text"
              className="w-full border p-2 mt-1 rounded"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

        </div>

        {/* UPLOAD SECTION */}
        <div className="border-2 border-dashed border-[#c7c2b8] rounded-md mt-6 p-6 text-center">
          {imagePreview ? (
            <Image src={imagePreview} width={120} height={120} alt="preview" className="mx-auto rounded" />
          ) : (
            <p className="text-gray-500 mb-4">Drag and drop or click to upload</p>
          )}
          <label className="cursor-pointer px-4 py-2 bg-[#48A6A7] text-white rounded">
            Upload
            <input type="file" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* PHONE */}
        <div className="mt-6">
          <label>Contact Number (for direct calls)</label>
          <input 
            type="text"
            className="w-full border p-2 mt-1 rounded"
            placeholder="Enter your contact number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: Buyers will contact you via phone.
          </p>
        </div>

        {/* BUTTON */}
        <button
          className="mt-6 bg-[#006A6A] text-white px-5 py-2 rounded-md"
        >
          Add to List
        </button>
      </div>

      {/* LISTINGS */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Listings</h2>

        {/* Example card */}
        <div className="flex items-center gap-4 py-3 border-b">
          <Image src="/book.png" width={60} height={60} alt="Book" className="rounded" />
          
          <div>
            <p className="font-medium">Advanced Calculus</p>
            <p className="text-sm text-gray-500">$25 – Seller: Anya Sharma</p>
            <p className="text-sm text-gray-500">Grade – 12</p>
          </div>

          <div className="ml-auto flex items-center gap-2 bg-[#E3F5F6] px-3 py-1 rounded">
            <Phone size={14} className="text-[#006A6A]" />
            <span className="text-sm font-medium text-[#006A6A]">
              +977 9876543210
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
