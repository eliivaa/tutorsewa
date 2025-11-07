export default function HowItWorks() {
  const steps = [
    { title: "1. Search", desc: "Browse thousands of qualified tutors by subjects, availability and price." },
    { title: "2. Book & Pay", desc: "Book your preferred tutor and pay securely." },
    { title: "3. Learn", desc: "Start learning online with interactive sessions." }
  ];

  return (
    <section className="py-12 text-center">
      <h2 className="font-semibold text-xl underline underline-offset-4 mb-8">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {steps.map((step) => (
          <div key={step.title} className="bg-white p-6 rounded-xl shadow-md w-64">
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
