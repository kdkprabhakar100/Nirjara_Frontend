import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  brand: string;
};

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );

      const data = await res.json();

      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF5F8] pt-32">
        <p className="text-lg text-[#8A6F78]">
          Loading product...
        </p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FFF5F8] pt-32">
        <p className="text-lg text-[#8A6F78]">
          Product not found
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FFF5F8] px-4 pb-20 pt-32 sm:px-6 lg:px-10">

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-500
              hover:scale-105
            "
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-center">

          <p className="text-xs uppercase tracking-[5px] text-[#E75480]">
            {product.category}
          </p>

          <h1 className="mt-5 font-serif text-5xl text-[#3A2A2F] sm:text-6xl">
            {product.name}
          </h1>

          <p className="mt-8 text-lg leading-9 text-[#8A6F78]">
            {product.description}
          </p>

          <div className="mt-10 flex items-center gap-6">

            <p className="text-5xl font-semibold text-[#E75480]">
              ${product.price}
            </p>

            <span className="rounded-full bg-[#FCE7EF] px-5 py-2 text-sm text-[#E75480]">
              Stock: {product.stock}
            </span>
          </div>

          {/* BUTTONS */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">

            <button
              onClick={() => {
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
              }}
              className="
                rounded-full
                bg-[#E75480]
                px-8
                py-4
                text-sm
                uppercase
                tracking-[3px]
                text-white
                transition
                hover:bg-[#d63c6d]
              "
            >
              Add to Cart
            </button>

            <button
              className="
                rounded-full
                border
                border-[#E75480]/20
                bg-white
                px-8
                py-4
                text-sm
                uppercase
                tracking-[3px]
                text-[#E75480]
                transition
                hover:bg-[#FFF0F5]
              "
            >
              Buy Now
            </button>
          </div>

          {/* EXTRA INFO */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2">

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
                Brand
              </p>

              <h3 className="mt-3 font-serif text-2xl text-[#3A2A2F]">
                {product.brand || "Nirjara Beauty"}
              </h3>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[4px] text-[#E75480]">
                Premium Care
              </p>

              <h3 className="mt-3 font-serif text-2xl text-[#3A2A2F]">
                Luxury Beauty Product
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}