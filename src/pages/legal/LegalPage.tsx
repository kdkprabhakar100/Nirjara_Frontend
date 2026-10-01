import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type LegalPageData = {
  _id: string;
  title: string;
  slug: "privacy-policy" | "terms";
  content: string;
  createdAt: string;
  updatedAt: string;
};

type LegalPageProps = {
  slug?: "privacy-policy" | "terms";
};

export default function LegalPage({
  slug: propSlug,
}: LegalPageProps) {
  const params = useParams();

  const slug =
    propSlug ||
    (params.slug as
      | "privacy-policy"
      | "terms");

  const [page, setPage] =
    useState<LegalPageData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const API_URL =
    import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/legal-pages/${slug}`
        );

        if (!response.ok) {
          throw new Error(
            "Could not load this page."
          );
        }

        const data =
          await response.json();

        setPage(data);
      } catch (error) {
        console.error(error);

        setError(
          "We couldn't load this page right now."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [API_URL, slug]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          bg-[#FFF9FB]
          px-5
          pt-28
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-9
              w-9
              animate-spin
              rounded-full
              border-2
              border-[#F3CBD7]
              border-t-[#E75480]
            "
          />

          <p className="mt-4 text-sm text-[#8A6F78]">
            Loading...
          </p>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !page) {
    return (
      <section
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          bg-[#FFF9FB]
          px-5
          pt-28
        "
      >
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#3A2A2F]">
            Page unavailable
          </h1>

          <p className="mt-3 text-sm text-[#8A6F78]">
            {error}
          </p>

          <Link
            to="/"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#E75480]
              px-6
              py-3
              text-xs
              font-semibold
              uppercase
              tracking-[2px]
              text-white
            "
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </div>
      </section>
    );
  }

  const updatedDate =
    page.updatedAt
      ? new Date(
          page.updatedAt
        ).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : "";

  return (
    <main className="min-h-screen bg-[#FFF9FB]">

      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          border-b
          border-[#E75480]/10
          px-5
          pb-12
          pt-32
          text-center

          sm:px-6
          sm:pb-14
          sm:pt-36
        "
      >
        <div className="mx-auto max-w-3xl">

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[5px]
              text-[#E75480]
            "
          >
            Nirjara Beauty
          </p>

          <h1
            className="
              mt-4
              font-serif
              text-4xl
              text-[#3A2A2F]

              sm:text-5xl
              lg:text-6xl
            "
          >
            {page.title}
          </h1>

          {updatedDate && (
            <p
              className="
                mt-5
                text-xs
                text-[#9A7F88]
              "
            >
              Last updated{" "}
              {updatedDate}
            </p>
          )}

        </div>
      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section
        className="
          px-5
          py-12

          sm:px-6
          sm:py-14

          lg:py-16
        "
      >
        <div
          className="
            mx-auto
            max-w-4xl
            rounded-[26px]
            border
            border-[#E75480]/10
            bg-white
            p-6

            shadow-[0_10px_40px_rgba(72,42,53,0.04)]

            sm:p-9
            lg:p-12
          "
        >

          {/* BACK */}

          <Link
            to="/"
            className="
              mb-8
              inline-flex
              items-center
              gap-2

              text-[10px]
              font-semibold
              uppercase
              tracking-[2px]
              text-[#E75480]

              transition
              hover:gap-3
            "
          >
            <ArrowLeft size={14} />

            Back to Home
          </Link>

          {/* LEGAL CONTENT */}

          <div
            className="
              legal-content
              text-[15px]
              leading-8
              text-[#6F5961]
            "
            dangerouslySetInnerHTML={{
              __html: page.content,
            }}
          />

        </div>
      </section>
    </main>
  );
}