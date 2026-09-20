import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const EventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<EventType | null>(
    null
  );

  const [relatedEvents, setRelatedEvents] = useState<
    EventType[]
  >([]);

  /* ============================================================
     FETCH SINGLE EVENT
  ============================================================ */

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`
      );

      setEvent(res.data);
    } catch (error) {
      console.error("EVENT FETCH ERROR:", error);
    }
  };

  /* ============================================================
     FETCH RELATED EVENTS
  ============================================================ */

  const fetchRelatedEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events`
      );

      const filtered = res.data.filter(
        (item: EventType) => item._id !== id
      );

      setRelatedEvents(filtered.slice(0, 3));
    } catch (error) {
      console.error("RELATED EVENTS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchRelatedEvents();
  }, [id]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (!event) {
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
          h-[440px]
          overflow-hidden

          sm:h-[500px]
          md:h-[560px]
          lg:h-[620px]
        "
      >
        {/* HERO IMAGE */}

        <img
          src={event.image}
          alt={event.title}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        {/* DARK WARM OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-[#29191F]/45
          "
        />

        {/* BOTTOM GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#29191F]/60
            via-transparent
            to-black/5
          "
        />

        {/* HERO CONTENT */}

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
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="max-w-4xl"
          >
            {/* TOP LABEL */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-4
              "
            >
              <span
                className="
                  hidden
                  h-px
                  w-10
                  bg-[#F48AAA]/70
                  sm:block
                "
              />

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[4px]
                  text-[#FF9DBA]
                  sm:text-[10px]
                  sm:tracking-[5px]
                "
              >
                Nirjara Beauty Event
              </p>

              <span
                className="
                  hidden
                  h-px
                  w-10
                  bg-[#F48AAA]/70
                  sm:block
                "
              />
            </div>

            {/* TITLE */}

            <h1
              className="
                mt-6
                font-serif
                text-[42px]
                font-normal
                leading-[0.98]
                tracking-[-1px]
                text-white
                drop-shadow-[0_3px_15px_rgba(0,0,0,0.18)]

                sm:text-[56px]
                md:text-[68px]
                lg:text-[76px]
              "
            >
              {event.title}
            </h1>

            {/* SMALL DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                font-serif
                text-base
                italic
                leading-relaxed
                text-white/85

                sm:text-lg
                md:text-xl
              "
            >
              Premium Nirjara Beauty Experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          EVENT INFORMATION
      ======================================================== */}

      <section
        className="
          relative
          z-20
          mx-auto
          max-w-6xl
          px-4
          pb-16
          pt-12

          sm:px-6
          sm:pb-20
          sm:pt-16

          lg:px-8
          lg:pb-24
        "
      >
        {/* ======================================================
            INFORMATION CARD
        ====================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-[#E75480]/10
            bg-white
            shadow-[0_20px_60px_rgba(58,42,47,0.07)]

            sm:rounded-[32px]
          "
        >
          {/* ====================================================
              DATE / TIME / LOCATION
          ==================================================== */}

          <div
            className="
              grid
              border-b
              border-[#E75480]/10

              sm:grid-cols-3
            "
          >
            {/* DATE */}

            <div
              className="
                flex
                items-center
                gap-4
                border-b
                border-[#E75480]/10
                p-6

                sm:border-b-0
                sm:border-r
                sm:p-7

                lg:p-8
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF5F8]
                "
              >
                <svg
                  className="
                    h-[18px]
                    w-[18px]
                    stroke-[#E75480]
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.7"
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
                    mt-2
                    text-[13px]
                    leading-5
                    text-[#654E56]

                    lg:text-sm
                  "
                >
                  {new Date(
                    event.date
                  ).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
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
                p-6

                sm:border-b-0
                sm:border-r
                sm:p-7

                lg:p-8
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF5F8]
                "
              >
                <svg
                  className="
                    h-[18px]
                    w-[18px]
                    stroke-[#E75480]
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.7"
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
                    mt-2
                    text-[13px]
                    leading-5
                    text-[#654E56]

                    lg:text-sm
                  "
                >
                  {event.time}
                </p>
              </div>
            </div>

            {/* LOCATION */}

            <div
              className="
                flex
                items-center
                gap-4
                p-6

                sm:p-7

                lg:p-8
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF5F8]
                "
              >
                <svg
                  className="
                    h-[18px]
                    w-[18px]
                    stroke-[#E75480]
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />

                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                  />
                </svg>
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
                  Location
                </p>

                <p
                  className="
                    mt-2
                    text-[13px]
                    leading-5
                    text-[#654E56]

                    lg:text-sm
                  "
                >
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              EVENT DESCRIPTION
          ==================================================== */}

          <div
            className="
              px-6
              py-9

              sm:px-9
              sm:py-11

              md:px-12
              md:py-12

              lg:px-16
              lg:py-14
            "
          >
            {/* SMALL LABEL */}

            <div className="flex items-center gap-3">
              <span
                className="
                  h-px
                  w-7
                  bg-[#E75480]/50
                "
              />

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

            {/* HEADING */}

            <h2
              className="
                mt-5
                font-serif
                text-[32px]
                font-normal
                leading-tight
                text-[#3A2A2F]

                sm:text-[38px]
                md:text-[42px]
              "
            >
              About This{" "}

              <span className="italic text-[#E75480]">
                Event
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-4xl
                whitespace-pre-line
                text-sm
                leading-7
                text-[#8A6F78]

                sm:text-[15px]
                sm:leading-8

                md:text-base
              "
            >
              {event.description}
            </p>

            {/* CTA */}

            {event.buttonLink && (
              <div className="mt-9">
                <Link
                  to={event.buttonLink}
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
                  {event.buttonText || "Learn More"}

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
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          RELATED EVENTS
      ======================================================== */}

      {relatedEvents.length > 0 && (
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

            {/* SECTION HEADING */}

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
                Discover More
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
                Related{" "}

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

            {/* ==================================================
                RELATED EVENT GRID
            ================================================== */}

            <div
              className="
                mt-12
                grid
                grid-cols-1
                gap-6

                sm:grid-cols-2

                lg:mt-16
                lg:grid-cols-3

                xl:gap-8
              "
            >
              {relatedEvents.map((item) => (
                <motion.article
                  key={item._id}
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
                      src={item.image}
                      alt={item.title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.05]
                      "
                    />

                    {/* OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#3A2A2F]/15
                        to-transparent
                      "
                    />

                    {/* DATE */}

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
                        item.date
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
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
                      {item.title}
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
                      {item.description}
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
                          className="
                            mt-[2px]
                            h-[15px]
                            w-[15px]
                            shrink-0
                            stroke-[#E75480]
                          "
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />

                          <circle
                            cx="12"
                            cy="10"
                            r="3"
                          />
                        </svg>

                        <span>
                          {item.location}
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
                          className="
                            mt-[2px]
                            h-[15px]
                            w-[15px]
                            shrink-0
                            stroke-[#E75480]
                          "
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
                          {item.time}
                        </span>
                      </div>
                    </div>

                    {/* BUTTON */}

                    <div className="mt-auto pt-7">
                      <Link
                        to={`/events/${item._id}`}
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

            {/* ==================================================
                BACK TO EVENTS
            ================================================== */}

            <div className="mt-14 text-center">
              <Link
                to="/events"
                className="
                  inline-flex
                  items-center
                  gap-3
                  text-[9px]
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
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default EventDetails;