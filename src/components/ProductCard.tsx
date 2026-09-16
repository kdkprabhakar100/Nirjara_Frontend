import { Link } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      
      <div className="h-72 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        <p className="text-sm text-[#C77A95]">
          {product.category}
        </p>

        <h2 className="mt-2 font-serif text-xl text-[#3A2A2F]">
          {product.name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-[#8A6F78]">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-lg font-semibold text-[#E75480]">
            ${product.price}
          </p>

          <Link
            to={`/products/${product._id}`}
            className="rounded-full bg-[#E75480] px-4 py-2 text-sm text-white transition hover:bg-[#d63c6d]"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}