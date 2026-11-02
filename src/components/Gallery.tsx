import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

type VisibleGalleryItem = {
  item: GalleryItem;
  index: number;
  offset: number;
};

/* =========================================================
   CONFIG
========================================================= */

const AUTOPLAY_TIME = 1800;

/*
  Fast enough to feel lively,
  but smooth enough to stay premium.
*/

const SLIDE_DURATION = 0.32;

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
  ] = useState<GalleryItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =======================================================
     FETCH GALLERY
  ======================================================= */

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

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading
  ) {
    return (
      <>
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
              min-h-[500px]
              items-center
              justify-center
            "
          >
            <div
              className="
                h-10
                w-10

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

  /* =======================================================
     EMPTY
  ======================================================= */

  if (
    !gallery.length
  ) {
    return (
      <>
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
              mx-auto

              flex
              min-h-[300px]
              max-w-4xl

              items-center
              justify-center

              px-5
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

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
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

      <main
        className="
          min-h-screen
          overflow-hidden
          bg-[#FFF5F8]
          pt-16
        "
      >
        <GalleryHeader />

        <GalleryCarousel
          items={gallery}
        />
      </main>
    </>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function GalleryHeader() {
  return (
    <section
      className="
        mx-auto
        max-w-4xl

        px-5
        pt-5

        text-center

        sm:pt-6

        md:pt-7
      "
    >
      {/* LABEL */}

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
            w-10
            bg-[#E75480]/35
            sm:block
          "
        />

        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[4px]

            text-[#E75480]

            sm:text-[9px]
            sm:tracking-[5px]
          "
        >
          Our Gallery
        </p>

        <span
          className="
            hidden
            h-px
            w-10
            bg-[#E75480]/35
            sm:block
          "
        />
      </div>

      {/* TITLE */}

      <h1
        className="
          mt-3

          font-serif

          text-[34px]
          leading-[1.05]

          text-[#3A2A2F]

          sm:text-[42px]

          md:text-[48px]

          lg:text-[52px]
        "
      >
        Beauty{" "}

        <span
          className="
            italic
            text-[#E75480]
          "
        >
          In Motion
        </span>
      </h1>

      {/* DESCRIPTION */}

      <p
        className="
          mx-auto
          mt-3

          max-w-[340px]

          text-[12px]
          leading-6

          text-[#8A6F78]

          sm:max-w-xl
          sm:text-[13px]

          md:max-w-2xl
          md:text-[14px]
        "
      >
        Explore beautiful
        transformations,
        professional artistry
        and memorable moments
        created at Nirjara
        Beauty.
      </p>

      <div
        className="
          mx-auto
          mt-4

          h-px
          w-14

          bg-[#E75480]/30
        "
      />
    </section>
  );
}

/* =========================================================
   GALLERY CAROUSEL
========================================================= */

function GalleryCarousel({
  items,
}: {
  items: GalleryItem[];
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
    paused,
    setPaused,
  ] =
    useState(false);

  /* =======================================================
     NEXT
  ======================================================= */

  const next = () => {
    if (
      total <=
      1
    ) {
      return;
    }

    setActiveIndex(
      (
        current
      ) =>
        (
          current +
          1
        ) %
        total
    );
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previous =
    () => {
      if (
        total <=
        1
      ) {
        return;
      }

    setActiveIndex(
      (
        current
      ) =>
        (
          current -
          1 +
          total
        ) %
        total
    );
  };

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  useEffect(
    () => {
      if (
        total <=
          1 ||
        paused
      ) {
        return;
      }

      const timer =
        window.setInterval(
          () => {
            setActiveIndex(
              (
                current
              ) =>
                (
                  current +
                  1
                ) %
                total
            );
          },

          AUTOPLAY_TIME
        );

      return () => {
        window.clearInterval(
          timer
        );
      };
    },

    [
      total,
      paused,
    ]
  );

  /* =======================================================
     KEEP INDEX VALID
  ======================================================= */

  useEffect(
    () => {
      if (
        total >
          0 &&
        activeIndex >=
          total
      ) {
        setActiveIndex(
          0
        );
      }
    },

    [
      activeIndex,
      total,
    ]
  );

  /* =======================================================
     VISIBLE ITEMS

     We keep five items visible:

     -2  far left
     -1  left
      0  active
      1  right
      2  far right

     Because each item keeps its own _id key,
     Framer Motion moves the SAME image from
     one position to another instead of replacing
     every card independently.
  ======================================================= */

  const visibleItems:
    VisibleGalleryItem[] =
    useMemo(
      () => {
        if (
          !total
        ) {
          return [];
        }

        const offsets =
          total >=
          5
            ? [
                -2,
                -1,
                0,
                1,
                2,
              ]
            : total ===
                4
              ? [
                  -1,
                  0,
                  1,
                  2,
                ]
              : total ===
                  3
                ? [
                    -1,
                    0,
                    1,
                  ]
                : total ===
                    2
                  ? [
                      0,
                      1,
                    ]
                  : [
                      0,
                    ];

        const used =
          new Set<
            number
          >();

        return offsets
          .map(
            (
              offset
            ) => {
              const index =
                (
                  activeIndex +
                  offset +
                  total
                ) %
                total;

              if (
                used.has(
                  index
                )
              ) {
                return null;
              }

              used.add(
                index
              );

              return {
                item:
                  galleryItems[
                    index
                  ],

                index,

                offset,
              };
            }
          )
          .filter(
            (
              value
            ):
              value is
              VisibleGalleryItem =>
                Boolean(
                  value
                )
          );
      },

      [
        activeIndex,
        galleryItems,
        total,
      ]
    );

  if (
    !galleryItems.length
  ) {
    return null;
  }

  const activeItem =
    galleryItems[
      activeIndex
    ];

  /* =======================================================
     CARD POSITION
  ======================================================= */

  const getCardAnimation =
    (
      offset:
        number
    ) => {
      /*
        Mobile positions are tighter.
        Desktop positions spread wider.
      */

      switch (
        offset
      ) {
        case -2:
          return {
            x:
              "-150%",

            scale:
              0.72,

            rotate:
              -5,

            opacity:
              0.32,

            zIndex:
              10,
          };

        case -1:
          return {
            x:
              "-82%",

            scale:
              0.88,

            rotate:
              -2.5,

            opacity:
              0.76,

            zIndex:
              20,
          };

        case 0:
          return {
            x:
              "0%",

            scale:
              1,

            rotate:
              0,

            opacity:
              1,

            zIndex:
              30,
          };

        case 1:
          return {
            x:
              "82%",

            scale:
              0.88,

            rotate:
              2.5,

            opacity:
              0.76,

            zIndex:
              20,
          };

        case 2:
          return {
            x:
              "150%",

            scale:
              0.72,

            rotate:
              5,

            opacity:
              0.32,

            zIndex:
              10,
          };

        default:
          return {
            x:
              offset <
              0
                ? "-180%"
                : "180%",

            scale:
              0.65,

            rotate:
              0,

            opacity:
              0,

            zIndex:
              0,
          };
      }
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        mx-auto

        w-full
        max-w-[1100px]

        px-4
        pb-10
        pt-4

        sm:px-6
        sm:pb-12

        lg:px-8
      "
    >
      <div
        className="
          rounded-[26px]

          border
          border-[#E75480]/10

          bg-white

          px-3
          py-4

          shadow-[0_8px_28px_rgba(117,71,87,0.05)]

          sm:px-5
          sm:py-5

          md:px-7
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
        onTouchStart={() =>
          setPaused(
            true
          )
        }
        onTouchEnd={() =>
          setPaused(
            false
          )
        }
      >
        {/* =================================================
            SLIDER
        ================================================= */}

        <div
          className="
            relative

            mx-auto

            h-[315px]
            w-full

            overflow-hidden

            sm:h-[350px]

            md:h-[390px]

            lg:h-[405px]
          "
        >
          <AnimatePresence
            initial={
              false
            }
          >
            {visibleItems.map(
              (
                visible
              ) => {
                const {
                  item,
                  index,
                  offset,
                } =
                  visible;

                const active =
                  offset ===
                  0;

                const animation =
                  getCardAnimation(
                    offset
                  );

                return (
                  <motion.button
                    key={
                      item._id
                    }
                    type="button"
                    onClick={() => {
                      if (
                        offset <
                        0
                      ) {
                        previous();
                      } else if (
                        offset >
                        0
                      ) {
                        next();
                      }
                    }}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            x:
                              offset <
                              0
                                ? "-180%"
                                : offset >
                                    0
                                  ? "180%"
                                  : "0%",

                            scale:
                              0.7,

                            opacity:
                              0,
                          }
                    }
                    animate={
                      animation
                    }
                    exit={
                      reduceMotion
                        ? undefined
                        : {
                            x:
                              offset <
                              0
                                ? "-190%"
                                : "190%",

                            scale:
                              0.68,

                            opacity:
                              0,
                          }
                    }
                    transition={
                      reduceMotion
                        ? {
                            duration:
                              0,
                          }
                        : {
                            duration:
                              SLIDE_DURATION,

                            ease:
                              [
                                0.22,
                                1,
                                0.36,
                                1,
                              ],
                          }
                    }
                    drag={
                      active &&
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
                      0.14
                    }
                    onDragStart={() => {
                      setPaused(
                        true
                      );
                    }}
                    onDragEnd={(
                      _,
                      info
                    ) => {
                      setPaused(
                        false
                      );

                      if (
                        info.offset
                          .x <
                          -45 ||
                        info.velocity
                          .x <
                          -400
                      ) {
                        next();

                        return;
                      }

                      if (
                        info.offset
                          .x >
                          45 ||
                        info.velocity
                          .x >
                          400
                      ) {
                        previous();
                      }
                    }}
                    style={{
                      zIndex:
                        animation.zIndex,
                    }}
                    className={`
                      absolute

                      left-1/2
                      top-1/2

                      -translate-x-1/2
                      -translate-y-1/2

                      overflow-hidden

                      border

                      bg-white

                      text-left

                      ${
                        active
                          ? `
                              w-[215px]

                              cursor-grab

                              rounded-[20px]

                              border-[#E75480]/20

                              shadow-[0_18px_40px_rgba(117,71,87,0.14)]

                              active:cursor-grabbing

                              sm:w-[250px]

                              md:w-[285px]

                              lg:w-[305px]
                            `
                          : `
                              w-[150px]

                              cursor-pointer

                              rounded-[16px]

                              border-[#E75480]/10

                              shadow-[0_8px_22px_rgba(117,71,87,0.07)]

                              sm:w-[175px]

                              md:w-[195px]

                              lg:w-[205px]
                            `
                      }
                    `}
                  >
                    {/* IMAGE */}

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.title ||
                        "Nirjara Beauty gallery"
                      }
                      draggable={
                        false
                      }
                      loading={
                        active
                          ? "eager"
                          : "lazy"
                      }
                      className={`
                        w-full

                        select-none

                        object-cover
                        object-center

                        ${
                          active
                            ? `
                                h-[270px]

                                sm:h-[310px]

                                md:h-[345px]

                                lg:h-[360px]
                              `
                            : `
                                h-[200px]

                                sm:h-[225px]

                                md:h-[245px]

                                lg:h-[255px]
                              `
                        }
                      `}
                    />

                    {/* =====================================
                        ACTIVE IMAGE TITLE
                    ===================================== */}

                    {active && (
                      <div
                        className="
                          pointer-events-none

                          absolute

                          inset-x-0
                          bottom-0

                          bg-gradient-to-t
                          from-[#3A2A2F]/85
                          via-[#3A2A2F]/42
                          to-transparent

                          px-4
                          pb-4
                          pt-14

                          sm:px-5
                          sm:pb-5
                        "
                      >
                        <h2
                          className="
                            mx-auto

                            line-clamp-2
                            max-w-[270px]

                            break-words

                            text-center

                            font-serif

                            text-[17px]
                            leading-[1.15]

                            text-white

                            sm:text-[19px]

                            md:text-[21px]
                          "
                        >
                          {item.title?.trim() ||
                            "Nirjara Beauty"}
                        </h2>

                        {item.category && (
                          <p
                            className="
                              mt-1.5

                              truncate

                              text-center

                              text-[7px]
                              font-medium
                              uppercase
                              tracking-[2px]

                              text-white/80

                              sm:text-[8px]
                            "
                          >
                            {
                              item.category
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              }
            )}
          </AnimatePresence>
        </div>

        {/* =================================================
            DOTS
        ================================================= */}

        {total >
          1 && (
          <div
            className="
              mt-2

              flex
              items-center
              justify-center

              gap-[7px]
            "
          >
            {galleryItems.map(
              (
                item,
                index
              ) => {
                const active =
                  index ===
                  activeIndex;

                return (
                  <button
                    key={
                      item._id
                    }
                    type="button"
                    aria-label={`Show image ${
                      index +
                      1
                    }`}
                    onClick={() =>
                      setActiveIndex(
                        index
                      )
                    }
                    className={`
                      rounded-full

                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                              h-[5px]
                              w-6

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
                );
              }
            )}
          </div>
        )}

        {/* =================================================
            ACCESSIBLE COUNTER
        ================================================= */}

        <p
          className="
            sr-only
          "
          aria-live="polite"
        >
          Image{" "}
          {
            activeIndex +
            1
          }{" "}
          of{" "}
          {
            total
          }
          .{" "}
          {activeItem.title ||
            "Nirjara Beauty"}
        </p>
      </div>
    </section>
  );
}