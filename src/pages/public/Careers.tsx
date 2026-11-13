
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import SEO from "../../components/SEO";

/* ============================================================
   SEO
============================================================ */

const CAREERS_SEO = {
  title: "Careers at Nirjara Beauty | Beauty Jobs Kathmandu",
  description:
    "Explore career opportunities at Nirjara Beauty and discover opportunities to work with our professional beauty salon and academy team in Kathmandu.",
  keywords:
    "Nirjara Beauty careers, beauty jobs Kathmandu, salon jobs Kathmandu, beautician jobs Nepal, beauty career Nepal",
  canonical: "/careers",
  image: "/images/nirjara-og.jpg",
  type: "website",
};

/* ============================================================
   TYPES
============================================================ */

export type Career = {
  _id: string;
  title: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements?: string;
};

export type CareersInitialData = {
  careers: Career[];
};

type CareersProps = {
  initialData?: CareersInitialData;
};

/* ============================================================
   API HELPERS
============================================================ */

function extractCareers(data: unknown): Career[] {
  if (Array.isArray(data)) {
    return data as Career[];
  }

  if (data && typeof data === "object") {
    const response = data as {
      careers?: unknown;
      data?: unknown;
    };

    if (Array.isArray(response.careers)) {
      return response.careers as Career[];
    }

    if (Array.isArray(response.data)) {
      return response.data as Career[];
    }
  }

  return [];
}

/* ============================================================
   COMPONENT
============================================================ */

export default function Careers({
  initialData,
}: CareersProps) {
  /* ==========================================================
     STATE
  ========================================================== */

  const [careers, setCareers] = useState<Career[]>(
    () => initialData?.careers ?? []
  );

  const [loading, setLoading] = useState(
    () => initialData === undefined
  );

  const [error, setError] = useState("");

  /* ==========================================================
     LOAD CAREERS

     SSR:
     Use careers supplied by the server.

     CLIENT-SIDE NAVIGATION:
     Fetch careers from the backend.
  ========================================================== */

  useEffect(() => {
    if (initialData !== undefined) {
      return;
    }

    const controller = new AbortController();

    const fetchCareers = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl =
          import.meta.env.VITE_API_URL || "";

        const response = await axios.get(
          `${apiUrl}/api/careers`,
          {
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) {
          return;
        }

        setCareers(extractCareers(response.data));
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("CAREERS FETCH ERROR:", err);

        setError(
          "We couldn't load career opportunities right now."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchCareers();

    return () => {
      controller.abort();
    };
  }, [initialData]);

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <>
      <SEO
        title={CAREERS_SEO.title}
        description={CAREERS_SEO.description}
        keywords={CAREERS_SEO.keywords}
        canonical={CAREERS_SEO.canonical}
        image={CAREERS_SEO.image}
        type="website"
      />

      <div className="min-h-screen bg-[#FFF5F8] text-[#3A2A2F]">
        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="bg-gradient-to-r from-pink-100 to-pink-200 px-6 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold text-[#E75480] md:text-6xl">
            Careers at Nirjara
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6B5B61] md:text-base">
            Join our beauty family and grow your career in a
            creative, professional, and elegant salon environment.
          </p>
        </section>

        {/* ====================================================
            CAREER OPENINGS
        ==================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-center font-serif text-3xl font-bold text-[#E75480] md:text-4xl">
            Current Openings
          </h2>

          {/* LOADING */}

          {loading ? (
            <div
              className="mt-12 flex min-h-[200px] flex-col items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#E75480]/20 border-t-[#E75480]" />

              <p className="mt-5 text-sm text-[#8A6F78]">
                Loading career opportunities...
              </p>
            </div>
          ) : error ? (
            /* ERROR */

            <div className="mt-12 text-center">
              <p className="text-[#8A6F78]">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#E75480] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d94372]"
              >
                Try Again
              </button>
            </div>
          ) : careers.length === 0 ? (
            /* EMPTY */

            <p className="mt-10 text-center text-[#8A6F78]">
              No job openings available right now.
            </p>
          ) : (
            /* CAREER GRID */

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {careers.map((career) => (
                <article
                  key={career._id}
                  className="rounded-[30px] bg-white p-8 shadow-lg"
                >
                  <h3 className="font-serif text-2xl font-bold text-[#E75480]">
                    {career.title}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#8A6F78]">
                    <span className="rounded-full bg-pink-50 px-4 py-2">
                      📍 {career.location}
                    </span>

                    <span className="rounded-full bg-pink-50 px-4 py-2">
                      🕒 {career.type}
                    </span>

                    {career.salary && (
                      <span className="rounded-full bg-pink-50 px-4 py-2">
                        💰 {career.salary}
                      </span>
                    )}
                  </div>

                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#6B5B61]">
                    {career.description}
                  </p>

                  {career.requirements && (
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B5B61]">
                      <strong>Requirements:</strong>{" "}
                      {career.requirements}
                    </p>
                  )}

                  <Link
                    to="/contact"
                    className="mt-8 inline-block rounded-full bg-[#E75480] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d94372]"
                  >
                    Apply Now
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
