import { useEffect, useState } from "react";
import SEO from "../../components/SEO";

const CONTACT_SEO = {
  title: "Contact Nirjara Beauty | Beauty Salon Kathmandu",
  description:
    "Contact Nirjara Beauty in Kathmandu for salon services, beauty treatments, academy information, appointments and general enquiries.",
  keywords:
    "contact Nirjara Beauty, beauty salon Kathmandu contact, Nirjara Beauty Kathmandu, book beauty salon Kathmandu",
  canonical: "/contact",
  image: "/images/nirjara-og.jpg",
  type: "website",
};

type Branch = {
  _id?: string;
  name: string;
  label?: string;
  address: string;
  phone?: string;
  openingHours?: string;
  mapUrl?: string;
};

type SiteSettings = {
  phone?: string;
  email?: string;
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    phone: "",
    email: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  /* ============================================================
     FETCH BRANCHES
  ============================================================ */

  const fetchBranches = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/branches`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await res.json();

      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("BRANCH FETCH ERROR:", error);
      setBranches([]);
    }
  };

  /* ============================================================
     FETCH SITE SETTINGS
  ============================================================ */

  const fetchSettings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/site-settings`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch site settings");
      }

      const data = await res.json();

      setSettings({
        phone: data?.phone || "",
        email: data?.email || "",
      });
    } catch (error) {
      console.error("SITE SETTINGS FETCH ERROR:", error);
    }
  };

  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {
    fetchBranches();
    fetchSettings();
  }, []);

  /* ============================================================
     CONTACT FORM
  ============================================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setSent(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSent(true);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={CONTACT_SEO.title}
        description={CONTACT_SEO.description}
        keywords={CONTACT_SEO.keywords}
        canonical={CONTACT_SEO.canonical}
        image={CONTACT_SEO.image}
        type="website"
      />

      <main className="min-h-screen bg-[#FFF5F8] px-6 pb-24 pt-36 text-[#3A2A2F] md:px-12">
        <section className="mx-auto max-w-6xl">

          {/* =====================================================
              PAGE HEADING
          ===================================================== */}

          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
              Get In Touch
            </p>

            <h1 className="mt-4 font-serif text-5xl font-light sm:text-6xl">
              Contact{" "}
              <span className="italic text-[#E75480]">
                Us
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#8A6F78]">
              Have questions about services, bookings, or academy courses?
              Send us a message and our team will get back to you soon.
            </p>

            <div className="mx-auto mt-8 h-[1px] w-20 bg-[#E75480]/50" />
          </div>

          {/* =====================================================
              CONTACT GRID
          ===================================================== */}

          <div className="grid gap-10 md:grid-cols-2">

            {/* ===================================================
                CONTACT INFORMATION
            =================================================== */}

            <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
              <h2 className="font-serif text-4xl text-[#E75480]">
                Visit Nirjara
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8A6F78]">
                Visit one of our locations or contact our team for
                appointments and enquiries.
              </p>

              <div className="mt-8 space-y-8 text-[#8A6F78]">

                {/* ===============================================
                    BRANCHES
                =============================================== */}

                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[1.5px] text-[#3A2A2F]">
                    Branches
                  </p>

                  {branches.length > 0 ? (
                    <div className="space-y-5">
                      {branches.map((branch, index) => (
                        <div
                          key={branch._id || `${branch.name}-${index}`}
                          className="
                            border-b
                            border-[#E75480]/10
                            pb-5
                            last:border-b-0
                            last:pb-0
                          "
                        >
                          <p className="font-medium text-[#3A2A2F]">
                            {branch.name}
                          </p>

                          {branch.address && (
                            <p className="mt-1 text-sm leading-6">
                              {branch.address}
                            </p>
                          )}

                          {branch.phone && (
                            <a
                              href={`tel:${branch.phone}`}
                              className="
                                mt-2
                                block
                                text-sm
                                transition-colors
                                hover:text-[#E75480]
                              "
                            >
                              {branch.phone}
                            </a>
                          )}

                          {branch.openingHours && (
                            <p className="mt-2 text-sm">
                              {branch.openingHours}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">
                      Branch information is currently being updated.
                    </p>
                  )}
                </div>

                {/* ===============================================
                    MAIN PHONE
                =============================================== */}

                {settings.phone && (
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[1.5px] text-[#3A2A2F]">
                      Phone
                    </p>

                    <a
                      href={`tel:${settings.phone}`}
                      className="
                        transition-colors
                        hover:text-[#E75480]
                      "
                    >
                      {settings.phone}
                    </a>
                  </div>
                )}

                {/* ===============================================
                    EMAIL
                =============================================== */}

                {settings.email && (
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[1.5px] text-[#3A2A2F]">
                      Email
                    </p>

                    <a
                      href={`mailto:${settings.email}`}
                      className="
                        break-all
                        transition-colors
                        hover:text-[#E75480]
                      "
                    >
                      {settings.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ===================================================
                CONTACT FORM
            =================================================== */}

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-8 shadow-sm sm:p-10"
            >
              <h2 className="font-serif text-4xl text-[#3A2A2F]">
                Send a{" "}
                <span className="italic text-[#E75480]">
                  Message
                </span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8A6F78]">
                Fill out the form below and our team will get back to you.
              </p>

              {sent && (
                <div className="mt-6 rounded-xl bg-[#FCE7EF] px-4 py-3 text-sm text-[#E75480]">
                  Message sent successfully!
                </div>
              )}

              <div className="mt-8 grid gap-5">
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="
                    rounded-xl
                    border
                    border-[#E75480]/20
                    bg-[#FFF5F8]
                    px-4
                    py-3.5
                    text-sm
                    text-[#3A2A2F]
                    outline-none
                    transition
                    placeholder:text-[#8A6F78]/60
                    focus:border-[#E75480]/50
                    focus:ring-2
                    focus:ring-[#E75480]/10
                  "
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="
                    rounded-xl
                    border
                    border-[#E75480]/20
                    bg-[#FFF5F8]
                    px-4
                    py-3.5
                    text-sm
                    text-[#3A2A2F]
                    outline-none
                    transition
                    placeholder:text-[#8A6F78]/60
                    focus:border-[#E75480]/50
                    focus:ring-2
                    focus:ring-[#E75480]/10
                  "
                />

                <input
                  required
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  className="
                    rounded-xl
                    border
                    border-[#E75480]/20
                    bg-[#FFF5F8]
                    px-4
                    py-3.5
                    text-sm
                    text-[#3A2A2F]
                    outline-none
                    transition
                    placeholder:text-[#8A6F78]/60
                    focus:border-[#E75480]/50
                    focus:ring-2
                    focus:ring-[#E75480]/10
                  "
                />

                <textarea
                  required
                  rows={6}
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  className="
                    resize-none
                    rounded-xl
                    border
                    border-[#E75480]/20
                    bg-[#FFF5F8]
                    px-4
                    py-3.5
                    text-sm
                    text-[#3A2A2F]
                    outline-none
                    transition
                    placeholder:text-[#8A6F78]/60
                    focus:border-[#E75480]/50
                    focus:ring-2
                    focus:ring-[#E75480]/10
                  "
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2
                    rounded-full
                    bg-[#E75480]
                    px-8
                    py-4
                    text-xs
                    font-medium
                    uppercase
                    tracking-[2px]
                    text-white
                    shadow-lg
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#C93D68]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}