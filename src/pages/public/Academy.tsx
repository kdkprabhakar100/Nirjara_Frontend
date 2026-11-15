
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SEO from "../../components/SEO";

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

  canonical: "/academy",

  image: "/images/nirjara-og.jpg",

  type: "website",
};

/* ============================================================
   TYPES
============================================================ */

export type Course = {
  _id: string;

  title: string;

  // Human-readable identifier from the backend.
  // Example: professional-nail-training
  slug?: string;

  description: string;

  duration: string;

  fee: string;

  certificate: string;

  image?: string;

  // False when disabled in the admin panel.
  // Course remains visible but enrollment is disabled.
  available?: boolean;
};

export type AcademyInitialData = {
  courses: Course[];
};

type AcademyProps = {
  initialData?: AcademyInitialData;
};

/* ============================================================
   API DATA NORMALIZATION
============================================================ */

function extractCourses(data: unknown): Course[] {
  if (Array.isArray(data)) {
    return data as Course[];
  }

  if (data && typeof data === "object") {
    const response = data as {
      courses?: unknown;
      data?: unknown;
    };

    if (Array.isArray(response.courses)) {
      return response.courses as Course[];
    }

    if (Array.isArray(response.data)) {
      return response.data as Course[];
    }
  }

  return [];
}

/* ============================================================
   ACADEMY COMPONENT
============================================================ */

