import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import SEO from "./SEO";

/* =========================================================
   TYPES
========================================================= */

type GalleryItem = {
  _id: string;
  title?: string;
  category?: string;
  image: string;
};

type FlipDirection =
  | "next"
  | "previous"
  | null;

/* =========================================================
   CONFIG
========================================================= */

const AUTOPLAY_TIME = 3400;
const FLIP_DURATION = 0.82;

/* =========================================================
   SEO
========================================================= */

const GALLERY_SEO = {
  title:
    "Gallery | Nirjara Beauty Kathmandu",

  description:
    "Explore beauty transformations, professional artistry and memorable moments created at Nirjara Beauty in Kathmandu, Nepal.",

  keywords:
    "Nirjara Beauty gallery, beauty salon Kathmandu, beauty parlour Kathmandu, makeup Kathmandu, hair salon Kathmandu, beauty transformations Nepal",

  canonical:
    "/gallery",

  image:
    "/images/nirjara-og.jpg",
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Gallery() {
  const [
    gallery,
    setGallery,
  ] = useState<GalleryItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchGallery =
      async () => {
        try {
          const response =
            await fetch(
              `${
                import.meta.env
                  .VITE_API_URL
              }/api/gallery`
            );

          if (!response.ok) {
            throw new Error(
              `Gallery request failed: ${response.status}`
            );
          }

          const data =
            await response.json();

          const items:
            GalleryItem[] =
            Array.isArray(data)
              ? data
              : Array.isArray(
                    data?.data
                  )
                ? data.data
                : Array.isArray(
                      data?.gallery
                    )
                  ? data.gallery
                  : [];

          setGallery(items);
        } catch (error) {
          console.error(
            "Failed to fetch gallery:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <>
        <GallerySEO />

        <main className="min-h-screen bg-[#FFF5F8] pt-16">
          <div className="flex min-h-[460px] items-center justify-center">
            <div
              className="
                h-9
                w-9
                animate-spin
                rounded-full
                border-2
                border-[#E75480]/20
                border-t-[#E75480]
              "
            />
          </div>
        </main>
      </>
    );
  }

  if (!gallery.length) {
    return (
      <>
        <GallerySEO />

        <main className="min-h-screen bg-[#FFF5F8] pt-16">
          <GalleryHeader />

          <div className="flex min-h-[280px] items-center justify-center">
            <p className="font-serif text-xl italic text-[#8A6F78]">
              Gallery coming soon.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <GallerySEO />

      <main
        className="
          min-h-screen
          overflow-hidden
          bg-[#FFF5F8]
          pt-16
        "
      >
        <GalleryHeader />

        <PremiumGallery
          items={gallery}
        />
      </main>
    </>
  );
}

/* =========================================================
   SEO
========================================================= */

function GallerySEO() {
  return (
    <SEO
      title={GALLERY_SEO.title}
      description={
        GALLERY_SEO.description
      }
      keywords={
        GALLERY_SEO.keywords
      }
      canonical={
        GALLERY_SEO.canonical
      }
      image={GALLERY_SEO.image}
      type="website"
    />
  );
}

/* =========================================================
   HEADER
========================================================= */

function GalleryHeader() {
  return (
    <section
      className="
        mx-auto
        max-w-4xl
        px-5
        pb-1
        pt-4
        text-center

        sm:pt-5
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
        <span
          className="
            hidden
            h-px
            w-10
            bg-[#E75480]/25

            sm:block
          "
        />

        <p
          className="
            text-[7px]
            font-semibold
            uppercase
            tracking-[4px]
            text-[#E75480]

            sm:text-[8px]
          "
        >
          Our Gallery
        </p>

        <span
          className="
            hidden
            h-px
            w-10
            bg-[#E75480]/25

            sm:block
          "
        />
      </div>

      <h1
        className="
          mt-2
          font-serif
          text-[31px]
          leading-none
          text-[#3A2A2F]

          sm:text-[39px]

          md:text-[44px]
        "
      >
        Beauty{" "}

        <span className="italic text-[#E75480]">
          Journal
        </span>
      </h1>

      <p
        className="
          mx-auto
          mt-2.5
          max-w-xl
          text-[11px]
          leading-5
          text-[#8A6F78]

          sm:text-[12px]
        "
      >
        A collection of transformations,
        artistry and memorable Nirjara
        moments.
      </p>
    </section>
  );
}

/* =========================================================
   PREMIUM GALLERY
========================================================= */

function PremiumGallery({
  items,
}: {
  items: GalleryItem[];
}) {
  const reduceMotion =
    useReducedMotion();

  const galleryItems =
    useMemo(
      () =>
        items.filter((item) =>
          Boolean(item.image)
        ),
      [items]
    );

  const total =
    galleryItems.length;

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    mobileDirection,
    setMobileDirection,
  ] =
    useState<1 | -1>(1);

  const [
    flipping,
    setFlipping,
  ] =
    useState<
      FlipDirection
    >(null);

  const [
    paused,
    setPaused,
  ] = useState(false);

  const busyRef =
    useRef(false);

  /* =======================================================
     ITEM HELPERS
  ======================================================= */

  const getItem = (
    index: number
  ) => {
    const safeIndex =
      (
        index +
        total
      ) %
      total;

    return galleryItems[
      safeIndex
    ];
  };

  const current =
    getItem(activeIndex);

  const nextIndex =
    (
      activeIndex +
      1
    ) %
    total;

  const previousIndex =
    (
      activeIndex -
      1 +
      total
    ) %
    total;

  const nextItem =
    getItem(nextIndex);

  const previousItem =
    getItem(previousIndex);

  const farPreviousItem =
    getItem(activeIndex - 2);

  const farNextItem =
    getItem(activeIndex + 2);

  const thirdPreviousItem =
    getItem(activeIndex - 3);

  const thirdNextItem =
    getItem(activeIndex + 3);

  /* =======================================================
     MOBILE
  ======================================================= */

  const mobileNext =
    () => {
      if (total <= 1) {
        return;
      }

      setMobileDirection(1);
      setActiveIndex(nextIndex);
    };

  const mobilePrevious =
    () => {
      if (total <= 1) {
        return;
      }

      setMobileDirection(-1);
      setActiveIndex(
        previousIndex
      );
    };

  /* =======================================================
     DESKTOP FLIP
  ======================================================= */

  const startFlip = (
    direction:
      Exclude<
        FlipDirection,
        null
      >
  ) => {
    if (
      total <= 1 ||
      busyRef.current
    ) {
      return;
    }

    busyRef.current = true;

    setFlipping(direction);
  };

  const finishFlip =
    () => {
      if (
        flipping === "next"
      ) {
        setActiveIndex(
          nextIndex
        );
      }

      if (
        flipping ===
        "previous"
      ) {
        setActiveIndex(
          previousIndex
        );
      }

      setFlipping(null);

      busyRef.current = false;
    };

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  useEffect(() => {
    if (
      total <= 1 ||
      paused ||
      flipping
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          if (
            window.innerWidth <
            640
          ) {
            setMobileDirection(1);

            setActiveIndex(
              (
                currentIndex
              ) =>
                (
                  currentIndex +
                  1
                ) %
                total
            );

            return;
          }

          startFlip("next");
        },
        AUTOPLAY_TIME
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    activeIndex,
    flipping,
    paused,
    total,
  ]);

  if (!galleryItems.length) {
    return null;
  }

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1220px]
        px-3
        pb-8
        pt-3

        sm:px-5

        lg:px-7
      "
    >
      {/* =================================================
          PREMIUM FRAME
      ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[26px]
          border
          border-[#E75480]/[0.08]
          bg-white/[0.42]
          px-1
          py-4

          sm:px-3
          sm:py-5

          md:px-5
        "
        onMouseEnter={() =>
          setPaused(true)
        }
        onMouseLeave={() =>
          setPaused(false)
        }
      >
        {/* subtle top glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[150px]
            w-[60%]
            -translate-x-1/2
            rounded-full
            bg-white/70
            blur-[70px]
          "
        />

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="relative sm:hidden">
          <div
            className="
              relative
              flex
              h-[305px]
              items-center
              justify-center
            "
          >
            {total > 2 && (
              <>
                <MobileSidePreview
                  item={previousItem}
                  side="left"
                />

                <MobileSidePreview
                  item={nextItem}
                  side="right"
                />
              </>
            )}

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={current._id}
                initial={
                  reduceMotion
                    ? false
                    : {
                        x:
                          mobileDirection >
                          0
                            ? 42
                            : -42,

                        opacity: 0,

                        scale: 0.97,
                      }
                }
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        x:
                          mobileDirection >
                          0
                            ? -42
                            : 42,

                        opacity: 0,

                        scale: 0.97,
                      }
                }
                transition={{
                  duration:
                    reduceMotion
                      ? 0
                      : 0.3,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                drag={
                  total > 1
                    ? "x"
                    : false
                }
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.08}
                onDragStart={() =>
                  setPaused(true)
                }
                onDragEnd={(
                  _,
                  info
                ) => {
                  setPaused(false);

                  if (
                    info.offset.x <
                      -45 ||
                    info.velocity.x <
                      -350
                  ) {
                    mobileNext();
                    return;
                  }

                  if (
                    info.offset.x >
                      45 ||
                    info.velocity.x >
                      350
                  ) {
                    mobilePrevious();
                  }
                }}
                className="
                  relative
                  z-20
                  h-[260px]
                  w-[205px]
                  cursor-grab
                  overflow-hidden
                  rounded-[19px]
                  border
                  border-[#E9DCDD]
                  bg-white
                  shadow-[0_20px_45px_rgba(58,42,47,0.16)]

                  active:cursor-grabbing
                "
              >
                <img
                  src={current.image}
                  alt={
                    current.title ||
                    "Nirjara Beauty"
                  }
                  draggable={false}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <JournalCaption
                  item={current}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <GalleryControls
              total={total}
              activeIndex={
                activeIndex
              }
              previous={
                mobilePrevious
              }
              next={mobileNext}
              onDot={(index) => {
                const forward =
                  (
                    index -
                    activeIndex +
                    total
                  ) %
                  total;

                setMobileDirection(
                  forward <=
                    total / 2
                    ? 1
                    : -1
                );

                setActiveIndex(
                  index
                );
              }}
            />
          )}
        </div>

        {/* =================================================
            TABLET / DESKTOP
        ================================================= */}

        <div
          className="
            relative
            hidden

            sm:block
          "
        >
          <div
            className="
              relative
              flex
              h-[375px]
              items-center
              justify-center

              [perspective:2400px]

              md:h-[405px]

              lg:h-[420px]
            "
          >
            {/* =================================================
                STACKED SIDE CARDS
            ================================================= */}

            {total >= 7 && (
              <DesktopSidePreview
                item={
                  thirdPreviousItem
                }
                position="outer-left"
              />
            )}

            {total >= 5 && (
              <DesktopSidePreview
                item={
                  farPreviousItem
                }
                position="far-left"
              />
            )}

            {total > 2 && (
              <DesktopSidePreview
                item={
                  previousItem
                }
                position="left"
              />
            )}

            {total > 2 && (
              <DesktopSidePreview
                item={nextItem}
                position="right"
              />
            )}

            {total >= 5 && (
              <DesktopSidePreview
                item={farNextItem}
                position="far-right"
              />
            )}

            {total >= 7 && (
              <DesktopSidePreview
                item={
                  thirdNextItem
                }
                position="outer-right"
              />
            )}

            {/* =================================================
                FLOOR SHADOW
            ================================================= */}

            <motion.div
              animate={{
                opacity:
                  flipping
                    ? 0.17
                    : 0.11,

                scaleX:
                  flipping
                    ? 1.08
                    : 1,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                pointer-events-none
                absolute
                bottom-[14px]
                left-1/2
                h-[44px]
                w-[49%]
                -translate-x-1/2
                rounded-full
                bg-[#3A2A2F]
                blur-[24px]
              "
            />

            {/* =================================================
                MAIN JOURNAL
            ================================================= */}

            <div
              className="
                relative
                z-30

                h-[285px]
                w-[470px]

                [perspective:2200px]
                [transform-style:preserve-3d]

                md:h-[315px]
                md:w-[555px]

                lg:h-[335px]
                lg:w-[610px]
              "
            >
              {/* =================================================
                  PAPER THICKNESS
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-[10px]
                  bottom-[-8px]
                  top-[8px]
                  rounded-[20px]
                  border
                  border-[#D9CACA]
                  bg-[#E8DDDA]
                  shadow-[0_12px_24px_rgba(58,42,47,0.11)]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-[6px]
                  bottom-[-5px]
                  top-[5px]
                  rounded-[20px]
                  bg-[#F3EBE7]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[-4px]
                  left-[15px]
                  right-[15px]
                  h-[6px]
                  rounded-b-[12px]
                  bg-gradient-to-b
                  from-[#F9F3EE]
                  to-[#D9CBC8]
                "
              />

              {/* =================================================
                  TARGET UNDERNEATH
              ================================================= */}

              {flipping && (
                <div
                  className="
                    absolute
                    inset-0
                    z-10
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E3D4D5]
                    bg-white
                    shadow-[0_26px_60px_rgba(58,42,47,0.18)]
                  "
                >
                  <img
                    src={
                      flipping ===
                      "next"
                        ? nextItem.image
                        : previousItem.image
                    }
                    alt=""
                    draggable={false}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <FullPhotoCaption
                    item={
                      flipping ===
                      "next"
                        ? nextItem
                        : previousItem
                    }
                  />
                </div>
              )}

              {/* =================================================
                  NORMAL RESTING IMAGE

                  SINGLE PHOTO
                  NO SEAM
              ================================================= */}

              {!flipping && (
                <div
                  className="
                    absolute
                    inset-0
                    z-20
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E3D4D5]
                    bg-white
                    shadow-[0_28px_62px_rgba(58,42,47,0.18)]
                  "
                >
                  <img
                    src={current.image}
                    alt={
                      current.title ||
                      "Nirjara Beauty"
                    }
                    draggable={false}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <FullPhotoCaption
                    item={current}
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-[20px]
                      ring-1
                      ring-inset
                      ring-white/30
                    "
                  />
                </div>
              )}

              {/* =================================================
                  NEXT FLIP
                  RIGHT -> LEFT
              ================================================= */}

              {flipping ===
                "next" && (
                <>
                  {/* CURRENT LEFT */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      top-0
                      z-30
                      w-1/2
                      overflow-hidden
                      rounded-l-[20px]
                    "
                  >
                    <SplitPhotoHalf
                      image={
                        current.image
                      }
                      side="left"
                    />
                  </div>

                  {/* TURNING RIGHT */}

                  <motion.div
                    initial={{
                      rotateY: 0,
                    }}
                    animate={{
                      rotateY:
                        -180,
                    }}
                    transition={{
                      duration:
                        reduceMotion
                          ? 0
                          : FLIP_DURATION,

                      ease: [
                        0.4,
                        0,
                        0.16,
                        1,
                      ],
                    }}
                    onAnimationComplete={
                      finishFlip
                    }
                    className="
                      absolute
                      right-0
                      top-0
                      z-50
                      h-full
                      w-1/2
                      origin-left

                      [transform-style:preserve-3d]
                    "
                  >
                    {/* FRONT */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-r-[20px]

                        [backface-visibility:hidden]
                      "
                      style={{
                        boxShadow:
                          "-14px 8px 28px rgba(58,42,47,0.16)",
                      }}
                    >
                      <SplitPhotoHalf
                        image={
                          current.image
                        }
                        side="right"
                      />

                      <motion.div
                        animate={{
                          opacity: [
                            0,
                            0.08,
                            0.34,
                            0.46,
                            0.12,
                            0,
                          ],
                        }}
                        transition={{
                          duration:
                            FLIP_DURATION,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-l
                          from-transparent
                          via-black/[0.04]
                          to-black/55
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          bottom-0
                          right-0
                          top-0
                          w-[2px]
                          bg-[#EEE2DD]
                        "
                      />
                    </div>

                    {/* BACK */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-l-[20px]

                        [backface-visibility:hidden]
                        [transform:rotateY(180deg)]
                      "
                      style={{
                        boxShadow:
                          "12px 8px 28px rgba(58,42,47,0.15)",
                      }}
                    >
                      <SplitPhotoHalf
                        image={
                          nextItem.image
                        }
                        side="left"
                      />

                      <motion.div
                        initial={{
                          opacity:
                            0.3,
                        }}
                        animate={{
                          opacity: [
                            0.3,
                            0.17,
                            0.04,
                            0,
                          ],
                        }}
                        transition={{
                          duration:
                            FLIP_DURATION,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-r
                          from-black/20
                          to-transparent
                        "
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* =================================================
                  PREVIOUS FLIP
                  LEFT -> RIGHT
              ================================================= */}

              {flipping ===
                "previous" && (
                <>
                  {/* CURRENT RIGHT */}

                  <div
                    className="
                      absolute
                      bottom-0
                      right-0
                      top-0
                      z-30
                      w-1/2
                      overflow-hidden
                      rounded-r-[20px]
                    "
                  >
                    <SplitPhotoHalf
                      image={
                        current.image
                      }
                      side="right"
                    />
                  </div>

                  {/* TURNING LEFT */}

                  <motion.div
                    initial={{
                      rotateY: 0,
                    }}
                    animate={{
                      rotateY:
                        180,
                    }}
                    transition={{
                      duration:
                        reduceMotion
                          ? 0
                          : FLIP_DURATION,

                      ease: [
                        0.4,
                        0,
                        0.16,
                        1,
                      ],
                    }}
                    onAnimationComplete={
                      finishFlip
                    }
                    className="
                      absolute
                      left-0
                      top-0
                      z-50
                      h-full
                      w-1/2
                      origin-right

                      [transform-style:preserve-3d]
                    "
                  >
                    {/* FRONT */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-l-[20px]

                        [backface-visibility:hidden]
                      "
                      style={{
                        boxShadow:
                          "14px 8px 28px rgba(58,42,47,0.16)",
                      }}
                    >
                      <SplitPhotoHalf
                        image={
                          current.image
                        }
                        side="left"
                      />

                      <motion.div
                        animate={{
                          opacity: [
                            0,
                            0.08,
                            0.34,
                            0.46,
                            0.12,
                            0,
                          ],
                        }}
                        transition={{
                          duration:
                            FLIP_DURATION,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-r
                          from-transparent
                          via-black/[0.04]
                          to-black/55
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          bottom-0
                          left-0
                          top-0
                          w-[2px]
                          bg-[#EEE2DD]
                        "
                      />
                    </div>

                    {/* BACK */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-r-[20px]

                        [backface-visibility:hidden]
                        [transform:rotateY(180deg)]
                      "
                      style={{
                        boxShadow:
                          "-12px 8px 28px rgba(58,42,47,0.15)",
                      }}
                    >
                      <SplitPhotoHalf
                        image={
                          previousItem.image
                        }
                        side="right"
                      />

                      <motion.div
                        initial={{
                          opacity:
                            0.3,
                        }}
                        animate={{
                          opacity: [
                            0.3,
                            0.17,
                            0.04,
                            0,
                          ],
                        }}
                        transition={{
                          duration:
                            FLIP_DURATION,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-l
                          from-black/20
                          to-transparent
                        "
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* =================================================
                  TEMPORARY SPINE
                  ONLY DURING FOLD
              ================================================= */}

              <AnimatePresence>
                {flipping && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-1/2
                      top-0
                      z-[60]
                      w-[12px]
                      -translate-x-1/2
                      bg-gradient-to-r
                      from-black/[0.07]
                      via-white/[0.06]
                      to-black/[0.07]
                    "
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* =================================================
              CONTROLS
          ================================================= */}

          {total > 1 && (
            <GalleryControls
              total={total}
              activeIndex={
                activeIndex
              }
              disabled={
                Boolean(
                  flipping
                )
              }
              previous={() =>
                startFlip(
                  "previous"
                )
              }
              next={() =>
                startFlip(
                  "next"
                )
              }
              onDot={(index) => {
                if (
                  index ===
                    activeIndex ||
                  flipping
                ) {
                  return;
                }

                const forward =
                  (
                    index -
                    activeIndex +
                    total
                  ) %
                  total;

                startFlip(
                  forward <=
                    total / 2
                    ? "next"
                    : "previous"
                );
              }}
            />
          )}
        </div>

        {/* =================================================
            COUNTER
        ================================================= */}

        <p
          className="
            mt-2
            text-center
            text-[7px]
            font-semibold
            uppercase
            tracking-[2.2px]
            text-[#B99DA6]
          "
        >
          {String(
            activeIndex + 1
          ).padStart(
            2,
            "0"
          )}

          <span
            className="
              mx-1
              text-[#E75480]/35
            "
          >
            /
          </span>

          {String(total).padStart(
            2,
            "0"
          )}
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   SPLIT PHOTO
========================================================= */

function SplitPhotoHalf({
  image,
  side,
}: {
  image: string;

  side:
    | "left"
    | "right";
}) {
  return (
    <div
      className="
        absolute
        inset-0
        overflow-hidden
      "
    >
      <img
        src={image}
        alt=""
        draggable={false}
        className="
          absolute
          top-0
          h-full
          max-w-none
          select-none
          object-cover
          object-center
        "
        style={{
          width: "200%",

          left:
            side ===
            "left"
              ? "0%"
              : "-100%",
        }}
      />
    </div>
  );
}

/* =========================================================
   DESKTOP SIDE PREVIEW
========================================================= */

function DesktopSidePreview({
  item,
  position,
}: {
  item: GalleryItem;

  position:
    | "outer-left"
    | "far-left"
    | "left"
    | "right"
    | "far-right"
    | "outer-right";
}) {
  const settings = {
    "outer-left": {
      x: -405,
      rotate: -4.5,
      scale: 0.67,
      opacity: 0.19,
      zIndex: 1,
    },

    "far-left": {
      x: -345,
      rotate: -3.5,
      scale: 0.73,
      opacity: 0.31,
      zIndex: 3,
    },

    left: {
      x: -278,
      rotate: -1.8,
      scale: 0.82,
      opacity: 0.56,
      zIndex: 6,
    },

    right: {
      x: 278,
      rotate: 1.8,
      scale: 0.82,
      opacity: 0.56,
      zIndex: 6,
    },

    "far-right": {
      x: 345,
      rotate: 3.5,
      scale: 0.73,
      opacity: 0.31,
      zIndex: 3,
    },

    "outer-right": {
      x: 405,
      rotate: 4.5,
      scale: 0.67,
      opacity: 0.19,
      zIndex: 1,
    },
  }[
    position
  ];

  return (
    <motion.div
      animate={{
        x: settings.x,
        rotate:
          settings.rotate,
        scale:
          settings.scale,
        opacity:
          settings.opacity,
      }}
      transition={{
        duration: 0.4,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="
        pointer-events-none
        absolute
        left-1/2
        top-1/2

        h-[255px]
        w-[176px]

        -translate-x-1/2
        -translate-y-1/2

        overflow-hidden

        rounded-[17px]

        border
        border-[#E6D8D9]

        bg-[#FFFDF9]

        shadow-[0_13px_28px_rgba(58,42,47,0.11)]

        md:h-[278px]
        md:w-[192px]
      "
      style={{
        zIndex:
          settings.zIndex,
      }}
    >
      <img
        src={item.image}
        alt=""
        draggable={false}
        className="
          h-full
          w-full
          object-cover
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          ring-1
          ring-inset
          ring-white/25
        "
      />
    </motion.div>
  );
}

/* =========================================================
   MOBILE SIDE PREVIEW
========================================================= */

function MobileSidePreview({
  item,
  side,
}: {
  item: GalleryItem;

  side:
    | "left"
    | "right";
}) {
  return (
    <div
      className={`
        pointer-events-none
        absolute
        left-1/2
        top-1/2

        h-[215px]
        w-[142px]

        -translate-y-1/2

        overflow-hidden

        rounded-[17px]

        border
        border-[#E7D9DA]

        bg-white

        opacity-28

        shadow-[0_10px_25px_rgba(58,42,47,0.08)]

        ${
          side ===
          "left"
            ? `
                -translate-x-[83%]
                -rotate-[4deg]
              `
            : `
                -translate-x-[17%]
                rotate-[4deg]
              `
        }
      `}
    >
      <img
        src={item.image}
        alt=""
        draggable={false}
        className="
          h-full
          w-full
          object-cover
        "
      />
    </div>
  );
}

/* =========================================================
   FULL PHOTO CAPTION
========================================================= */

function FullPhotoCaption({
  item,
}: {
  item: GalleryItem;
}) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0

        bg-gradient-to-t
        from-[#2A1C21]/75
        via-[#2A1C21]/13
        to-transparent

        px-4
        pb-4
        pt-16
      "
    >
      <h2
        className="
          text-center
          font-serif
          text-[16px]
          leading-tight
          text-white

          md:text-[18px]
        "
      >
        {item.title?.trim() ||
          "Nirjara Beauty"}
      </h2>

      {item.category && (
        <p
          className="
            mt-1
            truncate
            text-center
            text-[6px]
            font-semibold
            uppercase
            tracking-[2px]
            text-white/75
          "
        >
          {
            item.category
          }
        </p>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE CAPTION
========================================================= */

function JournalCaption({
  item,
}: {
  item: GalleryItem;
}) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0

        bg-gradient-to-t
        from-[#281B20]/80
        via-[#281B20]/20
        to-transparent

        px-4
        pb-4
        pt-14
      "
    >
      <h2
        className="
          text-center
          font-serif
          text-[14px]
          text-white
        "
      >
        {item.title?.trim() ||
          "Nirjara Beauty"}
      </h2>
    </div>
  );
}

/* =========================================================
   CONTROLS
========================================================= */

function GalleryControls({
  total,
  activeIndex,
  previous,
  next,
  onDot,
  disabled = false,
}: {
  total: number;

  activeIndex: number;

  previous:
    () => void;

  next:
    () => void;

  onDot:
    (
      index: number
    ) => void;

  disabled?: boolean;
}) {
  return (
    <div
      className="
        mt-1
        flex
        items-center
        justify-center
        gap-3
      "
    >
      <button
        type="button"
        disabled={disabled}
        onClick={previous}
        aria-label="Previous image"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center

          rounded-full

          border
          border-[#E75480]/15

          bg-white/95

          text-[#E75480]

          shadow-[0_4px_14px_rgba(58,42,47,0.08)]

          transition-all
          duration-200

          hover:-translate-y-0.5
          hover:border-[#E75480]/35
          hover:bg-[#E75480]
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft
          size={15}
        />
      </button>

      <div
        className="
          flex
          items-center
          gap-[6px]
        "
      >
        {Array.from({
          length: total,
        }).map(
          (
            _,
            index
          ) => (
            <button
              key={index}
              type="button"
              disabled={disabled}
              onClick={() =>
                onDot(index)
              }
              aria-label={`Open image ${
                index + 1
              }`}
              className={`
                rounded-full

                transition-all
                duration-200

                ${
                  index ===
                  activeIndex
                    ? `
                        h-[5px]
                        w-[22px]
                        bg-[#E75480]
                      `
                    : `
                        h-[5px]
                        w-[5px]
                        bg-[#E75480]/20

                        hover:bg-[#E75480]/45
                      `
                }
              `}
            />
          )
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={next}
        aria-label="Next image"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center

          rounded-full

          border
          border-[#E75480]/15

          bg-white/95

          text-[#E75480]

          shadow-[0_4px_14px_rgba(58,42,47,0.08)]

          transition-all
          duration-200

          hover:-translate-y-0.5
          hover:border-[#E75480]/35
          hover:bg-[#E75480]
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight
          size={15}
        />
      </button>
    </div>
  );
}