export default function ContactUs() {
  return (
    <section id="contact-us" className="py-16 px-6 md:px-12 bg-[#F6F6F6] text-center">
      <h2 className="text-xl font-semibold text-[#004B4B] underline underline-offset-4 mb-6">
        Contact Us
      </h2>
      <p className="text-gray-700 mb-8">
        Have questions? Reach out to our team — we’d love to hear from you!
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
        <div>
          <h3 className="font-semibold mb-2 text-[#006A6A]">📧 Email</h3>
          <p>support@tutorsewa.com</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-[#006A6A]">📞 Phone</h3>
          <p>+977-9800000000</p>
        </div>
      </div>
    </section>
  );
}
