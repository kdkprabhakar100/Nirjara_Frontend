import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

/* ============================================================
   TYPES
============================================================ */

interface EventType {
  _id: string;

  title: string;
  description: string;
  image: string;

  branchId?: string | null;

  locationType?:
    | "branch"
    | "custom";

  location: string;
  mapUrl?: string;

  date: string;
  time: string;

  buttonText: string;
  buttonLink: string;

  featured: boolean;
}

interface BranchType {
  _id: string;

  name: string;
  label?: string;

  address: string;

  phone?: string;
  openingHours?: string;

  mapUrl?: string;

  active?: boolean;
}

/* ============================================================
   ICONS
============================================================ */

function CalendarIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
      />

      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function ClockIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LocationIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />

      <circle
        cx="12"
        cy="10"
        r="3"
      />
    </svg>
  );
}

function ArrowIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />

      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function ExternalLinkIcon({
  className = "h-3 w-3",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />

      <path d="M10 14 21 3" />

      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/* ============================================================
   DATE
============================================================ */

function formatDate(
  date: string
) {
  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleDateString(
    undefined,
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

/* ============================================================
   NORMALIZE LOCATION

   Makes these match:

   "Chabahil , kathmandu"
   "Chabahil, Kathmandu"
   "  Chabahil,   Kathmandu "
============================================================ */

function normalizeLocation(
  value?: string
) {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        " "
      )
      .replace(
        /\s*,\s*/g,
        ","
      ) || ""
  );
}

/* ============================================================
   EVENT DETAILS
============================================================ */

const EventDetails = () => {
  const { id } =
    useParams();

  /* ============================================================
     STATE
  ============================================================ */

  const [
    event,
    setEvent,
  ] =
    useState<EventType | null>(
      null
    );

  const [
    relatedEvents,
    setRelatedEvents,
  ] =
    useState<EventType[]>(
      []
    );

  const [
    branches,
    setBranches,
  ] =
    useState<BranchType[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  /* ============================================================
     FETCH EVENT
  ============================================================ */

  const fetchEvent =
    async () => {
      try {
        setLoading(
          true
        );

        const res =
          await axios.get(
            `${
              import.meta.env
                .VITE_API_URL
            }/api/events/${id}`
          );

        setEvent(
          res.data
        );
      } catch (error) {
        console.error(
          "EVENT FETCH ERROR:",
          error
        );

        setEvent(
          null
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ============================================================
     FETCH RELATED EVENTS
  ============================================================ */

  const fetchRelatedEvents =
    async () => {
      try {
        const res =
          await axios.get(
            `${
              import.meta.env
                .VITE_API_URL
            }/api/events`
          );

        const data =
          Array.isArray(
            res.data
          )
            ? res.data
            : [];

        const filtered =
          data.filter(
            (
              item: EventType
            ) =>
              item._id !==
              id
          );

        setRelatedEvents(
          filtered.slice(
            0,
            3
          )
        );
      } catch (error) {
        console.error(
          "RELATED EVENTS ERROR:",
          error
        );

        setRelatedEvents(
          []
        );
      }
    };

  /* ============================================================
     FETCH BRANCHES

     Gets the latest address + mapUrl directly
     from Branch Admin.
  ============================================================ */

  const fetchBranches =
    async () => {
      try {
        const res =
          await axios.get(
            `${
              import.meta.env
                .VITE_API_URL
            }/api/branches`
          );

        const data =
          Array.isArray(
            res.data
          )
            ? res.data
            : res.data
                ?.branches ||
              [];

        setBranches(
          data
        );
      } catch (error) {
        console.error(
          "BRANCH FETCH ERROR:",
          error
        );

        setBranches(
          []
        );
      }
    };

  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {
    fetchEvent();

    fetchRelatedEvents();

    fetchBranches();
  }, [id]);

  /* ============================================================
     FIND EVENT BRANCH

     1. New events:
        match using branchId.

     2. Older events:
        if branchId is missing,
        match event.location against branch.address.
  ============================================================ */

  const getEventBranch = (
    targetEvent: EventType
  ) => {
    /* ------------------------------
       FIRST: MATCH BY BRANCH ID
    ------------------------------ */

    if (
      targetEvent.branchId
    ) {
      const branchById =
        branches.find(
          (branch) =>
            String(
              branch._id
            ) ===
            String(
              targetEvent.branchId
            )
        );

      if (
        branchById
      ) {
        return branchById;
      }
    }

    /* ------------------------------
       FALLBACK: MATCH BY ADDRESS
       FOR OLD EVENTS
    ------------------------------ */

    const eventLocation =
      normalizeLocation(
        targetEvent.location
      );

    if (
      !eventLocation
    ) {
      return null;
    }

    const branchByAddress =
      branches.find(
        (branch) =>
          normalizeLocation(
            branch.address
          ) ===
          eventLocation
      );

    return (
      branchByAddress ||
      null
    );
  };

  /* ============================================================
     CURRENT LOCATION

     If branch matched:
     always use the latest Branch Admin address.

     Otherwise:
     use event.location.
  ============================================================ */

  const getEventLocation = (
    targetEvent: EventType
  ) => {
    const branch =
      getEventBranch(
        targetEvent
      );

    if (
      branch
        ?.address
        ?.trim()
    ) {
      return branch.address.trim();
    }

    return (
      targetEvent.location?.trim() ||
      ""
    );
  };

  /* ============================================================
     CURRENT MAP URL

     If branch matched:
     always use latest Branch Admin mapUrl.

     If custom event:
     use event.mapUrl.
  ============================================================ */

  const getEventMapUrl = (
    targetEvent: EventType
  ) => {
    const branch =
      getEventBranch(
        targetEvent
      );

    /* ------------------------------
       BRANCH MAP URL
    ------------------------------ */

    if (
      branch
        ?.mapUrl
        ?.trim()
    ) {
      return branch.mapUrl.trim();
    }

    /* ------------------------------
       CUSTOM EVENT
    ------------------------------ */

    if (
      targetEvent.locationType ===
      "custom"
    ) {
      return (
        targetEvent.mapUrl?.trim() ||
        ""
      );
    }

    /* ------------------------------
       LEGACY EVENT WITH MAP URL
    ------------------------------ */

    if (
      !targetEvent.branchId &&
      targetEvent.mapUrl?.trim()
    ) {
      return targetEvent.mapUrl.trim();
    }

    return "";
  };

  /* ============================================================
     LOCATION VALUE
  ============================================================ */

  const LocationValue = ({
    targetEvent,
    className = "",
  }: {
    targetEvent: EventType;
    className?: string;
  }) => {
    const location =
      getEventLocation(
        targetEvent
      );

    const mapUrl =
      getEventMapUrl(
        targetEvent
      );

    if (
      !location
    ) {
      return (
        <span
          className={
            className
          }
        >
          Location to be announced
        </span>
      );
    }

    /* ------------------------------
       NO MAP URL
    ------------------------------ */

    if (
      !mapUrl
    ) {
      return (
        <span
          className={
            className
          }
        >
          {location}
        </span>
      );
    }

    /* ------------------------------
       CLICKABLE LOCATION
    ------------------------------ */

    return (
      <a
        href={
          mapUrl
        }
        target="_blank"
        rel="noopener noreferrer"
        title="Open in Google Maps"
        className={`
          ${className}

          inline-flex
          items-center
          gap-1.5

          cursor-pointer

          transition-colors
          duration-300

          hover:text-[#E75480]
          hover:underline
          hover:underline-offset-4
        `}
      >
        <span>
          {location}
        </span>

        <ExternalLinkIcon className="h-3 w-3 shrink-0" />
      </a>
    );
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (
    loading
  ) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center

          bg-[#FFF5F8]
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto

              h-10
              w-10

              animate-spin

              rounded-full

              border-2
              border-[#E75480]/20

              border-t-[#E75480]
            "
          />

          <p
            className="
              mt-5

              text-[9px]
              font-semibold
              uppercase
              tracking-[4px]

              text-[#E75480]
            "
          >
            Loading Event
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (
    !event
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center

          bg-[#FFF5F8]

          px-6

          text-center
        "
      >
        <div>
          <h1 className="font-serif text-4xl text-[#3A2A2F]">
            Event not found
          </h1>

          <Link
            to="/events"
            className="
              mt-6

              inline-flex
              items-center
              gap-2

              text-[9px]
              font-semibold
              uppercase
              tracking-[2.5px]

              text-[#E75480]
            "
          >
            ← Back to Events
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     CURRENT VALUES
  ============================================================ */

  const currentLocation =
    getEventLocation(
      event
    );

  const currentMapUrl =
    getEventMapUrl(
      event
    );

  return (
    <main
      className="
        min-h-screen
        overflow-hidden

        bg-[#FFF5F8]

        text-[#3A2A2F]
      "
    >
      {/* ========================================================
          HERO
      ======================================================== */}

      <section
        className="
          relative

          mt-[72px]

          h-[300px]

          overflow-hidden

          sm:h-[340px]

          md:h-[380px]

          lg:h-[420px]
        "
      >
        <img
          src={
            event.image
          }
          alt={
            event.title
          }
          className="
            absolute
            inset-0

            h-full
            w-full

            object-cover
            object-center
          "
        />

        <div className="absolute inset-0 bg-[#29191F]/40" />

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-t

            from-[#29191F]/60
            via-[#29191F]/15
            to-transparent
          "
        />

        <div
          className="
            relative
            z-10

            mx-auto

            flex
            h-full
            max-w-6xl
            items-center
            justify-center

            px-5

            text-center

            sm:px-8
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="max-w-3xl"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="hidden h-px w-8 bg-[#F48AAA]/70 sm:block" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[4px]

                  text-[#FF9DBA]

                  sm:text-[9px]
                "
              >
                Nirjara Beauty Event
              </p>

              <span className="hidden h-px w-8 bg-[#F48AAA]/70 sm:block" />
            </div>

            <h1
              className="
                mt-4

                font-serif

                text-[38px]
                font-normal
                leading-[0.98]

                tracking-[-1px]

                text-white

                sm:text-[46px]

                md:text-[54px]

                lg:text-[60px]
              "
            >
              {
                event.title
              }
            </h1>

            <p
              className="
                mt-4

                text-[8px]
                font-semibold
                uppercase
                tracking-[3px]

                text-white/80

                sm:text-[9px]
              "
            >
              {formatDate(
                event.date
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          SUMMARY
      ======================================================== */}

      <section
        className="
          relative
          z-20

          mx-auto

          -mt-8

          max-w-6xl

          px-4

          sm:-mt-10
          sm:px-6

          lg:-mt-12
          lg:px-8
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            overflow-hidden

            rounded-[24px]

            border
            border-[#E75480]/10

            bg-white

            shadow-[0_20px_60px_rgba(58,42,47,0.09)]

            sm:rounded-[28px]
          "
        >
          <div className="grid sm:grid-cols-3">
            {/* DATE */}

            <div
              className="
                flex
                items-center
                gap-4

                border-b
                border-[#E75480]/10

                p-5

                sm:border-b-0
                sm:border-r
                sm:p-6

                lg:p-7
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-[#FFF5F8]

                  text-[#E75480]
                "
              >
                <CalendarIcon className="h-[16px] w-[16px]" />
              </div>

              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]

                    text-[#E75480]
                  "
                >
                  Date
                </p>

                <p
                  className="
                    mt-1

                    text-[13px]
                    leading-5

                    text-[#654E56]

                    lg:text-sm
                  "
                >
                  {formatDate(
                    event.date
                  )}
                </p>
              </div>
            </div>

            {/* TIME */}

            <div
              className="
                flex
                items-center
                gap-4

                border-b
                border-[#E75480]/10

                p-5

                sm:border-b-0
                sm:border-r
                sm:p-6

                lg:p-7
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-[#FFF5F8]

                  text-[#E75480]
                "
              >
                <ClockIcon className="h-[16px] w-[16px]" />
              </div>

              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]

                    text-[#E75480]
                  "
                >
                  Time
                </p>

                <p
                  className="
                    mt-1

                    text-[13px]
                    leading-5

                    text-[#654E56]

                    lg:text-sm
                  "
                >
                  {event.time ||
                    "To be announced"}
                </p>
              </div>
            </div>

            {/* LOCATION */}

            <div
              className="
                flex
                items-center
                gap-4

                p-5

                sm:p-6

                lg:p-7
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  bg-[#FFF5F8]

                  text-[#E75480]
                "
              >
                <LocationIcon className="h-[16px] w-[16px]" />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]

                    text-[#E75480]
                  "
                >
                  Location
                </p>

                <LocationValue
                  targetEvent={
                    event
                  }
                  className="
                    mt-1

                    text-[13px]
                    leading-5

                    text-[#654E56]

                    lg:text-sm
                  "
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <section
        className="
          mx-auto
          max-w-6xl

          px-4
          py-12

          sm:px-6
          sm:py-14

          lg:px-8
          lg:py-16
        "
      >
        <div
          className="
            grid
            gap-8

            lg:grid-cols-[1fr_320px]
            lg:gap-10
          "
        >
          {/* DESCRIPTION */}

          <motion.article
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              rounded-[24px]

              border
              border-[#E75480]/10

              bg-white

              p-6

              shadow-[0_12px_40px_rgba(58,42,47,0.05)]

              sm:p-8

              lg:p-10
            "
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#E75480]/50" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[3px]

                  text-[#E75480]
                "
              >
                Event Details
              </p>
            </div>

            <h2
              className="
                mt-5

                font-serif

                text-[30px]
                font-normal
                leading-tight

                text-[#3A2A2F]

                sm:text-[36px]

                md:text-[40px]
              "
            >
              About This{" "}
              <span className="italic text-[#E75480]">
                Event
              </span>
            </h2>

            <p
              className="
                mt-6

                whitespace-pre-line

                text-[14px]
                leading-7

                text-[#8A6F78]

                sm:text-[15px]
                sm:leading-8
              "
            >
              {
                event.description
              }
            </p>
          </motion.article>

          {/* ====================================================
              EVENT INFORMATION
          ==================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: 15,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              h-fit

              rounded-[24px]

              border
              border-[#E75480]/10

              bg-white

              p-6

              shadow-[0_12px_40px_rgba(58,42,47,0.05)]

              lg:sticky
              lg:top-[100px]
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[3px]

                text-[#E75480]
              "
            >
              Event Information
            </p>

            <h3
              className="
                mt-3

                font-serif

                text-[26px]
                leading-tight

                text-[#3A2A2F]
              "
            >
              Join This{" "}
              <span className="italic text-[#E75480]">
                Experience
              </span>
            </h3>

            <p
              className="
                mt-4

                text-[12px]
                leading-6

                text-[#8A6F78]
              "
            >
              Interested in attending
              this event? Use the button
              below for more information
              or registration.
            </p>

            <div
              className="
                mt-6
                space-y-3

                border-t
                border-[#E75480]/10

                pt-5
              "
            >
              {/* DATE */}

              <div className="flex items-start gap-3">
                <CalendarIcon className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#E75480]" />

                <p className="text-[12px] leading-5 text-[#765F68]">
                  {formatDate(
                    event.date
                  )}
                </p>
              </div>

              {/* TIME */}

              {event.time && (
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#E75480]" />

                  <p className="text-[12px] leading-5 text-[#765F68]">
                    {
                      event.time
                    }
                  </p>
                </div>
              )}

              {/* LOCATION */}

              {currentLocation && (
                <div className="flex items-start gap-3">
                  <LocationIcon className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#E75480]" />

                  <LocationValue
                    targetEvent={
                      event
                    }
                    className="
                      text-[12px]
                      leading-5

                      text-[#765F68]
                    "
                  />
                </div>
              )}
            </div>

            {/* MAP BUTTON */}

            {currentMapUrl && (
              <a
                href={
                  currentMapUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6

                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  border
                  border-[#E75480]/25

                  bg-white

                  px-6
                  py-3.5

                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2.2px]

                  text-[#E75480]

                  transition-all
                  duration-300

                  hover:border-[#E75480]
                  hover:bg-[#FFF5F8]
                "
              >
                <LocationIcon className="h-3.5 w-3.5" />

                Open in Maps
              </a>
            )}

            {/* CTA */}

            {event.buttonLink && (
              <Link
                to={
                  event.buttonLink
                }
                className="
                  group

                  mt-3

                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3

                  rounded-full

                  bg-[#E75480]

                  px-6
                  py-4

                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2.4px]

                  text-white

                  shadow-[0_12px_28px_rgba(231,84,128,0.22)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:bg-[#D94773]
                "
              >
                {event.buttonText ||
                  "Learn More"}

                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </motion.aside>
        </div>
      </section>

      {/* ========================================================
          RELATED EVENTS
      ======================================================== */}

      {relatedEvents.length >
        0 && (
        <section
          className="
            border-t
            border-[#E75480]/10

            bg-white

            px-4
            py-14

            sm:px-6
            sm:py-16

            lg:px-8
            lg:py-20
          "
        >
          <div className="mx-auto max-w-7xl">
            <div
              className="
                flex
                flex-col
                gap-5

                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[4px]

                    text-[#E75480]
                  "
                >
                  Discover More
                </p>

                <h2
                  className="
                    mt-3

                    font-serif

                    text-[34px]
                    font-normal
                    leading-tight

                    text-[#3A2A2F]

                    sm:text-[42px]

                    lg:text-[46px]
                  "
                >
                  Related{" "}
                  <span className="italic text-[#E75480]">
                    Events
                  </span>
                </h2>
              </div>

              <Link
                to="/events"
                className="
                  group

                  inline-flex
                  items-center
                  gap-2

                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2px]

                  text-[#8A6F78]

                  transition-colors
                  duration-300

                  hover:text-[#E75480]
                "
              >
                View All Events

                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div
              className="
                mt-9

                grid
                grid-cols-1
                gap-5

                sm:grid-cols-2

                lg:mt-11
                lg:grid-cols-3
                lg:gap-6
              "
            >
              {relatedEvents.map(
                (
                  item,
                  index
                ) => {
                  const relatedLocation =
                    getEventLocation(
                      item
                    );

                  const relatedMapUrl =
                    getEventMapUrl(
                      item
                    );

                  return (
                    <motion.article
                      key={
                        item._id
                      }
                      initial={{
                        opacity:
                          0,
                        y: 15,
                      }}
                      whileInView={{
                        opacity:
                          1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount:
                          0.15,
                      }}
                      transition={{
                        duration:
                          0.4,

                        delay:
                          Math.min(
                            index *
                              0.05,
                            0.15
                          ),
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className="
                        group

                        flex
                        h-full
                        flex-col

                        overflow-hidden

                        rounded-[22px]

                        border
                        border-[#E75480]/10

                        bg-white

                        shadow-[0_8px_28px_rgba(58,42,47,0.045)]
                      "
                    >
                      <Link
                        to={`/events/${item._id}`}
                        className="
                          relative
                          block

                          h-[210px]

                          overflow-hidden

                          sm:h-[220px]

                          lg:h-[230px]
                        "
                      >
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.title
                          }
                          className="
                            h-full
                            w-full

                            object-cover

                            transition-transform
                            duration-700

                            group-hover:scale-[1.04]
                          "
                        />
                      </Link>

                      <div
                        className="
                          flex
                          flex-1
                          flex-col

                          p-5

                          sm:p-6
                        "
                      >
                        <Link
                          to={`/events/${item._id}`}
                        >
                          <h3
                            className="
                              line-clamp-2

                              font-serif

                              text-[24px]
                              leading-[1.08]

                              text-[#3A2A2F]

                              transition-colors
                              duration-300

                              hover:text-[#E75480]
                            "
                          >
                            {
                              item.title
                            }
                          </h3>
                        </Link>

                        <p
                          className="
                            mt-3

                            line-clamp-2

                            text-[12px]
                            leading-5

                            text-[#8A6F78]
                          "
                        >
                          {
                            item.description
                          }
                        </p>

                        <div
                          className="
                            mt-5

                            space-y-2.5

                            border-t
                            border-[#E75480]/10

                            pt-4
                          "
                        >
                          {/* LOCATION */}

                          {relatedLocation && (
                            <div
                              className="
                                flex
                                items-start
                                gap-2.5

                                text-[11px]
                                leading-5

                                text-[#765F68]
                              "
                            >
                              <LocationIcon className="mt-[2px] h-[13px] w-[13px] shrink-0 text-[#E75480]" />

                              {relatedMapUrl ? (
                                <a
                                  href={
                                    relatedMapUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="
                                    inline-flex
                                    min-w-0
                                    items-center
                                    gap-1

                                    transition-colors
                                    duration-300

                                    hover:text-[#E75480]
                                    hover:underline
                                  "
                                >
                                  <span className="line-clamp-1">
                                    {
                                      relatedLocation
                                    }
                                  </span>

                                  <ExternalLinkIcon className="h-[11px] w-[11px] shrink-0" />
                                </a>
                              ) : (
                                <span className="line-clamp-1">
                                  {
                                    relatedLocation
                                  }
                                </span>
                              )}
                            </div>
                          )}

                          {/* TIME */}

                          {item.time && (
                            <div
                              className="
                                flex
                                items-center
                                gap-2.5

                                text-[11px]

                                text-[#765F68]
                              "
                            >
                              <ClockIcon className="h-[13px] w-[13px] shrink-0 text-[#E75480]" />

                              <span>
                                {
                                  item.time
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto pt-5">
                          <Link
                            to={`/events/${item._id}`}
                            className="
                              group/button

                              inline-flex
                              items-center
                              gap-2

                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[2px]

                              text-[#E75480]
                            "
                          >
                            View Details

                            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/events"
                className="
                  inline-flex
                  items-center
                  gap-3

                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2.5px]

                  text-[#8A6F78]

                  transition-colors
                  duration-300

                  hover:text-[#E75480]
                "
              >
                <span>←</span>

                Back to All Events
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default EventDetails;