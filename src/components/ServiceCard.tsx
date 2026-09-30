import { motion } from "framer-motion";

type ServiceCardProps = {
  title: string;
  description: string;
  price: string;
  image?: string;
};

export default function ServiceCard({
  title,
  description,
  price,
  image,
}: ServiceCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.45,
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
      {/* ===================================================
          IMAGE
      =================================================== */}

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
          src={
            image ||
            "/images/salon.png"
          }
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

        {/* ===============================================
            PRICE
        =============================================== */}

        <div
          className="
            absolute
            bottom-2
            right-2

            max-w-[calc(100%-16px)]

            truncate

            rounded-full

            bg-white/95

            px-2.5
            py-1.5

            text-[9px]
            font-medium
            text-[#E75480]

            shadow-sm
            backdrop-blur-sm

            sm:bottom-3
            sm:right-3
            sm:px-4
            sm:py-2
            sm:text-[11px]

            lg:bottom-4
            lg:right-4
            lg:px-5
            lg:text-xs
          "
        >
          {price}
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

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
        {/* TITLE */}

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

        {/* DESCRIPTION */}

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

        {/* =================================================
            BUTTON
        ================================================= */}

        <div
          className="
            mt-auto
            pt-4

            sm:pt-5

            lg:pt-6
          "
        >
          <button
            type="button"
            className="
              w-full

              rounded-full

              bg-[#E75480]

              px-2
              py-2.5

              text-[8px]
              font-semibold
              uppercase
              tracking-[1px]
              text-white

              transition-all
              duration-300

              hover:bg-[#D94873]

              active:scale-[0.98]

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
          </button>
        </div>
      </div>
    </motion.article>
  );
}