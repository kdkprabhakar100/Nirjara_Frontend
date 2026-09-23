import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../../components/ServiceCard";
import BranchCard from "../../components/BranchCard";
import Gallery from "../../components/Gallery";
/* ============================================================
   TYPES
============================================================ */

type Service = {
  _id?: string;
  title: string;
  description: string;
  price: string;
  icon?: string;
  image?: string;
};

type Branch = {
  name: string;
  label: string;
  address: string;
  phone: string;
  openingHours: string;
  mapUrl: string;
};

/* ============================================================
   STATS
============================================================ */

const stats = [
  { number: "12+", label: "Years of Excellence" },
  { number: "3", label: "Kathmandu Branches" },
  { number: "5K+", label: "Happy Clients" },
  { number: "200+", label: "Certified Graduates" },
];

/* ============================================================
   HOME
============================================================ */

export default function Home() {
  const navigate = useNavigate();

  /* ==========================================================
     SERVICES + BRANCHES
  ========================================================== */

  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  /* ==========================================================
     FETCH SERVICES
  ========================================================== */

  const fetchServices = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`
      );

      if (!res.ok) {
        throw new Error("Failed to load services");
      }

      const data = await res.json();

      setServices(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error("SERVICE ERROR:", error);
    }
  };

  /* ==========================================================
     FETCH BRANCHES FROM ADMIN / SITE SETTINGS
  ========================================================== */

  const fetchBranches = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/site-settings`
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch branches: ${res.status}`
        );
      }

      const data = await res.json();

      setBranches(
        Array.isArray(data?.branches)
          ? data.branches
          : []
      );
    } catch (error) {
      console.error("BRANCH FETCH ERROR:", error);
      setBranches([]);
    }
  };

  /* ==========================================================
     INITIAL FETCH
  ========================================================== */

  useEffect(() => {
    fetchServices();
    fetchBranches();
  }, []);

  /* ==========================================================
     MOBILE / TABLET BRANCH SLIDER
  ========================================================== */

  const [currentBranch, setCurrentBranch] = useState(0);

  const [isBranchHovered, setIsBranchHovered] =
    useState(false);

  /* ==========================================================
     AUTO SLIDE EVERY 2 SECONDS
  ========================================================== */

  useEffect(() => {
    if (branches.length <= 1 || isBranchHovered) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentBranch((previous) =>
        previous >= branches.length - 1
          ? 0
          : previous + 1
      );
    }, 2000);

    return () => {
      window.clearInterval(interval);
    };
  }, [branches.length, isBranchHovered]);

  /* ==========================================================
     RESET SLIDER IF ADMIN CHANGES BRANCHES
  ========================================================== */

  useEffect(() => {
    if (branches.length === 0) {
      setCurrentBranch(0);
      return;
    }

    if (currentBranch >= branches.length) {
      setCurrentBranch(0);
    }
  }, [branches.length, currentBranch]);

  /* ==========================================================
     NEXT BRANCH
  ========================================================== */

  const nextBranch = () => {
    if (branches.length === 0) return;

    setCurrentBranch((previous) =>
      previous >= branches.length - 1
        ? 0
        : previous + 1
    );
  };

  /* ==========================================================
     PREVIOUS BRANCH
  ========================================================== */

  const previousBranch = () => {
    if (branches.length === 0) return;

    setCurrentBranch((previous) =>
      previous <= 0
        ? branches.length - 1
        : previous - 1
    );
  };

  return (
    <main className="overflow-x-hidden bg-[#FFF5F8] text-[#3A2A2F]">

      {/* ========================================================
          HERO
      ======================================================== */}

      <section
        className="
          relative
          mt-[72px]
          min-h-[calc(100vh-72px)]
          overflow-hidden
          bg-[#3A2A2F]
        "
      >
        {/* BACKGROUND VIDEO */}

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="
            absolute
            inset-0
            z-0
            h-full
            w-full
            object-cover
            object-center
          "
        >
          <source
            src="/videos/hero.mp4"
            type="video/mp4"
          />
        </video>

        {/* ======================================================
            NIRJARA VIDEO OVERLAY

            /5 = very light
            /10 = light
            /20 = medium
            /30 = stronger
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-[#3A2A2F]/5
          "
        />

        {/* ======================================================
            SOFT LIGHT BEHIND HERO TEXT
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            bg-[radial-gradient(ellipse_at_center,rgba(255,245,248,0.62)_0%,rgba(255,245,248,0.38)_30%,rgba(255,245,248,0.10)_58%,transparent_76%)]
          "
        />

        {/* ======================================================
            CINEMATIC GRADIENT
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[3]
            bg-gradient-to-b
            from-black/[0.02]
            via-transparent
            to-[#3A2A2F]/5
          "
        />

        {/* ======================================================
            HERO CONTENT
        ====================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[calc(100vh-72px)]
            max-w-7xl
            items-center
            justify-center
            px-6
            pb-24
            pt-16
            text-center
            sm:px-8
            sm:pt-20
            md:px-12
            lg:px-16
            lg:pt-20
          "
        >
          <div className="mx-auto w-full max-w-4xl">

            {/* HERO TOP LABEL */}

            <div className="flex items-center justify-center gap-4">
              <span
                className="
                  hidden
                  h-px
                  w-10
                  bg-[#E75480]/60
                  sm:block
                "
              />

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[3px]
                  text-[#E75480]
                  sm:tracking-[5px]
                  md:text-[11px]
                  md:tracking-[6px]
                "
              >
                Kathmandu&apos;s Premier Beauty Destination
              </p>

              <span
                className="
                  hidden
                  h-px
                  w-10
                  bg-[#E75480]/60
                  sm:block
                "
              />
            </div>

            {/* HERO TITLE */}

            <h1
              className="
                mt-8
                font-serif
                text-[64px]
                leading-[0.84]
                tracking-[-2px]
                text-[#3A2A2F]
                drop-shadow-[0_2px_12px_rgba(255,255,255,0.30)]
                sm:text-[78px]
                md:text-[96px]
                lg:text-[112px]
              "
            >
              Nirjara

              <span
                className="
                  mt-4
                  block
                  font-serif
                  italic
                  text-[#E75480]
                "
              >
                Beauty
              </span>
            </h1>

            {/* HERO TAGLINE */}

            <p
              className="
                mx-auto
                mt-10
                max-w-3xl
                font-serif
                text-lg
                italic
                leading-relaxed
                text-black
                sm:text-xl
                md:text-2xl
              "
            >
              Salon &amp; Academy — Where Beauty Meets
              Confidence
            </p>

            {/* HERO BUTTON */}

            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="
                group
                mt-11
                inline-flex
                items-center
                justify-center
                gap-5
                rounded-full
                border
                border-[#E75480]
                bg-[#E75480]
                px-9
                py-[17px]
                text-[13px]
                font-medium
                uppercase
                tracking-[3px]
                text-white
                shadow-[0_15px_40px_rgba(231,84,128,0.30)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#D94773]
                hover:shadow-[0_20px_50px_rgba(231,84,128,0.40)]
                sm:px-11
                sm:py-[18px]
              "
            >
              Book a Service

              <span
                className="
                  text-lg
                  leading-none
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </button>
          </div>
        </div>

        {/* HERO BOTTOM LEFT */}

        <div
          className="
            absolute
            bottom-8
            left-8
            z-10
            hidden
            items-center
            gap-5
            lg:flex
            xl:left-16
          "
        >
          <span className="h-px w-12 bg-[#E75480]/70" />

          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[4px]
              text-white/90
              drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)]
            "
          >
            Beauty • Wellness • Confidence
          </p>
        </div>

        {/* HERO BOTTOM RIGHT */}

        <div
          className="
            absolute
            bottom-8
            right-8
            z-10
            hidden
            items-center
            gap-5
            lg:flex
            xl:right-16
          "
        >
          <span className="h-px w-12 bg-[#E75480]/70" />

          <div className="text-right">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[4px]
                text-white
              "
            >
              Nirjara Beauty
            </p>

            <p
              className="
                mt-2
                text-[7px]
                uppercase
                tracking-[3px]
                text-white/80
              "
            >
              Beauty Lives Here
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          STATS
      ======================================================== */}

      <section className="border-y border-[#E75480]/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                border-r
                border-[#E75480]/10
                px-6
                py-10
                text-center
                last:border-r-0
              "
            >
              <h2 className="font-serif text-4xl text-[#E75480]">
                {stat.number}
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  uppercase
                  tracking-[2px]
                  text-[#8A6F78]
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SERVICES
      ======================================================== */}

      <section className="bg-[#FFF5F8] px-6 py-24 md:px-12">
        <div className="text-center">
          <p
            className="
              text-xs
              uppercase
              tracking-[4px]
              text-[#E75480]
            "
          >
            Our Services
          </p>

          <h2
            className="
              mt-4
              font-serif
              text-5xl
              text-[#3A2A2F]
            "
          >
            The Art of{" "}
            <span className="italic text-[#E75480]">
              Beauty
            </span>
          </h2>

          <div
            className="
              mx-auto
              mt-6
              h-px
              w-20
              bg-[#E75480]/40
            "
          />
        </div>

        <div
          className="
            mx-auto
            mt-16
            grid
            max-w-6xl
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service._id || index}
              title={service.title}
              description={service.description}
              price={service.price}
              //icon={service.icon || "✦"}
              image={service.image || ""}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          GALLERY
      ======================================================== */}

      <Gallery />

      {/* ========================================================
          BRANCHES
      ======================================================== */}

{/* ========================================================
    BRANCHES
======================================================== */}

<section
  className="
    bg-white
    px-4
    py-14
    sm:px-6
    sm:py-16
    md:px-8
    md:py-20
    lg:px-12
    lg:py-24
  "
>
  {/* ======================================================
      BRANCH HEADING
  ====================================================== */}

  <div className="text-center">
    <p
      className="
        text-[10px]
        uppercase
        tracking-[4px]
        text-[#E75480]
        sm:text-xs
      "
    >
      Our Branches
    </p>

    <h2
      className="
        mt-3
        font-serif
        text-[38px]
        leading-tight
        text-[#3A2A2F]
        sm:mt-4
        sm:text-5xl
      "
    >
      Visit{" "}
      <span className="italic text-[#E75480]">
        Nirjara
      </span>
    </h2>

    <div
      className="
        mx-auto
        mt-5
        h-px
        w-16
        bg-[#E75480]/40
        sm:mt-6
        sm:w-20
      "
    />
  </div>

  {/* ======================================================
      MOBILE + TABLET
      0px - 1023px
      ONE CARD AT A TIME
  ====================================================== */}

  {branches.length > 0 && (
    <div
      className="
        relative
        mx-auto
        mt-10
        w-full
        max-w-[680px]
        sm:mt-12
        md:mt-14
        lg:hidden
      "
      onMouseEnter={() => setIsBranchHovered(true)}
      onMouseLeave={() => setIsBranchHovered(false)}
    >
      {/* ================================================
          SLIDER VIEWPORT
      ================================================ */}

      <div
        className="
          w-full
          overflow-hidden
          rounded-[24px]
        "
      >
        {/* ==============================================
            SLIDER TRACK
        ============================================== */}

        <div
          className="
            flex
            w-full
            transition-transform
            duration-700
            ease-in-out
          "
          style={{
            transform: `translateX(-${currentBranch * 100}%)`,
          }}
        >
          {branches.map((branch, index) => (
            <div
              key={`${branch.name}-mobile-${index}`}
              className="
                w-full
                min-w-full
                shrink-0
                basis-full
              "
            >
              {/* ========================================
                  RESPONSIVE CARD WRAPPER

                  Mobile:
                  almost full screen width

                  Tablet:
                  controlled width so it does not
                  become huge/stretched
              ======================================== */}

                <div
                  className="
                    mx-auto

                    w-[90%]
                    max-w-[340px]

                    min-[400px]:max-w-[360px]

                    sm:w-[82%]
                    sm:max-w-[420px]

                    md:w-[62%]
                    md:max-w-[460px]
                  "
                >
                <BranchCard
                  number={String(index + 1).padStart(2, "0")}
                  name={branch.name}
                  address={branch.address}
                  hours={branch.openingHours}
                  phone={branch.phone}
                  tag={branch.label}
                  mapUrl={branch.mapUrl}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          PREVIOUS BUTTON
      ================================================== */}

      {branches.length > 1 && (
        <button
          type="button"
          aria-label="Previous branch"
          onClick={previousBranch}
          className="
            absolute
            left-2
            top-1/2
            z-20
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[#E75480]/25
            bg-white/95
            font-serif
            text-2xl
            text-[#E75480]
            shadow-[0_8px_25px_rgba(58,42,47,0.12)]
            backdrop-blur-md
            transition-all
            duration-300

            hover:border-[#E75480]
            hover:bg-[#E75480]
            hover:text-white

            sm:left-4
            sm:h-11
            sm:w-11

            md:left-5
            md:h-12
            md:w-12
            md:text-3xl
          "
        >
          ‹
        </button>
      )}

      {/* ==================================================
          NEXT BUTTON
      ================================================== */}

      {branches.length > 1 && (
        <button
          type="button"
          aria-label="Next branch"
          onClick={nextBranch}
          className="
            absolute
            right-2
            top-1/2
            z-20
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[#E75480]/25
            bg-white/95
            font-serif
            text-2xl
            text-[#E75480]
            shadow-[0_8px_25px_rgba(58,42,47,0.12)]
            backdrop-blur-md
            transition-all
            duration-300

            hover:border-[#E75480]
            hover:bg-[#E75480]
            hover:text-white

            sm:right-4
            sm:h-11
            sm:w-11

            md:right-5
            md:h-12
            md:w-12
            md:text-3xl
          "
        >
          ›
        </button>
      )}

      {/* ==================================================
          DOT INDICATORS
      ================================================== */}

      {branches.length > 1 && (
        <div
          className="
            mt-6
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {branches.map((branch, index) => (
            <button
              key={`${branch.name}-dot-${index}`}
              type="button"
              aria-label={`Show ${branch.name}`}
              onClick={() => setCurrentBranch(index)}
              className={`
                h-2
                rounded-full
                transition-all
                duration-500

                ${
                  currentBranch === index
                    ? "w-8 bg-[#E75480]"
                    : "w-2 bg-[#E75480]/20 hover:bg-[#E75480]/50"
                }
              `}
            />
          ))}
        </div>
      )}

      {/* ==================================================
          LOCATION COUNTER
      ================================================== */}

      <p
        className="
          mt-4
          text-center
          text-[8px]
          font-medium
          uppercase
          tracking-[3px]
          text-[#8A6F78]/60
          sm:text-[9px]
        "
      >
        {currentBranch + 1} of {branches.length} locations
      </p>
    </div>
  )}

  {/* ======================================================
      LAPTOP + DESKTOP
      1024PX+
      THREE CARDS SIDE BY SIDE
  ====================================================== */}

  {branches.length > 0 && (
    <div
      className="
        mx-auto
        mt-16
        hidden
        w-full
        max-w-7xl
        grid-cols-3
        items-stretch
        gap-5
        lg:grid
        xl:gap-8
      "
    >
      {branches.map((branch, index) => (
        <div
          key={`${branch.name}-desktop-${index}`}
          className="
            h-full
            min-w-0
          "
        >
          <BranchCard
            number={String(index + 1).padStart(2, "0")}
            name={branch.name}
            address={branch.address}
            hours={branch.openingHours}
            phone={branch.phone}
            tag={branch.label}
            mapUrl={branch.mapUrl}
          />
        </div>
      ))}
    </div>
  )}

  {/* ======================================================
      DESKTOP BOTTOM LABEL
  ====================================================== */}

  {branches.length > 0 && (
    <div
      className="
        mx-auto
        mt-12
        hidden
        items-center
        justify-center
        gap-4
        lg:flex
      "
    >
      <span className="h-px w-8 bg-[#E75480]/30" />

      <p
        className="
          text-[9px]
          uppercase
          tracking-[4px]
          text-[#8A6F78]/70
        "
      >
        Three Locations • One Nirjara Experience
      </p>

      <span className="h-px w-8 bg-[#E75480]/30" />
    </div>
  )}

  {/* ======================================================
      EMPTY STATE
  ====================================================== */}

  {branches.length === 0 && (
    <div className="mx-auto mt-14 max-w-xl text-center">
      <p
        className="
          font-serif
          text-xl
          italic
          text-[#8A6F78]
        "
      >
        Our branch information is currently being updated.
      </p>
    </div>
  )}
</section>
    </main>
  );
}