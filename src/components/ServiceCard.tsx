
import { motion } from "framer-motion";
import { Link } from "react-router";

/* ============================================================
   PROPS
============================================================ */

type ServiceCardProps = {
  title: string;
  description: string;
  startingPrice: number;
  maxPrice?: number | null;
  image?: string;
  serviceId?: string;
  available?: boolean;
};

/* ============================================================
   PRICE FORMATTER
============================================================ */

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 0,
  }).format(value);
}

/* ============================================================
   SERVICE CARD
============================================================ */

export default function ServiceCard({
  title,
  description,
  startingPrice,
  maxPrice,
  image,
  serviceId,
  available = true,
}: ServiceCardProps) {
  /* ==========================================================
     BOOKING URL
  ========================================================== */

  const bookingUrl = serviceId
    ? `/booking?service=${encodeURIComponent(serviceId)}`
    : "/booking";

  /* ==========================================================
     PRICE VALIDATION
  ========================================================== */

  const validStartingPrice =
    typeof startingPrice === "number" &&
    Number.isFinite(startingPrice) &&
    startingPrice >= 0;

  const validMaxPrice =
    typeof maxPrice === "number" &&
    Number.isFinite(maxPrice) &&
    maxPrice > startingPrice;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <motion.article
      initial={false}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-[#E75480]/10
        bg-white
        shadow-[0_5px_20px_rgba(117,71,87,0.05)]
        transition-shadow
        duration-300
        hover:shadow-[0_12px_35px_rgba(117,71,87,0.12)]
        sm:rounded-[24px]
        lg:rounded-[28px]
      "
    >
      {/* ======================================================
          SERVICE IMAGE
      ====================================================== */}

      <div
        className="
          relative
          h-[150px]
          overflow-hidden
          sm:h-[210px]
          md:h-[220px]
          lg:h-[230px]
          xl:h-[240px]
        "
      >
        <img
          src={image || "/images/salon.png"}
          alt={title || "Nirjara Beauty Salon service"}
          loading="lazy"
          decoding="async"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {/* ====================================================
            UNAVAILABLE LABEL
        ==================================================== */}

        {!available && (
          <div
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-[#3A2A2F]/85
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[1.5px]
              text-white
              backdrop-blur-sm
              sm:left-4
              sm:top-4
              sm:px-4
              sm:text-[10px]
              sm:tracking-[2px]
            "
          >
            Not Available
          </div>
        )}

        {/* ====================================================
            FLOATING PRICE LABEL
        ==================================================== */}

        {validStartingPrice && (
          <div
            className="
              absolute
              bottom-3
              right-3
              rounded-[14px]
              border
              border-white/70
              bg-white/95
              px-3.5
              py-2
              shadow-[0_5px_18px_rgba(58,42,47,0.10)]
              backdrop-blur-md
              sm:bottom-4
              sm:right-4
              sm:px-4
              sm:py-2.5
            "
          >
            <div className="flex flex-col items-start gap-[1px]">
              <p
                className="
                  whitespace-nowrap
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[1.4px]
                  leading-none
                  text-[#A98994]
                  sm:text-[7px]
                "
              >
                Starting From
              </p>

              <p
                className="
                  whitespace-nowrap
                  font-serif
                  text-[13px]
                  font-semibold
                  leading-none
                  text-[#E75480]
                  sm:text-[15px]
                  lg:text-[16px]
                "
              >
                Rs. {formatPrice(startingPrice)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          SERVICE CONTENT
      ====================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-3
          sm:p-5
          lg:p-6
        "
      >
        {/* SERVICE TITLE */}

        <h3
          className="
            line-clamp-2
            font-serif
            text-[17px]
            leading-[1.2]
            text-[#3A2A2F]
            sm:text-xl
            lg:text-2xl
          "
        >
          {title}
        </h3>

        {/* SERVICE DESCRIPTION */}

        <p
          className="
            mt-2
            line-clamp-2
            text-[10px]
            leading-[1.6]
            text-[#8A6F78]
            sm:mt-3
            sm:line-clamp-3
            sm:text-xs
            sm:leading-6
            lg:text-sm
            lg:leading-7
          "
        >
          {description}
        </p>

        {/* ====================================================
            PRICE RANGE
        ==================================================== */}

        {validStartingPrice && (
          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
              text-[9px]
              sm:mt-4
              sm:text-[10px]
            "
          >
            <span className="font-medium text-[#E75480]">
              From Rs. {formatPrice(startingPrice)}
            </span>

            {validMaxPrice && (
              <>
                <span
                  className="text-[#D7C4CA]"
                  aria-hidden="true"
                >
                  •
                </span>

                <span className="text-[#8A6F78]">
                  Up to Rs. {formatPrice(maxPrice)}
                </span>
              </>
            )}
          </div>
        )}

        {/* ====================================================
            BOOKING ACTION
        ==================================================== */}

        <div
          className="
            mt-auto
            pt-4
            sm:pt-5
            lg:pt-6
          "
        >
          {available ? (
            <Link
              to={bookingUrl}
              aria-label={`Book ${title}`}
              className="
                block
                w-full
                rounded-full
                bg-[#E75480]
                px-2
                py-2.5
                text-center
                text-[8px]
                font-semibold
                uppercase
                tracking-[1px]
                text-white
                transition-all
                duration-300
                hover:bg-[#D94873]
                active:scale-[0.98]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#E75480]
                sm:px-4
                sm:py-3
                sm:text-[10px]
                sm:tracking-[1.5px]
                lg:px-6
                lg:py-3.5
                lg:text-xs
                lg:tracking-[2px]
              "
            >
              Book Now
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="
                w-full
                cursor-not-allowed
                rounded-full
                bg-[#F4F1F2]
                px-2
                py-2.5
                text-[8px]
                font-semibold
                uppercase
                tracking-[1px]
                text-[#A98D96]
                sm:px-4
                sm:py-3
                sm:text-[10px]
                sm:tracking-[1.5px]
                lg:px-6
                lg:py-3.5
                lg:text-xs
                lg:tracking-[2px]
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
