import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

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
  featured: boolean;
  brand: string;

  // Analytics
  views?: number;
  cartCount?: number;
  salesCount?: number;
};

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch product (${res.status})`);
      }

      const data = await res.json();

      // Supports both:
      // { ...product }
      // { data: { ...product } }
      // { product: { ...product } }

      const productData =
        data?.product ??
        data?.data ??
        data;

      setProduct(productData);
    } catch (error) {
      console.error("PRODUCT FETCH ERROR:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD PRODUCT
  ========================================================= */

  useEffect(() => {
    fetchProduct();
  }, [id]);

  /* =========================================================
     TRACK PRODUCT VIEW
  ========================================================= */

  useEffect(() => {
    if (!id) return;

    /*
      Prevent duplicate views in the same browser tab.

      This is especially useful because React StrictMode
      can run effects twice during development.
    */

    const viewKey = `nirjara-product-view-${id}`;

    const alreadyViewed =
      sessionStorage.getItem(viewKey);

    if (alreadyViewed) return;

    const trackView = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}/view`,
          {
            method: "POST",
          }
        );

        if (res.ok) {
          sessionStorage.setItem(viewKey, "1");
        } else {
          console.warn(
            `View tracking failed: ${res.status}`
          );
        }
      } catch (error) {
        console.error(
          "Failed to track product view:",
          error
        );
      }
    };

    trackView();
  }, [id]);

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );
      return;
    }

    /*
      Add to local cart FIRST.

      Analytics should never prevent
      the customer from adding something.
    */

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

    /* Track cart action */

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}/cart`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        console.warn(
          `Cart tracking failed: ${res.status}`
        );
      }
    } catch (error) {
      console.error(
        "Failed to track add to cart:",
        error
      );
    }
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = async () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );
      return;
    }

    /*
      For now Buy Now adds the product to the cart.

      Later we can navigate directly to checkout.
    */

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

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${product._id}/cart`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Failed to track Buy Now:",
        error
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF5F8] pt-32">
        <p className="text-lg text-[#8A6F78]">
          Loading product...
        </p>
      </section>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF5F8] pt-32">
        <p className="text-lg text-[#8A6F78]">
          Product not found
        </p>
      </section>
    );
  }

  /* =========================================================
     SEO
  ========================================================= */

  const seoDescription =
    product.description.length > 155
      ? `${product.description.slice(0, 152)}...`
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

  const outOfStock = product.stock <= 0;

  return (
    <>
      {/* =====================================================
          DYNAMIC PRODUCT SEO
      ===================================================== */}

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

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <section className="min-h-screen bg-[#FFF5F8] px-4 pb-20 pt-32 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14">

          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="overflow-hidden rounded-[26px] bg-white shadow-sm sm:rounded-[32px]">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="
                  h-full
                  min-h-[350px]
                  w-full
                  object-cover
                  transition
                  duration-500
                  hover:scale-105

                  sm:min-h-[450px]
                  lg:min-h-[600px]
                "
              />
            ) : (
              <div className="flex min-h-[350px] items-center justify-center bg-[#FCECF1] sm:min-h-[450px] lg:min-h-[600px]">
                <span className="font-serif text-8xl text-[#E75480]/20">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="flex flex-col justify-center">

            {/* CATEGORY */}

            <p className="text-[10px] uppercase tracking-[4px] text-[#E75480] sm:text-xs sm:tracking-[5px]">
              {product.productCategory?.name}
            </p>

            {/* NAME */}

            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#3A2A2F] sm:mt-5 sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 text-[15px] leading-8 text-[#8A6F78] sm:mt-8 sm:text-lg sm:leading-9">
              {product.description}
            </p>

            {/* =================================================
                PRICE + STOCK
            ================================================= */}

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-6">

              <p className="font-serif text-4xl font-semibold text-[#E75480] sm:text-5xl">
                ${product.price}
              </p>

              <span
                className={`
                  rounded-full
                  px-5
                  py-2
                  text-sm

                  ${
                    outOfStock
                      ? "bg-[#EFE4E7] text-[#A17F89]"
                      : "bg-[#FCE7EF] text-[#E75480]"
                  }
                `}
              >
                {outOfStock
                  ? "Out of Stock"
                  : `Stock: ${product.stock}`}
              </span>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-4">

              {/* ADD TO CART */}

              <button
                type="button"
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="
                  rounded-full
                  bg-[#E75480]
                  px-8
                  py-4
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  text-white
                  transition
                  hover:bg-[#d63c6d]

                  disabled:cursor-not-allowed
                  disabled:bg-[#E7CBD3]
                  disabled:text-white/80

                  sm:text-sm
                  sm:tracking-[3px]
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
                onClick={handleBuyNow}
                className="
                  rounded-full
                  border
                  border-[#E75480]/20
                  bg-white
                  px-8
                  py-4
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  text-[#E75480]
                  transition
                  hover:border-[#E75480]/40
                  hover:bg-[#FFF0F5]

                  disabled:cursor-not-allowed
                  disabled:opacity-40

                  sm:text-sm
                  sm:tracking-[3px]
                "
              >
                Buy Now
              </button>
            </div>

            {/* =================================================
                EXTRA INFO
            ================================================= */}

            <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">

              {/* BRAND */}

              <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <p className="text-[9px] uppercase tracking-[3px] text-[#E75480] sm:text-xs sm:tracking-[4px]">
                  Brand
                </p>

                <h3 className="mt-3 font-serif text-xl text-[#3A2A2F] sm:text-2xl">
                  {product.brand ||
                    "Nirjara Beauty"}
                </h3>
              </div>

              {/* CARE */}

              <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <p className="text-[9px] uppercase tracking-[3px] text-[#E75480] sm:text-xs sm:tracking-[4px]">
                  Premium Care
                </p>

                <h3 className="mt-3 font-serif text-xl text-[#3A2A2F] sm:text-2xl">
                  Luxury Beauty Product
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}