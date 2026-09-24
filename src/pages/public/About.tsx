import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

type TeamMember = {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  image?: string;
  order?: number;
  status?: string;
};

/* =========================================================
   IMAGE HELPER
========================================================= */

const getImageUrl = (image?: string) => {
  if (!image) return "";

  const apiUrl = import.meta.env.VITE_API_URL || "";

  if (image.startsWith("http://localhost:5000")) {
    return image.replace("http://localhost:5000", apiUrl);
  }

  if (image.startsWith("/uploads")) {
    return `${apiUrl}${image}`;
  }

  return image;
};

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  /* Team slider */
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  /* =======================================================
     FETCH TEAM
  ======================================================= */

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/teams/public`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }

        const data = await response.json();

        const members: TeamMember[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setTeamMembers(members);
      } catch (error) {
        console.error("TEAM FETCH ERROR:", error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  /* =======================================================
     FIND CEO
  ======================================================= */

  const ceo = useMemo(() => {
    return teamMembers.find((member) => {
      const designation = member.designation?.toLowerCase().trim() || "";

      return (
        designation === "ceo" ||
        designation.includes("chief executive officer") ||
        designation.includes("founder & ceo") ||
        designation.includes("founder and ceo")
      );
    });
  }, [teamMembers]);

  /*
   * CEO is displayed in the leadership section,
   * so remove them from the team slider.
   */
  const sliderMembers = useMemo(() => {
    if (!ceo) return teamMembers;

    return teamMembers.filter((member) => member._id !== ceo._id);
  }, [teamMembers, ceo]);

  /* =======================================================
     RESPONSIVE TEAM CARDS
  ======================================================= */

  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleCards(1);
      } else if (width < 900) {
        setVisibleCards(2);
      } else if (width < 1200) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    updateVisibleCards();

    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  /* =======================================================
     SLIDER CALCULATIONS
  ======================================================= */

  const totalSlides = Math.max(
    sliderMembers.length - visibleCards + 1,
    1
  );

  useEffect(() => {
    if (activeSlide >= totalSlides) {
      setActiveSlide(0);
    }
  }, [totalSlides, activeSlide]);

  const nextSlide = () => {
    setActiveSlide((current) =>
      current >= totalSlides - 1 ? 0 : current + 1
    );
  };

  const previousSlide = () => {
    setActiveSlide((current) =>
      current <= 0 ? totalSlides - 1 : current - 1
    );
  };

  /* =======================================================
     AUTO SLIDE
     Change 2200 if you want different speed.
  ======================================================= */

  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) =>
        current >= totalSlides - 1 ? 0 : current + 1
      );
    }, 2200);

    return () => {
      window.clearInterval(timer);
    };
  }, [totalSlides]);

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="overflow-hidden bg-[#FFF5F8]">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative px-6 pb-20 pt-36 md:px-10 md:pb-24 md:pt-40 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Hero Text */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#E75480]" />

              <p className="text-[11px] font-medium uppercase tracking-[5px] text-[#E75480]">
                About Nirjara
              </p>
            </div>

            <h1 className="mt-7 max-w-xl font-serif text-5xl leading-[1.05] text-[#3A2A2F] sm:text-6xl lg:text-[68px]">
              Beauty with{" "}
              <span className="italic text-[#E75480]">
                purpose.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-8 text-[#8A6F78] md:text-base">
              Nirjara Beauty is a space dedicated to beauty, confidence,
              creativity, and care. We combine professional expertise with
              thoughtful service to create experiences that help every client
              feel uniquely beautiful.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/booking"
                className="rounded-full bg-[#E75480] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#D94370]"
              >
                Book Appointment
              </a>

              <a
                href="/services"
                className="rounded-full border border-[#E75480]/30 bg-white px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-[#E75480] transition hover:border-[#E75480]"
              >
                Explore Services
              </a>
            </div>
          </motion.div>

          {/* CEO Hero Image */}

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div className="overflow-hidden rounded-[36px] bg-[#FCE7EF]">
              {ceo?.image ? (
                <img
                  src={getImageUrl(ceo.image)}
                  alt={ceo.name}
                  className="h-[480px] w-full object-cover object-top sm:h-[560px]"
                />
              ) : (
                <div className="flex h-[480px] items-center justify-center sm:h-[560px]">
                  <span className="font-serif text-8xl text-[#E75480]/20">
                    N
                  </span>
                </div>
              )}
            </div>

            {ceo && (
              <div className="absolute bottom-5 left-5 right-5 rounded-[22px] bg-white/95 px-6 py-5 shadow-sm backdrop-blur">
                <p className="text-[9px] font-semibold uppercase tracking-[3px] text-[#E75480]">
                  Leadership
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#3A2A2F]">
                  {ceo.name}
                </h2>

                <p className="mt-1 text-xs uppercase tracking-[2px] text-[#8A6F78]">
                  {ceo.designation}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          WHO WE ARE
      =================================================== */}

      <section className="bg-white px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#E75480]">
              Who We Are
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#3A2A2F] md:text-5xl">
              Beauty that feels
              <br />
              <span className="italic text-[#E75480]">
                personal.
              </span>
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-[#8A6F78]">
              We believe beauty is more than appearance. It is about
              confidence, expression, and feeling comfortable in your own
              style.
            </p>

            <p className="mt-5 text-base leading-8 text-[#8A6F78]">
              Our team brings together creativity, technique, and genuine care
              to provide services designed around each individual client.
              Whether it is an everyday appointment or a special occasion, we
              aim to make every Nirjara experience warm, professional, and
              memorable.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          VALUES
      =================================================== */}

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#E75480]">
              Our Approach
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#3A2A2F]">
              What makes Nirjara{" "}
              <span className="italic text-[#E75480]">
                different.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">

            <div className="rounded-[24px] bg-white p-8">
              <span className="font-serif text-3xl text-[#E75480]">
                01
              </span>

              <h3 className="mt-7 font-serif text-2xl text-[#3A2A2F]">
                Personal Care
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#8A6F78]">
                Every service is shaped around the individual, their style,
                preferences, and needs.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-8">
              <span className="font-serif text-3xl text-[#E75480]">
                02
              </span>

              <h3 className="mt-7 font-serif text-2xl text-[#3A2A2F]">
                Professional Craft
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#8A6F78]">
                Our professionals combine skill, creativity, and attention to
                detail in every experience.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-8">
              <span className="font-serif text-3xl text-[#E75480]">
                03
              </span>

              <h3 className="mt-7 font-serif text-2xl text-[#3A2A2F]">
                Modern Beauty
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#8A6F78]">
                We blend contemporary beauty trends with timeless techniques
                and thoughtful service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================
          CEO MESSAGE
      =================================================== */}

      {ceo && (
        <section className="bg-white px-6 py-20 md:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">

            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#E75480]">
                Leadership
              </p>

              <h2 className="mt-4 font-serif text-4xl text-[#3A2A2F]">
                A message from our{" "}
                <span className="italic text-[#E75480]">
                  CEO.
                </span>
              </h2>
            </div>

            <div className="mx-auto mt-10 max-w-3xl text-center">
              <span className="font-serif text-6xl leading-none text-[#E75480]/25">
                “
              </span>

              <p className="-mt-2 text-lg leading-9 text-[#6F5961]">
                {ceo.bio ||
                  "At Nirjara, our purpose is to create a place where beauty, confidence, creativity, and care come together. Every experience we create begins with understanding the person behind it."}
              </p>

              <div className="mt-7">
                <p className="font-serif text-xl text-[#3A2A2F]">
                  {ceo.name}
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[3px] text-[#E75480]">
                  {ceo.designation}
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ===================================================
          TEAM
      =================================================== */}

      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">

          {/* Team Heading */}

          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#E75480]">
              Our Team
            </p>

            <h2 className="mt-4 font-serif text-3xl text-[#3A2A2F] sm:text-4xl">
              Meet our{" "}
              <span className="italic text-[#E75480]">
                professionals.
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#8A6F78]">
              The talented people behind your Nirjara experience.
            </p>
          </div>

          {/* Loading */}

          {loading && (
            <div className="py-20 text-center text-sm text-[#8A6F78]">
              Loading our team...
            </div>
          )}

          {/* No Members */}

          {!loading && sliderMembers.length === 0 && (
            <div className="py-20 text-center text-sm text-[#8A6F78]">
              Our team will be introduced soon.
            </div>
          )}

          {/* Slider */}

          {!loading && sliderMembers.length > 0 && (
            <>
              <div className="mt-10 overflow-hidden">

                <motion.div
                  className="flex"
                  animate={{
                    x: `-${activeSlide * (100 / visibleCards)}%`,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {sliderMembers.map((member) => (
                    <div
                      key={member._id}
                      style={{
                        width: `${100 / visibleCards}%`,
                      }}
                      className="shrink-0 px-2"
                    >
                      <article className="group h-full overflow-hidden rounded-[22px] border border-[#E75480]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(58,42,47,0.08)]">

                        {/* Team Image */}

                        <div className="relative h-[320px] overflow-hidden bg-[#F9EEF1]">
                          {member.image ? (
                            <img
                              src={getImageUrl(member.image)}
                              alt={member.name}
                              loading="lazy"
                              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="font-serif text-7xl text-[#E75480]/20">
                                {member.name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Team Information */}

                        <div className="min-h-[145px] p-5">
                          <h3 className="font-serif text-xl text-[#3A2A2F]">
                            {member.name}
                          </h3>

                          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[2.5px] text-[#E75480]">
                            {member.designation}
                          </p>

                          {member.bio && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#8A6F78]">
                              {member.bio}
                            </p>
                          )}
                        </div>

                      </article>
                    </div>
                  ))}
                </motion.div>

              </div>

              {/* Controls */}

              {totalSlides > 1 && (
                <div className="mt-7 flex items-center justify-center gap-4">

                  {/* Previous */}

                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous team members"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E75480]/20 bg-white text-[#E75480] transition hover:border-[#E75480] hover:bg-[#E75480] hover:text-white"
                  >
                    ←
                  </button>

                  {/* Dots */}

                  <div className="flex items-center justify-center gap-1.5">
                    {Array.from({
                      length: totalSlides,
                    }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to team slide ${index + 1}`}
                        onClick={() => setActiveSlide(index)}
                        className={`h-[5px] rounded-full transition-all duration-300 ${
                          activeSlide === index
                            ? "w-7 bg-[#E75480]"
                            : "w-[5px] bg-[#E75480]/25 hover:bg-[#E75480]/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next */}

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next team members"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E75480] text-white transition hover:bg-[#D94370]"
                  >
                    →
                  </button>

                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section className="bg-[#3A2A2F] px-6 py-20 text-center md:px-10">
        <div className="mx-auto max-w-2xl">

          <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#F7A4BD]">
            Your Nirjara Experience
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight text-white md:text-5xl">
            Ready to feel your{" "}
            <span className="italic text-[#F7A4BD]">
              best?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/65">
            Discover professional beauty services designed around you.
          </p>

          <a
            href="/booking"
            className="mt-8 inline-flex rounded-full bg-[#E75480] px-8 py-4 text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#F06292]"
          >
            Book Your Appointment
          </a>

        </div>
      </section>

    </main>
  );
}