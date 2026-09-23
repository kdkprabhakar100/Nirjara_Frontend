import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  image: string;
};

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http://localhost:5000")) {
      return image.replace(
        "http://localhost:5000",
        import.meta.env.VITE_API_URL
      );
    }

    if (image.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${image}`;
    }

    return image;
  };

  // ==========================================
  // FETCH GALLERY
  // ==========================================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gallery`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch gallery");
      }

      const data = await res.json();

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gallery fetch error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ==========================================
  // NEXT / PREVIOUS
  // ==========================================

  const next = () => {
    if (items.length <= 1) return;

    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    if (items.length <= 1) return;

    setIndex(
      (prev) => (prev - 1 + items.length) % items.length
    );
  };

  // ==========================================
  // AUTO SLIDE
  // ==========================================

  useEffect(() => {
    if (items.length <= 1 || paused) return;

    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [items.length, paused]);

  // ==========================================
  // KEEP INDEX VALID
  // ==========================================

  useEffect(() => {
    if (items.length === 0) {
      setIndex(0);
      return;
    }

    if (index >= items.length) {
      setIndex(0);
    }
  }, [items.length, index]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFF5F8]
          px-4
          pt-20
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#E75480]/20
              border-t-[#E75480]
            "
          />

          <p
            className="
              mt-4
              text-[10px]
              uppercase
              tracking-[3px]
              text-[#8A6F78]
            "
          >
            Loading Gallery
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (items.length === 0) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFF5F8]
          px-4
          pt-20
        "
      >
        <div className="text-center">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[4px]
              text-[#E75480]
            "
          >
            Our Gallery
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-4xl
              text-[#3A2A2F]
            "
          >
            Beauty{" "}
            <span className="italic text-[#E75480]">
              Moments
            </span>
          </h1>

          <p className="mt-5 text-sm text-[#8A6F78]">
            No gallery images yet.
          </p>
        </div>
      </main>
    );
  }

  const current = items[index];

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#FFF5F8]
        px-4
        pb-8
        pt-[92px]
        sm:px-6
        sm:pb-10
        sm:pt-[100px]
        md:px-8
        lg:px-12
      "
    >
      <section className="mx-auto max-w-[1280px]">

        {/* =====================================
            HEADING
        ===================================== */}

        <div
          className="
            mb-7
            text-center
            sm:mb-8
            md:mb-9
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px w-7 bg-[#E75480]/40" />

            <p
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[4px]
                text-[#E75480]
                sm:text-[9px]
              "
            >
              Our Gallery
            </p>

            <span className="h-px w-7 bg-[#E75480]/40" />
          </div>

          <h1
            className="
              mt-3
              font-serif
              text-[36px]
              font-light
              leading-none
              text-[#3A2A2F]
              sm:text-[42px]
              md:text-[48px]
              lg:text-[54px]
            "
          >
            Beauty{" "}
            <span className="italic text-[#E75480]">
              Moments
            </span>
          </h1>

          <div
            className="
              mx-auto
              mt-4
              h-px
              w-16
              bg-[#E75480]/40
            "
          />

          <p
            className="
              mx-auto
              mt-4
              hidden
              max-w-2xl
              text-[13px]
              leading-6
              text-[#8A6F78]
              sm:block
              md:text-sm
            "
          >
            A glimpse into the artistry, transformations,
            and experiences that define Nirjara Beauty.
          </p>
        </div>

        {/* =====================================
            GALLERY SLIDER
        ===================================== */}

        <div
          className="
            relative
            mx-auto
            overflow-hidden
            rounded-[22px]
            bg-[#3A2A2F]
            shadow-[0_20px_60px_rgba(58,42,47,0.12)]
            sm:rounded-[26px]
            lg:rounded-[30px]
          "
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* RESPONSIVE HEIGHT */}

          <div
            className="
              relative
              h-[430px]
              sm:h-[470px]
              md:h-[500px]
              lg:h-[530px]
              xl:h-[550px]
            "
          >
            <AnimatePresence mode="wait">

              <motion.div
                key={current._id}
                initial={{
                  opacity: 0,
                  scale: 1.02,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="absolute inset-0"
              >

                {/* IMAGE */}

                <img
                  src={getImageUrl(current.image)}
                  alt={current.title || "Nirjara Beauty"}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                {/* FULL IMAGE SOFT OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/5
                  "
                />

                {/* BOTTOM GRADIENT */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/10
                    to-transparent
                  "
                />

                {/* =====================================
                    IMAGE INFORMATION
                ===================================== */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    z-10
                    p-5
                    sm:p-7
                    md:p-9
                    lg:p-10
                  "
                >
                  <div className="max-w-2xl">

                    {/* CATEGORY */}

                    {current.category && (
                      <div
                        className="
                          mb-2.5
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <span
                          className="
                            h-px
                            w-6
                            bg-[#FF9DBA]
                          "
                        />

                        <p
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[3px]
                            text-[#FF9DBA]
                            sm:text-[9px]
                          "
                        >
                          {current.category}
                        </p>
                      </div>
                    )}

                    {/* TITLE */}

                    <h2
                      className="
                        font-serif
                        text-[30px]
                        leading-[1.05]
                        text-white
                        sm:text-[36px]
                        md:text-[42px]
                        lg:text-[46px]
                      "
                    >
                      {current.title}
                    </h2>

                    {/* DESCRIPTION */}

                    {current.description && (
                      <p
                        className="
                          mt-3
                          max-w-xl
                          text-[12px]
                          leading-5
                          text-white/85
                          sm:text-[13px]
                          sm:leading-6
                          md:text-[14px]
                        "
                      >
                        {current.description}
                      </p>
                    )}
                  </div>
                </div>

              </motion.div>

            </AnimatePresence>

            {/* =====================================
                IMAGE NUMBER
            ===================================== */}

            <div
              className="
                absolute
                right-4
                top-4
                z-20
                rounded-full
                border
                border-white/30
                bg-black/20
                px-3
                py-1.5
                backdrop-blur-md
                sm:right-5
                sm:top-5
                sm:px-4
              "
            >
              <span
                className="
                  text-[8px]
                  font-semibold
                  tracking-[2px]
                  text-white
                  sm:text-[9px]
                "
              >
                {String(index + 1).padStart(2, "0")}
                {" / "}
                {String(items.length).padStart(2, "0")}
              </span>
            </div>

            {/* =====================================
                ARROWS
            ===================================== */}

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="
                    absolute
                    left-3
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
                    border-white/40
                    bg-white/95
                    text-xl
                    text-[#E75480]
                    shadow-lg
                    transition
                    duration-300
                    hover:scale-105
                    hover:bg-[#E75480]
                    hover:text-white
                    sm:left-5
                    sm:h-12
                    sm:w-12
                  "
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="
                    absolute
                    right-3
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
                    border-white/40
                    bg-white/95
                    text-xl
                    text-[#E75480]
                    shadow-lg
                    transition
                    duration-300
                    hover:scale-105
                    hover:bg-[#E75480]
                    hover:text-white
                    sm:right-5
                    sm:h-12
                    sm:w-12
                  "
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        {/* =====================================
            DOTS
        ===================================== */}

        {items.length > 1 && (
          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {items.map((item, i) => (
              <button
                type="button"
                key={item._id}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`
                  h-[6px]
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    i === index
                      ? "w-8 bg-[#E75480]"
                      : "w-[6px] bg-[#E75480]/25 hover:bg-[#E75480]/50"
                  }
                `}
              />
            ))}
          </div>
        )}

        {/* =====================================
            BOTTOM TEXT
        ===================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-4
          "
        >
          <span className="h-px w-7 bg-[#E75480]/30" />

          <p
            className="
              text-[7px]
              uppercase
              tracking-[4px]
              text-[#B58B99]
              sm:text-[8px]
            "
          >
            Discover Nirjara
          </p>

          <span className="h-px w-7 bg-[#E75480]/30" />
        </div>
      </section>
    </main>
  );
}