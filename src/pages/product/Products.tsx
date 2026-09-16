import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="min-h-screen bg-[#FFF5F8] px-4 pb-20 pt-32 sm:px-6 lg:px-10">

      {/* HEADER */}
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs uppercase tracking-[5px] text-[#E75480]">
          Luxury Beauty Collection
        </p>

        <h1 className="mt-4 font-serif text-5xl text-[#3A2A2F] sm:text-6xl">
          Our Products
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#8A6F78]">
          Discover premium beauty and skincare essentials
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div
        className="
          mx-auto
          mt-16
          grid
          max-w-7xl
          gap-8
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="
              overflow-hidden
              rounded-[30px]
              bg-white
              shadow-sm
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "
          >

            {/* IMAGE */}
            <Link to={`/products/${product._id}`}>
              <div className="overflow-hidden bg-[#FFF5F8]">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="
                    h-[280px]
                    w-full
                    object-cover
                    transition
                    duration-500
                    hover:scale-105
                  "
                />
              </div>
            </Link>

            {/* CONTENT */}
            <div className="p-6">

              <p className="text-[10px] uppercase tracking-[4px] text-[#E75480]">
                {product.category}
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#3A2A2F]">
                {product.name}
              </h2>

              <p className="mt-4 line-clamp-2 text-sm leading-7 text-[#8A6F78]">
                {product.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-3xl font-semibold text-[#E75480]">
                  ${product.price}
                </p>

                <p className="text-sm text-[#8A6F78]">
                  Stock: {product.stock}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">

                {/* DETAILS */}
                <Link
                  to={`/products/${product._id}`}
                  className="
                    flex-1
                    rounded-full
                    border
                    border-[#E75480]/20
                    bg-[#FFF5F8]
                    px-4
                    py-3
                    text-center
                    text-[11px]
                    uppercase
                    tracking-[2px]
                    text-[#E75480]
                    transition
                    hover:bg-[#FCE7EF]
                  "
                >
                  View
                </Link>

                {/* ADD TO CART */}
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
                    flex-1
                    rounded-full
                    bg-[#E75480]
                    px-4
                    py-3
                    text-[11px]
                    uppercase
                    tracking-[2px]
                    text-white
                    transition
                    hover:bg-[#d63c6d]
                  "
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}