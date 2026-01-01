"use client";

import { useState } from "react";
import TutorLogin from "../login/page";
import TutorRegistration from "../register/page";

export default function TutorAuthPortal() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2EFE7] p-4">

      {/* MAIN CONTAINER */}
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT TABS */}
        <div className="bg-[#004B4B] text-white w-full md:w-1/3 p-8 flex flex-col justify-center gap-6 text-center">

          <h1 className="text-3xl font-bold mb-4">Become a Tutor</h1>

          <button
            onClick={() => setActiveTab("register")}
            className={`py-2 rounded-lg transition ${
              activeTab === "register" ? "bg-white text-[#004B4B] font-bold" : "bg-transparent border border-white"
            }`}
          >
            Register as Tutor
          </button>

          <button
            onClick={() => setActiveTab("login")}
            className={`py-2 rounded-lg transition ${
              activeTab === "login" ? "bg-white text-[#004B4B] font-bold" : "bg-transparent border border-white"
            }`}
          >
            Already Registered? Login
          </button>

          {/* Mobile instruction */}
          <p className="md:hidden text-sm opacity-75 mt-4">
            Swipe left or right to switch.
          </p>
        </div>

        {/* RIGHT CONTENT – ANIMATED */}
        <div className="relative w-full md:w-2/3 overflow-hidden">

          <div
            className="flex transition-transform duration-500"
            style={{
              transform: activeTab === "register" ? "translateX(0%)" : "translateX(-50%)",
              width: "200%",
            }}
          >
            {/* REGISTER PANEL */}
            <div className="w-1/2 p-6 overflow-y-auto max-h-[90vh]">
              <TutorRegistration />
            </div>

            {/* LOGIN PANEL */}
            <div className="w-1/2 p-6 overflow-y-auto max-h-[90vh]">
              <TutorLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
