"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HowItWorksPage() {

  const videos = [
    "/search.mp4",
    "/tutor.mp4",
    "/pay.mp4",
    "/session.mp4",
    "/onlineclass.mp4",
  ];

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const handleEnd = () => {
    setIndex((prev) => (prev + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [index]);

  return (
    <div className="bg-[#F8FAFC]">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[70vh] overflow-hidden">

        <video
          src={videos[index]}
          onEnded={handleEnd}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            How TutorSewa Works
          </h1>

          <p className="mt-4 max-w-xl text-gray-200">
            A simple and effective way to connect with expert tutors and start learning.
          </p>
        </div>
      </section>

      {/* ================= SECTION 1 ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <video
          src="/search.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-xl shadow-md w-full"
        />

        <div>
          <h2 className="text-2xl font-semibold text-[#004B4B]">
            1. Search Tutors
          </h2>
          <p className="text-gray-600 mt-3">
            Easily find tutors based on subject, price, and availability that matches your needs.
          </p>
        </div>

      </section>

      {/* ================= SECTION 2 ================= */}
      <section className="py-20 px-6 bg-white grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">

        <div>
          <h2 className="text-2xl font-semibold text-[#004B4B]">
            2. Book & Pay
          </h2>
          <p className="text-gray-600 mt-3">
            Book your session securely and choose flexible payment options.
          </p>
        </div>

        <video
          src="/pay.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-xl shadow-md w-full"
        />

      </section>

      {/* ================= SECTION 3 ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <video
          src="/session.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="rounded-xl shadow-md w-full"
        />

        <div>
          <h2 className="text-2xl font-semibold text-[#004B4B]">
            3. Join & Learn
          </h2>
          <p className="text-gray-600 mt-3">
            Join live sessions and learn interactively from expert tutors.
          </p>
        </div>

      </section>

      {/* ================= FULL WIDTH VIDEO ================= */}
      <section className="relative w-full h-[60vh] overflow-hidden">

        <video
          src="/onlineclass.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>
<div className="relative z-10 h-full flex items-center justify-center text-white text-center px-6">
  <div>

    <h2 className="text-3xl font-bold">
      Complete Learning Journey
    </h2>

    <p className="mt-4 text-gray-200">
      Search → Choose Tutor → Book → Pay → Join Session → Learn → Review
    </p>

    {/* ✅ BUTTON INSIDE VIDEO */}
    <button
  onClick={() => router.push("/register")}
  className="mt-6 bg-[#006A6A] text-white px-6 py-3 rounded-xl hover:bg-[#005454] transition"
>
  Get Started
</button>

  </div>
</div>

      </section>

    

    </div>
  );
}