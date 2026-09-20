import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  /* ============================================================
     FETCH EVENTS
  ============================================================ */

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events`
      );

      setEvents(res.data);
    } catch (error) {
      console.error("EVENT FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ============================================================
     FEATURED EVENT
  ============================================================ */

  const featuredEvent = events.find(
    (event) => event.featured
  );

  return (
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
          px-6
          pb-16
          pt-28
          sm:pb-20
          sm:pt-32
          lg:pb-24
          lg:pt-36
        "
      >
        {/* DECORATIVE BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[420px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#E75480]/[0.04]
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-4xl
            text-center
          "
        >
          {/* SMALL LABEL */}

          <div className="flex items-center justify-center gap-4">
            <span
              className="
                hidden
                h-px
                w-10
                bg-[#E75480]/50
                sm:block
              "
            />

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[4px]
                text-[#E75480]
                sm:text-[10px]
                sm:tracking-[5px]
              "
            >
              Beauty • Education • Experience
            </p>

            <span
              className="
                hidden
                h-px
                w-10
                bg-[#E75480]/50
                sm:block
              "
            />
          </div>

          {/* TITLE */}

          <h1
            className="
              mt-6
              font-serif
              text-[48px]
              font-normal
              leading-[0.95]
              tracking-[-1px]
              text-[#3A2A2F]
              sm:text-[64px]
              md:text-[76px]
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
              mt-7
              max-w-2xl
              text-sm
              leading-7
              text-[#8A6F78]
              sm:text-base
              sm:leading-8
            "
          >
            Discover exclusive beauty masterclasses,
            bridal workshops, academy events, and
            premium salon experiences.
          </p>

          {/* BOTTOM LINE */}

          <div
            className="
              mx-auto
              mt-8
              h-px
              w-20
              bg-[#E75480]/40
            "
          />
        </div>
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
            py-16
            sm:px-6
            sm:py-20
            lg:px-8
            lg:py-24
          "
        >
          {/* SECTION LABEL */}

          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-[#E75480]/40" />

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[4px]
                  text-[#E75480]
                "
              >
                Featured Experience
              </p>
            </div>
          </div>

          {/* FEATURED CARD */}

          <motion.div
            whileHover={{
              y: -4,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              grid
              overflow-hidden
              rounded-[28px]
              border
              border-[#E75480]/10
              bg-white
              shadow-[0_20px_60px_rgba(58,42,47,0.07)]
              lg:grid-cols-[1.05fr_0.95fr]
              lg:rounded-[32px]
            "
          >
            {/* IMAGE */}

            <div
              className="
                group
                relative
                min-h-[260px]
                overflow-hidden
                sm:min-h-[360px]
                lg:min-h-[520px]
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
                  group-hover:scale-[1.04]
                "
              />

              {/* IMAGE OVERLAY */}

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

              {/* FEATURED BADGE */}

              <div
                className="
                  absolute
                  left-5
                  top-5
                  rounded-full
                  border
                  border-white/40
                  bg-white/90
                  px-4
                  py-2
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2px]
                  text-[#E75480]
                  shadow-sm
                  backdrop-blur-md
                  sm:left-7
                  sm:top-7
                "
              >
                Featured Event
              </div>
            </div>

            {/* CONTENT */}

            <div
              className="
                flex
                flex-col
                justify-center
                p-6
                sm:p-9
                md:p-10
                lg:p-12
              "
            >
              {/* EVENT DATE LABEL */}

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[3px]
                  text-[#E75480]
                "
              >
                {new Date(
                  featuredEvent.date
                ).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* TITLE */}

              <h2
                className="
                  mt-4
                  font-serif
                  text-[34px]
                  font-normal
                  leading-[1.05]
                  text-[#3A2A2F]
                  sm:text-[42px]
                  lg:text-[48px]
                "
              >
                {featuredEvent.title}
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-5
                  text-sm
                  leading-7
                  text-[#8A6F78]
                  sm:text-[15px]
                "
              >
                {featuredEvent.description}
              </p>

              {/* DIVIDER */}

              <div
                className="
                  my-7
                  h-px
                  w-full
                  bg-[#E75480]/10
                "
              />

              {/* DETAILS */}

              <div className="space-y-4">

                {/* LOCATION */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-[#8A6F78]
                  "
                >
                  <svg
                    className="mt-[2px] h-4 w-4 shrink-0 stroke-[#E75480]"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>

                  <span>
                    {featuredEvent.location}
                  </span>
                </div>

                {/* DATE */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-[#8A6F78]
                  "
                >
                  <svg
                    className="mt-[2px] h-4 w-4 shrink-0 stroke-[#E75480]"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="17"
                      rx="2"
                    />

                    <path d="M8 2v4M16 2v4M3 10h18" />
                  </svg>

                  <span>
                    {new Date(
                      featuredEvent.date
                    ).toLocaleDateString()}
                  </span>
                </div>

                {/* TIME */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    text-sm
                    text-[#8A6F78]
                  "
                >
                  <svg
                    className="mt-[2px] h-4 w-4 shrink-0 stroke-[#E75480]"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />

                    <path d="M12 7v5l3 2" />
                  </svg>

                  <span>
                    {featuredEvent.time}
                  </span>
                </div>
              </div>

              {/* BUTTON */}

              <div className="mt-9">
                <Link
                  to={`/events/${featuredEvent._id}`}
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-4
                    rounded-full
                    bg-[#E75480]
                    px-7
                    py-4
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[2.5px]
                    text-white
                    shadow-[0_12px_30px_rgba(231,84,128,0.22)]
                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:bg-[#D94773]
                    hover:shadow-[0_16px_38px_rgba(231,84,128,0.30)]
                  "
                >
                  View Details

                  <span
                    className="
                      text-base
                      leading-none
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ========================================================
          UPCOMING EVENTS
      ======================================================== */}

      <section
        className="
          border-t
          border-[#E75480]/10
          bg-white
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:px-8
          lg:py-24
        "
      >
        <div className="mx-auto max-w-7xl">

          {/* HEADING */}

          <div className="text-center">

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[4px]
                text-[#E75480]
              "
            >
              Discover What&apos;s Next
            </p>

            <h2
              className="
                mt-4
                font-serif
                text-[38px]
                font-normal
                leading-tight
                text-[#3A2A2F]
                sm:text-[48px]
                lg:text-[54px]
              "
            >
              Upcoming{" "}

              <span className="italic text-[#E75480]">
                Events
              </span>
            </h2>

            <div
              className="
                mx-auto
                mt-6
                h-px
                w-20
                bg-[#E75480]/40
              "
            />
          </div>

          {/* ====================================================
              NO EVENTS
          ==================================================== */}

          {events.length === 0 ? (
            <div
              className="
                mx-auto
                mt-14
                max-w-xl
                rounded-[24px]
                border
                border-[#E75480]/10
                bg-[#FFF5F8]
                px-6
                py-12
                text-center
              "
            >
              <p
                className="
                  font-serif
                  text-xl
                  italic
                  text-[#8A6F78]
                "
              >
                No events are currently available.
              </p>
            </div>
          ) : (
            /* ==================================================
                EVENTS GRID
            ================================================== */

            <div
              className="
                mt-12
                grid
                grid-cols-1
                gap-6
                sm:grid-cols-2
                lg:mt-16
                xl:grid-cols-3
                xl:gap-8
              "
            >
              {events.map((event) => (
                <motion.article
                  key={event._id}
                  whileHover={{
                    y: -6,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-[#E75480]/10
                    bg-white
                    shadow-[0_10px_35px_rgba(58,42,47,0.05)]
                    transition-shadow
                    duration-300

                    hover:shadow-[0_20px_50px_rgba(58,42,47,0.09)]
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      h-[230px]
                      overflow-hidden
                      sm:h-[250px]
                      lg:h-[270px]
                    "
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.05]
                      "
                    />

                    {/* IMAGE OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#3A2A2F]/15
                        to-transparent
                      "
                    />

                    {/* DATE BADGE */}

                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        border
                        border-white/40
                        bg-white/90
                        px-4
                        py-2
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[1.5px]
                        text-[#E75480]
                        shadow-sm
                        backdrop-blur-md
                      "
                    >
                      {new Date(
                        event.date
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    {/* FEATURED INDICATOR */}

                    {event.featured && (
                      <div
                        className="
                          absolute
                          right-4
                          top-4
                          rounded-full
                          bg-[#E75480]
                          px-3
                          py-2
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[1.5px]
                          text-white
                        "
                      >
                        Featured
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                      sm:p-6
                    "
                  >
                    {/* TITLE */}

                    <h3
                      className="
                        font-serif
                        text-[27px]
                        font-normal
                        leading-[1.08]
                        text-[#3A2A2F]
                        transition-colors
                        duration-300

                        group-hover:text-[#E75480]
                      "
                    >
                      {event.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-4
                        line-clamp-3
                        text-[13px]
                        leading-6
                        text-[#8A6F78]
                        sm:text-sm
                      "
                    >
                      {event.description}
                    </p>

                    {/* DIVIDER */}

                    <div
                      className="
                        my-5
                        h-px
                        w-full
                        bg-[#E75480]/10
                      "
                    />

                    {/* DETAILS */}

                    <div className="space-y-3">

                      {/* LOCATION */}

                      <div
                        className="
                          flex
                          items-start
                          gap-3
                          text-[12px]
                          leading-5
                          text-[#8A6F78]
                        "
                      >
                        <svg
                          className="mt-[2px] h-[15px] w-[15px] shrink-0 stroke-[#E75480]"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>

                        <span>
                          {event.location}
                        </span>
                      </div>

                      {/* TIME */}

                      <div
                        className="
                          flex
                          items-start
                          gap-3
                          text-[12px]
                          leading-5
                          text-[#8A6F78]
                        "
                      >
                        <svg
                          className="mt-[2px] h-[15px] w-[15px] shrink-0 stroke-[#E75480]"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                          />

                          <path d="M12 7v5l3 2" />
                        </svg>

                        <span>
                          {event.time}
                        </span>
                      </div>
                    </div>

                    {/* BUTTON */}

                    <div className="mt-auto pt-7">
                      <Link
                        to={`/events/${event._id}`}
                        className="
                          group/button
                          inline-flex
                          items-center
                          justify-center
                          gap-3
                          rounded-full
                          border
                          border-[#E75480]
                          bg-[#E75480]
                          px-6
                          py-3
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[2px]
                          text-white
                          transition-all
                          duration-300

                          hover:-translate-y-[2px]
                          hover:bg-[#D94773]
                          hover:shadow-[0_10px_25px_rgba(231,84,128,0.20)]
                        "
                      >
                        View Details

                        <span
                          className="
                            text-sm
                            transition-transform
                            duration-300
                            group-hover/button:translate-x-1
                          "
                        >
                          →
                        </span>
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
  );
};

export default Events;