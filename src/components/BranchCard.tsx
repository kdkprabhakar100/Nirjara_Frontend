import {
  MapPin,
  Clock3,
  Phone,
} from "lucide-react";

export type BranchCardProps = {
  number: string;
  name: string;
  label?: string;
  address: string;
  openingHours?: string;
  phone?: string;
  mapUrl?: string;
  active?: boolean;
};

export default function BranchCard({
  number,
  name,
  label,
  address,
  openingHours,
  phone,
  mapUrl,
  active = true,
}: BranchCardProps) {
  return (
    <article
      className="
        relative
        flex
        h-full
        w-full
        flex-col
        overflow-hidden

        rounded-[24px]
        border
        border-[#E75480]/15
        bg-white

        px-5
        py-6

        sm:px-6
        sm:py-7

        lg:min-h-[440px]
        lg:px-5
        lg:py-6

        xl:min-h-[460px]
        xl:px-6
        xl:py-7

        transition-all
        duration-300

        hover:-translate-y-[2px]
        hover:border-[#E75480]/25
        hover:shadow-[0_18px_55px_rgba(58,42,47,0.07)]
      "
    >
      {/* ========================================
          TOP ROW
      ======================================== */}

      <div className="flex items-start justify-between gap-3">

        {/* NUMBER */}

        <span
          className="
            font-serif
            text-[42px]
            leading-none
            text-[#E75480]/12

            sm:text-[48px]

            lg:text-[42px]

            xl:text-[48px]
          "
        >
          {number}
        </span>

        {/* STATUS */}

        <span
          className="
            mt-1
            inline-flex
            shrink-0
            items-center
            gap-2

            rounded-full
            bg-[#F8F3F5]

            px-3
            py-2

            text-[7px]
            font-medium
            uppercase
            tracking-[1.6px]
            text-[#8E737C]
          "
        >
          <span
            className={`
              h-[6px]
              w-[6px]
              rounded-full

              ${
                active
                  ? "bg-[#E75480]"
                  : "bg-[#CDA8B4]"
              }
            `}
          />

          {active
            ? "Open"
            : "Closed"}
        </span>
      </div>

      {/* ========================================
          BRANCH NAME
      ======================================== */}

      <h3
        className="
          mt-5
          font-serif
          text-[25px]
          leading-[1.08]
          text-[#3A2A2F]

          sm:text-[28px]

          lg:text-[23px]

          xl:text-[27px]
        "
      >
        {name}
      </h3>

      {/* ========================================
          BRANCH TAG
      ======================================== */}

      {label && (
        <span
          className="
            mt-4
            w-fit
            rounded-full
            bg-[#D93668]

            px-4
            py-[7px]

            text-[7px]
            font-semibold
            uppercase
            tracking-[1.8px]
            text-white
          "
        >
          {label}
        </span>
      )}

      {/* DIVIDER */}

      <div className="my-5 h-px w-full bg-[#E75480]/15" />

      {/* ========================================
          DETAILS
      ======================================== */}

      <div className="space-y-4 text-[#8D737C]">

        {/* LOCATION */}

        <div className="flex items-start gap-3">
          <MapPin
            strokeWidth={1.8}
            className="
              mt-[2px]
              h-[16px]
              w-[16px]
              shrink-0
              text-[#E75480]
            "
          />

          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-[12px]
                leading-[1.7]
                text-[#8D737C]
                transition-colors
                duration-200

                hover:text-[#E75480]

                sm:text-[13px]

                xl:text-[14px]
              "
            >
              {address}
            </a>
          ) : (
            <p
              className="
                text-[12px]
                leading-[1.7]

                sm:text-[13px]

                xl:text-[14px]
              "
            >
              {address}
            </p>
          )}
        </div>

        {/* OPENING HOURS */}

        {openingHours && (
          <div className="flex items-start gap-3">
            <Clock3
              strokeWidth={1.8}
              className="
                mt-[2px]
                h-[16px]
                w-[16px]
                shrink-0
                text-[#E75480]
              "
            />

            <p
              className="
                text-[12px]
                leading-[1.7]

                sm:text-[13px]

                xl:text-[14px]
              "
            >
              {openingHours}
            </p>
          </div>
        )}

        {/* PHONE */}

        {phone && (
          <div className="flex items-start gap-3">
            <Phone
              strokeWidth={1.8}
              className="
                mt-[2px]
                h-[16px]
                w-[16px]
                shrink-0
                text-[#E75480]
              "
            />

            <a
              href={`tel:${phone.replace(
                /\s/g,
                ""
              )}`}
              className="
                text-[12px]
                leading-[1.7]
                text-[#8D737C]

                underline
                decoration-[#E75480]/20
                underline-offset-4

                transition-colors
                duration-200

                hover:text-[#E75480]

                sm:text-[13px]

                xl:text-[14px]
              "
            >
              {phone}
            </a>
          </div>
        )}
      </div>

      {/* ========================================
          BUTTONS
      ======================================== */}

      <div
        className="
          mt-auto
          flex
          flex-col
          gap-2.5
          pt-7

          sm:flex-row

          lg:flex-col

          xl:flex-row
        "
      >
        {/* GET DIRECTIONS */}

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              inline-flex
              min-h-[44px]
              flex-1
              items-center
              justify-center
              gap-2

              rounded-full
              bg-[#E75480]

              px-4

              text-center
              text-[7px]
              font-semibold
              uppercase
              tracking-[1.5px]
              text-white

              shadow-[0_10px_25px_rgba(231,84,128,0.18)]

              transition-all
              duration-300

              hover:-translate-y-[2px]
              hover:bg-[#D94773]
              hover:shadow-[0_14px_30px_rgba(231,84,128,0.28)]

              xl:text-[8px]
            "
          >
            <MapPin
              className="
                h-[14px]
                w-[14px]
                shrink-0
                transition-transform
                duration-300

                group-hover:-translate-y-[1px]
              "
            />

            Get Directions
          </a>
        )}

        {/* CALL */}

        {phone && (
          <a
            href={`tel:${phone.replace(
              /\s/g,
              ""
            )}`}
            className="
              group
              inline-flex
              min-h-[44px]
              flex-1
              items-center
              justify-center
              gap-2

              rounded-full
              border
              border-[#E75480]/25
              bg-white

              px-4

              text-center
              text-[7px]
              font-semibold
              uppercase
              tracking-[1.5px]
              text-[#E75480]

              transition-all
              duration-300

              hover:-translate-y-[2px]
              hover:border-[#E75480]
              hover:bg-[#FFF7FA]

              xl:text-[8px]
            "
          >
            <Phone
              className="
                h-[14px]
                w-[14px]
                shrink-0
                transition-transform
                duration-300

                group-hover:rotate-[-8deg]
              "
            />

            Call Us
          </a>
        )}
      </div>
    </article>
  );
}