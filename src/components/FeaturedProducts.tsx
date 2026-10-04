import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
} from "lucide-react";

import { Link } from "react-router-dom";

/* =========================================================
   TYPES
========================================================= */

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  product_category_id: string;

  productCategory?: {
    _id: string;
    name: string;
  } | null;

  images: string[];

  featured?: boolean;
  isFeatured?: boolean;
};

type Props = {
  products: Product[];
};

/* =========================================================
   SETTINGS
========================================================= */

const GAP = 16;

const AUTO_SLIDE_TIME = 2000;

const SLIDE_ANIMATION_TIME = 550;

/*
 * Number of cards visible at each screen size.
 *
 * Desktop: 5
 * Small desktop: 4
 * Tablet: 3
 * Small tablet: 2
 * Mobile: 1
 */
const getCardsPerView = (width: number) => {
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;

  return 1;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function FeaturedProducts({
  products,
}: Props) {
  const viewportRef =
    useRef<HTMLDivElement>(null);

  const touchStartX = useRef(0);

  const [index, setIndex] = useState(0);

  const [cardsPerView, setCardsPerView] =
    useState(5);

  const [cardWidth, setCardWidth] =
    useState(180);

  const [activeCard, setActiveCard] =
    useState<string | null>(null);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [isHovered, setIsHovered] =
    useState(false);

  /* =======================================================
     FEATURED PRODUCTS
  ======================================================= */

  const markedFeatured = products.filter(
    (product) =>
      product.featured === true ||
      product.isFeatured === true
  );

  /*
   * If products are explicitly marked featured,
   * use them.
   *
   * Otherwise show the first products so the
   * section never becomes empty.
   */
  const featuredProducts =
    markedFeatured.length > 0
      ? markedFeatured
      : products.slice(0, 10);

  /* =======================================================
     RESPONSIVE LAYOUT
  ======================================================= */

  const calculateLayout = useCallback(() => {
    if (!viewportRef.current) {
      return;
    }

    const viewportWidth =
      viewportRef.current.clientWidth;

    const screenWidth =
      window.innerWidth;

    const perView =
      getCardsPerView(screenWidth);

    setCardsPerView(perView);

    /*
     * Desired card sizes.
     *
     * We intentionally keep the featured
     * cards smaller than normal product cards.
     */
    let desiredWidth = 180;

    if (screenWidth < 640) {
      desiredWidth = Math.min(
        220,
        viewportWidth * 0.76
      );
    } else if (screenWidth < 768) {
      desiredWidth = 180;
    } else if (screenWidth < 1024) {
      desiredWidth = 175;
    } else if (screenWidth < 1280) {
      desiredWidth = 180;
    } else {
      desiredWidth = 185;
    }

    /*
     * Calculate the largest possible card
     * width without overlap.
     */
    const totalGap =
      GAP * (perView - 1);

    const availableWidth =
      viewportWidth - totalGap;

    const maximumCardWidth =
      availableWidth / perView;

    /*
     * On mobile we intentionally allow the
     * card to be narrower than the viewport.
     */
    const finalWidth =
      perView === 1
        ? Math.min(
            desiredWidth,
            viewportWidth
          )
        : Math.min(
            desiredWidth,
            maximumCardWidth
          );

    setCardWidth(finalWidth);
  }, []);

  useEffect(() => {
    calculateLayout();

    window.addEventListener(
      "resize",
      calculateLayout
    );

    return () => {
      window.removeEventListener(
        "resize",
        calculateLayout
      );
    };
  }, [calculateLayout]);

  /* =======================================================
     CAROUSEL LIMIT
  ======================================================= */

  const maxIndex = Math.max(
    0,
    featuredProducts.length -
      cardsPerView
  );

  /*
   * Prevent an old index from becoming
   * invalid after resizing.
   */
  useEffect(() => {
    setIndex((current) =>
      Math.min(current, maxIndex)
    );
  }, [maxIndex]);

  /* =======================================================
     MOVE TO SLIDE
  ======================================================= */

  const moveTo = useCallback(
    (newIndex: number) => {
      if (isAnimating) {
        return;
      }

      const safeIndex = Math.max(
        0,
        Math.min(newIndex, maxIndex)
      );

      if (safeIndex === index) {
        return;
      }

      setIsAnimating(true);

      setIndex(safeIndex);

      window.setTimeout(() => {
        setIsAnimating(false);
      }, SLIDE_ANIMATION_TIME);
    },
    [
      index,
      maxIndex,
      isAnimating,
    ]
  );

  /* =======================================================
     NEXT
  ======================================================= */

  const next = useCallback(() => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    setIndex((current) => {
      if (current >= maxIndex) {
        return 0;
      }

      return current + 1;
    });

    window.setTimeout(() => {
      setIsAnimating(false);
    }, SLIDE_ANIMATION_TIME);
  }, [
    maxIndex,
    isAnimating,
  ]);

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previous = useCallback(() => {
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    setIndex((current) => {
      if (current <= 0) {
        return maxIndex;
      }

      return current - 1;
    });

    window.setTimeout(() => {
      setIsAnimating(false);
    }, SLIDE_ANIMATION_TIME);
  }, [
    maxIndex,
    isAnimating,
  ]);

  /* =======================================================
     AUTO SLIDE
  ======================================================= */

  useEffect(() => {
    /*
     * No reason to auto-slide when every
     * product already fits.
     */
    if (
      featuredProducts.length <=
      cardsPerView
    ) {
      return;
    }

    /*
     * Pause auto slide while the user is
     * interacting with the carousel.
     */
    if (isHovered) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setIndex((current) => {
          if (current >= maxIndex) {
            return 0;
          }

          return current + 1;
        });
      }, AUTO_SLIDE_TIME);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    featuredProducts.length,
    cardsPerView,
    maxIndex,
    isHovered,
  ]);

  /* =======================================================
     TOUCH / SWIPE
  ======================================================= */

  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    touchStartX.current =
      event.touches[0].clientX;
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    const touchEndX =
      event.changedTouches[0].clientX;

    const difference =
      touchStartX.current -
      touchEndX;

    /*
     * Ignore tiny finger movements.
     */
    if (Math.abs(difference) < 45) {
      return;
    }

    if (difference > 0) {
      next();
    } else {
      previous();
    }
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!featuredProducts.length) {
    return null;
  }

  const step =
    cardWidth + GAP;

  const showControls =
    featuredProducts.length >
    cardsPerView;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="
        relative
        overflow-hidden

        bg-[#FFF1F5]

        px-4
        pt-7
        pb-7

        sm:px-6
        sm:pt-8
        sm:pb-8

        lg:px-10
        lg:pt-8
        lg:pb-9
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl 
          pt-16
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

<div
  className="
    grid
    grid-cols-1
    gap-2

    md:grid-cols-[1fr_auto_1fr]
    md:items-center
    md:gap-8
  "
>
  {/* LEFT */}
  <div className="md:justify-self-start">
    <p
      className="
        text-[8px]
        font-bold
        uppercase
        tracking-[0.34em]
        text-[#E75480]

        sm:text-[9px]
      "
    >
      Our Collection
    </p>
  </div>

  {/* CENTER */}
  <div className="min-w-0 md:justify-self-center">
    <h2
      className="
        whitespace-nowrap
        font-serif
        text-[20px]
        leading-none
        text-[#3A2A2F]

        sm:text-[22px]
        md:text-[24px]
        lg:text-[28px]
      "
    >
      Featured Products
    </h2>
  </div>

  {/* RIGHT */}
  <div className="md:justify-self-end">
    <p
      className="
        max-w-[280px]
        text-[11px]
        leading-[1.5]
        text-[#8A6F78]
        font-semibold

        sm:text-[11px]

        md:text-right
      "
    >
        Most-loved picks from our collection.
    </p>
  </div>
</div>

        {/* =================================================
            CAROUSEL
        ================================================= */}

        <div
          className="
            relative

            mx-auto

            mt-9

            sm:mt-10
          "
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
        >
          {/* =================================================
              LEFT ARROW
          ================================================= */}

          {showControls && (
            <button
              type="button"
              onClick={previous}
              disabled={isAnimating}
              aria-label="Previous products"
              className="
                absolute

                left-0
                top-1/2

                z-30

                flex
                h-9
                w-9

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                border
                border-[#E75480]/15

                bg-white

                text-[#E75480]

                shadow-[0_6px_20px_rgba(58,42,47,0.10)]

                transition-all
                duration-300

                hover:scale-110
                hover:border-[#E75480]
                hover:bg-[#E75480]
                hover:text-white

                active:scale-95

                disabled:pointer-events-none

                lg:h-10
                lg:w-10
              "
            >
              <ArrowLeft size={16} />
            </button>
          )}

          {/* =================================================
              CAROUSEL SAFE AREA

              This padding reserves space for
              the arrows so cards cannot run
              underneath them.
          ================================================= */}

          <div
            className="
              px-11

              sm:px-12

              lg:px-14
            "
          >
            {/* ===============================================
                VIEWPORT
            ================================================ */}

            <div
              ref={viewportRef}
              onTouchStart={
                handleTouchStart
              }
              onTouchEnd={
                handleTouchEnd
              }
              className="
                overflow-hidden

                py-3

                touch-pan-y
              "
            >
              {/* =============================================
                  ANIMATED TRACK

                  KEEP:
                  transition-transform
                  duration-[550ms]
                  translate3d
              ============================================== */}

              <div
                className="
                  flex
                  items-center

                  will-change-transform

                  transition-transform
                  duration-[550ms]

                  ease-[cubic-bezier(0.22,1,0.36,1)]
                "
                style={{
                  gap: `${GAP}px`,

                  transform: `translate3d(-${
                    index * step
                  }px, 0, 0)`,
                }}
              >
                {/* ===========================================
                    PRODUCT CARDS
                ============================================ */}

                {featuredProducts.map(
                  (product) => {
                    const image =
                      product.images?.[0];

                    const isActive =
                      activeCard ===
                      product._id;

                    return (
                      <article
                        key={
                          product._id
                        }
                        style={{
                          width: `${cardWidth}px`,
                          minWidth: `${cardWidth}px`,
                        }}
                        onClick={() => {
                          setActiveCard(
                            isActive
                              ? null
                              : product._id
                          );
                        }}
                        className="
                          group

                          relative

                          aspect-square

                          flex-none

                          cursor-pointer

                          overflow-hidden

                          rounded-[18px]

                          border
                          border-[#E75480]/10

                          bg-[#FCE7EE]

                          shadow-[0_8px_24px_rgba(96,52,67,0.07)]

                          transition-all
                          duration-500

                          ease-[cubic-bezier(0.22,1,0.36,1)]

                          md:hover:-translate-y-1.5

                          md:hover:shadow-[0_16px_36px_rgba(96,52,67,0.15)]
                        "
                      >
                        {/* ===================================
                            IMAGE
                        ==================================== */}

                        {image ? (
                          <img
                            src={image}
                            alt={
                              product.name
                            }
                            draggable={
                              false
                            }
                            className="
                              absolute
                              inset-0

                              h-full
                              w-full

                              object-cover

                              transition-transform
                              duration-700

                              ease-[cubic-bezier(0.22,1,0.36,1)]

                              md:group-hover:scale-[1.07]
                            "
                          />
                        ) : (
                          <div
                            className="
                              absolute
                              inset-0

                              bg-gradient-to-br

                              from-[#FCE7EE]

                              via-[#FBE1EA]

                              to-[#F7CEDB]
                            "
                          />
                        )}

                        {/* ===================================
                            DEFAULT IMAGE SHADE
                        ==================================== */}

                        <div
                          className="
                            pointer-events-none

                            absolute
                            inset-0

                            bg-gradient-to-t

                            from-[#3A2A2F]/10

                            via-transparent

                            to-transparent
                          "
                        />

                        {/* ===================================
                            CATEGORY PILL
                        ==================================== */}

                        {product
                          .productCategory
                          ?.name && (
                          <div
                            className="
                              absolute

                              left-2.5
                              top-2.5

                              z-20

                              max-w-[65%]

                              truncate

                              rounded-full

                              bg-white/95

                              px-2.5
                              py-1

                              text-[7px]

                              font-bold
                              uppercase

                              tracking-[0.13em]

                              text-[#E75480]

                              shadow-sm

                              backdrop-blur-sm
                            "
                          >
                            {
                              product
                                .productCategory
                                .name
                            }
                          </div>
                        )}

                        {/* ===================================
                            HEART
                        ==================================== */}

                        <button
                          type="button"
                          aria-label="Add to favourites"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            /*
                             * Add your favourite
                             * functionality here.
                             */
                          }}
                          className="
                            absolute

                            right-2.5
                            top-2.5

                            z-30

                            flex
                            h-7
                            w-7

                            items-center
                            justify-center

                            rounded-full

                            bg-white/95

                            text-[#E75480]

                            shadow-sm

                            transition-all
                            duration-300

                            hover:scale-110

                            hover:bg-[#E75480]

                            hover:text-white

                            active:scale-95
                          "
                        >
                          <Heart
                            size={12}
                          />
                        </button>

                        {/* ===================================
                            INFORMATION OVERLAY

                            Desktop:
                            hover

                            Mobile / tablet:
                            tap card
                        ==================================== */}

                        <div
                          className={`
                            absolute
                            inset-0

                            z-10

                            flex
                            flex-col
                            justify-end

                            bg-gradient-to-t

                            from-[#342127]/95

                            via-[#342127]/42

                            to-transparent

                            p-3.5

                            transition-opacity
                            duration-500

                            ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0"
                            }

                            md:opacity-0

                            md:group-hover:opacity-100
                          `}
                        >
                          {/* =================================
                              CONTENT
                          ================================== */}

                          <div
                            className={`
                              transform

                              transition-all
                              duration-500

                              ease-[cubic-bezier(0.22,1,0.36,1)]

                              ${
                                isActive
                                  ? "translate-y-0 opacity-100"
                                  : "translate-y-4 opacity-0"
                              }

                              md:translate-y-4
                              md:opacity-0

                              md:group-hover:translate-y-0
                              md:group-hover:opacity-100
                            `}
                          >
                            {product
                              .productCategory
                              ?.name && (
                              <p
                                className="
                                  text-[7px]

                                  font-bold
                                  uppercase

                                  tracking-[0.18em]

                                  text-[#FFD7E3]
                                "
                              >
                                {
                                  product
                                    .productCategory
                                    .name
                                }
                              </p>
                            )}

                            {/* NAME */}

                            <h3
                              className="
                                mt-1

                                line-clamp-1

                                font-serif

                                text-[15px]

                                leading-tight

                                text-white
                              "
                            >
                              {
                                product.name
                              }
                            </h3>

                            {/* DESCRIPTION */}

                            <p
                              className="
                                mt-1

                                line-clamp-2

                                text-[9px]

                                leading-[1.45]

                                text-white/75
                              "
                            >
                              {
                                product.description
                              }
                            </p>

                            {/* PRICE + VIEW */}

                            <div
                              className="
                                mt-2.5

                                flex

                                items-center

                                justify-between

                                gap-2
                              "
                            >
                              <p
                                className="
                                  font-serif

                                  text-[15px]

                                  font-semibold

                                  text-white
                                "
                              >
                                $
                                {Number(
                                  product.price
                                ).toFixed(
                                  2
                                )}
                              </p>

                              <Link
                                to={`/products/${product._id}`}
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();
                                }}
                                className="
                                  inline-flex

                                  items-center

                                  gap-1

                                  rounded-full

                                  bg-white

                                  px-3
                                  py-1.5

                                  text-[7px]

                                  font-bold
                                  uppercase

                                  tracking-[0.12em]

                                  text-[#E75480]

                                  transition-all
                                  duration-300

                                  hover:bg-[#E75480]

                                  hover:text-white
                                "
                              >
                                View

                                <ArrowRight
                                  size={9}
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT ARROW
          ================================================= */}

          {showControls && (
            <button
              type="button"
              onClick={next}
              disabled={isAnimating}
              aria-label="Next products"
              className="
                absolute

                right-0
                top-1/2

                z-30

                flex
                h-9
                w-9

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                border
                border-[#E75480]/15

                bg-white

                text-[#E75480]

                shadow-[0_6px_20px_rgba(58,42,47,0.10)]

                transition-all
                duration-300

                hover:scale-110
                hover:border-[#E75480]
                hover:bg-[#E75480]
                hover:text-white

                active:scale-95

                disabled:pointer-events-none

                lg:h-10
                lg:w-10
              "
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* =================================================
            DOTS
        ================================================= */}

        {maxIndex > 0 && (
          <div
            className="
              mt-2

              flex
              items-center
              justify-center

              gap-1.5
            "
          >
            {Array.from({
              length: maxIndex + 1,
            }).map(
              (_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  aria-label={`Go to slide ${
                    dotIndex + 1
                  }`}
                  onClick={() =>
                    moveTo(
                      dotIndex
                    )
                  }
                  className={`
                    h-1.5

                    rounded-full

                    transition-all
                    duration-300

                    ${
                      dotIndex ===
                      index
                        ? "w-6 bg-[#E75480]"
                        : "w-1.5 bg-[#E9C8D2] hover:bg-[#E75480]/60"
                    }
                  `}
                />
              )
            )}
          </div>
        )}

        {/* =================================================
            VIEW ALL PRODUCTS
        ================================================= */}

        {/* <div
          className="
            mt-4
            text-center
          "
        >
          <a
            href="#all-products"
            className="
              inline-flex

              items-center

              gap-2

              text-[8px]

              font-bold
              uppercase

              tracking-[0.28em]

              text-[#E75480]

              transition-all
              duration-300

              hover:gap-3
            "
          >
            View All Products

            <ArrowRight
              size={12}
            />
          </a>
        </div> */}
      </div>
    </section>
  );
}