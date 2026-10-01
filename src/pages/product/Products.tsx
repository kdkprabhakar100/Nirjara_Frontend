import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

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
   PAGINATION
========================================================= */

const PRODUCTS_PER_PAGE = 8;

/* =========================================================
   PRODUCT CARD
========================================================= */

type ProductCardProps = {
  product: Product;
  mobile?: boolean;
  onAddToCart: (product: Product) => void;
};

function ProductCard({
  product,
  mobile = false,
  onAddToCart,
}: ProductCardProps) {
  const image = product.images?.[0];

  return (
    <article
      className={`
        group
        overflow-hidden
        bg-white
        shadow-[0_6px_24px_rgba(58,42,47,0.06)]
        transition-all
        duration-300

        ${
          mobile
            ? `
              w-[68vw]
              max-w-[270px]
              flex-none
              snap-start
              rounded-[20px]
            `
            : `
              rounded-[22px]
              hover:-translate-y-1
              hover:shadow-[0_14px_35px_rgba(58,42,47,0.10)]
            `
        }
      `}
    >
      {/* IMAGE */}
      <Link
        to={`/products/${product._id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div
          className={`
            relative
            overflow-hidden
            bg-[#FCECF1]

            ${
              mobile
                ? "h-[205px]"
                : "h-[220px] md:h-[230px] xl:h-[240px]"
            }
          `}
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.04]
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
                from-[#FCECF1]
                to-[#F7DDE5]
              "
            >
              <span className="font-serif text-5xl text-[#E75480]/20">
                {product.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {product.stock <= 0 && (
            <div
              className="
                absolute
                right-3
                top-3
                rounded-full
                bg-white/95
                px-2.5
                py-1.5
                text-[7px]
                font-semibold
                uppercase
                tracking-[1.3px]
                text-[#8A6F78]
                shadow-sm
                backdrop-blur
              "
            >
              Out of stock
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className={mobile ? "p-4" : "p-5"}>
        {/* CATEGORY */}

        <p
          className="
            truncate
            text-[8px]
            font-semibold
            uppercase
            tracking-[2.5px]
            text-[#E75480]
          "
        >
          {product.productCategory?.name}
        </p>

        {/* PRODUCT NAME */}

        <Link to={`/products/${product._id}`}>
          <h2
            className="
              mt-2
              line-clamp-1
              font-serif
              text-[21px]
              leading-tight
              text-[#3A2A2F]
              transition-colors
              duration-300
              hover:text-[#E75480]
              md:text-[22px]
            "
          >
            {product.name}
          </h2>
        </Link>

        {/* DESCRIPTION */}

        <p
          className="
            mt-2
            line-clamp-2
            min-h-[40px]
            text-[11px]
            leading-5
            text-[#8A6F78]
            md:text-[12px]
          "
        >
          {product.description}
        </p>

        {/* PRICE + STOCK */}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p
            className="
              font-serif
              text-[21px]
              font-semibold
              leading-none
              text-[#E75480]
            "
          >
            ${product.price}
          </p>

          <p
            className={`
              text-[9px]
              font-medium

              ${
                product.stock > 0
                  ? "text-[#8A6F78]"
                  : "text-[#C28A9A]"
              }
            `}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Unavailable"}
          </p>
        </div>

        {/* BUTTONS */}

        <div className="mt-4 flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="
              flex
              h-[38px]
              flex-1
              items-center
              justify-center
              rounded-full
              border
              border-[#E75480]/20
              bg-[#FFF5F8]
              px-3
              text-[8px]
              font-semibold
              uppercase
              tracking-[1.4px]
              text-[#E75480]
              transition
              hover:border-[#E75480]/40
              hover:bg-[#FCE7EF]
            "
          >
            View
          </Link>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
            className="
              flex
              h-[38px]
              flex-1
              items-center
              justify-center
              rounded-full
              bg-[#E75480]
              px-3
              text-[8px]
              font-semibold
              uppercase
              tracking-[1.4px]
              text-white
              transition-all
              duration-300
              hover:bg-[#D94370]
              active:scale-[0.97]
              disabled:cursor-not-allowed
              disabled:bg-[#E7CBD3]
            "
          >
            {product.stock > 0 ? "Add" : "Sold Out"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart } = useCart();

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch products (${res.status})`
        );
      }

      const data = await res.json();

      const productList: Product[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setProducts(productList);
    } catch (error) {
      console.error("PRODUCT FETCH ERROR:", error);

      setError(
        "We couldn't load the products right now."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.ceil(
    products.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const start =
      (currentPage - 1) * PRODUCTS_PER_PAGE;

    return products.slice(
      start,
      start + PRODUCTS_PER_PAGE
    );
  }, [products, currentPage]);

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =======================================================
     CHANGE PAGE
  ======================================================= */

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.setTimeout(() => {
      document
        .getElementById("products-grid")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;

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

  return (
    <>
      {/* SEO */}

      <SEO
        title={PRODUCTS_SEO.title}
        description={PRODUCTS_SEO.description}
        keywords={PRODUCTS_SEO.keywords}
        canonical={PRODUCTS_SEO.canonical}
        image={PRODUCTS_SEO.image}
        type="website"
      />

      <section
        className="
          min-h-screen
          bg-[#FFF5F8]
          pb-16
          pt-28
          sm:pb-20
          sm:pt-32
          lg:pt-36
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            text-center
            sm:px-6
            lg:px-10
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
              sm:tracking-[5px]
            "
          >
            Luxury Beauty Collection
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-[36px]
              leading-tight
              text-[#3A2A2F]
              sm:text-5xl
              lg:text-[54px]
            "
          >
            Our Products
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-[13px]
              leading-6
              text-[#8A6F78]
              sm:mt-4
              sm:text-sm
            "
          >
            Discover premium beauty and skincare essentials
            selected for your everyday beauty routine.
          </p>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
              px-4
              text-sm
              text-[#8A6F78]
            "
          >
            Loading products...
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="mx-auto mt-14 max-w-lg px-4 text-center">
            <p className="text-sm text-[#8A6F78]">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
              className="
                mt-5
                rounded-full
                bg-[#E75480]
                px-6
                py-3
                text-[9px]
                font-semibold
                uppercase
                tracking-[2px]
                text-white
                transition
                hover:bg-[#D94370]
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div
              className="
                mx-auto
                mt-14
                max-w-lg
                px-4
                text-center
              "
            >
              <p className="font-serif text-2xl text-[#3A2A2F]">
                Products coming soon.
              </p>

              <p
                className="
                  mt-3
                  text-[13px]
                  leading-6
                  text-[#8A6F78]
                "
              >
                Our beauty collection will be available
                here soon.
              </p>
            </div>
          )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              {/* =============================================
                  MOBILE MANUAL SCROLLER
              ============================================= */}

              <div className="mt-8 sm:hidden">
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    px-4
                  "
                >
                  <p
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[2px]
                      text-[#9B7F88]
                    "
                  >
                    {products.length}{" "}
                    {products.length === 1
                      ? "product"
                      : "products"}
                  </p>

                  {products.length > 1 && (
                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[2px]
                        text-[#E75480]
                      "
                    >
                      Swipe →
                    </p>
                  )}
                </div>

                <div
                  className="
                    flex
                    snap-x
                    snap-mandatory
                    gap-3
                    overflow-x-auto
                    overscroll-x-contain
                    px-4
                    pb-5

                    [-ms-overflow-style:none]
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      mobile
                      onAddToCart={handleAddToCart}
                    />
                  ))}

                  <div
                    aria-hidden="true"
                    className="w-[1px] flex-none"
                  />
                </div>
              </div>

              {/* =============================================
                  TABLET + DESKTOP GRID
              ============================================= */}

              <div
                id="products-grid"
                className="
                  mx-auto
                  mt-10
                  hidden
                  max-w-[1180px]
                  scroll-mt-28
                  grid-cols-2
                  gap-5
                  px-6

                  sm:grid

                  lg:grid-cols-3
                  lg:gap-6
                  lg:px-8

                  xl:grid-cols-4
                "
              >
                {paginatedProducts.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={
                        handleAddToCart
                      }
                    />
                  )
                )}
              </div>

              {/* =============================================
                  PAGINATION
              ============================================= */}

              {totalPages > 1 && (
                <div
                  className="
                    mx-auto
                    mt-10
                    hidden
                    items-center
                    justify-center
                    gap-2
                    px-6
                    sm:flex
                  "
                >
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      changePage(currentPage - 1)
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
                      border-[#E75480]/20
                      bg-white
                      text-[#E75480]
                      transition
                      hover:border-[#E75480]
                      hover:bg-[#E75480]
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    ←
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    { length: totalPages },
                    (_, index) => {
                      const page = index + 1;
                      const active =
                        page === currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() =>
                            changePage(page)
                          }
                          aria-label={`Go to page ${page}`}
                          aria-current={
                            active
                              ? "page"
                              : undefined
                          }
                          className={`
                            flex
                            h-9
                            min-w-9
                            items-center
                            justify-center
                            rounded-full
                            px-2.5
                            text-[10px]
                            font-semibold
                            transition-all

                            ${
                              active
                                ? `
                                  bg-[#E75480]
                                  text-white
                                `
                                : `
                                  border
                                  border-[#E75480]/15
                                  bg-white
                                  text-[#8A6F78]
                                  hover:border-[#E75480]/40
                                  hover:text-[#E75480]
                                `
                            }
                          `}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      changePage(currentPage + 1)
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
                      border-[#E75480]/20
                      bg-white
                      text-[#E75480]
                      transition
                      hover:border-[#E75480]
                      hover:bg-[#E75480]
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    →
                  </button>
                </div>
              )}

              {/* PAGE NUMBER */}

              {totalPages > 1 && (
                <p
                  className="
                    mt-3
                    hidden
                    text-center
                    text-[8px]
                    uppercase
                    tracking-[2px]
                    text-[#A98D96]
                    sm:block
                  "
                >
                  Page {currentPage} of{" "}
                  {totalPages}
                </p>
              )}
            </>
          )}
      </section>
    </>
  );
}