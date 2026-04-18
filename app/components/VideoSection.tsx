"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = ["/group.mp4", "/teaching.mp4"]; // ✅ FIXED
  const [index, setIndex] = useState(0);

  /* 🔁 SWITCH VIDEO */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIndex((prev) => (prev + 1) % videos.length);
    };

    video.onended = handleEnded;

    return () => {
      video.onended = null;
    };
  }, []);

  /* ▶️ UPDATE VIDEO SOURCE */
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.src = videos[index];   // ✅ IMPORTANT
      video.load();

      video.play().catch(() => {});
    }
  }, [index]);

  return (
  <section className="relative h-[60vh] w-full overflow-hidden -mt-[2px]">

      {/* 🎥 VIDEO */}
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
       className="absolute inset-0 w-full h-full object-cover block"
      />

      {/* 🌑 OVERLAY */}
     <div className="absolute inset-0 bg-gradient-to-b from-[#0f766e]/70 via-black/40 to-[#F2EFE7]"></div>

      {/* TEXT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Learn Anytime, Anywhere
        </h2>

        <p className="max-w-xl text-sm md:text-base text-white/90">
          Experience both one-to-one teaching and group learning seamlessly.
        </p>
      </div>

    </section>
  );
}