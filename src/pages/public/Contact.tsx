import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    setSent(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 text-[#3A2A2F] md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Get In Touch
          </p>

          <h1 className="mt-4 font-serif text-6xl font-light">
            Contact <span className="italic text-[#E75480]">Us</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#8A6F78]">
            Have questions about services, bookings, or academy courses? Send us
            a message and our team will get back to you soon.
          </p>

          <div className="mx-auto mt-8 h-[1px] w-20 bg-[#E75480]/50" />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-4xl text-[#E75480]">
              Visit Nirjara
            </h2>

            <div className="mt-8 space-y-6 text-[#8A6F78]">
              <div>
                <p className="font-semibold text-[#3A2A2F]">Branches</p>
                <p>Teku Branch, Kathmandu</p>
                <p>Chabahil Branch, Kathmandu</p>
              </div>

              <div>
                <p className="font-semibold text-[#3A2A2F]">Phone</p>
                <p>+977 98XXXXXXXX</p>
                <p>+977 01-4XXXXXX</p>
              </div>

              <div>
                <p className="font-semibold text-[#3A2A2F]">Email</p>
                <p>info@nirjarabeauty.com</p>
              </div>

              <div>
                <p className="font-semibold text-[#3A2A2F]">Opening Hours</p>
                <p>Sunday – Friday: 10:00 AM – 7:00 PM</p>
                <p>Saturday: 9:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-8 shadow-sm"
          >
            {sent && (
              <div className="mb-5 rounded-xl bg-[#FCE7EF] px-4 py-3 text-sm text-[#E75480]">
                Message sent successfully!
              </div>
            )}

            <div className="grid gap-5">
              <input
                required
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
              />

              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
              />

              <input
                required
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
              />

              <textarea
                required
                rows={6}
                placeholder="Write your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="resize-none rounded-xl border border-[#E75480]/20 bg-[#FFF5F8] px-4 py-3 outline-none"
              />

              <button
                disabled={loading}
                className="rounded-full bg-[#E75480] px-8 py-4 text-xs font-medium uppercase tracking-[2px] text-white shadow-lg transition hover:bg-[#C93D68] disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}