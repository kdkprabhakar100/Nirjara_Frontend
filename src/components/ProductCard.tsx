import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

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
};

type Props = {
  product: Product;
};

export default function ProductCard({
  product,
}: Props) {
  const image =
    product.images?.[0] || "/placeholder-product.jpg";

  const category =
    product.productCategory?.name || "Beauty";

  const formattedPrice = Number(
    product.price
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[20px]
        border
        border-[#E75480]/10
        bg-white

        shadow-[0_8px_30px_rgba(72,42,53,0.05)]

        transition-all
        duration-500
        ease-out

        hover:-translate-y-1
        hover:border-[#E75480]/20
        hover:shadow-[0_18px_45px_rgba(72,42,53,0.10)]
      "
    >
      {/* ==========================================
          IMAGE
      ========================================== */}

      <Link
        to={`/products/${product._id}`}
        aria-label={`View ${product.name}`}
        className="
          relative
          block
          aspect-square
          overflow-hidden
          bg-[#FCEEF3]
        "
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover

            transition-transform
            duration-700
            ease-out

            group-hover:scale-[1.045]
          "
          onError={(event) => {
            event.currentTarget.src =
              "/placeholder-product.jpg";
          }}
        />

        {/* subtle image overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-[#3A2A2F]/10
            via-transparent
            to-transparent

            opacity-0
            transition-opacity
            duration-500

            group-hover:opacity-100
          "
        />

        {/* CATEGORY BADGE */}

        <span
          className="
            absolute
            left-3
            top-3

            max-w-[70%]
            truncate

            rounded-full
            border
            border-white/70
            bg-white/90

            px-3
            py-1.5

            text-[8px]
            font-semibold
            uppercase
            tracking-[1.6px]
            text-[#E75480]

            shadow-sm
            backdrop-blur-sm
          "
        >
          {category}
        </span>

        {/* DESKTOP HOVER VIEW */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-3
            right-3

            hidden
            h-9
            w-9
            items-center
            justify-center

            rounded-full
            bg-white
            text-[#E75480]

            opacity-0
            shadow-[0_5px_20px_rgba(58,42,47,0.12)]

            transition-all
            duration-300

            group-hover:translate-y-0
            group-hover:opacity-100

            md:flex
            md:translate-y-2
          "
        >
          <ArrowUpRight size={15} />
        </div>
      </Link>

      {/* ==========================================
          PRODUCT INFORMATION
      ========================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          px-4
          pb-4
          pt-4

          sm:px-5
          sm:pb-5
        "
      >
        {/* CATEGORY */}

        <p
          className="
            truncate
            text-[8px]
            font-semibold
            uppercase
            tracking-[2px]
            text-[#E75480]
          "
        >
          {category}
        </p>

        {/* NAME */}

        <Link
          to={`/products/${product._id}`}
          className="mt-2 block"
        >
          <h2
            className="
              line-clamp-1
              font-serif
              text-[18px]
              leading-tight
              text-[#3A2A2F]

              transition-colors
              duration-300

              group-hover:text-[#E75480]

              sm:text-[19px]
            "
          >
            {product.name}
          </h2>
        </Link>

        {/* DESCRIPTION */}

        {product.description && (
          <p
            className="
              mt-2
              line-clamp-2
              min-h-[40px]

              text-[12px]
              leading-5
              text-[#8A6F78]
            "
          >
            {product.description}
          </p>
        )}

        {/* SPACER */}

        <div className="flex-1" />

        {/* PRICE + VIEW */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3

            border-t
            border-[#E75480]/10
            pt-4
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[1.5px]
                text-[#B89CA5]
              "
            >
              Price
            </p>

            <p
              className="
                mt-0.5
                font-serif
                text-[19px]
                font-semibold
                text-[#3A2A2F]
              "
            >
              ${formattedPrice}
            </p>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              gap-1.5

              rounded-full
              bg-[#FCE8EF]

              px-4

              text-[9px]
              font-semibold
              uppercase
              tracking-[1.4px]
              text-[#E75480]

              transition-all
              duration-300

              hover:bg-[#E75480]
              hover:text-white
            "
          >
            View

            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}