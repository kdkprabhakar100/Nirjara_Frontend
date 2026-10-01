import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

/* =========================================================
   TYPES
========================================================= */

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  product_category_id: string;
  // Filled in by the API; null when the
  // category is missing.
  productCategory?: { _id: string; name: string } | null;
  images: string[];
  stock: number;
  featured?: boolean;
  brand?: string;
  clicks?: number;
};

type FeaturedProductsProps = {
  products: Product[];
};

/* =========================================================
   SETTINGS
========================================================= */

const AUTO_ROTATE_TIME = 4000;

/* =========================================================
   COMPONENT
========================================================= */

export default function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  const { addToCart } = useCart();

  const [activeIndex, setActiveIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  /* =========================================================
     CREATE FEATURED PRODUCTS

     RULE:

     1. If products have clicks:
        highest clicked products appear first.

     2. Remaining spaces are filled with normal products.

     3. If there are no clicks:
        first 6 products are used.
  ========================================================= */

  const featuredProducts = useMemo(() => {
    if (!products?.length) {
      return [];
    }

    const clickedProducts = [...products]
      .filter((product) => (product.clicks ?? 0) > 0)
      .sort(
        (a, b) =>
          (b.clicks ?? 0) - (a.clicks ?? 0)
      );

    /* No clicks yet */

    if (clickedProducts.length === 0) {
      return products.slice(0, 6);
    }

    const result: Product[] = [];

    /* Add clicked products */

    clickedProducts.forEach((product) => {
      if (result.length >= 6) return;

      if (
        !result.some(
          (item) => item._id === product._id
        )
      ) {
        result.push(product);
      }
    });

    /* Fill empty positions */

    products.forEach((product) => {
      if (result.length >= 6) return;

      if (
        !result.some(
          (item) => item._id === product._id
        )
      ) {
        result.push(product);
      }
    });

    return result.slice(0, 6);
  }, [products]);

  /* =========================================================
     KEEP ACTIVE INDEX VALID
  ========================================================= */

  useEffect(() => {
    if (!featuredProducts.length) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= featuredProducts.length) {
      setActiveIndex(0);
    }
  }, [featuredProducts.length, activeIndex]);

  /* =========================================================
     NEXT
  ========================================================= */

  const nextProduct = useCallback(() => {
    if (featuredProducts.length <= 1) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current + 1) % featuredProducts.length
    );
  }, [featuredProducts.length]);

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const previousProduct = useCallback(() => {
    if (featuredProducts.length <= 1) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current -
          1 +
          featuredProducts.length) %
        featuredProducts.length
    );
  }, [featuredProducts.length]);

  /* =========================================================
     AUTO ROTATE

     Automatically changes center product every 4 seconds.

     Stops while mouse is over carousel.
  ========================================================= */

  useEffect(() => {
    if (
      featuredProducts.length <= 1 ||
      isPaused
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) %
          featuredProducts.length
      );
    }, AUTO_ROTATE_TIME);

    return () => {
      window.clearInterval(interval);
    };
  }, [featuredProducts.length, isPaused]);

  /* =========================================================
     RELATIVE POSITION

     Example:

     active = product 3

     product 1 = -2
     product 2 = -1
     product 3 =  0
     product 4 =  1
     product 5 =  2
  ========================================================= */

  const getRelativePosition = (
    index: number
  ) => {
    const total = featuredProducts.length;

    if (!total) {
      return 0;
    }

    let difference = index - activeIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  };

  /* =========================================================
     CARD POSITION / ANIMATION

     Center:
        biggest

     Near cards:
        slightly smaller

     Outer cards:
        smaller

     IMPORTANT:
     Spacing prevents overlapping.
  ========================================================= */

  const getCardStyle = (
    relativePosition: number
  ): CSSProperties => {
    const absolutePosition = Math.abs(
      relativePosition
    );

    /* HIDDEN */

    if (absolutePosition > 2) {
      return {
        opacity: 0,

        pointerEvents: "none",

        transform: `translateX(${
          relativePosition > 0 ? 760 : -760
        }px) translateY(35px) scale(0.72)`,

        zIndex: 0,
      };
    }

    /* CENTER */

    if (relativePosition === 0) {
      return {
        transform:
          "translateX(0px) translateY(-24px) scale(1.08)",

        opacity: 1,

        zIndex: 30,
      };
    }

    /* LEFT */

    if (relativePosition === -1) {
      return {
        transform:
          "translateX(-292px) translateY(8px) scale(0.92)",

        opacity: 1,

        zIndex: 20,
      };
    }

    /* RIGHT */

    if (relativePosition === 1) {
      return {
        transform:
          "translateX(292px) translateY(8px) scale(0.92)",

        opacity: 1,

        zIndex: 20,
      };
    }

    /* FAR LEFT */

    if (relativePosition === -2) {
      return {
        transform:
          "translateX(-535px) translateY(27px) scale(0.82)",

        opacity: 0.88,

        zIndex: 10,
      };
    }

    /* FAR RIGHT */

    return {
      transform:
        "translateX(535px) translateY(27px) scale(0.82)",

      opacity: 0.88,

      zIndex: 10,
    };
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = (
    product: Product
  ) => {
    if (product.stock <= 0) {
      toast.error(
        `${product.name} is currently out of stock.`
      );

      return;
    }

    addToCart({
      _id: product._id,

      name: product.name,

      price: product.price,

      image: product.images?.[0],

      quantity: 1,
    });

    toast.success(
      `${product.name} added to cart 💖`
    );
  };

  /* =========================================================
     NOTHING TO SHOW
  ========================================================= */

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section
      className="
        overflow-hidden
        bg-[#FBF5EC]
        px-4
        pb-16
        pt-24

        sm:px-6
        sm:pb-20
        sm:pt-28

        lg:px-10
        lg:pb-24
        lg:pt-28
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          text-center
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[5px]
            text-[#9B7A55]
          "
        >
          Our Collection
        </p>

        <h2
          className="
            mt-3
            font-serif
            text-4xl
            text-[#302520]

            sm:text-5xl

            lg:text-[54px]
          "
        >
          Featured Products
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-xl
            text-sm
            leading-7
            text-[#8C7569]

            sm:text-base
          "
        >
          Explore our most popular beauty
          products loved by customers.
        </p>
      </div>

      {/* =====================================================
          DESKTOP / TABLET CAROUSEL
      ===================================================== */}

      <div
        onMouseEnter={() =>
          setIsPaused(true)
        }
        onMouseLeave={() =>
          setIsPaused(false)
        }
        className="
          relative
          mx-auto
          mt-16
          hidden
          h-[510px]
          max-w-[1280px]
          md:block
        "
      >
        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          {featuredProducts.map(
            (product, index) => {
              const relativePosition =
                getRelativePosition(index);

              const isActive =
                relativePosition === 0;

              return (
                <article
                  key={product._id}
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  style={getCardStyle(
                    relativePosition
                  )}
                  className="
                    absolute
                    w-[250px]
                    cursor-pointer
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-[#E9DFD1]
                    bg-[#FFFCF7]

                    shadow-[0_15px_40px_rgba(92,67,46,0.08)]

                    will-change-transform

                    transition-[transform,opacity]
                    duration-200
                    ease-in-out
                  "
                >
                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  <Link
                    to={`/products/${product._id}`}
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    className="block"
                  >
                    <div
                      className="
                        relative
                        h-[235px]
                        overflow-hidden
                        bg-[#F4ECE1]
                      "
                    >
                      {product.images?.[0] ? (
                        <img
                          src={
                            product.images[0]
                          }
                          alt={product.name}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover

                            transition-transform
                            duration-200

                            hover:scale-105
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            px-5
                            text-center
                            text-xs
                            uppercase
                            tracking-[2px]
                            text-[#A58E7C]
                          "
                        >
                          No Image
                        </div>
                      )}

                      {/* BADGE */}

                      <span
                        className="
                          absolute
                          left-4
                          top-4

                          rounded-md

                          bg-[#F3E5CA]

                          px-3
                          py-1.5

                          text-[8px]
                          uppercase
                          tracking-[1px]
                          text-[#8B6B42]
                        "
                      >
                        {isActive
                          ? "Best Seller"
                          : index % 2 === 0
                            ? "Popular"
                            : "Trending"}
                      </span>

                      {/* HEART */}

                      <button
                        type="button"
                        aria-label={`Save ${product.name}`}
                        onClick={(event) => {
                          event.preventDefault();

                          event.stopPropagation();
                        }}
                        className="
                          absolute
                          right-4
                          top-4

                          flex
                          h-9
                          w-9
                          items-center
                          justify-center

                          rounded-full

                          bg-white/90

                          text-lg
                          text-[#806E61]

                          shadow-sm
                        "
                      >
                        ♡
                      </button>
                    </div>
                  </Link>

                  {/* =========================================
                      CONTENT
                  ========================================= */}

                  <div className="p-5">
                    <p
                      className="
                        truncate
                        text-[8px]
                        uppercase
                        tracking-[2px]
                        text-[#B28A62]
                      "
                    >
                      {product.productCategory?.name}
                    </p>

                    <Link
                      to={`/products/${product._id}`}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <h3
                        className="
                          mt-2
                          truncate
                          font-serif
                          text-[21px]
                          text-[#302520]
                        "
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-2
                        line-clamp-2
                        min-h-[40px]

                        text-[11px]
                        leading-5
                        text-[#927D71]
                      "
                    >
                      {product.description}
                    </p>

                    {/* STOCK */}

                    <p
                      className="
                        mt-3
                        text-[9px]
                        text-[#A58E7C]
                      "
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>

                    {/* =======================================
                        PRICE / BUTTON
                    ======================================= */}

                    <div
                      className="
                        mt-2
                        flex
                        items-end
                        justify-between
                        gap-3
                      "
                    >
                      <p
                        className="
                          font-serif
                          text-2xl
                          font-semibold
                          text-[#302520]
                        "
                      >
                        ${product.price}
                      </p>

                      {isActive ? (
                        <button
                          type="button"
                          disabled={
                            product.stock <= 0
                          }
                          onClick={(event) => {
                            event.stopPropagation();

                            handleAddToCart(
                              product
                            );
                          }}
                          className="
                            rounded-xl

                            bg-[#BE9663]

                            px-5
                            py-3

                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[1.5px]
                            text-white

                            transition

                            hover:bg-[#A77D4E]

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {product.stock > 0
                            ? "Add to Cart"
                            : "Sold Out"}
                        </button>
                      ) : (
                        <Link
                          to={`/products/${product._id}`}
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          className="
                            rounded-xl

                            bg-[#F4EBDD]

                            px-4
                            py-3

                            text-[9px]
                            uppercase
                            tracking-[1.5px]
                            text-[#9A7954]

                            transition

                            hover:bg-[#EADCC8]
                          "
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>

        {/* ===================================================
            PREVIOUS BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={previousProduct}
          aria-label="Previous featured product"
          className="
            absolute
            left-0
            top-1/2
            z-50

            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center

            rounded-full

            bg-white

            text-xl
            text-[#705D51]

            shadow-[0_8px_25px_rgba(73,54,39,0.12)]

            transition

            hover:scale-110
          "
        >
          ‹
        </button>

        {/* ===================================================
            NEXT BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={nextProduct}
          aria-label="Next featured product"
          className="
            absolute
            right-0
            top-1/2
            z-50

            flex
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center

            rounded-full

            bg-white

            text-xl
            text-[#705D51]

            shadow-[0_8px_25px_rgba(73,54,39,0.12)]

            transition

            hover:scale-110
          "
        >
          ›
        </button>
      </div>

      {/* =====================================================
          DESKTOP DOTS
      ===================================================== */}

      <div
        className="
          mt-2
          hidden
          items-center
          justify-center
          gap-2
          md:flex
        "
      >
        {featuredProducts.map(
          (product, index) => (
            <button
              key={product._id}
              type="button"
              onClick={() =>
                setActiveIndex(index)
              }
              aria-label={`Show featured product ${
                index + 1
              }`}
              className={`
                h-2
                rounded-full

                transition-all
                duration-500

                ${
                  activeIndex === index
                    ? "w-7 bg-[#BE9663]"
                    : "w-2 bg-[#D9CFC2]"
                }
              `}
            />
          )
        )}
      </div>

      {/* =====================================================
          MOBILE

          Manual swipe instead of automatic rotation.
          This is better UX for touch screens.
      ===================================================== */}

      <div className="mt-10 md:hidden">
        <div
          className="
            -mx-4
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto

            px-4
            pb-5

            [scrollbar-width:none]

            [&::-webkit-scrollbar]:hidden
          "
        >
          {featuredProducts.map(
            (product, index) => (
              <article
                key={product._id}
                className="
                  w-[82vw]
                  max-w-[330px]
                  flex-none
                  snap-center

                  overflow-hidden

                  rounded-[24px]

                  border
                  border-[#E9DFD1]

                  bg-[#FFFCF7]

                  shadow-[0_12px_30px_rgba(92,67,46,0.08)]
                "
              >
                {/* ===========================================
                    MOBILE IMAGE
                =========================================== */}

                <Link
                  to={`/products/${product._id}`}
                  className="block"
                >
                  <div
                    className="
                      relative
                      h-[290px]
                      overflow-hidden
                      bg-[#F4ECE1]
                    "
                  >
                    {product.images?.[0] ? (
                      <img
                        src={
                          product.images[0]
                        }
                        alt={product.name}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center

                          text-sm
                          text-[#9C8678]
                        "
                      >
                        No image
                      </div>
                    )}

                    {/* BADGE */}

                    <span
                      className="
                        absolute
                        left-4
                        top-4

                        rounded-md

                        bg-[#F3E5CA]

                        px-3
                        py-1.5

                        text-[8px]
                        uppercase
                        tracking-[1px]
                        text-[#8B6B42]
                      "
                    >
                      {index === 0
                        ? "Best Seller"
                        : index % 2 === 0
                          ? "Popular"
                          : "Trending"}
                    </span>

                    {/* HEART */}

                    <button
                      type="button"
                      aria-label={`Save ${product.name}`}
                      onClick={(event) => {
                        event.preventDefault();

                        event.stopPropagation();
                      }}
                      className="
                        absolute
                        right-4
                        top-4

                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-full

                        bg-white/90

                        text-xl
                        text-[#806E61]

                        shadow-sm
                      "
                    >
                      ♡
                    </button>
                  </div>
                </Link>

                {/* ===========================================
                    MOBILE CONTENT
                =========================================== */}

                <div className="p-5">
                  <p
                    className="
                      truncate

                      text-[9px]
                      uppercase
                      tracking-[2px]
                      text-[#B28A62]
                    "
                  >
                    {product.productCategory?.name}
                  </p>

                  <Link
                    to={`/products/${product._id}`}
                  >
                    <h3
                      className="
                        mt-2
                        truncate

                        font-serif
                        text-2xl
                        text-[#302520]
                      "
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <p
                    className="
                      mt-2
                      line-clamp-2
                      min-h-[40px]

                      text-xs
                      leading-5
                      text-[#927D71]
                    "
                  >
                    {product.description}
                  </p>

                  {/* PRICE + STOCK */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          font-serif
                          text-2xl
                          font-semibold
                          text-[#302520]
                        "
                      >
                        ${product.price}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-[#A58E7C]
                        "
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        product.stock <= 0
                      }
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      className="
                        rounded-xl

                        bg-[#BE9663]

                        px-5
                        py-3

                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[1.5px]
                        text-white

                        transition

                        active:scale-95

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {product.stock > 0
                        ? "Add to Cart"
                        : "Sold Out"}
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>

        {/* MOBILE MESSAGE */}

        <p
          className="
            mt-2
            text-center

            text-[9px]
            uppercase
            tracking-[4px]
            text-[#B79A7C]
          "
        >
          Swipe to explore
        </p>
      </div>
    </section>
  );
}