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
  // Filled in by the API; null when the
  // category is missing.
  productCategory?: { _id: string; name: string } | null;
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
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load products (${response.status})`
        );
      }

      const data = await response.json();

      /*
        Supports either:

        [
          {...},
          {...}
        ]

        OR

        {
          data: [...]
        }

        OR

        {
          products: [...]
        }
      */

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
        "We couldn't load the products right now."
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
      products.length /
        DESKTOP_PRODUCTS_PER_PAGE
    )
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

     Each mobile page contains up to 10 products.

     Inside that page the user horizontally swipes
     through the products.
  ======================================================= */

  const mobileTotalPages = Math.max(
    1,
    Math.ceil(
      products.length /
        MOBILE_PRODUCTS_PER_PAGE
    )
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
     RESET PAGINATION WHEN PRODUCTS CHANGE
  ======================================================= */

  useEffect(() => {
    setDesktopPage(1);

    setMobilePage(1);
  }, [products.length]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

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

  /* =======================================================
     DESKTOP PAGE CHANGE
  ======================================================= */

  const changeDesktopPage = (
    page: number
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
    page: number
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
            bg-[#FFF5F8]
            px-4
            pt-28
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-2
                border-[#E75480]/20
                border-t-[#E75480]
              "
            />

            <p
              className="
                mt-5
                text-sm
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
            bg-[#FFF5F8]
            px-4
            pt-28
          "
        >
          <div
            className="
              max-w-md
              text-center
            "
          >
            <h1
              className="
                font-serif
                text-4xl
                text-[#3A2A2F]
              "
            >
              Products unavailable
            </h1>

            <p
              className="
                mt-4
                leading-7
                text-[#8A6F78]
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
              className="
                mt-7
                rounded-full
                bg-[#E75480]
                px-7
                py-3
                text-xs
                uppercase
                tracking-[2px]
                text-white
                transition
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
      {/* ===================================================
          SEO
      =================================================== */}

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

          The FeaturedProducts component handles:
          - first 6 fallback
          - click ranking
          - desktop carousel
          - mobile swipe
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
          bg-[#FFF5F8]
          px-4
          py-16

          sm:px-6
          sm:py-20

          lg:px-10
          lg:py-24
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

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
              text-[#E75480]
            "
          >
            Shop The Collection
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-4xl
              text-[#3A2A2F]

              sm:text-5xl

              lg:text-[54px]
            "
          >
            All Products
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-[#8A6F78]

              sm:text-base
            "
          >
            Discover premium beauty and
            skincare essentials carefully
            selected for your everyday beauty
            routine.
          </p>
        </div>

        {/* =================================================
            EMPTY PRODUCTS
        ================================================= */}

        {products.length === 0 ? (
          <div
            className="
              mx-auto
              mt-14
              max-w-2xl
              rounded-[30px]
              bg-white
              px-6
              py-16
              text-center
              shadow-sm
            "
          >
            <h2
              className="
                font-serif
                text-3xl
                text-[#3A2A2F]
              "
            >
              Products coming soon
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-[#8A6F78]
              "
            >
              Our beauty collection is being
              prepared. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {/* ===============================================
                DESKTOP / TABLET

                Hidden below md.
            =============================================== */}

            <div className="hidden md:block">
              {/* PRODUCT COUNT */}

              <div
                className="
                  mx-auto
                  mt-14
                  flex
                  max-w-7xl
                  items-center
                  justify-between
                "
              >
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[3px]
                    text-[#A88993]
                  "
                >
                  {products.length}{" "}
                  {products.length === 1
                    ? "Product"
                    : "Products"}
                </p>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[3px]
                    text-[#A88993]
                  "
                >
                  Page {desktopPage} of{" "}
                  {desktopTotalPages}
                </p>
              </div>

              {/* GRID */}

              <div
                className="
                  mx-auto
                  mt-7
                  grid
                  max-w-7xl
                  grid-cols-2
                  gap-6

                  lg:grid-cols-3

                  xl:grid-cols-4
                "
              >
                {desktopProducts.map(
                  (product) => (
                    <article
                      key={product._id}
                      className="
                        group
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-[#F4E4EA]
                        bg-white
                        shadow-[0_10px_30px_rgba(112,72,87,0.05)]
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_18px_45px_rgba(112,72,87,0.10)]
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
                            bg-[#FDF0F4]
                          "
                        >
                          {product
                            .images?.[0] ? (
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
                                duration-500
                                group-hover:scale-105
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
                                text-[#B2949E]
                              "
                            >
                              No image available
                            </div>
                          )}

                          {product.featured && (
                            <span
                              className="
                                absolute
                                left-4
                                top-4
                                rounded-full
                                bg-white/90
                                px-3
                                py-1.5
                                text-[8px]
                                uppercase
                                tracking-[2px]
                                text-[#E75480]
                                shadow-sm
                                backdrop-blur-sm
                              "
                            >
                              Featured
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* CONTENT */}

                      <div className="p-5">
                        <p
                          className="
                            truncate
                            text-[9px]
                            uppercase
                            tracking-[3px]
                            text-[#E75480]
                          "
                        >
                          {product.productCategory?.name}
                        </p>

                        <Link
                          to={`/products/${product._id}`}
                        >
                          <h2
                            className="
                              mt-2
                              truncate
                              font-serif
                              text-2xl
                              text-[#3A2A2F]
                              transition
                              hover:text-[#E75480]
                            "
                          >
                            {product.name}
                          </h2>
                        </Link>

                        {product.brand && (
                          <p
                            className="
                              mt-1
                              truncate
                              text-[11px]
                              text-[#B0949D]
                            "
                          >
                            {product.brand}
                          </p>
                        )}

                        <p
                          className="
                            mt-3
                            line-clamp-2
                            min-h-[42px]
                            text-xs
                            leading-5
                            text-[#8A6F78]
                          "
                        >
                          {product.description}
                        </p>

                        {/* PRICE */}

                        <div
                          className="
                            mt-5
                            flex
                            items-end
                            justify-between
                            gap-3
                          "
                        >
                          <div>
                            <p
                              className="
                                font-serif
                                text-2xl
                                font-semibold
                                text-[#E75480]
                              "
                            >
                              ${product.price}
                            </p>

                            <p
                              className={`
                                mt-1
                                text-[10px]

                                ${
                                  product.stock >
                                  0
                                    ? "text-[#A48B94]"
                                    : "text-red-400"
                                }
                              `}
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </p>
                          </div>
                        </div>

                        {/* BUTTONS */}

                        <div
                          className="
                            mt-5
                            flex
                            gap-2
                          "
                        >
                          <Link
                            to={`/products/${product._id}`}
                            className="
                              flex-1
                              rounded-full
                              border
                              border-[#E75480]/20
                              bg-[#FFF5F8]
                              px-3
                              py-3
                              text-center
                              text-[9px]
                              uppercase
                              tracking-[1.5px]
                              text-[#E75480]
                              transition
                              hover:bg-[#FCE7EF]
                            "
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            disabled={
                              product.stock <= 0
                            }
                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }
                            className="
                              flex-1
                              rounded-full
                              bg-[#E75480]
                              px-3
                              py-3
                              text-[9px]
                              uppercase
                              tracking-[1.5px]
                              text-white
                              transition
                              hover:bg-[#D63C6D]

                              disabled:cursor-not-allowed
                              disabled:bg-[#D9BFC7]
                            "
                          >
                            {product.stock > 0
                              ? "Add"
                              : "Sold Out"}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>

              {/* =============================================
                  DESKTOP PAGINATION
              ============================================= */}

              {desktopTotalPages > 1 && (
                <div
                  className="
                    mt-12
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      desktopPage === 1
                    }
                    onClick={() =>
                      changeDesktopPage(
                        desktopPage - 1
                      )
                    }
                    aria-label="Previous page"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E75480]/20
                      bg-white
                      text-lg
                      text-[#E75480]
                      transition
                      hover:bg-[#FFF0F5]

                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    ‹
                  </button>

                  {Array.from(
                    {
                      length:
                        desktopTotalPages,
                    },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        changeDesktopPage(
                          page
                        )
                      }
                      className={`
                        flex
                        h-10
                        min-w-10
                        items-center
                        justify-center
                        rounded-full
                        px-3
                        text-xs
                        transition

                        ${
                          desktopPage ===
                          page
                            ? "bg-[#E75480] text-white"
                            : "border border-[#E75480]/20 bg-white text-[#E75480] hover:bg-[#FFF0F5]"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      desktopPage ===
                      desktopTotalPages
                    }
                    onClick={() =>
                      changeDesktopPage(
                        desktopPage + 1
                      )
                    }
                    aria-label="Next page"
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E75480]/20
                      bg-white
                      text-lg
                      text-[#E75480]
                      transition
                      hover:bg-[#FFF0F5]

                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* ===============================================
                MOBILE PRODUCTS

                Up to 10 products per page.
                Swipe horizontally.
            =============================================== */}

            <div
              id="mobile-products"
              className="
                mt-10
                scroll-mt-24
                md:hidden
              "
            >
              {/* COUNT */}

              <div
                className="
                  mb-5
                  flex
                  items-center
                  justify-between
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[2px]
                    text-[#A88993]
                  "
                >
                  {products.length} Products
                </p>

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[2px]
                    text-[#A88993]
                  "
                >
                  {mobilePage}/
                  {mobileTotalPages}
                </p>
              </div>

              {/* SWIPE CONTAINER */}

              <div
                className="
                  -mx-4
                  flex
                  snap-x
                  snap-mandatory
                  gap-4
                  overflow-x-auto
                  px-4
                  pb-6

                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {mobileProducts.map(
                  (product) => (
                    <article
                      key={product._id}
                      className="
                        w-[78vw]
                        max-w-[300px]
                        flex-none
                        snap-center
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-[#F4E4EA]
                        bg-white
                        shadow-[0_10px_30px_rgba(112,72,87,0.06)]
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
                            aspect-square
                            overflow-hidden
                            bg-[#FDF0F4]
                          "
                        >
                          {product
                            .images?.[0] ? (
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
                                text-xs
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
                                left-3
                                top-3
                                rounded-full
                                bg-white/90
                                px-3
                                py-1.5
                                text-[8px]
                                uppercase
                                tracking-[1.5px]
                                text-[#E75480]
                              "
                            >
                              Featured
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* CONTENT */}

                      <div className="p-5">
                        <p
                          className="
                            truncate
                            text-[8px]
                            uppercase
                            tracking-[2.5px]
                            text-[#E75480]
                          "
                        >
                          {product.productCategory?.name}
                        </p>

                        <Link
                          to={`/products/${product._id}`}
                        >
                          <h2
                            className="
                              mt-2
                              truncate
                              font-serif
                              text-2xl
                              text-[#3A2A2F]
                            "
                          >
                            {product.name}
                          </h2>
                        </Link>

                        {product.brand && (
                          <p
                            className="
                              mt-1
                              truncate
                              text-[10px]
                              text-[#B0949D]
                            "
                          >
                            {product.brand}
                          </p>
                        )}

                        <p
                          className="
                            mt-3
                            line-clamp-2
                            min-h-[40px]
                            text-xs
                            leading-5
                            text-[#8A6F78]
                          "
                        >
                          {product.description}
                        </p>

                        <div
                          className="
                            mt-5
                            flex
                            items-end
                            justify-between
                          "
                        >
                          <div>
                            <p
                              className="
                                font-serif
                                text-2xl
                                font-semibold
                                text-[#E75480]
                              "
                            >
                              ${product.price}
                            </p>

                            <p
                              className="
                                mt-1
                                text-[9px]
                                text-[#A48B94]
                              "
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </p>
                          </div>
                        </div>

                        <div
                          className="
                            mt-5
                            flex
                            gap-2
                          "
                        >
                          <Link
                            to={`/products/${product._id}`}
                            className="
                              flex-1
                              rounded-full
                              border
                              border-[#E75480]/20
                              bg-[#FFF5F8]
                              py-3
                              text-center
                              text-[9px]
                              uppercase
                              tracking-[1.5px]
                              text-[#E75480]
                            "
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            disabled={
                              product.stock <= 0
                            }
                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }
                            className="
                              flex-1
                              rounded-full
                              bg-[#E75480]
                              py-3
                              text-[9px]
                              uppercase
                              tracking-[1.5px]
                              text-white

                              disabled:cursor-not-allowed
                              disabled:bg-[#D9BFC7]
                            "
                          >
                            {product.stock > 0
                              ? "Add"
                              : "Sold"}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>

              {/* SWIPE TEXT */}

              <p
                className="
                  text-center
                  text-[8px]
                  uppercase
                  tracking-[4px]
                  text-[#B2949E]
                "
              >
                Swipe to explore
              </p>

              {/* =============================================
                  MOBILE 10-PRODUCT GROUP PAGINATION
              ============================================= */}

              {mobileTotalPages > 1 && (
                <div
                  className="
                    mt-7
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      mobilePage === 1
                    }
                    onClick={() =>
                      changeMobilePage(
                        mobilePage - 1
                      )
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E75480]/20
                      bg-white
                      text-[#E75480]

                      disabled:opacity-30
                    "
                    aria-label="Previous product group"
                  >
                    ‹
                  </button>

                  {Array.from(
                    {
                      length:
                        mobileTotalPages,
                    },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        changeMobilePage(page)
                      }
                      aria-label={`Product page ${page}`}
                      className={`
                        h-2
                        rounded-full
                        transition-all

                        ${
                          mobilePage === page
                            ? "w-7 bg-[#E75480]"
                            : "w-2 bg-[#E8CAD4]"
                        }
                      `}
                    />
                  ))}

                  <button
                    type="button"
                    disabled={
                      mobilePage ===
                      mobileTotalPages
                    }
                    onClick={() =>
                      changeMobilePage(
                        mobilePage + 1
                      )
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E75480]/20
                      bg-white
                      text-[#E75480]

                      disabled:opacity-30
                    "
                    aria-label="Next product group"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}