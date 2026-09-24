import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

type GalleryItem = {
  _id: string;
  title?: string;
  category?: string;
  image: string;
};

/* =========================================================
   CONFIG
========================================================= */

const MOBILE_AUTOPLAY_TIME = 2800;
const DESKTOP_SPEED = 32;

const DESKTOP_HEIGHTS = [
  430,
  370,
  310,
  255,
  310,
  370,
  430,
];

const TABLET_HEIGHTS = [
  350,
  305,
  265,
  225,
  265,
  305,
  350,
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  /* =======================================================
     FETCH GALLERY
  ======================================================= */

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/gallery`
        );

        if (!response.ok) {
          throw new Error(`Gallery request failed: ${response.status}`);
        }

        const data = await response.json();

        const items: GalleryItem[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.gallery)
          ? data.gallery
          : [];

        setGallery(items);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  /* =======================================================
     SCREEN WIDTH
  ======================================================= */

  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const isMobile = viewportWidth < 768;

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] pt-24">
        <div className="flex h-[500px] items-center justify-center">
          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#E75480]/20
              border-t-[#E75480]
            "
          />
        </div>
      </main>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!gallery.length) {
    return (
      <main className="min-h-screen bg-[#FFF5F8] pt-24">
        <div className="flex h-[500px] items-center justify-center">
          <p className="text-sm text-[#8A6F78]">
            Gallery coming soon.
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF5F8] pt-24 md:pt-32">
      {/* ===================================================
          PAGE INTRO
      =================================================== */}

      <section className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        <p
          className="
            text-[8px]
            font-medium
            uppercase
            tracking-[4px]
            text-[#E75480]

            md:text-[10px]
            md:tracking-[5px]
          "
        >
          Our Gallery
        </p>

        <h1
          className="
            mt-3
            font-serif
            text-[32px]
            leading-[1.08]
            text-[#3A2A2F]

            sm:text-[38px]

            md:mt-4
            md:text-[48px]

            lg:text-[54px]
          "
        >
          Beauty{" "}
          <span className="italic text-[#E75480]">
            In Motion
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-[310px]
            text-[13px]
            leading-6
            text-[#8A6F78]

            md:mt-5
            md:max-w-2xl
            md:text-[15px]
            md:leading-7
          "
        >
          Explore beautiful transformations, artistry and unforgettable
          moments created at Nirjara Beauty.
        </p>
      </section>

      {/* ===================================================
          SMALL SECTION LABEL
      =================================================== */}

      <div
        className="
          mt-6
          flex
          items-center
          justify-center
          gap-3

          md:mt-8
          md:gap-4
        "
      >
        <span className="h-px w-8 bg-[#E75480]/25 md:w-10" />

        <span
          className="
            text-[6px]
            font-medium
            uppercase
            tracking-[4px]
            text-[#E75480]

            md:text-[7px]
            md:tracking-[5px]
          "
        >
          Beauty In Motion
        </span>

        <span className="h-px w-8 bg-[#E75480]/25 md:w-10" />
      </div>

      {/* ===================================================
          MOBILE
      =================================================== */}

      {isMobile ? (
        <MobileGallery items={gallery} />
      ) : (
        <DesktopGallery
          items={gallery}
          viewportWidth={viewportWidth}
        />
      )}
    </main>
  );
}

/* =========================================================
   MOBILE GALLERY
========================================================= */

function MobileGallery({
  items,
}: {
  items: GalleryItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = items.length;

  /* =======================================================
     NEXT
  ======================================================= */

  const nextSlide = useCallback(() => {
    if (total <= 1) return;

    setDirection(1);

    setActiveIndex((current) =>
      current === total - 1 ? 0 : current + 1
    );
  }, [total]);

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousSlide = useCallback(() => {
    if (total <= 1) return;

    setDirection(-1);

    setActiveIndex((current) =>
      current === 0 ? total - 1 : current - 1
    );
  }, [total]);

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  useEffect(() => {
    if (paused || total <= 1) return;

    const timer = window.setInterval(() => {
      nextSlide();
    }, MOBILE_AUTOPLAY_TIME);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused, total, nextSlide]);

  /* =======================================================
     GET ITEM SAFELY
  ======================================================= */

  const getItem = (offset: number) => {
    const index = (activeIndex + offset + total) % total;

    return items[index];
  };

  const previousItem = getItem(-1);
  const activeItem = getItem(0);
  const nextItem = getItem(1);

  /* =======================================================
     MOBILE UI
  ======================================================= */

  return (
    <section
      className="
        relative
        mt-7
        w-full
        overflow-hidden
        pb-14
      "
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* =================================================
          CAROUSEL AREA
      ================================================= */}

      <div
        className="
          relative
          mx-auto
          h-[390px]
          w-full
          overflow-hidden

          min-[390px]:h-[410px]
        "
      >
        {/* =================================================
            PREVIOUS CARD
        ================================================= */}

        {total > 1 && (
          <motion.button
            type="button"
            aria-label="Previous gallery image"
            onClick={previousSlide}
            initial={false}
            animate={{
              x: "-76%",
              scale: 0.91,
              opacity: 0.48,
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              mass: 0.8,
            }}
            className="
              absolute
              left-1/2
              top-1/2
              z-10

              h-[330px]
              w-[76vw]
              max-w-[320px]

              -translate-x-1/2
              -translate-y-1/2

              overflow-hidden
              rounded-[24px]

              bg-[#F4E8EC]

              shadow-[0_10px_30px_rgba(58,42,47,0.06)]
            "
          >
            <img
              src={previousItem.image}
              alt=""
              draggable={false}
              className="
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div className="absolute inset-0 bg-[#FFF5F8]/10" />
          </motion.button>
        )}

        {/* =================================================
            NEXT CARD
        ================================================= */}

        {total > 1 && (
          <motion.button
            type="button"
            aria-label="Next gallery image"
            onClick={nextSlide}
            initial={false}
            animate={{
              x: "76%",
              scale: 0.91,
              opacity: 0.48,
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              mass: 0.8,
            }}
            className="
              absolute
              left-1/2
              top-1/2
              z-10

              h-[330px]
              w-[76vw]
              max-w-[320px]

              -translate-x-1/2
              -translate-y-1/2

              overflow-hidden
              rounded-[24px]

              bg-[#F4E8EC]

              shadow-[0_10px_30px_rgba(58,42,47,0.06)]
            "
          >
            <img
              src={nextItem.image}
              alt=""
              draggable={false}
              className="
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div className="absolute inset-0 bg-[#FFF5F8]/10" />
          </motion.button>
        )}

        {/* =================================================
            ACTIVE CARD
        ================================================= */}

        <AnimatePresence
          initial={false}
          custom={direction}
          mode="popLayout"
        >
          <motion.article
            key={activeItem._id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 35 : -35,
                opacity: 0.8,
                scale: 0.97,
              }),

              center: {
                x: 0,
                opacity: 1,
                scale: 1,
              },

              exit: (dir: number) => ({
                x: dir > 0 ? -35 : 35,
                opacity: 0,
                scale: 0.97,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.75,
            }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            dragElastic={0.16}
            onDragStart={() => {
              setPaused(true);
            }}
            onDragEnd={(_, info) => {
              setPaused(false);

              const swipeDistance = 55;
              const swipeVelocity = 450;

              if (
                info.offset.x < -swipeDistance ||
                info.velocity.x < -swipeVelocity
              ) {
                nextSlide();
                return;
              }

              if (
                info.offset.x > swipeDistance ||
                info.velocity.x > swipeVelocity
              ) {
                previousSlide();
              }
            }}
            className="
              absolute
              left-1/2
              top-1/2
              z-20

              h-[360px]
              w-[76vw]
              max-w-[320px]

              -translate-x-1/2
              -translate-y-1/2

              cursor-grab
              touch-pan-y
              overflow-hidden
              rounded-[26px]

              bg-[#F4E8EC]

              shadow-[0_18px_45px_rgba(58,42,47,0.12)]

              active:cursor-grabbing

              min-[390px]:h-[380px]
            "
          >
            <img
              src={activeItem.image}
              alt={activeItem.title || "Nirjara Beauty"}
              draggable={false}
              className="
                pointer-events-none
                h-full
                w-full
                select-none
                object-cover
                object-center
              "
            />

            {/* bottom readable gradient */}

            {(activeItem.title || activeItem.category) && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-[38%]

                  bg-gradient-to-t
                  from-black/55
                  via-black/15
                  to-transparent
                "
              />
            )}

            {/* text */}

            {(activeItem.title || activeItem.category) && (
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-5
                  left-5
                  right-5
                  z-10
                  text-left
                "
              >
                {activeItem.category && (
                  <p
                    className="
                      mb-1.5
                      text-[7px]
                      font-medium
                      uppercase
                      tracking-[2.5px]
                      text-white/75
                    "
                  >
                    {activeItem.category}
                  </p>
                )}

                {activeItem.title && (
                  <h2
                    className="
                      font-serif
                      text-[19px]
                      leading-tight
                      text-white
                    "
                  >
                    {activeItem.title}
                  </h2>
                )}
              </div>
            )}
          </motion.article>
        </AnimatePresence>

        {/* =================================================
            SIDE FADES
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-30
            w-[8%]

            bg-gradient-to-r
            from-[#FFF5F8]
            to-transparent
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-30
            w-[8%]

            bg-gradient-to-l
            from-[#FFF5F8]
            to-transparent
          "
        />
      </div>

      {/* =================================================
          DOTS
      ================================================= */}

      {total > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {items.map((item, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={item._id}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`
                  h-[5px]
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    active
                      ? "w-7 bg-[#E75480]"
                      : "w-[5px] bg-[#E75480]/25"
                  }
                `}
              />
            );
          })}
        </div>
      )}

      {/* =================================================
          SWIPE TEXT
      ================================================= */}

      <div className="mt-5 text-center">
        <p
          className="
            text-[7px]
            font-medium
            uppercase
            tracking-[4px]
            text-[#E75480]
          "
        >
          Swipe to explore
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   DESKTOP GALLERY
========================================================= */

function DesktopGallery({
  items,
  viewportWidth,
}: {
  items: GalleryItem[];
  viewportWidth: number;
}) {
  const x = useMotionValue(0);

  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const previousTimeRef = useRef<number | null>(null);

  /* =======================================================
     DIMENSIONS
  ======================================================= */

  const dimensions = useMemo(() => {
    if (viewportWidth >= 1280) {
      const gap = 14;

      const cardWidth = Math.max(
        150,
        Math.min(205, (viewportWidth - gap * 6) / 7)
      );

      return {
        cardWidth,
        gap,
        heights: DESKTOP_HEIGHTS,
      };
    }

    return {
      cardWidth: 170,
      gap: 12,
      heights: TABLET_HEIGHTS,
    };
  }, [viewportWidth]);

  const itemWidth =
    dimensions.cardWidth + dimensions.gap;

  /* =======================================================
     ENSURE ENOUGH CARDS
  ======================================================= */

  const baseItems = useMemo(() => {
    if (!items.length) return [];

    const result: GalleryItem[] = [];

    while (result.length < 14) {
      result.push(...items);
    }

    return result.slice(0, Math.max(14, items.length));
  }, [items]);

  const repeatedItems = useMemo(
    () => [...baseItems, ...baseItems, ...baseItems],
    [baseItems]
  );

  const singleSetWidth =
    baseItems.length * itemWidth;

  /* =======================================================
     START POSITION
  ======================================================= */

  useEffect(() => {
    if (!singleSetWidth) return;

    x.set(-singleSetWidth);

    previousTimeRef.current = null;
  }, [singleSetWidth, x]);

  /* =======================================================
     AUTO MOVEMENT
  ======================================================= */

  useAnimationFrame((time) => {
    if (!singleSetWidth) return;

    if (pausedRef.current || draggingRef.current) {
      previousTimeRef.current = time;
      return;
    }

    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
      return;
    }

    const delta =
      Math.min(time - previousTimeRef.current, 40) / 1000;

    previousTimeRef.current = time;

    let nextX =
      x.get() - DESKTOP_SPEED * delta;

    if (nextX <= -singleSetWidth * 2) {
      nextX += singleSetWidth;
    }

    x.set(nextX);
  });

  /* =======================================================
     NORMALIZE
  ======================================================= */

  const normalizeSlider = () => {
    if (!singleSetWidth) return;

    let current = x.get();

    while (current > -singleSetWidth * 0.25) {
      current -= singleSetWidth;
    }

    while (current < -singleSetWidth * 2.5) {
      current += singleSetWidth;
    }

    x.set(current);
  };

  /* =======================================================
     DESKTOP UI
  ======================================================= */

  return (
    <section
      className="
        relative
        mt-7
        flex
        h-[390px]
        w-full
        items-center
        overflow-hidden

        lg:h-[470px]
      "
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* LEFT FADE */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-20
          w-[7%]

          bg-gradient-to-r
          from-[#FFF5F8]
          via-[#FFF5F8]/70
          to-transparent
        "
      />

      {/* RIGHT FADE */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          z-20
          w-[7%]

          bg-gradient-to-l
          from-[#FFF5F8]
          via-[#FFF5F8]/70
          to-transparent
        "
      />

      {/* TRACK */}

      <motion.div
        drag="x"
        dragMomentum={false}
        dragElastic={0.035}
        onDragStart={() => {
          draggingRef.current = true;
        }}
        onDragEnd={() => {
          draggingRef.current = false;
          previousTimeRef.current = null;
          normalizeSlider();
        }}
        style={{
          x,
          gap: dimensions.gap,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
        className="
          flex
          cursor-grab
          touch-pan-y
          items-center

          active:cursor-grabbing
        "
      >
        {repeatedItems.map((item, index) => (
          <DesktopGalleryCard
            key={`${item._id}-${index}`}
            item={item}
            index={index}
            cardWidth={dimensions.cardWidth}
            itemWidth={itemWidth}
            heights={dimensions.heights}
            x={x}
            viewportWidth={viewportWidth}
          />
        ))}
      </motion.div>
    </section>
  );
}

/* =========================================================
   DESKTOP CARD
========================================================= */

type DesktopGalleryCardProps = {
  item: GalleryItem;
  index: number;
  cardWidth: number;
  itemWidth: number;
  heights: number[];
  x: ReturnType<typeof useMotionValue<number>>;
  viewportWidth: number;
};

function DesktopGalleryCard({
  item,
  index,
  cardWidth,
  itemWidth,
  heights,
  x,
  viewportWidth,
}: DesktopGalleryCardProps) {
  const maxHeight = heights[0];
  const minHeight = heights[3];

  const scaleY = useDynamicScale({
    index,
    itemWidth,
    cardWidth,
    x,
    viewportWidth,
    maxHeight,
    minHeight,
  });

  return (
    <div
      style={{
        width: cardWidth,
        height: maxHeight,
      }}
      className="
        relative
        flex
        shrink-0
        items-center
        justify-center
      "
    >
      <motion.article
        style={{
          width: cardWidth,
          height: maxHeight,
          scaleY,
          transformOrigin: "center center",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
        className="
          relative
          overflow-hidden
          rounded-[22px]
          bg-[#F4E8EC]

          shadow-[0_10px_35px_rgba(58,42,47,0.06)]
        "
      >
        <img
          src={item.image}
          alt={item.title || "Nirjara Beauty"}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="
            pointer-events-none
            h-full
            w-full
            select-none
            object-cover
            object-center
          "
        />

        {(item.title || item.category) && (
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-[38%]

              bg-gradient-to-t
              from-black/50
              via-black/10
              to-transparent
            "
          />
        )}

        {(item.title || item.category) && (
          <div
            className="
              pointer-events-none
              absolute
              bottom-5
              left-5
              right-5
              z-10
            "
          >
            {item.category && (
              <p
                className="
                  mb-1
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[2.5px]
                  text-white/75
                "
              >
                {item.category}
              </p>
            )}

            {item.title && (
              <h3
                className="
                  font-serif
                  text-[16px]
                  leading-tight
                  text-white
                "
              >
                {item.title}
              </h3>
            )}
          </div>
        )}
      </motion.article>
    </div>
  );
}

/* =========================================================
   DESKTOP CURVE
========================================================= */

type DynamicScaleProps = {
  index: number;
  itemWidth: number;
  cardWidth: number;
  x: ReturnType<typeof useMotionValue<number>>;
  viewportWidth: number;
  maxHeight: number;
  minHeight: number;
};

function useDynamicScale({
  index,
  itemWidth,
  cardWidth,
  x,
  viewportWidth,
  maxHeight,
  minHeight,
}: DynamicScaleProps) {
  const scale = useMotionValue(1);

  useAnimationFrame(() => {
    if (!viewportWidth) return;

    const cardCenter =
      x.get() +
      index * itemWidth +
      cardWidth / 2;

    const screenCenter =
      viewportWidth / 2;

    const distance =
      Math.abs(cardCenter - screenCenter);

    const maxDistance =
      itemWidth * 3;

    const normalized =
      Math.min(distance / maxDistance, 1);

    /*
      Smoothstep.

      Center = shortest.
      Edges = tallest.
    */

    const curved =
      normalized *
      normalized *
      (3 - 2 * normalized);

    const height =
      minHeight +
      (maxHeight - minHeight) * curved;

    scale.set(height / maxHeight);
  });

  return scale;
}