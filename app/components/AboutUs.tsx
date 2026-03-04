"use client";

import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section
      id="about-us"
      className="py-24 px-6 md:px-12 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

        {/* LEFT SIDE - Animated Shape */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="md:w-1/2 flex justify-center"
        >
          <div className="w-64 h-64 bg-gradient-to-tr from-[#006A6A] to-[#009999] rounded-full blur-2xl opacity-30 absolute"></div>

          <div className="relative bg-[#006A6A] text-white p-10 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-sm leading-relaxed text-white/90">
              To make quality education accessible and affordable
              while empowering tutors to teach flexibly.
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Text */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="md:w-1/2"
        >
          <h2 className="text-3xl font-semibold text-[#004B4B] mb-6">
            About TutorSewa
          </h2>

          <p className="text-gray-700 leading-relaxed text-base">
            TutorSewa connects students with qualified tutors for
            personalized 1-to-1 online sessions. Whether you're preparing
            for exams or learning new skills, our platform ensures
            interactive, secure, and flexible learning from anywhere.
          </p>
        </motion.div>

      </div>
    </section>
  );
}