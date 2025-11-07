export default function CTASection() {
  return (
    <section className="bg-[#006A6A] text-center text-white py-10">
      <h2 className="text-lg font-semibold mb-2">Ready to Start Your Learning Journey?</h2>
      <p className="text-sm mb-6">Join thousands of students who are already improving their skills with TutorSewa.</p>
      <div className="space-x-4">
        <button className="bg-white text-[#006A6A] px-5 py-2 rounded-md hover:bg-gray-100 transition">
          Get Started as Student
        </button>
        <button className="border border-white px-5 py-2 rounded-md hover:bg-white hover:text-[#006A6A] transition">
          Become a Tutor
        </button>
      </div>
    </section>
  );
}
