import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import BranchCard from "../../components/BranchCard";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

/* ============================================================
   TYPES
============================================================ */

type Branch = {
  _id: string;
  name: string;
  label?: string;
  address: string;
  openingHours?: string;
  phone?: string;
  mapUrl?: string;
  active?: boolean;
};

/* ============================================================
   SEO
============================================================ */

const BRANCHES_SEO = {
  title:
    "Nirjara Beauty Branches | Beauty Salon in Kathmandu",

  description:
    "Find Nirjara Beauty branches in Kathmandu and discover professional salon, beauty and customer care services near you.",

  keywords:
    "Nirjara Beauty branches, beauty salon Kathmandu, salon Teku, salon Chabahil, beauty parlour Kathmandu, Nirjara Beauty locations",

  canonical: "/branches",

  image: "/images/nirjara-og.jpg",

  type: "website",
};

/* ============================================================
   PAGE
============================================================ */

// Managed in the admin panel (Branches).
type Branch = {
  _id: string;
  name: string;
  label?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  mapUrl?: string;
};

export default function Branches() {
  const navigate = useNavigate();

  const sliderRef =
    useRef<HTMLDivElement | null>(null);

  const [branches, setBranches] =
    useState<Branch[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeSlide, setActiveSlide] =
    useState(0);

  const [visibleCards, setVisibleCards] =
    useState(1);

  const [isInteracting, setIsInteracting] =
    useState(false);

  /* ============================================================
     FETCH BRANCHES
  ============================================================ */

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/branches`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load branches."
        );
      }

      const data =
        await response.json();

      const branchList =
        Array.isArray(data)
          ? data
          : data?.branches || [];

      setBranches(branchList);
    } catch (error) {
      console.error(
        "BRANCH FETCH ERROR:",
        error
      );

      setError(
        "We couldn't load our branch information right now."
      );

      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {
    fetchBranches();
  }, []);

  /* ============================================================
     RESPONSIVE CARD COUNT

     MOBILE  < 640px    = 1 CARD
     TABLET  640-1023px = 2 CARDS
     DESKTOP >= 1024px  = 3-COLUMN GRID
  ============================================================ */

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();

    window.addEventListener(
      "resize",
      updateVisibleCards
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateVisibleCards
      );
    };
  }, []);

  /* ============================================================
     MAX SLIDER POSITION
  ============================================================ */

  const maxSlide = Math.max(
    0,
    branches.length - visibleCards
  );

  /* ============================================================
     SCROLL TO SLIDE
  ============================================================ */

  const scrollToSlide = (
    index: number
  ) => {
    const slider =
      sliderRef.current;

    if (!slider) return;

    const cards =
      slider.querySelectorAll<HTMLElement>(
        "[data-branch-slide]"
      );

    if (!cards.length) return;

    const safeIndex = Math.max(
      0,
      Math.min(index, maxSlide)
    );

    const target =
      cards[safeIndex];

    if (!target) return;

    slider.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });

    setActiveSlide(safeIndex);
  };

  /* ============================================================
     NEXT SLIDE
  ============================================================ */

  const nextSlide = () => {
    if (activeSlide >= maxSlide) {
      scrollToSlide(0);
    } else {
      scrollToSlide(
        activeSlide + 1
      );
    }
  };

  /* ============================================================
     PREVIOUS SLIDE
  ============================================================ */

  const previousSlide = () => {
    if (activeSlide <= 0) {
      scrollToSlide(maxSlide);
    } else {
      scrollToSlide(
        activeSlide - 1
      );
    }
  };

  /* ============================================================
     AUTOMATIC SLIDER
  ============================================================ */

  useEffect(() => {
    if (
      branches.length <= visibleCards ||
      isInteracting
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        if (
          window.innerWidth >= 1024
        ) {
          return;
        }

        setActiveSlide(
          (current) => {
            const next =
              current >= maxSlide
                ? 0
                : current + 1;

            const slider =
              sliderRef.current;

            if (slider) {
              const cards =
                slider.querySelectorAll<HTMLElement>(
                  "[data-branch-slide]"
                );

              const target =
                cards[next];

              if (target) {
                slider.scrollTo({
                  left:
                    target.offsetLeft,
                  behavior:
                    "smooth",
                });
              }
            }

            return next;
          }
        );
      }, 4500);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    branches,
    visibleCards,
    maxSlide,
    isInteracting,
  ]);

  /* ============================================================
     DETECT MANUAL SWIPE
  ============================================================ */

  const handleSliderScroll = () => {
    const slider =
      sliderRef.current;

    if (!slider) return;

    const cards =
      slider.querySelectorAll<HTMLElement>(
        "[data-branch-slide]"
      );

    if (!cards.length) return;

    let closestIndex = 0;

    let closestDistance =
      Infinity;

    cards.forEach(
      (card, index) => {
        if (index > maxSlide) {
          return;
        }

        const distance =
          Math.abs(
            slider.scrollLeft -
              card.offsetLeft
          );

        if (
          distance <
          closestDistance
        ) {
          closestDistance =
            distance;

          closestIndex =
            index;
        }
      }
    );

    setActiveSlide(
      closestIndex
    );
  };

  /* ============================================================
     RESET WHEN BREAKPOINT CHANGES
  ============================================================ */

  useEffect(() => {
    setActiveSlide(0);

    const slider =
      sliderRef.current;

    if (slider) {
      slider.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }, [visibleCards]);

  return (
    <>
      <SEO
        title={
          BRANCHES_SEO.title
        }
        description={
          BRANCHES_SEO.description
        }
        keywords={
          BRANCHES_SEO.keywords
        }
        canonical={
          BRANCHES_SEO.canonical
        }
        image={
          BRANCHES_SEO.image
        }
        type="website"
      />

      <main
        className="
          min-h-screen
          overflow-hidden
          bg-[#FFF5F8]

          px-4
          pb-20
          pt-32

          text-[#3A2A2F]

          sm:px-6
          sm:pb-24
          sm:pt-36

          lg:px-8

          xl:px-10
        "
      >
        <section className="mx-auto max-w-7xl">

          {/* =====================================================
              PAGE HEADING
          ===================================================== */}

          <div
            className="
              mb-10
              text-center

              sm:mb-12

              lg:mb-14
            "
          >
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[4px]
                text-[#E75480]

                sm:text-[10px]
              "
            >
              Our Branches
            </p>

            <h1
              className="
                mt-4
                font-serif
                text-[40px]
                font-light
                leading-[1]
                tracking-[-1px]
                text-[#3A2A2F]

                sm:text-[50px]

                lg:text-[56px]

                xl:text-[60px]
              "
            >
              Visit Our{" "}
              <span className="italic text-[#E75480]">
                Locations
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl

                text-[13px]
                leading-6
                text-[#8A6F78]

                sm:text-[14px]
              "
            >
              Find your nearest Nirjara Beauty
              branch and discover our salon
              services, beauty treatments, and
              professional care.
            </p>

            <div
              className="
                mx-auto
                mt-7
                h-px
                w-16
                bg-[#E75480]/40
              "
            />
          </div>

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (
            <div
              className="
                flex
                min-h-[280px]
                items-center
                justify-center
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    h-9
                    w-9
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
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  Loading Branches
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              ERROR
          ===================================================== */}

          {!loading &&
            error && (
              <div
                className="
                  mx-auto
                  max-w-xl

                  rounded-[24px]

                  border
                  border-[#E75480]/10

                  bg-white

                  px-6
                  py-10

                  text-center

                  shadow-[0_10px_35px_rgba(58,42,47,0.05)]
                "
              >
                <p
                  className="
                    font-serif
                    text-2xl
                    text-[#3A2A2F]
                  "
                >
                  Unable to load branches
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-[#8A6F78]
                  "
                >
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchBranches
                  }
                  className="
                    mt-6

                    rounded-full

                    border
                    border-[#E75480]

                    px-6
                    py-3

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[2px]
                    text-[#E75480]

                    transition-all
                    duration-300

                    hover:bg-[#E75480]
                    hover:text-white
                  "
                >
                  Try Again
                </button>
              </div>
            )}

          {/* =====================================================
              EMPTY
          ===================================================== */}

          {!loading &&
            !error &&
            branches.length === 0 && (
              <div
                className="
                  mx-auto
                  max-w-xl

                  rounded-[24px]

                  border
                  border-[#E75480]/10

                  bg-white

                  px-6
                  py-12

                  text-center
                "
              >
                <p
                  className="
                    font-serif
                    text-2xl
                    italic
                    text-[#8A6F78]
                  "
                >
                  Branch information is
                  currently being updated.
                </p>
              </div>
            )}

          {/* =====================================================
              BRANCHES
          ===================================================== */}

          {!loading &&
            !error &&
            branches.length > 0 && (
              <>
                {/* =================================================
                    MOBILE + TABLET SLIDER
                ================================================= */}

                <div className="lg:hidden">

                  {/* ===============================================
                      CONSTRAINED SLIDER AREA
                  =============================================== */}

                  <div
                    className="
                      mx-auto
                      w-full

                      max-w-[340px]

                      sm:max-w-[760px]
                    "
                  >
                    {/* =============================================
                        SLIDER VIEWPORT
                    ============================================= */}

                    <div
                      ref={sliderRef}
                      onScroll={
                        handleSliderScroll
                      }
                      onPointerDown={() =>
                        setIsInteracting(true)
                      }
                      onPointerUp={() =>
                        setIsInteracting(false)
                      }
                      onPointerCancel={() =>
                        setIsInteracting(false)
                      }
                      onMouseEnter={() =>
                        setIsInteracting(true)
                      }
                      onMouseLeave={() =>
                        setIsInteracting(false)
                      }
                      className="
                        flex

                        snap-x
                        snap-mandatory

                        gap-4

                        overflow-x-auto

                        scroll-smooth

                        overscroll-x-contain

                        [-ms-overflow-style:none]
                        [scrollbar-width:none]

                        [&::-webkit-scrollbar]:hidden
                      "
                    >
                      {branches.map(
                        (
                          branch,
                          index
                        ) => (
                          <div
                            key={
                              branch._id
                            }
                            data-branch-slide
                            className="
                              flex
                              shrink-0
                              snap-start
                            "
                            style={{
                              width:
                                visibleCards === 1
                                  ? "100%"
                                  : "calc((100% - 16px) / 2)",
                            }}
                          >
                            <BranchCard
                              number={String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                              {...branch}
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* =============================================
                        CONTROLS
                    ============================================= */}

                    {branches.length >
                      visibleCards && (
                      <div className="mt-5">

                        {/* ARROWS + DOTS */}

                        <div
                          className="
                            mx-auto
                            flex
                            max-w-[340px]
                            items-center
                            justify-between
                            gap-5
                          "
                        >
                          {/* PREVIOUS */}

                          <button
                            type="button"
                            onClick={
                              previousSlide
                            }
                            aria-label="Previous branch"
                            className="
                              group

                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center

                              rounded-full

                              border
                              border-[#E75480]/15

                              bg-white

                              text-[#E75480]

                              shadow-[0_6px_20px_rgba(58,42,47,0.05)]

                              transition-all
                              duration-300

                              hover:-translate-y-[1px]
                              hover:border-[#E75480]/40
                              hover:bg-[#E75480]
                              hover:text-white
                              hover:shadow-[0_10px_25px_rgba(231,84,128,0.18)]

                              active:translate-y-0
                            "
                          >
                            <ChevronLeft
                              size={17}
                              strokeWidth={1.8}
                              className="
                                transition-transform
                                duration-300

                                group-hover:-translate-x-[1px]
                              "
                            />
                          </button>

                          {/* DOTS */}

                          <div
                            className="
                              flex
                              flex-1
                              items-center
                              justify-center
                              gap-2
                            "
                          >
                            {Array.from({
                              length:
                                maxSlide + 1,
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
                                  onClick={() =>
                                    scrollToSlide(
                                      index
                                    )
                                  }
                                  aria-label={`Go to branch slide ${
                                    index + 1
                                  }`}
                                  className={`
                                    h-[6px]
                                    rounded-full
                                    transition-all
                                    duration-300

                                    ${
                                      activeSlide ===
                                      index
                                        ? "w-7 bg-[#E75480]"
                                        : "w-[6px] bg-[#E75480]/20 hover:bg-[#E75480]/40"
                                    }
                                  `}
                                />
                              )
                            )}
                          </div>

                          {/* NEXT */}

                          <button
                            type="button"
                            onClick={
                              nextSlide
                            }
                            aria-label="Next branch"
                            className="
                              group

                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center

                              rounded-full

                              border
                              border-[#E75480]/15

                              bg-white

                              text-[#E75480]

                              shadow-[0_6px_20px_rgba(58,42,47,0.05)]

                              transition-all
                              duration-300

                              hover:-translate-y-[1px]
                              hover:border-[#E75480]/40
                              hover:bg-[#E75480]
                              hover:text-white
                              hover:shadow-[0_10px_25px_rgba(231,84,128,0.18)]

                              active:translate-y-0
                            "
                          >
                            <ChevronRight
                              size={17}
                              strokeWidth={1.8}
                              className="
                                transition-transform
                                duration-300

                                group-hover:translate-x-[1px]
                              "
                            />
                          </button>
                        </div>

                        {/* LOCATION COUNTER */}

                        <p
                          className="
                            mt-3

                            text-center

                            text-[7px]
                            font-semibold
                            uppercase
                            tracking-[3px]
                            text-[#B38A98]
                          "
                        >
                          {Math.min(
                            activeSlide + 1,
                            branches.length
                          )}{" "}
                          of{" "}
                          {branches.length}{" "}
                          locations
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================================
                    DESKTOP GRID
                ================================================= */}

                <div
                  className="
                    hidden

                    lg:grid
                    lg:grid-cols-3
                    lg:gap-5

                    xl:gap-6
                  "
                >
                  {branches.map(
                    (
                      branch,
                      index
                    ) => (
                      <BranchCard
                        key={
                          branch._id
                        }
                        number={String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                        {...branch}
                      />
                    )
                  )}
                </div>
              </>
            )}

          {/* =====================================================
              BOOK BUTTON
          ===================================================== */}

          {!loading &&
            !error &&
            branches.length > 0 && (
              <div
                className="
                  mt-10
                  text-center

                  sm:mt-12

                  lg:mt-16
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/booking"
                    )
                  }
                  className="
                    rounded-full

                    bg-[#E75480]

                    px-8
                    py-3.5

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]
                    text-white

                    shadow-[0_10px_28px_rgba(231,84,128,0.22)]

                    transition-all
                    duration-300

                    hover:-translate-y-[2px]
                    hover:bg-[#C93D68]
                    hover:shadow-[0_14px_32px_rgba(231,84,128,0.30)]

                    sm:px-10
                    sm:py-4
                  "
                >
                  Book at a Branch
                </button>
              </div>
            )}
        </section>
      </main>
    </>
  );
}
