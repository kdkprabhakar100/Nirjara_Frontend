import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../../components/ServiceCard";
import BranchCard from "../../components/BranchCard";
import Gallery from "../../components/Gallery";

import { branches } from "../../data/branches";

type Service = {
  _id?: string;
  title: string;
  description: string;
  price: string;
  icon?: string;
  image?: string;
};

const stats = [
  { number: "12+", label: "Years of Excellence" },
  { number: "2", label: "Kathmandu Branches" },
  { number: "5K+", label: "Happy Clients" },
  { number: "200+", label: "Certified Graduates" },
];

export default function Home() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`
      );

      const data = await res.json();

      setServices(data.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <main className="bg-[#FFF5F8] text-[#3A2A2F] overflow-x-hidden">
      
      {/* HERO */}
{/* =========================
    NIRJARA VIDEO HERO
========================= */}
{/* ============================================================
    HERO SECTION
============================================================ */}
<section
  className="
    relative
    mt-[72px]
    min-h-[calc(100vh-72px)]
    overflow-hidden
    bg-[#3A2A2F]
  "
>

  {/* ==========================================================
      1. BACKGROUND VIDEO

      Video location:
      public/videos/hero.mp4

      - autoPlay = plays automatically
      - muted = no sound
      - loop = repeats continuously
      - playsInline = works properly on mobile
  ========================================================== */}
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


  {/* ==========================================================
      2. BRAND COLOR VIDEO OVERLAY

      THIS CONTROLS THE DARK OVERLAY OPACITY.

      Current: /10 = 10%

      Change to:
      /5  = clearer video
      /10 = recommended
      /15 = slightly darker
      /20 = darker
      /30 = strong overlay
  ========================================================== */}
  <div
    className="
      pointer-events-none
      absolute
      inset-0
      z-[1]
      bg-[#3A2A2F]/5
    "
  />


  {/* ==========================================================
      3. SOFT LIGHT BEHIND CENTER TEXT

      This DOES NOT cover the video evenly.

      It creates a soft blush/white glow behind
      Nirjara Beauty so the original dark/pink
      brand colors remain readable.

      To make video clearer:
      reduce 0.42 → 0.30

      To make text more protected:
      increase 0.42 → 0.55
  ========================================================== */}
  <div
    className="
      pointer-events-none
      absolute
      inset-0
      z-[2]
    bg-[radial-gradient(ellipse_at_center,rgba(255,245,248,0.62)_0%,rgba(255,245,248,0.38)_30%,rgba(255,245,248,0.10)_58%,transparent_76%)]    "
  />


  {/* ==========================================================
      4. CINEMATIC TOP/BOTTOM GRADIENT

      Adds slight depth without hiding video.
  ========================================================== */}
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


  {/* ==========================================================
      5. HERO CONTENT WRAPPER

      Top padding here protects the content from navbar.

      pt-16 / lg:pt-20 = space above hero text
      pb-24 = space below hero text
  ========================================================== */}
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

    {/* ========================================================
        CENTER CONTENT
    ======================================================== */}
    <div className="mx-auto w-full max-w-4xl">


      {/* ======================================================
          6. SMALL TOP LABEL
      ====================================================== */}
      <div
        className="
          flex
          items-center
          justify-center
          gap-4
        "
      >

        {/* LEFT PINK LINE */}
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
            text-[14px]
            font-bold
            uppercase
            tracking-[4px]
            text-[#E75480]

            sm:text-[10px]
            sm:tracking-[5px]

            md:text-[11px]
            md:tracking-[6px]
          "
        >
          Kathmandu&apos;s Premier Beauty Destination
        </p>

        {/* RIGHT PINK LINE */}
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


      {/* ======================================================
          7. MAIN NIRJARA BEAUTY TITLE

          Nirjara = original dark brand color
          Beauty  = original pink brand color
      ====================================================== */}
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


      {/* ======================================================
          8. TAGLINE

          Original muted Nirjara color
      ====================================================== */}
      <p
        className="
          mx-auto
          mt-10
          max-w-3xl

          font-serif
          text-lg
          italic
          leading-relaxed

          text-[#000000]

          sm:text-xl
          md:text-2xl
        "
      >
        Salon &amp; Academy — Where Beauty Meets Confidence
      </p>


      {/* ======================================================
          9. BOOK A SERVICE BUTTON
      ====================================================== */}
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

          text-[16px]
          font-thin
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

        {/* BUTTON ARROW */}
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


  {/* ==========================================================
      10. BOTTOM LEFT DECORATION
      Desktop only
  ========================================================== */}
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

    {/* PINK LINE */}
    <span
      className="
        h-px
        w-12
        bg-[#E75480]/70
      "
    />

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


  {/* ==========================================================
      11. BOTTOM RIGHT BRANDING
      Desktop only
  ========================================================== */}
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

    {/* PINK LINE */}
    <span
      className="
        h-px
        w-12
        bg-[#E75480]/70
      "
    />

    <div className="text-right">

      <p
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[4px]
          text-white

          drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)]
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

          drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)]
        "
      >
        Beauty Lives Here
      </p>

    </div>
  </div>

</section>
      {/* STATS */}
      <section className="border-y border-[#E75480]/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-r border-[#E75480]/10 px-6 py-10 text-center last:border-r-0"
            >
              <h2 className="font-serif text-4xl text-[#E75480]">
                {stat.number}
              </h2>

              <p className="mt-2 text-xs uppercase tracking-[2px] text-[#8A6F78]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#FFF5F8] px-6 py-24 md:px-12">
        <div className="text-center">
          
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Services
          </p>

          <h2 className="mt-4 font-serif text-5xl text-[#3A2A2F]">
            The Art of{" "}
            <span className="italic text-[#E75480]">
              Beauty
            </span>
          </h2>

          <div className="mx-auto mt-6 h-[1px] w-20 bg-[#E75480]/40"></div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service._id || index}
              title={service.title}
              description={service.description}
              price={service.price}
              icon={service.icon || "✦"}
              image={service.image || ""}
            />
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* BRANCHES */}
      <section className="bg-white px-6 py-24 md:px-12">
        <div className="text-center">
          
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Our Branches
          </p>

          <h2 className="mt-4 font-serif text-5xl text-[#3A2A2F]">
            Visit{" "}
            <span className="italic text-[#E75480]">
              Nirjara
            </span>
          </h2>

          <div className="mx-auto mt-6 h-[1px] w-20 bg-[#E75480]/40"></div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
          {branches.map((branch, index) => (
            <BranchCard
              key={index}
              {...branch}
            />
          ))}
        </div>
      </section>
    </main>
  );
}