import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "framer-motion";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export type TeamMember = {
  _id: string;
  name: string;
  designation?: string;
  bio?: string;
  image?: string;
};

type TeamSectionProps = {
  members: TeamMember[];
  loading?: boolean;

  /*
    Optional function if your backend stores relative paths.
    Example:
    /uploads/team/person.jpg
       ↓
    http://localhost:5000/uploads/team/person.jpg
  */
  getImageUrl?: (image: string) => string;
};

/* =========================================================
   CONSTANTS
========================================================= */

/*
  Change this if you want the automatic slider
  faster or slower.

  2600 = 2.6 seconds
  3000 = 3 seconds
*/
const AUTO_PLAY_TIME = 2600;

/*
  How many cards can exist around the active card.

  Desktop:
  -3 -2 -1 [ACTIVE] 1 2 3
*/
const MAX_VISIBLE_DISTANCE = 3;

/* =========================================================
   COMPONENT
========================================================= */

export default function TeamSection({
  members,
  loading = false,
  getImageUrl = (image) => image,
}: TeamSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [teamPaused, setTeamPaused] = useState(false);

  /* =======================================================
     CLEAN MEMBERS
  ======================================================= */

  const sliderMembers = useMemo(() => {
    return members.filter(
      (member) => member && member._id && member.name,
    );
  }, [members]);

  const total = sliderMembers.length;

  /* =======================================================
     MAKE SURE ACTIVE INDEX IS VALID
  ======================================================= */

  useEffect(() => {
    if (total === 0) {
      setActiveSlide(0);
      return;
    }

    setActiveSlide((current) => {
      if (current >= total) {
        return 0;
      }

      return current;
    });
  }, [total]);

  /* =======================================================
     NEXT
  ======================================================= */

  const nextSlide = useCallback(() => {
    if (total <= 1) return;

    setActiveSlide((current) => {
      return (current + 1) % total;
    });
  }, [total]);

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousSlide = useCallback(() => {
    if (total <= 1) return;

    setActiveSlide((current) => {
      return (current - 1 + total) % total;
    });
  }, [total]);

  /* =======================================================
     AUTO PLAY
  ======================================================= */

  useEffect(() => {
    if (total <= 1 || teamPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => {
        return (current + 1) % total;
      });
    }, AUTO_PLAY_TIME);

    return () => {
      window.clearInterval(interval);
    };
  }, [total, teamPaused]);

  /* =======================================================
     KEYBOARD CONTROLS
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [nextSlide, previousSlide]);

  /* =======================================================
     GET CIRCULAR OFFSET

     Example with 7 cards:

     -3 -2 -1  0  1  2  3
               ↑
             ACTIVE
  ======================================================= */

  const getCircularOffset = (
    index: number,
    active: number,
    count: number,
  ) => {
    let offset = index - active;

    if (offset > count / 2) {
      offset -= count;
    }

    if (offset < -count / 2) {
      offset += count;
    }

    return offset;
  };

  /* =======================================================
     CARD POSITION

     We use vw so the carousel spreads nicely
     across large desktop screens.
  ======================================================= */

  const getXPosition = (offset: number) => {
    const positions: Record<number, number> = {
      [-3]: -75,
      [-2]: -52,
      [-1]: -27,
      [0]: 0,
      [1]: 27,
      [2]: 52,
      [3]: 75,
    };

    return positions[offset] ?? 0;
  };

  /* =======================================================
     CARD SCALE
  ======================================================= */

  const getScale = (distance: number) => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.84;
    if (distance === 2) return 0.7;

    return 0.59;
  };

  /* =======================================================
     CARD VERTICAL OFFSET
  ======================================================= */

  const getYPosition = (distance: number) => {
    if (distance === 0) return 0;
    if (distance === 1) return 18;
    if (distance === 2) return 34;

    return 48;
  };

  /* =======================================================
     CARD OPACITY
  ======================================================= */

  const getOpacity = (distance: number) => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.6;
    if (distance === 2) return 0.32;

    return 0.15;
  };

  /* =======================================================
     BLUR
  ======================================================= */

  const getBlur = (distance: number) => {
    if (distance === 0) return 0;
    if (distance === 1) return 2;
    if (distance === 2) return 4;

    return 7;
  };

  /* =======================================================
     DRAG END
  ======================================================= */

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setTeamPaused(false);

    /*
      Drag left -> next
    */
    if (
      info.offset.x < -55 ||
      info.velocity.x < -450
    ) {
      nextSlide();
      return;
    }

    /*
      Drag right -> previous
    */
    if (
      info.offset.x > 55 ||
      info.velocity.x > 450
    ) {
      previousSlide();
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#FFF5F8]
        py-14
        sm:py-16
        md:py-20
        lg:py-24
      "
    >
      <div className="mx-auto max-w-[1600px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="px-5 text-center sm:px-8">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[5px]
              text-[#E75480]
              sm:text-[10px]
            "
          >
            Our Team
          </p>

          <h2
            className="
              mt-4
              font-serif
              text-[32px]
              leading-[1.08]
              text-[#352429]

              sm:text-[38px]
              md:text-[46px]
              lg:text-[50px]
            "
          >
            Meet our{" "}
            <span className="italic text-[#E75480]">
              professionals.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[520px]
              text-[13px]
              leading-6
              text-[#8A6F78]

              sm:text-sm
            "
          >
            The talented people behind your Nirjara
            experience.
          </p>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="
              flex
              min-h-[400px]
              items-center
              justify-center
              text-sm
              text-[#8A6F78]
            "
          >
            Loading our team...
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && total === 0 && (
          <div
            className="
              flex
              min-h-[400px]
              items-center
              justify-center
              px-6
              text-center
              text-sm
              text-[#8A6F78]
            "
          >
            Our team will be introduced soon.
          </div>
        )}

        {/* =================================================
            CAROUSEL
        ================================================= */}

        {!loading && total > 0 && (
          <>
            <div
              className="
                relative
                mt-8
                h-[440px]
                w-full
                overflow-hidden

                sm:mt-10
                sm:h-[500px]

                md:mt-12
                md:h-[540px]

                lg:h-[580px]
              "
              onMouseEnter={() => {
                setTeamPaused(true);
              }}
              onMouseLeave={() => {
                setTeamPaused(false);
              }}
              onTouchStart={() => {
                setTeamPaused(true);
              }}
              onTouchEnd={() => {
                setTeamPaused(false);
              }}
            >

              {/* ===========================================
                  LEFT FADE
              =========================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  z-40

                  w-[5%]

                  bg-gradient-to-r
                  from-[#FFF5F8]
                  via-[#FFF5F8]/60
                  to-transparent

                  sm:w-[8%]
                  lg:w-[12%]
                "
              />

              {/* ===========================================
                  RIGHT FADE
              =========================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  right-0
                  z-40

                  w-[5%]

                  bg-gradient-to-l
                  from-[#FFF5F8]
                  via-[#FFF5F8]/60
                  to-transparent

                  sm:w-[8%]
                  lg:w-[12%]
                "
              />

              {/* ===========================================
                  TEAM MEMBERS
              =========================================== */}

              <AnimatePresence initial={false}>
                {sliderMembers.map(
                  (member, index) => {
                    const offset =
                      getCircularOffset(
                        index,
                        activeSlide,
                        total,
                      );

                    const distance =
                      Math.abs(offset);

                    /*
                      Don't render distant cards.
                      Helps performance.
                    */
                    if (
                      distance >
                      MAX_VISIBLE_DISTANCE
                    ) {
                      return null;
                    }

                    const isActive =
                      offset === 0;

                    const x =
                      getXPosition(offset);

                    const scale =
                      getScale(distance);

                    const y =
                      getYPosition(distance);

                    const opacity =
                      getOpacity(distance);

                    const blur =
                      getBlur(distance);

                    return (
                      <motion.article
                        key={member._id}

                        /* ===============================
                           CLICK SIDE CARD
                        =============================== */

                        onClick={() => {
                          if (!isActive) {
                            setActiveSlide(
                              index,
                            );
                          }
                        }}

                        /* ===============================
                           DRAG
                        =============================== */

                        drag={
                          isActive &&
                          total > 1
                            ? "x"
                            : false
                        }

                        dragConstraints={{
                          left: 0,
                          right: 0,
                        }}

                        dragElastic={0.12}

                        onDragStart={() => {
                          setTeamPaused(true);
                        }}

                        onDragEnd={
                          handleDragEnd
                        }

                        /* ===============================
                           START POSITION
                        =============================== */

                        initial={false}

                        /* ===============================
                           ANIMATION
                        =============================== */

                        animate={{
                          x: `${x}vw`,
                          y,
                          scale,
                          opacity,

                          filter:
                            `blur(${blur}px)`,
                        }}

                        /* ===============================
                           SMOOTH SPRING
                        =============================== */

                        transition={{
                          x: {
                            type: "spring",
                            stiffness: 95,
                            damping: 19,
                            mass: 0.9,
                          },

                          y: {
                            type: "spring",
                            stiffness: 105,
                            damping: 20,
                            mass: 0.9,
                          },

                          scale: {
                            type: "spring",
                            stiffness: 105,
                            damping: 20,
                            mass: 0.85,
                          },

                          opacity: {
                            duration: 0.45,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          },

                          filter: {
                            duration: 0.45,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          },
                        }}

                        style={{
                          zIndex:
                            30 - distance,

                          /*
                            GPU optimization.
                          */
                          willChange:
                            "transform, opacity, filter",

                          backfaceVisibility:
                            "hidden",

                          WebkitBackfaceVisibility:
                            "hidden",
                        }}

                        className={`
                          absolute

                          left-1/2
                          top-1/2

                          h-[380px]
                          w-[68vw]
                          max-w-[310px]

                          -translate-x-1/2
                          -translate-y-1/2

                          overflow-hidden

                          rounded-[26px]

                          bg-[#F8EDEF]

                          shadow-[0_25px_70px_rgba(50,30,38,0.14)]

                          sm:h-[425px]
                          sm:w-[55vw]
                          sm:max-w-[335px]

                          md:h-[465px]
                          md:w-[32vw]
                          md:max-w-[360px]

                          lg:h-[500px]
                          lg:w-[27vw]
                          lg:max-w-[390px]

                          ${
                            isActive
                              ? "cursor-grab active:cursor-grabbing"
                              : "cursor-pointer"
                          }
                        `}
                      >

                        {/* =============================
                            IMAGE
                        ============================= */}

                        {member.image ? (
                          <img
                            src={getImageUrl(
                              member.image,
                            )}
                            alt={member.name}
                            loading={
                              isActive
                                ? "eager"
                                : "lazy"
                            }
                            draggable={false}
                            className="
                              pointer-events-none
                              h-full
                              w-full
                              select-none
                              object-cover
                              object-top
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center

                              bg-gradient-to-br
                              from-[#FCE6ED]
                              to-[#F7D7E1]
                            "
                          >
                            <span
                              className="
                                font-serif
                                text-8xl
                                text-[#E75480]/25
                              "
                            >
                              {member.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* =============================
                            IMAGE OVERLAY
                        ============================= */}

                        <motion.div
                          animate={{
                            opacity: isActive
                              ? 1
                              : 0.8,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          className="
                            pointer-events-none

                            absolute
                            inset-x-0
                            bottom-0

                            h-[58%]

                            bg-gradient-to-t

                            from-[#1E1015]/95
                            via-[#1E1015]/45
                            to-transparent
                          "
                        />

                        {/* =============================
                            TEXT
                        ============================= */}

                        <motion.div
                          animate={{
                            y: isActive
                              ? 0
                              : 8,

                            opacity: isActive
                              ? 1
                              : 0.78,
                          }}
                          transition={{
                            duration: 0.35,
                          }}
                          className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            z-10

                            p-5

                            text-left

                            sm:p-6
                            md:p-7
                          "
                        >
                          {/* DESIGNATION */}

                          {member.designation && (
                            <p
                              className="
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[3px]
                                text-[#F7A4BD]

                                sm:text-[9px]
                              "
                            >
                              {
                                member.designation
                              }
                            </p>
                          )}

                          {/* NAME */}

                          <h3
                            className="
                              mt-2

                              font-serif

                              text-[24px]
                              leading-tight

                              text-white

                              sm:text-[26px]
                              md:text-[29px]
                            "
                          >
                            {member.name}
                          </h3>

                          {/* BIO */}

                          <AnimatePresence>
                            {isActive &&
                              member.bio && (
                                <motion.p
                                  initial={{
                                    opacity: 0,
                                    y: 10,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    y: 8,
                                  }}
                                  transition={{
                                    duration:
                                      0.3,
                                  }}
                                  className="
                                    mt-3

                                    line-clamp-2

                                    max-w-[280px]

                                    text-[11px]
                                    leading-5

                                    text-white/70

                                    sm:text-[12px]
                                  "
                                >
                                  {member.bio}
                                </motion.p>
                              )}
                          </AnimatePresence>
                        </motion.div>

                        {/* =============================
                            ACTIVE BORDER
                        ============================= */}

                        <motion.div
                          animate={{
                            opacity: isActive
                              ? 1
                              : 0,
                          }}
                          className="
                            pointer-events-none

                            absolute
                            inset-0

                            rounded-[26px]

                            ring-1
                            ring-inset
                            ring-white/20
                          "
                        />
                      </motion.article>
                    );
                  },
                )}
              </AnimatePresence>
            </div>

            {/* =================================================
                CONTROLS
            ================================================= */}

            {total > 1 && (
              <div
                className="
                  mt-1
                  flex
                  items-center
                  justify-center
                  gap-4

                  sm:mt-2
                  sm:gap-5

                  md:mt-4
                "
              >

                {/* ===========================================
                    PREVIOUS
                =========================================== */}

                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous team member"
                  className="
                    group

                    flex
                    h-10
                    w-10

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[#E75480]/20

                    bg-white

                    text-[#E75480]

                    shadow-[0_5px_20px_rgba(231,84,128,0.08)]

                    transition-all
                    duration-300

                    hover:border-[#E75480]
                    hover:bg-[#E75480]
                    hover:text-white

                    sm:h-11
                    sm:w-11
                  "
                >
                  <span
                    className="
                      -translate-y-[1px]
                      text-xl
                      transition-transform
                      duration-300

                      group-hover:-translate-x-[2px]
                    "
                  >
                    ←
                  </span>
                </button>

                {/* ===========================================
                    DOTS
                =========================================== */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-[7px]
                  "
                >
                  {sliderMembers.map(
                    (member, index) => {
                      const active =
                        index ===
                        activeSlide;

                      return (
                        <button
                          key={
                            member._id
                          }
                          type="button"
                          aria-label={`View ${member.name}`}
                          onClick={() => {
                            setActiveSlide(
                              index,
                            );
                          }}
                          className={`
                            h-[6px]
                            rounded-full

                            transition-all
                            duration-500

                            ${
                              active
                                ? "w-8 bg-[#E75480]"
                                : "w-[6px] bg-[#E75480]/25 hover:bg-[#E75480]/50"
                            }
                          `}
                        />
                      );
                    },
                  )}
                </div>

                {/* ===========================================
                    NEXT
                =========================================== */}

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next team member"
                  className="
                    group

                    flex
                    h-10
                    w-10

                    items-center
                    justify-center

                    rounded-full

                    bg-[#E75480]

                    text-white

                    shadow-[0_8px_25px_rgba(231,84,128,0.22)]

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:bg-[#D94370]

                    sm:h-11
                    sm:w-11
                  "
                >
                  <span
                    className="
                      -translate-y-[1px]
                      text-xl

                      transition-transform
                      duration-300

                      group-hover:translate-x-[2px]
                    "
                  >
                    →
                  </span>
                </button>
              </div>
            )}

            {/* =================================================
                MOBILE SWIPE LABEL
            ================================================= */}

            {total > 1 && (
              <p
                className="
                  mt-5
                  text-center

                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[4px]

                  text-[#E75480]/60

                  md:hidden
                "
              >
                Swipe to explore
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}