export default function Academy({
  initialData,
}: AcademyProps) {
  const navigate = useNavigate();

  /* ==========================================================
     SSR INITIAL STATE

     When the server provides courses, they are rendered
     immediately in the HTML.

     When initialData is missing, the browser fetches
     courses through the backend API.
  ========================================================== */

  const [courses, setCourses] = useState<Course[]>(
    () => initialData?.courses ?? []
  );

  const [loading, setLoading] = useState(
    () => initialData === undefined
  );

  const [error, setError] = useState("");

  /* ==========================================================
     FETCH COURSES

     Avoid duplicate API requests when SSR data exists.
  ========================================================== */

  useEffect(() => {
    if (initialData !== undefined) {
      return;
    }

    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl =
          import.meta.env.VITE_API_URL || "";

        const response = await fetch(
          `${apiUrl}/api/courses`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load academy courses."
          );
        }

        const data: unknown =
          await response.json();

        if (controller.signal.aborted) {
          return;
        }

        setCourses(extractCourses(data));
      } catch (err) {
        if (controller.signal.aborted) {
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
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchCourses();

    return () => {
      controller.abort();
    };
  }, [initialData]);

  /* ==========================================================
     COURSE SLUG / ID HANDOFF

     Preferred:
       /booking?course=professional-nail-training

     Fallback for existing courses:
       /booking?course=6acf277f73fd9991902d82f6

     Booking.tsx resolves the slug or ID and submits
     the database ID to the backend.
  ========================================================== */

  const handleEnroll = (course: Course) => {
    if (course.available === false) {
      return;
    }

    const identifier =
      course.slug?.trim() || course._id;

    navigate(
      `/booking?course=${encodeURIComponent(identifier)}`
    );
  };

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <>
      <SEO
        title={ACADEMY_SEO.title}
        description={ACADEMY_SEO.description}
        keywords={ACADEMY_SEO.keywords}
        canonical={ACADEMY_SEO.canonical}
        image={ACADEMY_SEO.image}
        type="website"
      />

      <div
        className="
          min-h-screen
          bg-[#FFF5F8]
          px-6
          pb-24
          pt-36
          text-[#3A2A2F]
          md:px-12
        "
      >
        <section className="mx-auto max-w-6xl">
          {/* ====================================================
              PAGE HEADING
          ==================================================== */}

          <div className="mb-12 text-center">
            <p
              className="
                text-xs
                uppercase
                tracking-[4px]
                text-[#E75480]
              "
            >
              Our Academy
            </p>

            <h1
              className="
                mt-4
                font-serif
                text-5xl
                font-light
                sm:text-6xl
              "
            >
              Beauty{" "}
              <span className="italic text-[#E75480]">
                Courses
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl
                leading-8
                text-[#8A6F78]
              "
            >
              Learn from industry experts and build your
              career in beauty with professional
              certification.
            </p>

            <div
              className="
                mx-auto
                mt-8
                h-[1px]
                w-20
                bg-[#E75480]/50
              "
            />
          </div>

          {/* ====================================================
              LOADING SKELETON

              This appears only when fetching courses
              through client-side navigation.
          ==================================================== */}

          {loading && (
            <div
              className="grid gap-8 md:grid-cols-3"
              role="status"
              aria-label="Loading academy courses"
            >
              {Array.from({ length: 3 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="
                      overflow-hidden
                      rounded-3xl
                      bg-white
                      p-6
                      shadow-sm
                    "
                  >
                    <div
                      className="
                        h-44
                        animate-pulse
                        rounded-2xl
                        bg-[#F6E8ED]
                      "
                    />

                    <div
                      className="
                        mt-5
                        h-7
                        w-3/4
                        animate-pulse
                        rounded
                        bg-[#F3DDE5]
                      "
                    />

                    <div
                      className="
                        mt-4
                        h-16
                        animate-pulse
                        rounded
                        bg-[#FAF1F4]
                      "
                    />

                    <div
                      className="
                        mt-5
                        h-12
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
              ERROR STATE
          ==================================================== */}

          {!loading && error && (
            <div
              className="
                rounded-3xl
                border
                border-[#E75480]/10
                bg-white
                px-6
                py-12
                text-center
              "
            >
              <p className="text-sm text-[#8A6F78]">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  mt-6
                  rounded-full
                  bg-[#E75480]
                  px-7
                  py-3
                  text-xs
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
            courses.length > 0 && (
              <div className="grid gap-8 md:grid-cols-3">
                {courses.map((course) => {
                  const unavailable =
                    course.available === false;

                  return (
                    <article
                      key={course._id}
                      className="
                        flex
                        h-full
                        flex-col
                        rounded-3xl
                        bg-white
                        p-6
                        shadow-sm
                      "
                    >
                      {/* COURSE IMAGE */}

                      {course.image && (
                        <div className="relative mb-5">
                          <img
                            src={course.image}
                            alt={course.title}
                            loading="lazy"
                            className="
                              h-44
                              w-full
                              rounded-2xl
                              object-cover
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
                                px-4
                                py-1.5
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[2px]
                                text-white
                              "
                            >
                              Not available
                            </span>
                          )}
                        </div>
                      )}

                      {/* COURSE TITLE */}

                      <h2
                        className="
                          font-serif
                          text-2xl
                          text-[#E75480]
                        "
                      >
                        {course.title}
                      </h2>

                      {/* COURSE DESCRIPTION */}

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-6
                          text-[#8A6F78]
                        "
                      >
                        {course.description}
                      </p>

                      {/* COURSE DETAILS */}

                      <div
                        className="
                          mt-4
                          space-y-1
                          text-sm
                          text-[#8A6F78]
                        "
                      >
                        <p>
                          <strong>Duration:</strong>{" "}
                          {course.duration}
                        </p>

                        <p>
                          <strong>Fee:</strong>{" "}
                          {course.fee}
                        </p>

                        <p>
                          <strong>Certificate:</strong>{" "}
                          {course.certificate}
                        </p>
                      </div>

                      {/* ENROLLMENT BUTTON */}

                      <div className="mt-auto pt-6">
                        {unavailable ? (
                          <button
                            type="button"
                            disabled
                            className="
                              w-full
                              cursor-not-allowed
                              rounded-full
                              bg-[#F4F1F2]
                              px-6
                              py-3
                              text-xs
                              uppercase
                              tracking-[2px]
                              text-[#A98D96]
                            "
                          >
                            Currently Not Available
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleEnroll(course)
                            }
                            className="
                              w-full
                              rounded-full
                              bg-[#E75480]
                              px-6
                              py-3
                              text-xs
                              uppercase
                              tracking-[2px]
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
                })}
              </div>
            )}

          {/* ====================================================
              EMPTY STATE
          ==================================================== */}

          {!loading &&
            !error &&
            courses.length === 0 && (
              <div
                className="
                  rounded-3xl
                  bg-white
                  px-6
                  py-12
                  text-center
                  shadow-sm
                "
              >
                <p className="text-sm text-[#8A6F78]">
                  No courses available yet.
                </p>
              </div>
            )}
        </section>
      </div>
    </>
  );
}
