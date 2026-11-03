import {
  useEffect,
  useMemo,
  useRef,
  useState,
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
   PAGE
========================================================= */

export default function Gallery() {
  const [
    gallery,
    setGallery,
  ] =
    useState<
      GalleryItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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

          if (
            !response.ok
          ) {
            throw new Error(
              `Gallery request failed: ${response.status}`
            );
          }

          const data =
            await response.json();

          const items:
            GalleryItem[] =
            Array.isArray(
              data
            )
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

          setGallery(
            items
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to fetch gallery:",
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchGallery();
  }, []);

  if (
    loading
  ) {
    return (
      <>
        <GallerySEO />

        <main
          className="
            min-h-screen
            bg-[#FFF5F8]
            pt-16
          "
        >
          <div
            className="
              flex
              min-h-[480px]
              items-center
              justify-center
            "
          >
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

  if (
    !gallery.length
  ) {
    return (
      <>
        <GallerySEO />

        <main
          className="
            min-h-screen
            bg-[#FFF5F8]
            pt-16
          "
        >
          <GalleryHeader />

          <div
            className="
              flex
              min-h-[280px]
              items-center
              justify-center
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
          items={
            gallery
          }
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
      title={
        GALLERY_SEO.title
      }
      description={
        GALLERY_SEO.description
      }
      keywords={
        GALLERY_SEO.keywords
      }
      canonical={
        GALLERY_SEO.canonical
      }
      image={
        GALLERY_SEO.image
      }
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
            w-9
            bg-[#E75480]/30

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
            w-9
            bg-[#E75480]/30

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

        <span
          className="
            italic
            text-[#E75480]
          "
        >
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
        A collection of
        transformations, artistry
        and memorable Nirjara
        moments.
      </p>
    </section>
  );
}

/* =========================================================
   GALLERY
========================================================= */

function PremiumGallery({
  items,
}: {
  items:
    GalleryItem[];
}) {
  const reduceMotion =
    useReducedMotion();

  const galleryItems =
    useMemo(
      () =>
        items.filter(
          (
            item
          ) =>
            Boolean(
              item.image
            )
        ),
      [
        items,
      ]
    );

  const total =
    galleryItems.length;

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const [
    mobileDirection,
    setMobileDirection,
  ] =
    useState<
      1 | -1
    >(1);

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
  ] =
    useState(false);

  const busyRef =
    useRef(false);

  /* =======================================================
     ITEM HELPERS
  ======================================================= */

  const getItem =
    (
      index:
        number
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
    getItem(
      activeIndex
    );

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
    getItem(
      nextIndex
    );

  const previousItem =
    getItem(
      previousIndex
    );

  const farPreviousItem =
    getItem(
      activeIndex -
        2
    );

  const farNextItem =
    getItem(
      activeIndex +
        2
    );

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  const mobileNext =
    () => {
      if (
        total <= 1
      ) {
        return;
      }

      setMobileDirection(
        1
      );

      setActiveIndex(
        nextIndex
      );
    };

  const mobilePrevious =
    () => {
      if (
        total <= 1
      ) {
        return;
      }

      setMobileDirection(
        -1
      );

      setActiveIndex(
        previousIndex
      );
    };

  /* =======================================================
     DESKTOP PAGE TURN
  ======================================================= */

  const startFlip =
    (
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

      busyRef.current =
        true;

      setFlipping(
        direction
      );
    };

  const finishFlip =
    () => {
      if (
        flipping ===
        "next"
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

      setFlipping(
        null
      );

      busyRef.current =
        false;
    };

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  useEffect(
    () => {
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
              setMobileDirection(
                1
              );

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

            startFlip(
              "next"
            );
          },
          AUTOPLAY_TIME
        );

      return () =>
        window.clearTimeout(
          timer
        );
    },
    [
      activeIndex,
      flipping,
      paused,
      total,
    ]
  );

  if (
    !galleryItems.length
  ) {
    return null;
  }

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1160px]
        px-3
        pb-10
        pt-3

        sm:px-5
        lg:px-8
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-[#E75480]/10
          bg-white/65
          px-2
          py-4
          shadow-[0_16px_50px_rgba(58,42,47,0.055)]

          sm:px-4
          sm:py-5
        "
        onMouseEnter={() =>
          setPaused(
            true
          )
        }
        onMouseLeave={() =>
          setPaused(
            false
          )
        }
      >
        {/* =================================================
            MOBILE
        ================================================= */}

        <div
          className="
            sm:hidden
          "
        >
          <div
            className="
              relative
              flex
              h-[310px]
              items-center
              justify-center
            "
          >
            {total >
              2 && (
              <>
                <MobileSidePreview
                  item={
                    previousItem
                  }
                  side="left"
                />

                <MobileSidePreview
                  item={
                    nextItem
                  }
                  side="right"
                />
              </>
            )}

            <AnimatePresence
              mode="wait"
              initial={
                false
              }
            >
              <motion.div
                key={
                  current._id
                }
                initial={
                  reduceMotion
                    ? false
                    : {
                        x:
                          mobileDirection >
                          0
                            ? 45
                            : -45,

                        opacity:
                          0,

                        scale:
                          0.97,
                      }
                }
                animate={{
                  x:
                    0,

                  opacity:
                    1,

                  scale:
                    1,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : {
                        x:
                          mobileDirection >
                          0
                            ? -45
                            : 45,

                        opacity:
                          0,

                        scale:
                          0.97,
                      }
                }
                transition={{
                  duration:
                    reduceMotion
                      ? 0
                      : 0.32,

                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                drag={
                  total >
                  1
                    ? "x"
                    : false
                }
                dragConstraints={{
                  left:
                    0,

                  right:
                    0,
                }}
                dragElastic={
                  0.08
                }
                onDragStart={() =>
                  setPaused(
                    true
                  )
                }
                onDragEnd={(
                  _,
                  info
                ) => {
                  setPaused(
                    false
                  );

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
                  h-[265px]
                  w-[210px]
                  cursor-grab
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#E8DADC]
                  bg-white
                  shadow-[0_20px_44px_rgba(58,42,47,0.15)]

                  active:cursor-grabbing
                "
              >
                <img
                  src={
                    current.image
                  }
                  alt={
                    current.title ||
                    "Nirjara Beauty"
                  }
                  draggable={
                    false
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <JournalCaption
                  item={
                    current
                  }
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {total >
            1 && (
            <GalleryControls
              total={
                total
              }
              activeIndex={
                activeIndex
              }
              previous={
                mobilePrevious
              }
              next={
                mobileNext
              }
              onDot={(
                index
              ) => {
                const forward =
                  (
                    index -
                    activeIndex +
                    total
                  ) %
                  total;

                setMobileDirection(
                  forward <=
                    total /
                      2
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
            TABLET + DESKTOP
        ================================================= */}

        <div
          className="
            hidden
            sm:block
          "
        >
          <div
            className="
              relative
              flex
              h-[380px]
              items-center
              justify-center

              [perspective:2300px]

              md:h-[415px]

              lg:h-[430px]
            "
          >
            {/* =================================================
                SIDE PREVIEWS
            ================================================= */}

            {total >
              4 && (
              <DesktopSidePreview
                item={
                  farPreviousItem
                }
                position="far-left"
              />
            )}

            {total >
              2 && (
              <DesktopSidePreview
                item={
                  previousItem
                }
                position="left"
              />
            )}

            {total >
              2 && (
              <DesktopSidePreview
                item={
                  nextItem
                }
                position="right"
              />
            )}

            {total >
              4 && (
              <DesktopSidePreview
                item={
                  farNextItem
                }
                position="far-right"
              />
            )}

            {/* =================================================
                FLOOR SHADOW
            ================================================= */}

            <motion.div
              animate={{
                opacity:
                  flipping
                    ? 0.16
                    : 0.11,

                scaleX:
                  flipping
                    ? 1.08
                    : 1,
              }}
              transition={{
                duration:
                  0.35,
              }}
              className="
                pointer-events-none
                absolute
                bottom-[14px]
                left-1/2
                h-[46px]
                w-[52%]
                -translate-x-1/2
                rounded-full
                bg-[#392A30]
                blur-[25px]
              "
            />

            {/* =================================================
                JOURNAL
            ================================================= */}

            <div
              className="
                relative
                z-30

                h-[295px]
                w-[470px]

                [perspective:2100px]
                [transform-style:preserve-3d]

                md:h-[325px]
                md:w-[560px]

                lg:h-[345px]
                lg:w-[610px]
              "
            >
              {/* =============================================
                  CLEAN PAPER THICKNESS

                  Only visible around bottom/right.
              ============================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-[8px]
                  bottom-[-7px]
                  top-[7px]
                  rounded-[21px]
                  bg-[#E5D7D4]
                  shadow-[0_8px_14px_rgba(58,42,47,0.13)]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-[4px]
                  bottom-[-4px]
                  top-[4px]
                  rounded-[21px]
                  bg-[#F2E9E5]
                "
              />

              {/* =============================================
                  TARGET FULL IMAGE UNDERNEATH

                  This is important:
                  when turning, next/previous
                  photo is already underneath.
              ============================================= */}

              {flipping && (
                <div
                  className="
                    absolute
                    inset-0
                    z-10
                    overflow-hidden
                    rounded-[21px]
                    border
                    border-[#E4D5D6]
                    bg-white
                    shadow-[0_24px_58px_rgba(58,42,47,0.17)]
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
                    draggable={
                      false
                    }
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

              {/* =============================================
                  NORMAL RESTING STATE

                  IMPORTANT:
                  one full uninterrupted photo.
                  NO visible center split.
              ============================================= */}

              {!flipping && (
                <div
                  className="
                    absolute
                    inset-0
                    z-20
                    overflow-hidden
                    rounded-[21px]
                    border
                    border-[#E4D5D6]
                    bg-white
                    shadow-[0_24px_58px_rgba(58,42,47,0.18)]
                  "
                >
                  <img
                    src={
                      current.image
                    }
                    alt={
                      current.title ||
                      "Nirjara Beauty"
                    }
                    draggable={
                      false
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <FullPhotoCaption
                    item={
                      current
                    }
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
                </div>
              )}

              {/* =============================================
                  NEXT PAGE TURN
                  RIGHT -> LEFT
              ============================================= */}

              {flipping ===
                "next" && (
                <>
                  {/* KEEP CURRENT LEFT HALF */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      top-0
                      z-30
                      w-1/2
                      overflow-hidden
                      rounded-l-[21px]
                    "
                  >
                    <SplitPhotoHalf
                      image={
                        current.image
                      }
                      side="left"
                    />
                  </div>

                  {/* FOLDING RIGHT HALF */}

                  <motion.div
                    initial={{
                      rotateY:
                        0,
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
                    style={{
                      transformStyle:
                        "preserve-3d",
                    }}
                  >
                    {/* FRONT:
                        CURRENT RIGHT HALF */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-r-[21px]

                        [backface-visibility:hidden]
                      "
                      style={{
                        boxShadow:
                          "-10px 10px 26px rgba(58,42,47,0.16)",
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
                            0.1,
                            0.38,
                            0.5,
                            0.18,
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
                          via-black/[0.05]
                          to-black/55
                        "
                      />

                      {/* thin page edge */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          bottom-0
                          right-0
                          top-0
                          w-[3px]
                          bg-[#E9DDD8]
                        "
                      />
                    </div>

                    {/* BACK:
                        NEXT LEFT HALF */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-l-[21px]

                        [backface-visibility:hidden]
                        [transform:rotateY(180deg)]
                      "
                      style={{
                        boxShadow:
                          "10px 10px 26px rgba(58,42,47,0.16)",
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
                            0.38,
                        }}
                        animate={{
                          opacity: [
                            0.38,
                            0.24,
                            0.08,
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
                          from-black/25
                          to-transparent
                        "
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* =============================================
                  PREVIOUS PAGE TURN
                  LEFT -> RIGHT
              ============================================= */}

              {flipping ===
                "previous" && (
                <>
                  {/* KEEP CURRENT RIGHT HALF */}

                  <div
                    className="
                      absolute
                      bottom-0
                      right-0
                      top-0
                      z-30
                      w-1/2
                      overflow-hidden
                      rounded-r-[21px]
                    "
                  >
                    <SplitPhotoHalf
                      image={
                        current.image
                      }
                      side="right"
                    />
                  </div>

                  {/* FOLDING LEFT HALF */}

                  <motion.div
                    initial={{
                      rotateY:
                        0,
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
                    style={{
                      transformStyle:
                        "preserve-3d",
                    }}
                  >
                    {/* FRONT:
                        CURRENT LEFT */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-l-[21px]

                        [backface-visibility:hidden]
                      "
                      style={{
                        boxShadow:
                          "10px 10px 26px rgba(58,42,47,0.16)",
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
                            0.1,
                            0.38,
                            0.5,
                            0.18,
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
                          via-black/[0.05]
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
                          w-[3px]
                          bg-[#E9DDD8]
                        "
                      />
                    </div>

                    {/* BACK:
                        PREVIOUS RIGHT */}

                    <div
                      className="
                        absolute
                        inset-0
                        overflow-hidden
                        rounded-r-[21px]

                        [backface-visibility:hidden]
                        [transform:rotateY(180deg)]
                      "
                      style={{
                        boxShadow:
                          "-10px 10px 26px rgba(58,42,47,0.16)",
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
                            0.38,
                        }}
                        animate={{
                          opacity: [
                            0.38,
                            0.24,
                            0.08,
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
                          from-black/25
                          to-transparent
                        "
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* =============================================
                  CENTER SPINE

                  Only show while page
                  is actually turning.
              ============================================= */}

              <AnimatePresence>
                {flipping && (
                  <motion.div
                    initial={{
                      opacity:
                        0,
                    }}
                    animate={{
                      opacity:
                        1,
                    }}
                    exit={{
                      opacity:
                        0,
                    }}
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-1/2
                      top-0
                      z-[60]
                      w-[14px]
                      -translate-x-1/2

                      bg-gradient-to-r
                      from-black/[0.08]
                      via-white/[0.08]
                      to-black/[0.08]
                    "
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* =================================================
              DESKTOP CONTROLS
          ================================================= */}

          {total >
            1 && (
            <GalleryControls
              total={
                total
              }
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
              onDot={(
                index
              ) => {
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
            tracking-[2px]
            text-[#B89BA5]
          "
        >
          {String(
            activeIndex +
              1
          ).padStart(
            2,
            "0"
          )}

          {" / "}

          {String(
            total
          ).padStart(
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

   Used ONLY while folding.

   At rest we use a single normal <img>,
   so there is no visible center seam.
========================================================= */

function SplitPhotoHalf({
  image,
  side,
}: {
  image:
    string;

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
        src={
          image
        }
        alt=""
        draggable={
          false
        }
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
          width:
            "200%",

          left:
            side ===
            "left"
              ? "0"
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
  item:
    GalleryItem;

  position:
    | "far-left"
    | "left"
    | "right"
    | "far-right";
}) {
  const config = {
    "far-left": {
      x:
        -330,
      rotate:
        -4,
      scale:
        0.73,
      opacity:
        0.17,
      zIndex:
        3,
    },

    left: {
      x:
        -255,
      rotate:
        -2,
      scale:
        0.82,
      opacity:
        0.37,
      zIndex:
        6,
    },

    right: {
      x:
        255,
      rotate:
        2,
      scale:
        0.82,
      opacity:
        0.37,
      zIndex:
        6,
    },

    "far-right": {
      x:
        330,
      rotate:
        4,
      scale:
        0.73,
      opacity:
        0.17,
      zIndex:
        3,
    },
  }[
    position
  ];

  return (
    <motion.div
      animate={{
        x:
          config.x,

        rotate:
          config.rotate,

        scale:
          config.scale,

        opacity:
          config.opacity,
      }}
      transition={{
        duration:
          0.42,

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
        h-[265px]
        w-[180px]
        -translate-x-1/2
        -translate-y-1/2
        overflow-hidden
        rounded-[17px]
        border
        border-[#E6D9DA]
        bg-white
        shadow-[0_14px_32px_rgba(58,42,47,0.10)]

        md:h-[285px]
        md:w-[195px]
      "
      style={{
        zIndex:
          config.zIndex,
      }}
    >
      <img
        src={
          item.image
        }
        alt=""
        draggable={
          false
        }
        className="
          h-full
          w-full
          object-cover
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
  item:
    GalleryItem;

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
        h-[220px]
        w-[145px]
        -translate-y-1/2
        overflow-hidden
        rounded-[17px]
        border
        border-[#E75480]/10
        bg-white
        opacity-25

        ${
          side ===
          "left"
            ? `
                -translate-x-[82%]
                -rotate-[4deg]
              `
            : `
                -translate-x-[18%]
                rotate-[4deg]
              `
        }
      `}
    >
      <img
        src={
          item.image
        }
        alt=""
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
  item:
    GalleryItem;
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
        via-[#281B20]/18
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
  item:
    GalleryItem;
}) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        bg-gradient-to-t
        from-[#281B20]/82
        via-[#281B20]/24
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
  total:
    number;

  activeIndex:
    number;

  previous:
    () => void;

  next:
    () => void;

  onDot:
    (
      index:
        number
    ) => void;

  disabled?:
    boolean;
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
        disabled={
          disabled
        }
        onClick={
          previous
        }
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
          bg-white
          text-[#E75480]
          shadow-[0_4px_12px_rgba(58,42,47,0.08)]
          transition-all

          hover:-translate-y-0.5
          hover:bg-[#E75480]
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft
          size={
            15
          }
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
          length:
            total,
        }).map(
          (
            _,
            index
          ) => (
            <button
              key={
                index
              }
              type="button"
              disabled={
                disabled
              }
              onClick={() =>
                onDot(
                  index
                )
              }
              aria-label={`Open image ${
                index +
                1
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
                        w-5
                        bg-[#E75480]
                      `
                    : `
                        h-[5px]
                        w-[5px]
                        bg-[#E75480]/20

                        hover:bg-[#E75480]/50
                      `
                }
              `}
            />
          )
        )}
      </div>

      <button
        type="button"
        disabled={
          disabled
        }
        onClick={
          next
        }
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
          bg-white
          text-[#E75480]
          shadow-[0_4px_12px_rgba(58,42,47,0.08)]
          transition-all

          hover:-translate-y-0.5
          hover:bg-[#E75480]
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight
          size={
            15
          }
        />
      </button>
    </div>
  );
}