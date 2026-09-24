import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type GalleryItem = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  image: string;
};

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  // ==========================================
  // FETCH GALLERY
  // ==========================================

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gallery`
        );

        if (!res.ok) {
          throw new Error("Failed to load gallery.");
        }

        const data = await res.json();

        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gallery fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // ==========================================
  // DUPLICATE ITEMS FOR INFINITE LOOP
  // ==========================================

  const sliderItems = useMemo(() => {
    if (!items.length) return [];

    return [...items, ...items];
  }, [items]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] pt-24">
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
            Loading Gallery...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] pt-24">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
              Our Gallery
            </p>

            <h1 className="mt-4 font-serif text-4xl text-[#3A2A2F]">
              Beauty{" "}
              <span className="italic text-[#E75480]">
                Moments
              </span>
            </h1>

            <p className="mt-4 text-[#8A6F78]">
              No gallery images available yet.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF5F8] pt-24">
      <section className="relative overflow-hidden pb-20 pt-12 md:pb-24 md:pt-16">

        {/* ================================= */}
        {/* BACKGROUND DECORATION             */}
        {/* ================================= */}

        <div className="pointer-events-none absolute left-[-120px] top-[100px] h-[300px] w-[300px] rounded-full bg-[#FAD7E3]/40 blur-[100px]" />

        <div className="pointer-events-none absolute right-[-100px] top-[200px] h-[300px] w-[300px] rounded-full bg-[#E75480]/10 blur-[100px]" />

        {/* ================================= */}
        {/* HEADER                            */}
        {/* ================================= */}

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-[#E75480]/40" />

            <p className="text-[10px] font-medium uppercase tracking-[5px] text-[#E75480] sm:text-xs">
              Our Gallery
            </p>

            <div className="h-px w-10 bg-[#E75480]/40" />
          </div>

          <h1 className="mt-5 font-serif text-[42px] leading-[1.05] text-[#3A2A2F] sm:text-5xl md:text-6xl lg:text-7xl">
            Moments of
            <span className="ml-3 italic text-[#E75480]">
              Beauty
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#8A6F78] md:text-base">
            Discover the artistry, transformations and
            unforgettable moments created at Nirjara Beauty.
          </p>
        </div>

        {/* ================================= */}
        {/* MOVING GALLERY                    */}
        {/* ================================= */}

        <div
          className="relative mt-12 overflow-hidden md:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* LEFT FADE */}

          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-12 bg-gradient-to-r from-[#FFF5F8] to-transparent sm:w-20 md:w-32" />

          {/* RIGHT FADE */}

          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-12 bg-gradient-to-l from-[#FFF5F8] to-transparent sm:w-20 md:w-32" />

          <motion.div
            className="flex w-max gap-3 px-3 sm:gap-4 md:gap-5"
            animate={
              paused
                ? {}
                : {
                    x: ["0%", "-50%"],
                  }
            }
            transition={{
              x: {
                duration: Math.max(items.length * 7, 20),
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              },
            }}
          >
            {sliderItems.map((item, index) => {

              // Give cards slightly different dimensions
              // like the Pinterest reference.

              const pattern = index % 5;

              const sizeClass =
                pattern === 0
                  ? "w-[180px] sm:w-[220px] md:w-[260px]"
                  : pattern === 1
                  ? "w-[220px] sm:w-[260px] md:w-[310px]"
                  : pattern === 2
                  ? "w-[190px] sm:w-[230px] md:w-[270px]"
                  : pattern === 3
                  ? "w-[230px] sm:w-[280px] md:w-[320px]"
                  : "w-[190px] sm:w-[240px] md:w-[280px]";

              return (
                <article
                  key={`${item._id}-${index}`}
                  className={`
                    group
                    relative
                    h-[340px]
                    shrink-0
                    cursor-pointer
                    overflow-hidden
                    rounded-[24px]
                    bg-white
                    shadow-sm
                    sm:h-[390px]
                    md:h-[430px]
                    ${sizeClass}
                  `}
                >
                  {/* IMAGE */}

                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-105
                    "
                  />

                  {/* DARK GRADIENT */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/75
                      via-black/5
                      to-transparent
                      opacity-70
                      transition
                      duration-500
                      group-hover:opacity-90
                    "
                  />

                  {/* CONTENT */}

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-6">

                    {item.category && (
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[3px] text-[#FFB8CD]">
                        {item.category}
                      </p>
                    )}

                    <h2 className="font-serif text-2xl leading-tight md:text-3xl">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p
                        className="
                          mt-2
                          max-h-0
                          overflow-hidden
                          text-xs
                          leading-5
                          text-white/80
                          opacity-0
                          transition-all
                          duration-500
                          group-hover:max-h-24
                          group-hover:opacity-100
                          md:text-sm
                        "
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* NUMBER */}

                  <div className="absolute right-4 top-4 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[9px] tracking-[2px] text-white backdrop-blur-md">
                    {String(
                      (index % items.length) + 1
                    ).padStart(2, "0")}
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>

        {/* ================================= */}
        {/* BOTTOM TEXT                       */}
        {/* ================================= */}

        <div className="mt-10 flex items-center justify-center gap-4">

          <div className="h-px w-8 bg-[#E75480]/30" />

          <p className="text-[9px] uppercase tracking-[4px] text-[#C77A95]">
            Discover Nirjara
          </p>

          <div className="h-px w-8 bg-[#E75480]/30" />

        </div>
      </section>
    </main>
  );
}