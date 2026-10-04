import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

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

  productCategory?: {
    _id: string;
    name: string;
  } | null;

  images: string[];

  stock: number;

  featured: boolean;

  brand: string;

  views?: number;

  cartCount?: number;

  salesCount?: number;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedImage, setSelectedImage] =
    useState(0);

  /* =======================================================
     FETCH PRODUCT
  ======================================================= */

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/products/${id}`,
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch product (${res.status})`,
        );
      }

      const data = await res.json();

      const productData =
        data?.product ??
        data?.data ??
        data;

      setProduct(productData);

      setSelectedImage(0);
    } catch (error) {
      console.error(
        "PRODUCT FETCH ERROR:",
        error,
      );

      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD PRODUCT
  ======================================================= */

  useEffect(() => {
    fetchProduct();
  }, [id]);

  /* =======================================================
     TRACK PRODUCT VIEW
  ======================================================= */

  useEffect(() => {
    if (!id) return;

    const viewKey =
      `nirjara-product-view-${id}`;

    const alreadyViewed =
      sessionStorage.getItem(viewKey);

    if (alreadyViewed) return;

    const trackView = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/products/${id}/view`,
          {
            method: "POST",
          },
        );

        if (res.ok) {
          sessionStorage.setItem(
            viewKey,
            "1",
          );
        } else {
          console.warn(
            `View tracking failed: ${res.status}`,
          );
        }
      } catch (error) {
        console.error(
          "Failed to track product view:",
          error,
        );
      }
    };

    trackView();
  }, [id]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error(
        "This product is currently out of stock.",
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

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/products/${product._id}/cart`,
        {
          method: "POST",
        },
      );

      if (!res.ok) {
        console.warn(
          `Cart tracking failed: ${res.status}`,
        );
      }
    } catch (error) {
      console.error(
        "Failed to track add to cart:",
        error,
      );
    }
  };

  /* =======================================================
     BUY NOW
  ======================================================= */

/* =======================================================
   BUY NOW
======================================================= */

