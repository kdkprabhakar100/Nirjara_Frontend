import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

const EVENTS_SEO = {
  title: "Events | Nirjara Beauty Kathmandu",
  description:
    "Discover upcoming and recent events, beauty programs, training activities and special moments from Nirjara Beauty in Kathmandu.",
  keywords:
    "Nirjara Beauty events, beauty events Kathmandu, beauty academy events Nepal, salon events Kathmandu",
  canonical: "/events",
  image: "/images/nirjara-og.jpg",
  type: "website",
};

interface EventType {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  buttonText: string;
  buttonLink: string;
  featured: boolean;
}

/* ============================================================
   ICONS
============================================================ */

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
      <circle cx="12" cy="10" r="3" />
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

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
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
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

/* ============================================================
   DATE FORMAT
============================================================ */

function formatDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ============================================================
   EVENTS
============================================================ */

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH EVENTS
  ============================================================ */

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events`
      );

      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("EVENT FETCH ERROR:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ============================================================
     FEATURED EVENT
  ============================================================ */

  const featuredEvent = useMemo(
    () => events.find((event) => event.featured),
    [events]
  );

  /* ============================================================
     NORMAL EVENTS

     Featured event is excluded so it does not appear twice.
  ============================================================ */

  const regularEvents = useMemo(
    () =>
      featuredEvent
        ? events.filter((event) => event._id !== featuredEvent._id)
        : events,
    [events, featuredEvent]
  );

  return (
    <>
      <SEO
        title={EVENTS_SEO.title}
        description={EVENTS_SEO.description}
        keywords={EVENTS_SEO.keywords}
        canonical={EVENTS_SEO.canonical}
        image={EVENTS_SEO.image}
        type="website"
      />

      <main className="min-h-screen overflow-hidden bg-[#FFF5F8] text-[#3A2A2F]">

        {/* ========================================================
            HERO
        ======================================================== */}

        <section
          className="
            relative
            overflow-hidden
            border-b
            border-[#E75480]/10
            bg-[#FFF5F8]

            px-5
            pb-12
            pt-[118px]

            sm:px-6
            sm:pb-14
            sm:pt-[126px]

            lg:pb-16
            lg:pt-[130px]
          "
        >
          {/* BACKGROUND DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[340px]
              w-[340px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#E75480]/[0.035]
              blur-3xl

              sm:h-[420px]
              sm:w-[420px]
            "
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              ease: "easeOut",
            }}
            className="
              relative
              z-10
              mx-auto
              max-w-4xl
              text-center
            "
          >
            {/* SMALL LABEL */}

            <div className="flex items-center justify-center gap-3">
              <span className="hidden h-px w-8 bg-[#E75480]/40 sm:block" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[3.5px]
                  text-[#E75480]

                  sm:text-[9px]
                  sm:tracking-[5px]
                "
              >
                Beauty • Education • Experience
              </p>

              <span className="hidden h-px w-8 bg-[#E75480]/40 sm:block" />
            </div>

            {/* TITLE */}

            <h1
              className="
                mt-5
                font-serif
                text-[44px]
                font-normal
                leading-[0.95]
                tracking-[-1.5px]
                text-[#3A2A2F]

                sm:text-[56px]

                md:text-[66px]

                lg:text-[72px]
              "
            >
              Nirjara{" "}
              <span className="italic text-[#E75480]">
                Events
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-[13px]
                leading-6
                text-[#8A6F78]

                sm:text-[15px]
                sm:leading-7
              "
            >
              Discover beauty masterclasses, bridal workshops,
              academy programs and exclusive Nirjara experiences.
            </p>

            <div className="mx-auto mt-6 h-px w-16 bg-[#E75480]/35" />
          </motion.div>
        </section>

        {/* ========================================================
            FEATURED EVENT
        ======================================================== */}

        {featuredEvent && (
          <section
            className="
              mx-auto
              max-w-7xl

              px-4
              py-12

              sm:px-6
              sm:py-14

              lg:px-8
              lg:py-16
            "
          >
            {/* LABEL */}

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-7 bg-[#E75480]/40" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[3.5px]
                  text-[#E75480]
                "
              >
                Featured Experience
              </p>
            </div>

            {/* FEATURED CARD */}

            <motion.article
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              whileHover={{
                y: -3,
              }}
              transition={{
                duration: 0.35,
              }}
              className="
                grid
                overflow-hidden
                rounded-[24px]
                border
                border-[#E75480]/10
                bg-white
                shadow-[0_16px_45px_rgba(58,42,47,0.06)]

                lg:grid-cols-[1.08fr_0.92fr]
                lg:rounded-[28px]
              "
            >
              {/* IMAGE */}

              <Link
                to={`/events/${featuredEvent._id}`}
                className="
                  group
                  relative
                  block
                  min-h-[250px]
                  overflow-hidden

                  sm:min-h-[320px]

                  lg:min-h-[410px]
                "
              >
                <img
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700

                    group-hover:scale-[1.035]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#3A2A2F]/25
                    via-transparent
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    left-4
                    top-4
                    rounded-full
                    border
                    border-white/40
                    bg-white/90
                    px-3.5
                    py-2
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[2px]
                    text-[#E75480]
                    shadow-sm
                    backdrop-blur-md

                    sm:left-5
                    sm:top-5
                  "
                >
                  Featured
                </div>
              </Link>

              {/* CONTENT */}

              <div
                className="
                  flex
                  flex-col
                  justify-center
                  p-6

                  sm:p-8

                  lg:p-9

                  xl:p-10
                "
              >
                {/* DATE */}

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  {formatDate(featuredEvent.date)}
                </p>

                {/* TITLE */}

                <Link to={`/events/${featuredEvent._id}`}>
                  <h2
                    className="
                      mt-3
                      font-serif
                      text-[30px]
                      font-normal
                      leading-[1.05]
                      tracking-[-0.5px]
                      text-[#3A2A2F]
                      transition-colors
                      duration-300

                      hover:text-[#E75480]

                      sm:text-[36px]

                      xl:text-[42px]
                    "
                  >
                    {featuredEvent.title}
                  </h2>
                </Link>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-4
                    line-clamp-4
                    text-[13px]
                    leading-6
                    text-[#8A6F78]

                    sm:text-sm
                    sm:leading-7
                  "
                >
                  {featuredEvent.description}
                </p>

                {/* DETAILS */}

                <div
                  className="
                    mt-6
                    grid
                    gap-3
                    border-t
                    border-[#E75480]/10
                    pt-5
                  "
                >
                  {/* LOCATION */}

                  {featuredEvent.location && (
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FFF5F8]
                          text-[#E75480]
                        "
                      >
                        <LocationIcon className="h-[14px] w-[14px]" />
                      </div>

                      <p className="text-[12px] leading-5 text-[#765F68]">
                        {featuredEvent.location}
                      </p>
                    </div>
                  )}

                  {/* TIME */}

                  {featuredEvent.time && (
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FFF5F8]
                          text-[#E75480]
                        "
                      >
                        <ClockIcon className="h-[14px] w-[14px]" />
                      </div>

                      <p className="text-[12px] text-[#765F68]">
                        {featuredEvent.time}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA */}

                <div className="mt-7">
                  <Link
                    to={`/events/${featuredEvent._id}`}
                    className="
                      group
                      inline-flex
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      bg-[#E75480]
                      px-6
                      py-3.5
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[2.3px]
                      text-white
                      shadow-[0_10px_25px_rgba(231,84,128,0.20)]
                      transition-all
                      duration-300

                      hover:-translate-y-[2px]
                      hover:bg-[#D94773]
                      hover:shadow-[0_13px_30px_rgba(231,84,128,0.27)]
                    "
                  >
                    View Event

                    <ArrowIcon
                      className="
                        h-3.5
                        w-3.5
                        transition-transform
                        duration-300

                        group-hover:translate-x-1
                      "
                    />
                  </Link>
                </div>
              </div>
            </motion.article>
          </section>
        )}

        {/* ========================================================
            ALL / UPCOMING EVENTS
        ======================================================== */}

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

            {/* HEADING */}

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
                  Discover What's Next
                </p>

                <h2
                  className="
                    mt-3
                    font-serif
                    text-[36px]
                    font-normal
                    leading-none
                    tracking-[-0.5px]
                    text-[#3A2A2F]

                    sm:text-[44px]

                    lg:text-[48px]
                  "
                >
                  Upcoming{" "}
                  <span className="italic text-[#E75480]">
                    Events
                  </span>
                </h2>
              </div>

              {regularEvents.length > 0 && (
                <p
                  className="
                    max-w-sm
                    text-[12px]
                    leading-6
                    text-[#8A6F78]

                    sm:text-right
                  "
                >
                  Explore upcoming workshops, programs and special
                  experiences from Nirjara Beauty.
                </p>
              )}
            </div>

            {/* ====================================================
                LOADING
            ==================================================== */}

            {loading && (
              <div className="py-20 text-center">
                <div
                  className="
                    mx-auto
                    h-9
                    w-9
                    animate-spin
                    rounded-full
                    border-2
                    border-[#E75480]/20
                    border-t-[#E75480]
                  "
                />

                <p
                  className="
                    mt-4
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#E75480]
                  "
                >
                  Loading Events
                </p>
              </div>
            )}

            {/* ====================================================
                NO EVENTS
            ==================================================== */}

            {!loading && regularEvents.length === 0 && (
              <div
                className="
                  mx-auto
                  mt-10
                  max-w-lg
                  rounded-[22px]
                  border
                  border-[#E75480]/10
                  bg-[#FFF5F8]
                  px-6
                  py-10
                  text-center
                "
              >
                <CalendarIcon className="mx-auto h-6 w-6 text-[#E75480]" />

                <p
                  className="
                    mt-4
                    font-serif
                    text-xl
                    italic
                    text-[#765F68]
                  "
                >
                  More events are coming soon.
                </p>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#8A6F78]">
                  Check back again for the latest Nirjara Beauty
                  programs and experiences.
                </p>
              </div>
            )}

            {/* ====================================================
                EVENTS GRID
            ==================================================== */}

            {!loading && regularEvents.length > 0 && (
              <div
                className="
                  mt-9
                  grid
                  grid-cols-1
                  gap-5

                  sm:grid-cols-2

                  lg:mt-11
                  lg:gap-6

                  xl:grid-cols-3
                "
              >
                {regularEvents.map((event, index) => (
                  <motion.article
                    key={event._id}
                    initial={{
                      opacity: 0,
                      y: 16,
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
                      duration: 0.4,
                      delay: Math.min(index * 0.04, 0.16),
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
                      transition-shadow
                      duration-300

                      hover:border-[#E75480]/20
                      hover:shadow-[0_16px_38px_rgba(58,42,47,0.08)]
                    "
                  >
                    {/* IMAGE */}

                    <Link
                      to={`/events/${event._id}`}
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
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700

                          group-hover:scale-[1.04]
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-[#3A2A2F]/20
                          via-transparent
                          to-transparent
                        "
                      />

                      {/* DATE BADGE */}

                      <div
                        className="
                          absolute
                          left-3
                          top-3
                          rounded-full
                          border
                          border-white/40
                          bg-white/90
                          px-3
                          py-1.5
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[1.3px]
                          text-[#E75480]
                          shadow-sm
                          backdrop-blur-md
                        "
                      >
                        {formatShortDate(event.date)}
                      </div>
                    </Link>

                    {/* CONTENT */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-5

                        lg:p-6
                      "
                    >
                      {/* TITLE */}

                      <Link to={`/events/${event._id}`}>
                        <h3
                          className="
                            line-clamp-2
                            font-serif
                            text-[24px]
                            font-normal
                            leading-[1.08]
                            tracking-[-0.25px]
                            text-[#3A2A2F]
                            transition-colors
                            duration-300

                            hover:text-[#E75480]
                          "
                        >
                          {event.title}
                        </h3>
                      </Link>

                      {/* DESCRIPTION */}

                      <p
                        className="
                          mt-3
                          line-clamp-2
                          text-[12px]
                          leading-5
                          text-[#8A6F78]

                          sm:text-[13px]
                          sm:leading-6
                        "
                      >
                        {event.description}
                      </p>

                      {/* DETAILS */}

                      <div
                        className="
                          mt-5
                          space-y-2.5
                          border-t
                          border-[#E75480]/10
                          pt-4
                        "
                      >
                        {event.location && (
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

                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                        )}

                        {event.time && (
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

                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}

                      <div className="mt-auto pt-5">
                        <Link
                          to={`/events/${event._id}`}
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
                            transition-colors
                            duration-300

                            hover:text-[#C93D68]
                          "
                        >
                          View Details

                          <ArrowIcon
                            className="
                              h-3.5
                              w-3.5
                              transition-transform
                              duration-300

                              group-hover/button:translate-x-1
                            "
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Events;