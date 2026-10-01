import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type ServiceCardProps = {
  title: string;
  description: string;
  price: string;
  image?: string;
  // Opens the booking page with this
  // service already selected.
  serviceId?: string;
  // Switched off in the admin panel: the
  // card stays visible but cannot be booked.
  available?: boolean;
};

export default function ServiceCard({
  title,
  description,
  price,
  image,
  serviceId,
  available = true,
}: ServiceCardProps) {
  const navigate = useNavigate();

  const book = () => {
    navigate(
      serviceId
        ? `/booking?service=${encodeURIComponent(serviceId)}`
        : "/booking"
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-[#E75480]/10
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* IMAGE */}

      <div className="relative h-[240px] overflow-hidden sm:h-[250px] lg:h-[260px]">
        <img
          src={image || "/images/salon.png"}
          alt={title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {!available && (
          <div className="absolute left-4 top-4 rounded-full bg-[#3A2A2F]/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-white">
            Not available
          </div>
        )}

        {/* PRICE */}

        <div className="absolute bottom-4 right-4 rounded-full bg-white px-5 py-2 text-xs font-medium text-[#E75480] shadow-sm">
          {price}
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-serif text-2xl text-[#3A2A2F] sm:text-[27px]">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#8A6F78]">
          {description}
        </p>

        <div className="mt-auto pt-6">
          {available ? (
            <button
              type="button"
              onClick={book}
              className="
                w-full
                rounded-full
                bg-[#E75480]
                px-6
                py-3.5
                text-xs
                font-semibold
                uppercase
                tracking-[2px]
                text-white
                transition-all
                duration-300
                hover:bg-[#d94873]
              "
            >
              Book Now
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="
                w-full
                cursor-not-allowed
                rounded-full
                bg-[#F4F1F2]
                px-6
                py-3.5
                text-xs
                font-semibold
                uppercase
                tracking-[2px]
                text-[#A98D96]
              "
            >
              Currently Not Available
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}