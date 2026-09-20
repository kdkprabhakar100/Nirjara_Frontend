import {
  MapPin,
  Clock3,
  Phone,
} from "lucide-react";

export type BranchCardProps = {
  number: string;
  name: string;
  tag?: string;
  address: string;
  hours: string;
  phone: string;
  mapUrl?: string;
  status?: string;
};

export default function BranchCard({
  number,
  name,
  tag,
  address,
  hours,
  phone,
  mapUrl,
  status = "Closed",
}: BranchCardProps) {
  return (
    <article
      className="
        relative
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-[26px]
        border
        border-[#E75480]/15
        bg-white

        px-5
        py-6

        sm:px-7
        sm:py-7

        md:rounded-[30px]
        md:px-9
        md:py-9

        lg:h-full
        lg:min-h-[500px]
        lg:px-7
        lg:py-8

        xl:px-8
        xl:py-9

        transition-all
        duration-300
        hover:border-[#E75480]/25
        hover:shadow-[0_18px_55px_rgba(58,42,47,0.07)]
      "
    >
      {/* ========================================
          TOP ROW
      ======================================== */}
      <div className="flex items-start justify-between gap-4">

        {/* NUMBER */}
        <span
          className="
            font-serif
            text-[44px]
            leading-none
            text-[#E75480]/12

            sm:text-[50px]
            md:text-[56px]
            lg:text-[52px]
          "
        >
          {number}
        </span>

        {/* STATUS */}
        {status && (
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
              text-[8px]
              font-medium
              uppercase
              tracking-[1.7px]
              text-[#8E737C]
            "
          >
            <span className="h-[6px] w-[6px] rounded-full bg-[#CDA8B4]" />

            {status}
          </span>
        )}
      </div>

      {/* ========================================
          BRANCH NAME
      ======================================== */}
      <h3
        className="
          mt-5
          font-serif
          text-[27px]
          leading-[1.08]
          text-[#3A2A2F]

          sm:text-[30px]
          md:text-[34px]
          lg:text-[29px]
          xl:text-[31px]
        "
      >
        {name}
      </h3>

      {/* ========================================
          BRANCH TAG
      ======================================== */}
      {tag && (
        <span
          className="
            mt-4
            w-fit
            rounded-full
            bg-[#D93668]
            px-4
            py-[7px]
            text-[8px]
            font-semibold
            uppercase
            tracking-[2px]
            text-white
          "
        >
          {tag}
        </span>
      )}

      {/* DIVIDER */}
      <div className="my-6 h-px w-full bg-[#E75480]/15" />

      {/* ========================================
          DETAILS
      ======================================== */}
      <div
        className="
          space-y-4
          text-[#8D737C]
        "
      >
        {/* LOCATION */}
        <div className="flex items-start gap-3">
          <MapPin
            strokeWidth={1.8}
            className="
              mt-[2px]
              h-[17px]
              w-[17px]
              shrink-0
              text-[#E75480]
            "
          />

          <p
            className="
              text-[13px]
              leading-[1.7]
              sm:text-[14px]
              md:text-[15px]
              lg:text-[13px]
              xl:text-[14px]
            "
          >
            {address}
          </p>
        </div>

        {/* TIME */}
        <div className="flex items-start gap-3">
          <Clock3
            strokeWidth={1.8}
            className="
              mt-[2px]
              h-[17px]
              w-[17px]
              shrink-0
              text-[#E75480]
            "
          />

          <p
            className="
              text-[13px]
              leading-[1.7]
              sm:text-[14px]
              md:text-[15px]
              lg:text-[13px]
              xl:text-[14px]
            "
          >
            {hours}
          </p>
        </div>

        {/* PHONE */}
        <div className="flex items-start gap-3">
          <Phone
            strokeWidth={1.8}
            className="
              mt-[2px]
              h-[17px]
              w-[17px]
              shrink-0
              text-[#E75480]
            "
          />

          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="
              text-[13px]
              leading-[1.7]
              text-[#8D737C]
              underline
              decoration-[#E75480]/20
              underline-offset-4
              transition-colors
              duration-200

              hover:text-[#E75480]

              sm:text-[14px]
              md:text-[15px]
              lg:text-[13px]
              xl:text-[14px]
            "
          >
            {phone}
          </a>
        </div>
      </div>

      {/* ========================================
          BUTTONS

          lg:mt-auto makes desktop cards align
          their buttons at the same level.
      ======================================== */}
      <div
        className="
          mt-7
          flex
          flex-col
          gap-3

          sm:flex-row

          lg:mt-auto
          lg:pt-8
        "
      >
        {/* GET DIRECTIONS */}
        <a
          href={mapUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            inline-flex
            min-h-[46px]
            flex-1
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#E75480]
            px-5
            text-center
            text-[8px]
            font-semibold
            uppercase
            tracking-[1.8px]
            text-white
            shadow-[0_10px_25px_rgba(231,84,128,0.18)]
            transition-all
            duration-300

            hover:-translate-y-[2px]
            hover:bg-[#D94773]
            hover:shadow-[0_14px_30px_rgba(231,84,128,0.28)]

            sm:text-[9px]
          "
        >
          <MapPin
            className="
              h-[15px]
              w-[15px]
              shrink-0
              transition-transform
              duration-300
              group-hover:-translate-y-[1px]
            "
          />

          Get Directions
        </a>

        {/* CALL */}
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="
            group
            inline-flex
            min-h-[46px]
            flex-1
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#E75480]/25
            bg-white
            px-5
            text-center
            text-[8px]
            font-semibold
            uppercase
            tracking-[1.8px]
            text-[#E75480]
            transition-all
            duration-300

            hover:border-[#E75480]
            hover:bg-[#FFF7FA]

            sm:text-[9px]
          "
        >
          <Phone
            className="
              h-[15px]
              w-[15px]
              shrink-0
              transition-transform
              duration-300
              group-hover:rotate-[-8deg]
            "
          />

          Call Us
        </a>
      </div>
    </article>
  );
}