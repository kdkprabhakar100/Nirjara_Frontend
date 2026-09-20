import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  _id: string;
  title: string;
  image: string;
};

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /* ============================================================
     FETCH GALLERY
  ============================================================ */

  const fetchGallery = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* ============================================================
     AUTO SLIDE
     Every 4 seconds
  ============================================================ */

  useEffect(() => {
    if (items.length <= 1 || isHovered) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [items.length, isHovered]);

  /* ============================================================
     KEEP INDEX VALID
  ============================================================ */

  useEffect(() => {
    if (items.length === 0) {
      setIndex(0);
      return;
    }

    if (index >= items.length) {
      setIndex(0);
    }
  }, [items.length, index]);

  /* ============================================================
     CONTROLS
  ============================================================ */

  const next = () => {
    if (items.length === 0) return;

    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    if (items.length === 0) return;

    setIndex(
      (prev) => (prev - 1 + items.length) % items.length
    );
  };

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (items.length === 0) {
    return (
      <section
        className="
          bg-[#FFF5F8]
          px-6
          py-16
          text-center
          sm:py-20
          lg:py-24
        "
      >
        <p
          className="
            font-serif
            text-xl
            italic
            text-[#8A6F78]
          "
        >
          Our beauty gallery is being updated.
        </p>
      </section>
    );
  }

  const current = items[index];

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#FFF5F8]
        px-4
        py-16

        sm:px-6
        sm:py-20

        md:px-10

        lg:px-12
        lg:py-24
      "
    >
      {/* ========================================================
          SUBTLE BACKGROUND DETAIL
      ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#E75480]/[0.025]
          blur-3xl
        "
      />

      <div className="relative z-10">

        {/* ======================================================
            SECTION HEADING
        ====================================================== */}

        <div className="text-center">

          {/* SMALL LABEL */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <span
              className="
                hidden
                h-px
                w-9
                bg-[#E75480]/40
                sm:block
              "
            />

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[4px]
                text-[#E75480]

                sm:text-[10px]
                sm:tracking-[5px]
              "
            >
              Our Gallery
            </p>

            <span
              className="
                hidden
                h-px
                w-9
                bg-[#E75480]/40
                sm:block
              "
            />
          </div>

          {/* TITLE */}

          <h2
            className="
              mt-4
              font-serif
              text-[38px]
              font-normal
              leading-tight
              text-[#3A2A2F]

              sm:text-[46px]

              md:text-[52px]

              lg:text-[56px]
            "
          >
            Beauty{" "}

            <span className="italic text-[#E75480]">
              Moments
            </span>
          </h2>

          {/* DECORATIVE LINE */}

          <div
            className="
              mx-auto
              mt-6
              h-px
              w-20
              bg-[#E75480]/40
            "
          />

          {/* OPTIONAL SMALL DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-[13px]
              leading-6
              text-[#8A6F78]

              sm:text-sm
            "
          >
            A glimpse into the artistry, transformations,
            and experiences that define Nirjara Beauty.
          </p>
        </div>

        {/* ======================================================
            GALLERY
        ====================================================== */}

        <div
          className="
            mx-auto
            mt-10
            w-full
            max-w-6xl

            sm:mt-12

            lg:mt-14
          "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* ====================================================
              IMAGE CARD
          ==================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-[#E75480]/10
              bg-white
              shadow-[0_20px_60px_rgba(58,42,47,0.08)]

              sm:rounded-[28px]

              lg:rounded-[32px]
            "
          >
            {/* ==================================================
                IMAGE CONTAINER

                Responsive aspect ratios prevent the gallery
                from stretching strangely at 320/425/768px.
            ================================================== */}

            <div
              className="
                relative
                aspect-[4/5]
                w-full
                overflow-hidden

                min-[425px]:aspect-[4/3]

                sm:aspect-[16/10]

                md:aspect-[16/9]

                lg:aspect-[2/1]
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current._id}
                  initial={{
                    opacity: 0,
                    scale: 1.025,
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
                  className="
                    absolute
                    inset-0
                  "
                >
                  {/* IMAGE */}

                  <img
                    src={current.image}
                    alt={current.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      object-center
                    "
                  />

                  {/* ============================================
                      SOFT IMAGE OVERLAY
                  ============================================ */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#29191F]/65
                      via-[#29191F]/5
                      to-transparent
                    "
                  />

                  {/* ============================================
                      TOP RIGHT COUNTER
                  ============================================ */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      rounded-full
                      border
                      border-white/30
                      bg-white/15
                      px-4
                      py-2
                      backdrop-blur-md

                      sm:right-6
                      sm:top-6
                    "
                  >
                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[2px]
                        text-white
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                      {" / "}
                      {String(items.length).padStart(2, "0")}
                    </p>
                  </div>

                  {/* ============================================
                      IMAGE TITLE
                  ============================================ */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0

                      p-5

                      sm:p-7

                      md:p-9

                      lg:p-10
                    "
                  >
                    <div className="max-w-3xl">

                      <p
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[3px]
                          text-[#FF9DBA]
                        "
                      >
                        Nirjara Beauty
                      </p>

                      <h3
                        className="
                          mt-2
                          font-serif
                          text-[28px]
                          font-normal
                          leading-tight
                          text-white

                          sm:text-[34px]

                          md:text-[40px]

                          lg:text-[44px]
                        "
                      >
                        {current.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ==================================================
                  PREVIOUS BUTTON
              ================================================== */}

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous gallery image"
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
                    border-white/30
                    bg-white/90

                    font-serif
                    text-[25px]
                    leading-none
                    text-[#E75480]

                    shadow-[0_8px_25px_rgba(0,0,0,0.12)]
                    backdrop-blur-md

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:bg-[#E75480]
                    hover:text-white

                    sm:left-5
                    sm:h-12
                    sm:w-12
                    sm:text-[30px]

                    lg:left-7
                  "
                >
                  ‹
                </button>
              )}

              {/* ==================================================
                  NEXT BUTTON
              ================================================== */}

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next gallery image"
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
                    border-white/30
                    bg-white/90

                    font-serif
                    text-[25px]
                    leading-none
                    text-[#E75480]

                    shadow-[0_8px_25px_rgba(0,0,0,0.12)]
                    backdrop-blur-md

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:bg-[#E75480]
                    hover:text-white

                    sm:right-5
                    sm:h-12
                    sm:w-12
                    sm:text-[30px]

                    lg:right-7
                  "
                >
                  ›
                </button>
              )}
            </div>
          </div>

          {/* ====================================================
              CONTROLS BELOW IMAGE
          ==================================================== */}

          {items.length > 1 && (
            <div
              className="
                mt-6
                flex
                flex-col
                items-center
                justify-center
                gap-5

                sm:flex-row
              "
            >
              {/* DOTS */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {items.map((item, i) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`View ${item.title}`}
                    className={`
                      h-2
                      rounded-full
                      transition-all
                      duration-500

                      ${
                        i === index
                          ? "w-8 bg-[#E75480]"
                          : "w-2 bg-[#E75480]/20 hover:bg-[#E75480]/50"
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              SMALL BOTTOM DETAIL
          ==================================================== */}

          <div
            className="
              mt-7
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <span
              className="
                h-px
                w-7
                bg-[#E75480]/30
              "
            />

            <p
              className="
                text-[8px]
                font-medium
                uppercase
                tracking-[3px]
                text-[#8A6F78]/70
              "
            >
              The Art of Nirjara
            </p>

            <span
              className="
                h-px
                w-7
                bg-[#E75480]/30
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}