import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Award,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router";

import SEO from "../../../components/SEO";

/* ============================================================
   TYPES
============================================================ */

type Course = {
  _id: string;

  title: string;

  slug?: string;

  description: string;

  duration: string;

  fee: string;

  certificate: string;

  image?: string;

  available?: boolean;
};

/* ============================================================
   HELPERS
============================================================ */

function extractCourses(
  data: unknown
): Course[] {
  if (
    Array.isArray(data)
  ) {
    return data as Course[];
  }

  if (
    data &&
    typeof data ===
      "object"
  ) {
    const response =
      data as {
        courses?: unknown;
        data?: unknown;
      };

    if (
      Array.isArray(
        response.courses
      )
    ) {
      return response.courses as Course[];
    }

    if (
      Array.isArray(
        response.data
      )
    ) {
      return response.data as Course[];
    }
  }

  return [];
}

function makeCourseSlug(
  title: string
) {
  return title
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim()
    .replace(
      /&/g,
      " and "
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .replace(
      /-+/g,
      "-"
    );
}

/* ============================================================
   COURSE DETAIL
============================================================ */

export default function CourseDetail() {
  const {
    slug,
  } =
    useParams<{
      slug: string;
    }>();

  const [
    course,
    setCourse,
  ] =
    useState<Course | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState("");

  /* ==========================================================
     FETCH COURSE

     Uses existing /api/courses so backend changes are
     not required yet.
  ========================================================== */

  useEffect(
    () => {
      if (
        !slug
      ) {
        setError(
          "Course not found."
        );

        setLoading(
          false
        );

        return;
      }

      const controller =
        new AbortController();

      const loadCourse =
        async () => {
          try {
            setLoading(
              true
            );

            setError(
              ""
            );

            const apiUrl =
              import.meta.env
                .VITE_API_URL ||
              "";

            const response =
              await fetch(
                `${apiUrl}/api/courses`,
                {
                  signal:
                    controller.signal,
                }
              );

            if (
              !response.ok
            ) {
              throw new Error(
                "Unable to load course."
              );
            }

            const data:
              unknown =
              await response.json();

            const courses =
              extractCourses(
                data
              );

            const decoded =
              decodeURIComponent(
                slug
              )
                .trim()
                .toLowerCase();

            const found =
              courses.find(
                (
                  item
                ) => {
                  const savedSlug =
                    item.slug
                      ?.trim()
                      .toLowerCase();

                  const generatedSlug =
                    makeCourseSlug(
                      item.title
                    );

                  return (
                    savedSlug ===
                      decoded ||
                    generatedSlug ===
                      decoded ||
                    item._id ===
                      decoded
                  );
                }
              );

            if (
              !found
            ) {
              throw new Error(
                "Course not found."
              );
            }

            setCourse(
              found
            );
          } catch (
            err
          ) {
            if (
              controller.signal
                .aborted
            ) {
              return;
            }

            console.error(
              "COURSE DETAIL ERROR:",
              err
            );

            setError(
              err instanceof Error
                ? err.message
                : "Unable to load course."
            );

            setCourse(
              null
            );
          } finally {
            if (
              !controller.signal
                .aborted
            ) {
              setLoading(
                false
              );
            }
          }
        };

      void loadCourse();

      return () => {
        controller.abort();
      };
    },

    [
      slug,
    ]
  );

  /* ==========================================================
     URL
  ========================================================== */

  const bookingUrl =
    useMemo(
      () => {
        if (
          !course
        ) {
          return "/booking";
        }

        const identifier =
          course.slug?.trim() ||
          course._id;

        return `/booking?course=${encodeURIComponent(
          identifier
        )}`;
      },

      [
        course,
      ]
    );

  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    loading
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-4
          pt-28
        "
      >
        <div
          className="
            flex
            min-h-[360px]
            items-center
            justify-center
          "
        >
          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#E75480]/20
              border-t-[#E75480]
            "
          />
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    error ||
    !course
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-4
          pb-16
          pt-28
        "
      >
        <div
          className="
            mx-auto
            max-w-lg
            rounded-[24px]
            border
            border-[#E75480]/10
            bg-white
            p-8
            text-center
            shadow-[0_14px_36px_rgba(58,42,47,0.05)]
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
            Nirjara Academy
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-3xl
              text-[#3A2A2F]
            "
          >
            Course not found
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#8A6F78]
            "
          >
            The course you are looking for may no longer be available.
          </p>

          <Link
            to="/academy"
            className="
              mt-6
              inline-flex
              rounded-full
              bg-[#E75480]
              px-7
              py-3
              text-[8px]
              font-semibold
              uppercase
              tracking-[2px]
              text-white
            "
          >
            View Academy
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PAGE DATA
  ========================================================== */

  const pageSlug =
    course.slug?.trim() ||
    makeCourseSlug(
      course.title
    );

  const description =
    course.description
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <>
      <SEO
        title={`${course.title} | Nirjara Beauty Academy`}
        description={
          description.slice(
            0,
            155
          )
        }
        keywords={`${course.title}, beauty course Kathmandu, beauty training Nepal, Nirjara Beauty Academy`}
        canonical={`/academy/${pageSlug}`}
        image={
          course.image ||
          "/images/nirjara-og.jpg"
        }
        type="website"
      />

      <main
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-3
          pb-8
          pt-24

          sm:px-5

          lg:px-8
          lg:pt-28
        "
      >
        <div
          className="
            mx-auto
            max-w-[1120px]
          "
        >
          {/* ==================================================
              BREADCRUMB
          ================================================== */}

          <div
            className="
              mb-4
              flex
              min-w-0
              items-center
              gap-2
              px-1

              text-[7px]
              font-medium
              uppercase
              tracking-[0.16em]

              text-[#A88993]

              sm:text-[8px]
            "
          >
            <Link
              to="/academy"
              className="
                shrink-0
                transition-colors
                hover:text-[#E75480]
              "
            >
              Academy
            </Link>

            <span
              className="
                text-[#D8BDC6]
              "
            >
              /
            </span>

            <span
              className="
                max-w-[220px]
                truncate
                text-[#C77A95]

                sm:max-w-[340px]
                lg:max-w-[500px]
              "
              title={
                course.title
              }
            >
              {
                course.title
              }
            </span>
          </div>

          {/* ==================================================
              PREMIUM CARD
          ================================================== */}

          <section
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#E75480]/10
              bg-white
              shadow-[0_18px_50px_rgba(58,42,47,0.06)]

              sm:rounded-[26px]
            "
          >
            <div
              className="
                grid

                lg:grid-cols-[0.95fr_1.05fr]
              "
            >
              {/* IMAGE */}

              <div
                className="
                  relative
                  h-[230px]
                  overflow-hidden
                  bg-[#FCE7EF]

                  sm:h-[320px]

                  lg:h-[430px]
                "
              >
                {course.image ? (
                  <img
                    src={
                      course.image
                    }
                    alt={
                      course.title
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                    "
                  >
                    <GraduationCap
                      size={
                        70
                      }
                      strokeWidth={
                        1
                      }
                      className="
                        text-[#E75480]/20
                      "
                    />
                  </div>
                )}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#3A2A2F]/10
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* CONTENT */}

              <div
                className="
                  flex
                  flex-col
                  justify-center
                  p-5

                  sm:p-7

                  lg:p-9
                "
              >
                {/* LABEL */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      h-px
                      w-7
                      bg-[#E75480]
                    "
                  />

                  <p
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[2.8px]
                      text-[#E75480]
                    "
                  >
                    Nirjara Academy
                  </p>
                </div>

                {/* TITLE */}

                <h1
                  className="
                    mt-3
                    max-w-[15ch]
                    font-serif
                    text-[30px]
                    leading-[1.02]
                    text-[#3A2A2F]

                    sm:text-[36px]

                    lg:text-[40px]
                  "
                >
                  {
                    course.title
                  }
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-[12px]
                    leading-6
                    text-[#8A6F78]

                    sm:text-[13px]
                  "
                >
                  {
                    course.description
                  }
                </p>

                {/* COURSE DETAILS */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-3
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#E75480]/10
                    bg-[#FFF9FB]
                  "
                >
                  <CourseInfo
                    icon={
                      <Clock3
                        size={
                          13
                        }
                      />
                    }
                    label="Duration"
                    value={
                      course.duration
                    }
                  />

                  <CourseInfo
                    icon={
                      <Award
                        size={
                          13
                        }
                      />
                    }
                    label="Certificate"
                    value={
                      course.certificate
                    }
                  />

                  <CourseInfo
                    icon={
                      <GraduationCap
                        size={
                          13
                        }
                      />
                    }
                    label="Course Fee"
                    value={
                      course.fee
                    }
                    last
                  />
                </div>

                {/* STATUS */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-3
                    rounded-[15px]
                    border
                    border-[#E75480]/10
                    bg-[#FFF9FB]
                    px-4
                    py-3
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#E75480]
                    "
                  >
                    <Check
                      size={
                        13
                      }
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[6px]
                        font-semibold
                        uppercase
                        tracking-[1.8px]
                        text-[#A98994]
                      "
                    >
                      Enrollment
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        font-medium
                        text-[#3A2A2F]
                      "
                    >
                      {course.available ===
                      false
                        ? "Currently unavailable"
                        : "Open for enrollment"}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  {course.available !==
                  false ? (
                    <Link
                      to={
                        bookingUrl
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-[#E75480]
                        px-5
                        py-3
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[1.6px]
                        text-white
                        transition

                        hover:bg-[#D94773]
                      "
                    >
                      <CalendarDays
                        size={
                          13
                        }
                      />

                      Enroll Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      type="button"
                      className="
                        cursor-not-allowed
                        rounded-full
                        bg-[#F4F1F2]
                        px-5
                        py-3
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[1.5px]
                        text-[#A98D96]
                      "
                    >
                      Unavailable
                    </button>
                  )}

                  <Link
                    to="/contact"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      border
                      border-[#E75480]/20
                      bg-white
                      px-5
                      py-3
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[1.5px]
                      text-[#E75480]
                      transition

                      hover:border-[#E75480]
                      hover:bg-[#FFF5F8]
                    "
                  >
                    <MessageCircle
                      size={
                        13
                      }
                    />

                    Ask About Course
                  </Link>
                </div>
              </div>
            </div>

            {/* BOTTOM STRIP */}

            <div
              className="
                grid
                grid-cols-3
                border-t
                border-[#E75480]/10
                bg-[#FFFBFC]
              "
            >
              <BottomInfo
                label="Duration"
                value={
                  course.duration
                }
              />

              <BottomInfo
                label="Course Fee"
                value={
                  course.fee
                }
              />

              <BottomInfo
                label="Enrollment"
                value={
                  course.available ===
                  false
                    ? "Unavailable"
                    : "Open"
                }
                last
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

/* ============================================================
   COURSE INFO
============================================================ */

function CourseInfo({
  icon,
  label,
  value,
  last = false,
}: {
  icon:
    React.ReactNode;

  label:
    string;

  value:
    string;

  last?: boolean;
}) {
  return (
    <div
      className={`
        min-w-0
        px-3
        py-3

        ${
          !last
            ? "border-r border-[#E75480]/10"
            : ""
        }
      `}
    >
      <div
        className="
          flex
          items-center
          gap-1.5
          text-[#E75480]
        "
      >
        {icon}

        <p
          className="
            text-[5px]
            font-semibold
            uppercase
            tracking-[1.4px]
            text-[#A98994]

            sm:text-[6px]
          "
        >
          {label}
        </p>
      </div>

      <p
        className="
          mt-1.5
          truncate
          text-[9px]
          font-semibold
          text-[#3A2A2F]

          sm:text-[11px]
        "
        title={
          value
        }
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   BOTTOM INFO
============================================================ */

function BottomInfo({
  label,
  value,
  last = false,
}: {
  label:
    string;

  value:
    string;

  last?: boolean;
}) {
  return (
    <div
      className={`
        min-w-0
        px-3
        py-3
        text-center

        sm:px-5
        sm:py-3.5

        ${
          !last
            ? "border-r border-[#E75480]/10"
            : ""
        }
      `}
    >
      <p
        className="
          text-[6px]
          font-semibold
          uppercase
          tracking-[1.5px]
          text-[#A98994]

          sm:text-[7px]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          truncate
          text-[10px]
          font-semibold
          text-[#3A2A2F]

          sm:text-[11px]
        "
        title={
          value
        }
      >
        {value}
      </p>
    </div>
  );
}