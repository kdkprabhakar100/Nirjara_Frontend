import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import SEO from "../../../components/SEO";

/* ============================================================
   SEO
============================================================ */

const ACADEMY_SEO = {
  title:
    "Beauty Academy in Kathmandu | Nirjara Beauty Academy",

  description:
    "Explore professional beauty training and courses at Nirjara Beauty Academy in Kathmandu and develop practical skills for a career in the beauty industry.",

  keywords:
    "beauty academy Kathmandu, beauty training Nepal, beautician course Kathmandu, makeup course Kathmandu, hair training Kathmandu, Nirjara Beauty Academy",

  canonical:
    "/academy",

  image:
    "/images/nirjara-og.jpg",

  type:
    "website",
};

/* ============================================================
   TYPES
============================================================ */

export type Course = {
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

export type AcademyInitialData = {
  courses: Course[];
};

type AcademyProps = {
  initialData?: AcademyInitialData;
};

/* ============================================================
   DATA NORMALIZER
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

/* ============================================================
   FALLBACK SLUG
============================================================ */

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
   ACADEMY
============================================================ */

export default function Academy({
  initialData,
}: AcademyProps) {
  const navigate =
    useNavigate();

  const [
    courses,
    setCourses,
  ] =
    useState<Course[]>(
      () =>
        initialData?.courses ??
        []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      () =>
        initialData ===
        undefined
    );

  const [
    error,
    setError,
  ] =
    useState("");

  /* ==========================================================
     FETCH COURSES
  ========================================================== */

  useEffect(
    () => {
      if (
        initialData !==
        undefined
      ) {
        return;
      }

      const controller =
        new AbortController();

      const fetchCourses =
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
                "Failed to load academy courses."
              );
            }

            const data:
              unknown =
              await response.json();

            if (
              controller.signal
                .aborted
            ) {
              return;
            }

            setCourses(
              extractCourses(
                data
              )
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
              "ACADEMY FETCH ERROR:",
              err
            );

            setError(
              "We couldn't load our academy courses right now."
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

      void fetchCourses();

      return () => {
        controller.abort();
      };
    },

    [
      initialData,
    ]
  );

  /* ==========================================================
     ENROLL
  ========================================================== */

  const handleEnroll = (
    course: Course
  ) => {
    if (
      course.available ===
      false
    ) {
      return;
    }

    const identifier =
      course.slug?.trim() ||
      course._id;

    navigate(
      `/booking?course=${encodeURIComponent(
        identifier
      )}`
    );
  };

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <>
      <SEO
        title={
          ACADEMY_SEO.title
        }
        description={
          ACADEMY_SEO.description
        }
        keywords={
          ACADEMY_SEO.keywords
        }
        canonical={
          ACADEMY_SEO.canonical
        }
        image={
          ACADEMY_SEO.image
        }
        type="website"
      />

      <main
        className="
          min-h-screen
          bg-[#FFF5F8]

          px-4
          pb-12
          pt-[92px]

          text-[#3A2A2F]

          sm:px-6
          sm:pt-[100px]

          md:px-10

          lg:px-12
          lg:pb-14
          lg:pt-[104px]
        "
      >
        <section
          className="
            mx-auto
            max-w-6xl
          "
        >
          {/* ====================================================
              HEADING
          ==================================================== */}

          <div
            className="
              mb-8
              text-center

              sm:mb-9

              lg:mb-10
            "
          >
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[4px]

                text-[#E75480]

                sm:text-[10px]
              "
            >
              Our Academy
            </p>

            <h1
              className="
                mt-2.5

                font-serif

                text-[38px]
                font-light
                leading-[1]

                text-[#3A2A2F]

                sm:text-[44px]

                lg:text-[48px]
              "
            >
              Beauty{" "}

              <span
                className="
                  italic
                  text-[#E75480]
                "
              >
                Courses
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-2xl

                text-[12px]
                leading-6

                text-[#8A6F78]

                sm:text-[13px]
              "
            >
              Learn from industry experts and build your career in beauty
              with professional certification.
            </p>

            <div
              className="
                mx-auto
                mt-4

                h-px
                w-16

                bg-[#E75480]/40
              "
            />
          </div>

          {/* ====================================================
              LOADING
          ==================================================== */}

          {loading && (
            <div
              className="
                grid
                gap-5

                md:grid-cols-2

                lg:grid-cols-3
              "
              role="status"
              aria-label="Loading academy courses"
            >
              {Array.from({
                length: 3,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      overflow-hidden
                      rounded-[22px]

                      bg-white

                      p-4

                      shadow-sm
                    "
                  >
                    <div
                      className="
                        h-[150px]
                        animate-pulse
                        rounded-[16px]

                        bg-[#F6E8ED]
                      "
                    />

                    <div
                      className="
                        mt-4

                        h-6
                        w-3/4

                        animate-pulse
                        rounded

                        bg-[#F3DDE5]
                      "
                    />

                    <div
                      className="
                        mt-3

                        h-12

                        animate-pulse
                        rounded

                        bg-[#FAF1F4]
                      "
                    />

                    <div
                      className="
                        mt-4

                        h-10

                        animate-pulse
                        rounded-full

                        bg-[#F3DDE5]
                      "
                    />
                  </div>
                )
              )}
            </div>
          )}

          {/* ====================================================
              ERROR
          ==================================================== */}

          {!loading &&
            error && (
              <div
                className="
                  rounded-[22px]

                  border
                  border-[#E75480]/10

                  bg-white

                  px-6
                  py-10

                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    text-[#8A6F78]
                  "
                >
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="
                    mt-5

                    rounded-full

                    bg-[#E75480]

                    px-7
                    py-3

                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[2px]

                    text-white

                    transition

                    hover:bg-[#D94773]
                  "
                >
                  Try Again
                </button>
              </div>
            )}

          {/* ====================================================
              COURSE GRID
          ==================================================== */}

          {!loading &&
            !error &&
            courses.length >
              0 && (
              <div
                className="
                  grid
                  gap-5

                  md:grid-cols-2

                  lg:grid-cols-3
                  lg:gap-6
                "
              >
                {courses.map(
                  (
                    course
                  ) => {
                    const unavailable =
                      course.available ===
                      false;

                    const courseSlug =
                      course.slug?.trim() ||
                      makeCourseSlug(
                        course.title
                      ) ||
                      course._id;

                    return (
                      <article
                        key={
                          course._id
                        }
                        className="
                          flex
                          h-full
                          min-w-0
                          flex-col

                          rounded-[22px]

                          bg-white

                          p-4

                          shadow-[0_6px_20px_rgba(58,42,47,0.04)]
                        "
                      >
                        {/* IMAGE */}

                        {course.image && (
                          <div
                            className="
                              relative
                              mb-4
                            "
                          >
                            <img
                              src={
                                course.image
                              }
                              alt={
                                course.title
                              }
                              loading="lazy"
                              className="
                                h-[150px]
                                w-full

                                rounded-[16px]

                                object-cover

                                sm:h-[160px]

                                lg:h-[165px]
                              "
                            />

                            {unavailable && (
                              <span
                                className="
                                  absolute
                                  left-3
                                  top-3

                                  rounded-full

                                  bg-[#3A2A2F]/80

                                  px-3
                                  py-1

                                  text-[8px]
                                  font-semibold
                                  uppercase
                                  tracking-[1.5px]

                                  text-white
                                "
                              >
                                Not available
                              </span>
                            )}
                          </div>
                        )}

                        {/* TITLE */}

                        <h2
                          className="
                            font-serif

                            text-[22px]
                            leading-tight

                            text-[#E75480]
                          "
                        >
                          {
                            course.title
                          }
                        </h2>

                        {/* DESCRIPTION */}

                        <p
                          className="
                            mt-2

                            line-clamp-2

                            text-[12px]
                            leading-5

                            text-[#8A6F78]
                          "
                        >
                          {
                            course.description
                          }
                        </p>

                        {/* DETAILS */}

                        <div
                          className="
                            mt-3
                            space-y-1

                            text-[11px]
                            leading-5

                            text-[#8A6F78]
                          "
                        >
                          <p>
                            <strong
                              className="
                                font-semibold
                                text-[#795C66]
                              "
                            >
                              Duration:
                            </strong>{" "}
                            {
                              course.duration
                            }
                          </p>

                          <p>
                            <strong
                              className="
                                font-semibold
                                text-[#795C66]
                              "
                            >
                              Fee:
                            </strong>{" "}
                            {
                              course.fee
                            }
                          </p>

                          <p>
                            <strong
                              className="
                                font-semibold
                                text-[#795C66]
                              "
                            >
                              Certificate:
                            </strong>{" "}
                            {
                              course.certificate
                            }
                          </p>
                        </div>

                        {/* VIEW DETAILS */}

                        <Link
                          to={`/academy/${encodeURIComponent(
                            courseSlug
                          )}`}
                          className="
                            mt-3

                            inline-flex
                            w-fit
                            items-center
                            gap-1.5

                            text-[7px]
                            font-semibold
                            uppercase
                            tracking-[1.8px]

                            text-[#E75480]

                            transition-colors

                            hover:text-[#D94773]
                          "
                        >
                          View Details

                          <span
                            aria-hidden="true"
                            className="
                              text-[11px]
                              leading-none
                            "
                          >
                            ↗
                          </span>
                        </Link>

                        {/* ACTION */}

                        <div
                          className="
                            mt-auto
                            pt-4
                          "
                        >
                          {unavailable ? (
                            <button
                              type="button"
                              disabled
                              className="
                                w-full

                                cursor-not-allowed

                                rounded-full

                                bg-[#F4F1F2]

                                px-5
                                py-2.5

                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[1.5px]

                                text-[#A98D96]
                              "
                            >
                              Currently Not Available
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleEnroll(
                                  course
                                )
                              }
                              className="
                                w-full

                                rounded-full

                                bg-[#E75480]

                                px-5
                                py-2.5

                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[1.7px]

                                text-white

                                transition-colors
                                duration-300

                                hover:bg-[#D94773]
                              "
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}

          {/* ====================================================
              EMPTY
          ==================================================== */}

          {!loading &&
            !error &&
            courses.length ===
              0 && (
              <div
                className="
                  rounded-[22px]

                  bg-white

                  px-6
                  py-10

                  text-center

                  shadow-sm
                "
              >
                <p
                  className="
                    text-sm
                    text-[#8A6F78]
                  "
                >
                  No courses available yet.
                </p>
              </div>
            )}
        </section>
      </main>
    </>
  );
}