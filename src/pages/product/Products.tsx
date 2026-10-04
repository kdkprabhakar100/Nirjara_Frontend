import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import { toast } from "react-toastify";

import SEO from "../../components/SEO";

import FeaturedProducts from "../../components/FeaturedProducts";

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

  stock: number;

  featured?: boolean;

  brand?: string;

  clicks?: number;

  createdAt?: string;

  updatedAt?: string;
};

/* =========================================================
   SEO
========================================================= */

const PRODUCTS_SEO = {
  title: "Beauty Products | Nirjara Beauty Kathmandu",

  description:
    "Explore beauty and personal care products available from Nirjara Beauty in Kathmandu.",

  keywords:
    "beauty products Nepal, beauty products Kathmandu, hair products Nepal, skincare products Kathmandu, Nirjara Beauty products",

  canonical: "/products",

  image: "/images/nirjara-og.jpg",

  type: "website",
};

/* =========================================================
   SETTINGS
========================================================= */

const DESKTOP_PRODUCTS_PER_PAGE = 8;

const MOBILE_PRODUCTS_PER_PAGE = 10;

/* =========================================================
   PRODUCT PAGE
========================================================= */

export default function Products() {
  /* =======================================================
     STATE
  ======================================================= */

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [desktopPage, setDesktopPage] = useState(1);

  const [mobilePage, setMobilePage] = useState(1);

  const { addToCart } = useCart();

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load products (${response.status})`,
        );
      }

      const data = await response.json();

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.products)
            ? data.products
            : [];

      setProducts(productList);
    } catch (err) {
      console.error("Failed to fetch products:", err);

      setError(
        "We couldn't load the products right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =======================================================
     DESKTOP PAGINATION
  ======================================================= */

  const desktopTotalPages = Math.max(
    1,
    Math.ceil(
      products.length / DESKTOP_PRODUCTS_PER_PAGE,
    ),
  );

  const desktopProducts = useMemo(() => {
    const start =
      (desktopPage - 1) *
      DESKTOP_PRODUCTS_PER_PAGE;

    const end =
      start + DESKTOP_PRODUCTS_PER_PAGE;

    return products.slice(start, end);
  }, [products, desktopPage]);

  /* =======================================================
     MOBILE PAGINATION
  ======================================================= */

  const mobileTotalPages = Math.max(
    1,
    Math.ceil(
      products.length / MOBILE_PRODUCTS_PER_PAGE,
    ),
  );

  const mobileProducts = useMemo(() => {
    const start =
      (mobilePage - 1) *
      MOBILE_PRODUCTS_PER_PAGE;

    const end =
      start + MOBILE_PRODUCTS_PER_PAGE;

    return products.slice(start, end);
  }, [products, mobilePage]);

  /* =======================================================
     RESET PAGINATION
  ======================================================= */

  useEffect(() => {
    setDesktopPage(1);
    setMobilePage(1);
  }, [products.length]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = (
    product: Product,
  ) => {
    if (product.stock <= 0) {
      toast.error(
        `${product.name} is currently out of stock.`,
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
      `${product.name} added to cart 💖`,
    );
  };

  /* =======================================================
     DESKTOP PAGE CHANGE
  ======================================================= */

  const changeDesktopPage = (
    page: number,
  ) => {
    if (
      page < 1 ||
      page > desktopTotalPages
    ) {
      return;
    }

    setDesktopPage(page);

    window.setTimeout(() => {
      document
        .getElementById("all-products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     MOBILE PAGE CHANGE
  ======================================================= */

  const changeMobilePage = (
    page: number,
  ) => {
    if (
      page < 1 ||
      page > mobileTotalPages
    ) {
      return;
    }

    setMobilePage(page);

    window.setTimeout(() => {
      document
        .getElementById("mobile-products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <>
        <SEO
          title={PRODUCTS_SEO.title}
          description={
            PRODUCTS_SEO.description
          }
          keywords={PRODUCTS_SEO.keywords}
          canonical={
            PRODUCTS_SEO.canonical
          }
          image={PRODUCTS_SEO.image}
          type="website"
        />

        <section
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#FFF9FB]
            px-4
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
                text-[12px]
                tracking-wide
                text-[#8A6F78]
              "
            >
              Loading products...
            </p>
          </div>
        </section>
      </>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <>
        <SEO
          title={PRODUCTS_SEO.title}
          description={
            PRODUCTS_SEO.description
          }
          keywords={PRODUCTS_SEO.keywords}
          canonical={
            PRODUCTS_SEO.canonical
          }
          image={PRODUCTS_SEO.image}
          type="website"
        />

        <section
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#FFF9FB]
            px-4
          "
        >
          <div className="max-w-md text-center">
            <h1
              className="
                font-serif
                text-3xl
                text-[#3A2A2F]
              "
            >
              Products unavailable
            </h1>

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
              onClick={fetchProducts}
              className="
                mt-6
                rounded-full
                bg-[#E75480]
                px-6
                py-2.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white
                transition
                duration-300
                hover:bg-[#D63C6D]
              "
            >
              Try Again
            </button>
          </div>
        </section>
      </>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <SEO
        title={PRODUCTS_SEO.title}
        description={
          PRODUCTS_SEO.description
        }
        keywords={PRODUCTS_SEO.keywords}
        canonical={PRODUCTS_SEO.canonical}
        image={PRODUCTS_SEO.image}
        type="website"
      />

      {/* ===================================================
          FEATURED PRODUCTS

          Keep this component separate.
          Existing carousel/click-ranking/animation logic
          remains inside FeaturedProducts.
      =================================================== */}

      {products.length > 0 && (
        <FeaturedProducts
          products={products}
        />
      )}

      {/* ===================================================
          ALL PRODUCTS
      =================================================== */}

      <section
        id="all-products"
        className="
          scroll-mt-24
          overflow-hidden
          border-t
          border-[#3A2A2F]/[0.06]
          bg-[#FFF9FB]
          px-4
          py-8

          sm:px-6
          sm:py-10

          lg:px-8
          lg:py-12
        "
      >
        <div
          className="
            mx-auto
            max-w-[1120px]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}
<div
  className="
    border-b
    border-[#3A2A2F]/10
    pb-4
  "
>
  <div
    className="
      flex
      items-end
      justify-between
      gap-4
    "
  >
    <h1
      className="
        font-serif
        text-[28px]
        leading-none
        tracking-[-0.025em]
        text-[#3A2A2F]
      "
    >
      All Products
    </h1>

    <span
      className="
        shrink-0
        pb-[4px]
        text-[8px]
        font-medium
        uppercase
        tracking-[0.16em]
        text-[#A88993]
      "
    >
      {products.length} products
    </span>
  </div>

  <p
    className="
      mt-2
      text-[11px]
      leading-5
      text-[#9B818A]
    "
  >
    Beauty and skincare essentials
  </p>
</div>

          {/* =================================================
              EMPTY
          ================================================= */}

          {products.length === 0 ? (
            <div
              className="
                mt-6
                rounded-[18px]
                border
                border-[#EEE1E6]
                bg-white
                px-6
                py-10
                text-center
              "
            >
              <h2
                className="
                  font-serif
                  text-2xl
                  text-[#3A2A2F]
                "
              >
                Products coming soon
              </h2>

              <p
                className="
                  mt-2
                  text-[12px]
                  text-[#8A6F78]
                "
              >
                Our beauty collection is being
                prepared.
              </p>
            </div>
          ) : (
            <>
              {/* =================================================
                  TABLET + DESKTOP GRID
              ================================================= */}

{/* =================================================
    TABLET + DESKTOP GRID
================================================= */}

<div className="hidden md:block">
  <div
    key={`desktop-page-${desktopPage}`}
    className="
      mt-6
      grid
      animate-[productPageIn_0.45s_ease-out_both]

      grid-cols-3
      gap-x-4
      gap-y-6

      lg:grid-cols-4
      lg:gap-x-5
      lg:gap-y-7
    "
  >
    {desktopProducts.map((product, index) => (
      <article
        key={product._id}
        style={{
          animationDelay: `${index * 45}ms`,
        }}
        className="
          group
          min-w-0
          overflow-hidden

          rounded-[18px]

          border
          border-[#E8D9DE]

          bg-white
          p-2.5

          shadow-[0_4px_14px_rgba(58,42,47,0.03)]

          transition-all
          duration-300

          hover:-translate-y-1
          hover:border-[#D9C0C9]
          hover:shadow-[0_10px_24px_rgba(58,42,47,0.07)]

          animate-[productCardIn_0.5s_ease-out_both]
        "
      >
        {/* ======================================
            IMAGE
        ====================================== */}

        <Link
          to={`/products/${product._id}`}
          className="
            block
            focus:outline-none
          "
        >
          <div
            className="
              relative

              aspect-[4/3]

              overflow-hidden

              rounded-[14px]

              border
              border-[#EADDE2]

              bg-[#F7ECEF]

              shadow-[0_5px_16px_rgba(58,42,47,0.03)]

              transition-all
              duration-500
              ease-out

              group-hover:-translate-y-0.5
              group-hover:shadow-[0_10px_24px_rgba(58,42,47,0.07)]
            "
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="
                  h-full
                  w-full
                  object-cover

                  transition-transform
                  duration-700
                  ease-out

                  group-hover:scale-[1.03]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  px-4
                  text-center

                  text-[8px]
                  uppercase
                  tracking-[0.16em]
                  text-[#B2949E]
                "
              >
                No image
              </div>
            )}

            {/* SOFT HOVER GRADIENT */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0

                bg-gradient-to-t
                from-[#3A2A2F]/15
                via-transparent
                to-transparent

                opacity-0

                transition-opacity
                duration-500

                group-hover:opacity-100
              "
            />

            {/* FEATURED BADGE */}

            {product.featured && (
              <span
                className="
                  absolute
                  left-2
                  top-2

                  rounded-full

                  bg-white/95

                  px-2
                  py-1

                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#E75480]

                  shadow-sm
                  backdrop-blur-md
                "
              >
                Featured
              </span>
            )}

            {/* QUICK VIEW */}

            <div
              className="
                absolute
                inset-x-3
                bottom-3

                translate-y-2
                opacity-0

                transition-all
                duration-300
                ease-out

                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <div
                className="
                  rounded-full
                  bg-white/95

                  px-3
                  py-2

                  text-center
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#3A2A2F]

                  shadow-md
                  backdrop-blur-md
                "
              >
                View Product
              </div>
            </div>
          </div>
        </Link>

        {/* ======================================
            PRODUCT INFO
        ====================================== */}

        <div className="px-0.5 pt-2.5">
          {/* CATEGORY */}

          {product.productCategory?.name && (
            <p
              className="
                truncate

                text-[6px]
                font-medium
                uppercase
                tracking-[0.15em]

                text-[#C77A95]
              "
            >
              {product.productCategory.name}
            </p>
          )}

          {/* NAME + PRICE */}

          <div
            className="
              mt-1

              flex
              items-start
              justify-between
              gap-2
            "
          >
            <Link
              to={`/products/${product._id}`}
              className="
                min-w-0
                flex-1
              "
            >
              <h2
                className="
                  truncate

                  font-serif
                  text-[14px]
                  leading-5

                  text-[#3A2A2F]

                  transition-colors
                  duration-200

                  hover:text-[#E75480]
                "
              >
                {product.name}
              </h2>
            </Link>

            <p
              className="
                shrink-0
                pt-[1px]

                text-[11px]
                font-semibold

                text-[#E75480]
              "
            >
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          {/* BRAND + STOCK */}

          <div
            className="
              mt-0.5

              flex
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className="
                min-w-0
                truncate

                text-[8px]

                text-[#A58C95]
              "
            >
              {product.brand || "Nirjara Beauty"}
            </p>

            <p
              className={`
                shrink-0

                text-[7px]

                ${
                  product.stock > 0
                    ? "text-[#A58C95]"
                    : "text-red-400"
                }
              `}
            >
              {product.stock > 0
                ? "In stock"
                : "Sold out"}
            </p>
          </div>

          {/* ADD TO BAG */}

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() =>
              handleAddToCart(product)
            }
            className="
              mt-2
              w-full

              rounded-full

              bg-[#3A2A2F]

              py-2

              text-[7px]
              font-semibold
              uppercase
              tracking-[0.15em]

              text-white

              transition-all
              duration-300

              hover:-translate-y-[1px]
              hover:bg-[#E75480]
              hover:shadow-[0_5px_14px_rgba(231,84,128,0.16)]

              active:translate-y-0
              active:scale-[0.985]

              disabled:cursor-not-allowed
              disabled:bg-[#D8C9CE]
              disabled:shadow-none
            "
          >
            {product.stock > 0
              ? "Add to Bag"
              : "Sold Out"}
          </button>
        </div>
      </article>
    ))}
  </div>

  {/* =================================================
      DESKTOP PAGINATION
  ================================================= */}

  {desktopTotalPages > 1 && (
    <div
      className="
        mt-8

        flex
        items-center
        justify-center

        border-t
        border-[#3A2A2F]/10

        pt-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-center
          gap-2
        "
      >
        {/* PREVIOUS */}

        <button
          type="button"
          disabled={desktopPage === 1}
          onClick={() =>
            changeDesktopPage(desktopPage - 1)
          }
          aria-label="Previous page"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            border
            border-[#E8D9DE]

            bg-white

            text-[13px]
            text-[#3A2A2F]

            transition-all
            duration-200

            hover:border-[#E75480]
            hover:text-[#E75480]

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          ‹
        </button>

        {/* PAGE NUMBERS */}

        {Array.from(
          { length: desktopTotalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() =>
              changeDesktopPage(page)
            }
            aria-label={`Page ${page}`}
            className={`
              flex
              h-9
              min-w-9
              items-center
              justify-center

              rounded-full

              px-3

              text-[10px]
              font-semibold

              transition-all
              duration-200

              ${
                desktopPage === page
                  ? `
                    border
                    border-[#E75480]
                    bg-[#E75480]
                    text-white
                    shadow-[0_4px_12px_rgba(231,84,128,0.20)]
                  `
                  : `
                    border
                    border-[#E8D9DE]
                    bg-white
                    text-[#8A6F78]

                    hover:border-[#E75480]
                    hover:text-[#E75480]
                  `
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* NEXT */}

        <button
          type="button"
          disabled={
            desktopPage === desktopTotalPages
          }
          onClick={() =>
            changeDesktopPage(desktopPage + 1)
          }
          aria-label="Next page"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            border
            border-[#E8D9DE]

            bg-white

            text-[13px]
            text-[#3A2A2F]

            transition-all
            duration-200

            hover:border-[#E75480]
            hover:text-[#E75480]

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          ›
        </button>
      </div>
    </div>
  )}
</div>

              {/* =================================================
                  MOBILE
              ================================================= */}

{/* =================================================
    MOBILE
================================================= */}

<div
  id="mobile-products"
  className="
    mt-5
    scroll-mt-24
    md:hidden
  "
>
  {/* MOBILE GRID */}

  <div
    key={`mobile-page-${mobilePage}`}
    className="
      grid
      grid-cols-2
      gap-3
      animate-[productPageIn_0.4s_ease-out_both]
    "
  >
    {mobileProducts.map((product, index) => (
      <article
        key={product._id}
        style={{
          animationDelay: `${index * 35}ms`,
        }}
        className="
          group
          min-w-0
          overflow-hidden
          rounded-[18px]
          border
          border-[#E8D9DE]
          bg-white
          p-2.5
          shadow-[0_4px_16px_rgba(58,42,47,0.035)]
          transition-all
          duration-300
          active:scale-[0.99]
          animate-[productCardIn_0.45s_ease-out_both]
        "
      >
        {/* IMAGE */}

        <Link
          to={`/products/${product._id}`}
          className="block"
        >
          <div
            className="
              relative
              aspect-[4/3]
              overflow-hidden
              rounded-[13px]
              border
              border-[#EADDE2]
              bg-[#F7ECEF]
              shadow-[0_4px_14px_rgba(58,42,47,0.035)]
              transition-transform
              duration-300
              active:scale-[0.985]
            "
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
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
                  text-[7px]
                  uppercase
                  tracking-[0.15em]
                  text-[#A88993]
                "
              >
                No image
              </div>
            )}

            {product.featured && (
              <span
                className="
                  absolute
                  left-2
                  top-2
                  rounded-full
                  bg-white/95
                  px-2
                  py-1
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#E75480]
                  shadow-sm
                "
              >
                Featured
              </span>
            )}
          </div>
        </Link>

        {/* INFO */}

        <div className="px-0.5 pt-2.5">
          {product.productCategory?.name && (
            <p
              className="
                truncate
                text-[7px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[#C77A95]
              "
            >
              {product.productCategory.name}
            </p>
          )}

          <Link to={`/products/${product._id}`}>
            <h2
              className="
                mt-1
                truncate
                font-serif
                text-[13px]
                leading-[1.35]
                text-[#3A2A2F]
              "
            >
              {product.name}
            </h2>
          </Link>

          <div
            className="
              mt-1
              flex
              items-center
              justify-between
              gap-2
            "
          >
            <span
              className="
                text-[11px]
                font-semibold
                text-[#E75480]
              "
            >
              ${Number(product.price).toFixed(2)}
            </span>

            <span
              className={`
                truncate
                text-[8px]

                ${
                  product.stock > 0
                    ? "text-[#A58C95]"
                    : "text-red-400"
                }
              `}
            >
              {product.stock > 0
                ? "In stock"
                : "Sold out"}
            </span>
          </div>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() =>
              handleAddToCart(product)
            }
            className="
              mt-2.5
              w-full
              rounded-full
              bg-[#3A2A2F]
              py-2.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              transition-all
              duration-200
              active:scale-[0.97]
              disabled:bg-[#D8C9CE]
            "
          >
            {product.stock > 0
              ? "Add to Bag"
              : "Sold Out"}
          </button>
        </div>
      </article>
    ))}
  </div>

{/* MOBILE META + PAGINATION */}

<div
  className="
    mt-7
    grid
    grid-cols-[1fr_auto_1fr]
    items-center
    gap-2
    border-t
    border-[#3A2A2F]/10
    pt-4
  "
>
  {/* LEFT: PRODUCT COUNT */}

  <span
    className="
      justify-self-start
      text-[8px]
      uppercase
      tracking-[0.17em]
      text-[#AD969E]
    "
  >
    {products.length} products
  </span>

  {/* CENTER: PAGINATION */}

  {mobileTotalPages > 1 ? (
    <div
      className="
        flex
        items-center
        justify-center
        gap-1.5
      "
    >
      {/* PREVIOUS */}

      <button
        type="button"
        disabled={mobilePage === 1}
        onClick={() =>
          changeMobilePage(mobilePage - 1)
        }
        aria-label="Previous page"
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          border-[#E8D9DE]
          bg-white
          text-[11px]
          text-[#3A2A2F]
          transition-all
          duration-200
          active:scale-[0.96]
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        ‹
      </button>

      {/* PAGE NUMBERS */}

      {Array.from(
        { length: mobileTotalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() =>
            changeMobilePage(page)
          }
          aria-label={`Page ${page}`}
          className={`
            flex
            h-7
            min-w-7
            items-center
            justify-center
            rounded-full
            px-2
            text-[8px]
            font-semibold
            transition-all
            duration-200

            ${
              mobilePage === page
                ? "border border-[#E75480] bg-[#E75480] text-white shadow-[0_3px_10px_rgba(231,84,128,0.18)]"
                : "border border-[#E8D9DE] bg-white text-[#8A6F78]"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* NEXT */}

      <button
        type="button"
        disabled={
          mobilePage === mobileTotalPages
        }
        onClick={() =>
          changeMobilePage(mobilePage + 1)
        }
        aria-label="Next page"
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          border-[#E8D9DE]
          bg-white
          text-[11px]
          text-[#3A2A2F]
          transition-all
          duration-200
          active:scale-[0.96]
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        ›
      </button>
    </div>
  ) : (
    <div />
  )}

  {/* RIGHT: PAGE COUNT */}

  <span
    className="
      justify-self-end
      text-[8px]
      uppercase
      tracking-[0.17em]
      text-[#AD969E]
    "
  >
    Page {mobilePage} of {mobileTotalPages}
  </span>
</div>


</div>
            </>
          )}
        </div>
      </section>

      {/* ===================================================
          LOCAL ANIMATION KEYFRAMES

          No Framer Motion dependency needed.
      =================================================== */}

      <style>{`
        @keyframes productPageIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes productCardIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [class*="productPageIn"],
          [class*="productCardIn"] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}