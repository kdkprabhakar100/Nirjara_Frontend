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

/* ============================================================
   ICONS
============================================================ */

function LocationIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.7a16 16 0 0 0 4.3 4.3l1.24-1.24a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function ClockIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MailIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ExternalLinkIcon({
  className = "h-3.5 w-3.5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

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

      setSettings({
        phone: "",
        email: "",
      });
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

      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-4
          pb-10
          pt-[104px]
          text-[#3A2A2F]

          sm:px-6
          lg:px-8
          xl:px-10
        "
      >
        <section className="mx-auto max-w-[1400px]">
          <div
            className="
              grid
              gap-5

              lg:grid-cols-[1.05fr_0.95fr]
              xl:gap-6
            "
          >
            {/* ==================================================
                VISIT NIRJARA

                MOBILE / TABLET:
                Second

                DESKTOP 1024+:
                Left / First
            ================================================== */}

            <section
              className="
                order-2

                rounded-[28px]
                border
                border-[#E75480]/10
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(58,42,47,0.05)]

                sm:p-7

                lg:order-1
                lg:p-6

                xl:p-8
              "
            >
              {/* ==================================================
                  HEADING
              ================================================== */}

              <div>
                <h1
                  className="
                    font-serif
                    text-[40px]
                    leading-[0.95]
                    tracking-[-1px]
                    text-[#3A2A2F]

                    sm:text-[46px]

                    lg:text-[42px]

                    xl:text-[50px]
                  "
                >
                  Visit{" "}
                  <span className="italic text-[#E75480]">
                    Nirjara
                  </span>
                </h1>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-[14px]
                    leading-6
                    text-[#8A6F78]

                    sm:text-[15px]

                    lg:text-[13px]

                    xl:text-[15px]
                  "
                >
                  Visit one of our locations or contact our team for
                  appointments and enquiries.
                </p>
              </div>

              {/* ==================================================
                  BRANCH TITLE
              ================================================== */}

              <div className="mt-7 flex items-center gap-4">
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[4px]
                    text-[#3A2A2F]
                  "
                >
                  Branches
                </p>

                <span className="h-px w-14 bg-[#E75480]/45" />
              </div>

              {/* ==================================================
                  BRANCH GRID
              ================================================== */}

              {branches.length > 0 ? (
                <div
                  className="
                    mt-4
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                  "
                >
                  {branches.map((branch, index) => (
                    <article
                      key={branch._id || `${branch.name}-${index}`}
                      className="
                        group
                        min-w-0
                        rounded-[20px]
                        border
                        border-[#E75480]/15
                        bg-[#FFF9FB]
                        p-4
                        transition-all
                        duration-300

                        hover:-translate-y-[2px]
                        hover:border-[#E75480]/35
                        hover:bg-white
                        hover:shadow-[0_10px_25px_rgba(231,84,128,0.10)]

                        lg:rounded-[18px]
                        lg:p-3.5

                        xl:rounded-[20px]
                        xl:p-4
                      "
                    >
                      {/* ============================================
                          LOCATION
                      ============================================ */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-3

                          lg:gap-2.5

                          xl:gap-3
                        "
                      >
                        {branch.mapUrl ? (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${branch.name} location`}
                            title="Open location in maps"
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#FCE7EF]
                              text-[#E75480]
                              transition-all
                              duration-300

                              hover:scale-105
                              hover:bg-[#E75480]
                              hover:text-white

                              lg:h-9
                              lg:w-9

                              xl:h-10
                              xl:w-10
                            "
                          >
                            <LocationIcon
                              className="
                                h-[18px]
                                w-[18px]

                                lg:h-[16px]
                                lg:w-[16px]

                                xl:h-[18px]
                                xl:w-[18px]
                              "
                            />
                          </a>
                        ) : (
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#FCE7EF]
                              text-[#E75480]

                              lg:h-9
                              lg:w-9

                              xl:h-10
                              xl:w-10
                            "
                          >
                            <LocationIcon
                              className="
                                h-[18px]
                                w-[18px]

                                lg:h-[16px]
                                lg:w-[16px]

                                xl:h-[18px]
                                xl:w-[18px]
                              "
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          {/* ========================================
                              BRANCH NAME

                              Smaller at 1024px so it fits
                              on one line.
                          ======================================== */}

                          <h2
                            title={branch.name}
                            className="
                              max-w-full
                              truncate
                              whitespace-nowrap
                              font-serif
                              text-[15px]
                              font-semibold
                              leading-[1.25]
                              text-[#3A2A2F]

                              lg:text-[13px]

                              xl:text-[15px]

                              2xl:text-[16px]
                            "
                          >
                            {branch.name}
                          </h2>

                          {/* ========================================
                              ADDRESS
                          ======================================== */}

                          {branch.address &&
                            (branch.mapUrl ? (
                              <a
                                href={branch.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Open ${branch.address} in maps`}
                                className="
                                  mt-1
                                  flex
                                  min-w-0
                                  items-start
                                  gap-1
                                  text-[12px]
                                  leading-5
                                  text-[#8A6F78]
                                  transition-colors
                                  duration-200

                                  hover:text-[#E75480]

                                  lg:text-[11px]

                                  xl:text-[12px]
                                "
                              >
                                <span className="min-w-0 line-clamp-2">
                                  {branch.address}
                                </span>

                                <ExternalLinkIcon
                                  className="
                                    mt-[3px]
                                    h-3
                                    w-3
                                    shrink-0
                                  "
                                />
                              </a>
                            ) : (
                              <p
                                className="
                                  mt-1
                                  line-clamp-2
                                  text-[12px]
                                  leading-5
                                  text-[#8A6F78]

                                  lg:text-[11px]

                                  xl:text-[12px]
                                "
                              >
                                {branch.address}
                              </p>
                            ))}
                        </div>
                      </div>

                      {/* ============================================
                          DIVIDER
                      ============================================ */}

                      <div
                        className="
                          my-3
                          h-px
                          bg-[#E75480]/10

                          lg:my-2.5

                          xl:my-3
                        "
                      />

                      {/* ============================================
                          PHONE
                      ============================================ */}

                      {branch.phone && (
                        <a
                          href={`tel:${branch.phone}`}
                          title={`Call ${branch.phone}`}
                          className="
                            group/phone
                            flex
                            w-fit
                            items-center
                            gap-2
                            rounded-lg
                            py-0.5
                            text-[12px]
                            text-[#6D5860]
                            transition-all
                            duration-200

                            hover:text-[#E75480]

                            lg:text-[11px]

                            xl:text-[12px]
                          "
                        >
                          <PhoneIcon
                            className="
                              h-[14px]
                              w-[14px]
                              shrink-0
                              text-[#E75480]
                              transition-transform
                              duration-200

                              group-hover/phone:scale-110

                              lg:h-[13px]
                              lg:w-[13px]

                              xl:h-[14px]
                              xl:w-[14px]
                            "
                          />

                          <span className="whitespace-nowrap">
                            {branch.phone}
                          </span>
                        </a>
                      )}

                      {/* ============================================
                          OPENING HOURS
                      ============================================ */}

                      {branch.openingHours && (
                        <div
                          className="
                            mt-1.5
                            flex
                            items-center
                            gap-2
                            text-[12px]
                            text-[#6D5860]

                            lg:text-[11px]

                            xl:text-[12px]
                          "
                        >
                          <ClockIcon
                            className="
                              h-[14px]
                              w-[14px]
                              shrink-0
                              text-[#E75480]

                              lg:h-[13px]
                              lg:w-[13px]

                              xl:h-[14px]
                              xl:w-[14px]
                            "
                          />

                          <span className="whitespace-nowrap">
                            {branch.openingHours}
                          </span>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div
                  className="
                    mt-4
                    rounded-[18px]
                    border
                    border-[#E75480]/10
                    bg-[#FFF9FB]
                    p-4
                    text-sm
                    text-[#8A6F78]
                  "
                >
                  Branch information is currently being updated.
                </div>
              )}

              {/* ==================================================
                  PHONE + EMAIL
              ================================================== */}

              <div className="mt-5 h-px bg-[#E75480]/10" />

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3

                  sm:grid-cols-2
                "
              >
                {/* ==================================================
                    MAIN PHONE
                ================================================== */}

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    title={`Call ${settings.phone}`}
                    className="
                      group
                      flex
                      min-w-0
                      items-center
                      gap-3
                      rounded-[18px]
                      border
                      border-[#E75480]/15
                      bg-[#FFF9FB]
                      p-4
                      transition-all
                      duration-300

                      hover:-translate-y-[2px]
                      hover:border-[#E75480]/35
                      hover:bg-white
                      hover:shadow-[0_8px_22px_rgba(231,84,128,0.10)]

                      lg:gap-2.5
                      lg:p-3.5

                      xl:gap-3
                      xl:p-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FCE7EF]
                        text-[#E75480]
                        transition-all
                        duration-300

                        group-hover:bg-[#E75480]
                        group-hover:text-white

                        lg:h-9
                        lg:w-9

                        xl:h-10
                        xl:w-10
                      "
                    >
                      <PhoneIcon
                        className="
                          h-[17px]
                          w-[17px]

                          lg:h-[15px]
                          lg:w-[15px]

                          xl:h-[17px]
                          xl:w-[17px]
                        "
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[3px]
                          text-[#3A2A2F]

                          lg:text-[8px]

                          xl:text-[9px]
                        "
                      >
                        Phone
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[14px]
                          text-[#765F68]
                          transition-colors

                          group-hover:text-[#E75480]

                          lg:text-[12px]

                          xl:text-[14px]
                        "
                      >
                        {settings.phone}
                      </p>
                    </div>
                  </a>
                )}

                {/* ==================================================
                    EMAIL
                ================================================== */}

                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    title={`Email ${settings.email}`}
                    className="
                      group
                      flex
                      min-w-0
                      items-center
                      gap-3
                      rounded-[18px]
                      border
                      border-[#E75480]/15
                      bg-[#FFF9FB]
                      p-4
                      transition-all
                      duration-300

                      hover:-translate-y-[2px]
                      hover:border-[#E75480]/35
                      hover:bg-white
                      hover:shadow-[0_8px_22px_rgba(231,84,128,0.10)]

                      lg:gap-2.5
                      lg:p-3.5

                      xl:gap-3
                      xl:p-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FCE7EF]
                        text-[#E75480]
                        transition-all
                        duration-300

                        group-hover:bg-[#E75480]
                        group-hover:text-white

                        lg:h-9
                        lg:w-9

                        xl:h-10
                        xl:w-10
                      "
                    >
                      <MailIcon
                        className="
                          h-[17px]
                          w-[17px]

                          lg:h-[15px]
                          lg:w-[15px]

                          xl:h-[17px]
                          xl:w-[17px]
                        "
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[3px]
                          text-[#3A2A2F]

                          lg:text-[8px]

                          xl:text-[9px]
                        "
                      >
                        Email
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[14px]
                          text-[#765F68]
                          transition-colors

                          group-hover:text-[#E75480]

                          lg:text-[12px]

                          xl:text-[14px]
                        "
                      >
                        {settings.email}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </section>

            {/* ==================================================
                SEND MESSAGE

                MOBILE / TABLET:
                First

                DESKTOP 1024+:
                Right / Second
            ================================================== */}

            <section
              className="
                order-1

                rounded-[28px]
                border
                border-[#E75480]/10
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(58,42,47,0.05)]

                sm:p-7

                lg:order-2
                lg:p-6

                xl:p-8
              "
            >
              {/* ==================================================
                  FORM HEADING
              ================================================== */}

              <h2
                className="
                  font-serif
                  text-[40px]
                  leading-[0.95]
                  tracking-[-1px]
                  text-[#3A2A2F]

                  sm:text-[46px]

                  lg:text-[42px]

                  xl:text-[50px]
                "
              >
                Send a{" "}
                <span className="italic text-[#E75480]">
                  Message
                </span>
              </h2>

              <p
                className="
                  mt-4
                  text-[14px]
                  leading-6
                  text-[#8A6F78]

                  sm:text-[15px]

                  lg:text-[13px]

                  xl:text-[15px]
                "
              >
                Fill out the form below and our team will get back to you.
              </p>

              {/* ==================================================
                  SUCCESS MESSAGE
              ================================================== */}

              {sent && (
                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-[#E75480]/10
                    bg-[#FCE7EF]
                    px-4
                    py-3
                    text-sm
                    text-[#E75480]
                  "
                >
                  Message sent successfully!
                </div>
              )}

              {/* ==================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="
                  mt-7
                  grid
                  gap-4

                  lg:mt-6
                  lg:gap-3.5

                  xl:mt-7
                  xl:gap-4
                "
              >
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
                    h-[52px]
                    rounded-[16px]
                    border
                    border-[#E75480]/20
                    bg-[#FFF9FB]
                    px-5
                    text-[13px]
                    text-[#3A2A2F]
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-[#B69AA4]

                    hover:border-[#E75480]/35

                    focus:border-[#E75480]/50
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#E75480]/5

                    lg:h-[48px]

                    xl:h-[52px]
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
                    h-[52px]
                    rounded-[16px]
                    border
                    border-[#E75480]/20
                    bg-[#FFF9FB]
                    px-5
                    text-[13px]
                    text-[#3A2A2F]
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-[#B69AA4]

                    hover:border-[#E75480]/35

                    focus:border-[#E75480]/50
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#E75480]/5

                    lg:h-[48px]

                    xl:h-[52px]
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
                    h-[52px]
                    rounded-[16px]
                    border
                    border-[#E75480]/20
                    bg-[#FFF9FB]
                    px-5
                    text-[13px]
                    text-[#3A2A2F]
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-[#B69AA4]

                    hover:border-[#E75480]/35

                    focus:border-[#E75480]/50
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#E75480]/5

                    lg:h-[48px]

                    xl:h-[52px]
                  "
                />

                <textarea
                  required
                  rows={5}
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  className="
                    min-h-[140px]
                    resize-none
                    rounded-[16px]
                    border
                    border-[#E75480]/20
                    bg-[#FFF9FB]
                    px-5
                    py-4
                    text-[13px]
                    text-[#3A2A2F]
                    outline-none
                    transition-all
                    duration-200

                    placeholder:text-[#B69AA4]

                    hover:border-[#E75480]/35

                    focus:border-[#E75480]/50
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#E75480]/5

                    lg:min-h-[130px]

                    xl:min-h-[140px]
                  "
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-1
                    h-[52px]
                    rounded-full
                    bg-[#E75480]
                    px-8
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-white
                    shadow-[0_10px_25px_rgba(231,84,128,0.22)]
                    transition-all
                    duration-300

                    hover:-translate-y-[2px]
                    hover:bg-[#D94773]
                    hover:shadow-[0_14px_30px_rgba(231,84,128,0.30)]

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    lg:h-[48px]

                    xl:h-[52px]
                  "
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}