const handleBuyNow = async () => {
  if (!product) return;

  if (product.stock <= 0) {
    toast.error(
      "This product is currently out of stock.",
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

  try {
    const res = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/products/${product._id}/cart`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      console.warn(
        `Buy Now tracking failed: ${res.status}`,
      );
    }
  } catch (error) {
    console.error(
      "Failed to track Buy Now:",
      error,
    );
  }

  navigate("/cart");
};

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section
        className="
          min-h-screen
          bg-[#FFFAFC]
          px-4
          pb-12
          pt-24

          sm:px-6
          sm:pt-28

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-5xl
            gap-7

            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-10
          "
        >
          <div
            className="
              aspect-[4/3]
              animate-pulse
              rounded-[18px]
              bg-[#F7E9EE]
            "
          />

          <div
            className="
              flex
              flex-col
              justify-center
            "
          >
            <div
              className="
                h-3
                w-24
                animate-pulse
                rounded-full
                bg-[#F2DCE4]
              "
            />

            <div
              className="
                mt-4
                h-9
                w-3/4
                animate-pulse
                rounded-xl
                bg-[#F2DCE4]
              "
            />

            <div
              className="
                mt-4
                h-14
                animate-pulse
                rounded-xl
                bg-[#F7E9EE]
              "
            />
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!product) {
    return (
      <section
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FFFAFC]
          px-4
          pt-24
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
              text-3xl
              text-[#3A2A2F]
            "
          >
            Product not found
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#8A6F78]
            "
          >
            This product may no longer be available.
          </p>

          <Link
            to="/products"
            className="
              mt-6
              inline-flex
              rounded-full
              bg-[#3A2A2F]
              px-6
              py-3
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-white
              transition
              hover:bg-[#E75480]
            "
          >
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  /* =======================================================
     SEO
  ======================================================= */

  const seoDescription =
    product.description.length > 155
      ? `${product.description.slice(
          0,
          152,
        )}...`
      : product.description;

  const seoKeywords = [
    product.name,
    product.productCategory?.name,
    product.brand,
    "Nirjara Beauty",
    "beauty products Kathmandu",
    "beauty products Nepal",
  ]
    .filter(Boolean)
    .join(", ");

  const outOfStock =
    product.stock <= 0;

  const images =
    product.images?.filter(Boolean) ?? [];

  const currentImage =
    images[selectedImage] ??
    images[0];

  /* =======================================================
     STRUCTURED DATA
  ======================================================= */

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    description: product.description,

    image: images,

    category:
      product.productCategory?.name,

    brand: {
      "@type": "Brand",

      name:
        product.brand ||
        "Nirjara Beauty",
    },

    offers: {
      "@type": "Offer",

      priceCurrency: "NPR",

      price: Number(
        product.price,
      ).toFixed(2),

      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",

      url:
        typeof window !== "undefined"
          ? window.location.href
          : `/products/${product._id}`,
    },
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <SEO
        title={`${product.name} | Nirjara Beauty Kathmandu`}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`/products/${product._id}`}
        image={
          product.images?.[0] ||
          "/images/nirjara-og.jpg"
        }
        type="product"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productSchema,
          ),
        }}
      />

      <section
        className="
          min-h-screen
          bg-[#FFFAFC]

          px-4
          pb-8
          pt-24

          sm:px-6
          sm:pb-12
          sm:pt-28

          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
          "
        >
          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div
            className="
              mb-4

              flex
              items-center
              gap-2

              text-[6px]
              font-medium
              uppercase
              tracking-[0.16em]

              text-[#A88993]

              sm:text-[7px]
            "
          >
            <Link
              to="/products"
              className="
                transition-colors
                hover:text-[#E75480]
              "
            >
              Products
            </Link>

            <span>/</span>

            <span
              className="
                max-w-[220px]
                truncate
                text-[#C77A95]
              "
            >
              {product.name}
            </span>
          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div
            className="
              grid
              items-start
              gap-5

              sm:gap-7

              lg:grid-cols-[0.85fr_1.15fr]
              lg:gap-10

              xl:gap-12
            "
          >
            {/* =================================================
                IMAGE
            ================================================= */}

            <div
              className="
                min-w-0

                lg:sticky
                lg:top-28
              "
            >
              <div
                className="
                  mx-auto

                  max-w-[400px]

                  overflow-hidden

                  rounded-[18px]

                  border
                  border-[#EADDE2]

                  bg-white

                  shadow-[0_6px_18px_rgba(58,42,47,0.035)]

                  sm:max-w-[460px]
                  sm:rounded-[20px]
                "
              >
                {currentImage ? (
                  <div
                    className="
                      aspect-[4/3]
                      overflow-hidden
                      bg-[#F7ECEF]
                    "
                  >
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="
                        h-full
                        w-full
                        object-cover

                        transition-transform
                        duration-700

                        hover:scale-[1.02]
                      "
                    />
                  </div>
                ) : (
                  <div
                    className="
                      flex
                      aspect-[4/3]
                      items-center
                      justify-center

                      bg-gradient-to-br
                      from-[#FCECF1]
                      to-[#FFF8FA]
                    "
                  >
                    <span
                      className="
                        font-serif
                        text-5xl
                        text-[#E75480]/20

                        sm:text-6xl
                      "
                    >
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* =================================================
                  THUMBNAILS
              ================================================= */}

              {images.length > 1 && (
                <div
                  className="
                    mx-auto
                    mt-2.5

                    flex

                    max-w-[400px]

                    gap-2
                    overflow-x-auto
                    pb-1

                    sm:max-w-[460px]
                  "
                >
                  {images.map(
                    (
                      image,
                      imageIndex,
                    ) => (
                      <button
                        key={`${image}-${imageIndex}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            imageIndex,
                          )
                        }
                        aria-label={`View product image ${
                          imageIndex + 1
                        }`}
                        className={`
                          h-12
                          w-12

                          shrink-0
                          overflow-hidden

                          rounded-[9px]

                          border
                          bg-white

                          transition-all

                          sm:h-14
                          sm:w-14

                          ${
                            selectedImage ===
                            imageIndex
                              ? "border-[#E75480] shadow-[0_3px_10px_rgba(231,84,128,0.15)]"
                              : "border-[#E8D9DE] hover:border-[#D9B6C2]"
                          }
                        `}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${
                            imageIndex + 1
                          }`}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                PRODUCT INFO
            ================================================= */}

            <div
              className="
                flex
                min-w-0
                flex-col

                lg:pt-1
              "
            >
              {/* CATEGORY */}

              {product.productCategory
                ?.name && (
                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]

                    text-[#E75480]

                    sm:text-[8px]
                  "
                >
                  {
                    product
                      .productCategory
                      .name
                  }
                </p>
              )}

              {/* TITLE */}

              <h1
                className="
                  mt-2.5

                  max-w-[600px]

                  font-serif

                  text-[26px]
                  leading-[1.08]
                  tracking-[-0.02em]

                  text-[#3A2A2F]

                  sm:text-[34px]

                  lg:text-[40px]

                  xl:text-[42px]
                "
              >
                {product.name}
              </h1>

              {/* BRAND */}

              <p
                className="
                  mt-2

                  text-[8px]
                  uppercase
                  tracking-[0.14em]

                  text-[#A58C95]

                  sm:text-[9px]
                "
              >
                {product.brand ||
                  "Nirjara Beauty"}
              </p>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-3

                  max-w-[600px]

                  text-[12px]
                  leading-5

                  text-[#806B73]

                  sm:text-[14px]
                  sm:leading-7
                "
              >
                {product.description}
              </p>

              {/* DIVIDER */}

              <div
                className="
                  my-3
                  h-px
                  bg-[#3A2A2F]/10

                  sm:my-4
                "
              />

              {/* =================================================
                  PRICE + STOCK
              ================================================= */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2.5

                  sm:gap-3
                "
              >
                <p
                  className="
                    font-serif

                    text-[26px]
                    font-semibold
                    leading-none

                    text-[#E75480]

                    sm:text-[34px]
                  "
                >
                  $
                  {Number(
                    product.price,
                  ).toFixed(2)}
                </p>

                <span
                  className={`
                    rounded-full

                    px-2.5
                    py-1

                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]

                    sm:px-3
                    sm:py-1.5
                    sm:text-[7px]

                    ${
                      outOfStock
                        ? "bg-[#F1E8EB] text-[#9C7F88]"
                        : "bg-[#FCE7EF] text-[#D94876]"
                    }
                  `}
                >
                  {outOfStock
                    ? "Out of stock"
                    : `${product.stock} in stock`}
                </span>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div
                className="
                  mt-4

                  grid
                  gap-2.5

                  sm:grid-cols-2
                  sm:gap-3
                "
              >
                {/* ADD TO CART */}

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={
                    handleAddToCart
                  }
                  className="
                    flex
                    min-h-[42px]
                    items-center
                    justify-center

                    rounded-full

                    bg-[#3A2A2F]

                    px-5
                    py-2.5

                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]

                    text-white

                    transition-all
                    duration-300

                    hover:-translate-y-[1px]
                    hover:bg-[#E75480]
                    hover:shadow-[0_6px_16px_rgba(231,84,128,0.16)]

                    active:translate-y-0
                    active:scale-[0.985]

                    disabled:cursor-not-allowed
                    disabled:bg-[#D8C9CE]
                    disabled:shadow-none

                    sm:min-h-[44px]
                    sm:text-[8px]
                  "
                >
                  {outOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>

                {/* BUY NOW */}

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={
                    handleBuyNow
                  }
                  className="
                    flex
                    min-h-[42px]
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[#DCCBD1]

                    bg-white

                    px-5
                    py-2.5

                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]

                    text-[#3A2A2F]

                    transition-all
                    duration-300

                    hover:border-[#E75480]
                    hover:bg-[#FFF7F9]
                    hover:text-[#E75480]

                    active:scale-[0.985]

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    sm:min-h-[44px]
                    sm:text-[8px]
                  "
                >
                  Buy Now
                </button>
              </div>

              {/* =================================================
                  DETAILS
              ================================================= */}

              <div
                className="
                  mt-4

                  rounded-[14px]

                  border
                  border-[#E8D9DE]

                  bg-white

                  px-3.5
                  py-3

                  shadow-[0_3px_10px_rgba(58,42,47,0.02)]

                  sm:rounded-[16px]
                  sm:px-4
                  sm:py-3.5
                "
              >
                <div
                  className="
                    grid
                    gap-3

                    sm:grid-cols-2
                    sm:gap-0
                  "
                >
                  {/* BRAND */}

                  <div
                    className="
                      sm:border-r
                      sm:border-[#E8D9DE]
                      sm:pr-4
                    "
                  >
                    <p
                      className="
                        text-[6px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]

                        text-[#C77A95]
                      "
                    >
                      Brand
                    </p>

                    <p
                      className="
                        mt-1

                        font-serif
                        text-[13px]

                        text-[#3A2A2F]

                        sm:text-[14px]
                      "
                    >
                      {product.brand ||
                        "Nirjara Beauty"}
                    </p>
                  </div>

                  {/* CATEGORY */}

                  <div
                    className="
                      sm:pl-4
                    "
                  >
                    <p
                      className="
                        text-[6px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]

                        text-[#C77A95]
                      "
                    >
                      Category
                    </p>

                    <p
                      className="
                        mt-1

                        font-serif
                        text-[13px]

                        text-[#3A2A2F]

                        sm:text-[14px]
                      "
                    >
                      {product
                        .productCategory
                        ?.name ||
                        "Beauty Product"}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  BACK
              ================================================= */}

              <Link
                to="/products#all-products"
                className="
                  mt-3.5

                  inline-flex
                  w-fit
                  items-center

                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]

                  text-[#A88993]

                  transition-colors

                  hover:text-[#E75480]

                  sm:mt-4
                  sm:text-[7px]
                "
              >
                ← Back to all products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}