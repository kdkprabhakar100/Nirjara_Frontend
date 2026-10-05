import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import SEO from "../../components/SEO";
import Breadcrumbs from "../../components/Breadcrumbs";
import BlogSidebar from "../../components/BlogSidebar";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  image?: string;
  readTime: string;
  author?: string;
  publishedAt?: string | null;
  status?: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

const formatDate = (
  value?: string | null,
) => {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
};

export default function BlogDetails() {
  const { slug } =
    useParams<{
      slug: string;
    }>();

  const [
    blog,
    setBlog,
  ] =
    useState<Blog | null>(
      null,
    );

  const [
    recentPosts,
    setRecentPosts,
  ] =
    useState<Blog[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    notFound,
    setNotFound,
  ] =
    useState(false);

  /* =======================================================
     FETCH CURRENT BLOG
  ======================================================= */

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);

      return;
    }

    const fetchBlog =
      async () => {
        try {
          setLoading(true);
          setNotFound(false);

          const res =
            await fetch(
              `${
                import.meta.env
                  .VITE_API_URL
              }/api/blogs/slug/${encodeURIComponent(
                slug,
              )}`,
            );

          if (
            res.status ===
            404
          ) {
            setBlog(null);
            setNotFound(true);

            return;
          }

          if (!res.ok) {
            throw new Error(
              "Failed to fetch blog",
            );
          }

          const data =
            await res.json();

          setBlog(data);
        } catch (error) {
          console.error(
            "BLOG DETAILS ERROR:",
            error,
          );

          setBlog(null);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      };

    fetchBlog();
  }, [slug]);

  /* =======================================================
     FETCH RECENT POSTS
  ======================================================= */

  useEffect(() => {
    const fetchRecentPosts =
      async () => {
        try {
          const res =
            await fetch(
              `${
                import.meta.env
                  .VITE_API_URL
              }/api/blogs`,
            );

          if (!res.ok) {
            throw new Error(
              "Failed to fetch recent blogs",
            );
          }

          const data =
            await res.json();

          setRecentPosts(
            Array.isArray(data)
              ? data
              : [],
          );
        } catch (error) {
          console.error(
            "RECENT BLOG ERROR:",
            error,
          );

          setRecentPosts([]);
        }
      };

    fetchRecentPosts();
  }, []);

  /* =======================================================
     SCROLL TO TOP ON ARTICLE CHANGE
  ======================================================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [slug]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FFF8FA]

          px-4
          pb-20
          pt-24

          sm:px-6
          sm:pt-24

          lg:px-10
          lg:pt-24
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          <div
            className="
              h-3
              w-56

              animate-pulse

              rounded-full

              bg-[#F1DDE4]
            "
          />

          <div
            className="
              mt-4

              grid
              items-start
              gap-8

              lg:grid-cols-[minmax(0,1fr)_330px]

              xl:grid-cols-[minmax(0,1fr)_350px]
              xl:gap-10
            "
          >
            <div
              className="
                h-[700px]

                animate-pulse

                rounded-[24px]

                bg-white
              "
            />

            <div
              className="
                hidden
                h-[520px]

                animate-pulse

                rounded-[22px]

                bg-white

                lg:block
              "
            />
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (
    notFound ||
    !blog
  ) {
    return (
      <>
        <SEO
          title="Article Not Found | Nirjara Beauty"
          description="The requested Nirjara Beauty article could not be found."
          keywords="Nirjara Beauty blog"
          canonical="/blog"
          image="/images/nirjara-og.jpg"
          type="website"
        />

        <main
          className="
            flex
            min-h-screen
            items-center
            justify-center

            bg-[#FFF8FA]

            px-6
            pt-24
          "
        >
          <div
            className="
              max-w-lg
              text-center
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]

                text-[#E75480]
              "
            >
              Nirjara Blog
            </p>

            <h1
              className="
                mt-3

                font-serif
                text-4xl

                text-[#3A2A2F]
              "
            >
              Article not found
            </h1>

            <p
              className="
                mt-4
                leading-7

                text-[#806B73]
              "
            >
              This article may have
              been removed, renamed
              or is not currently
              published.
            </p>

            <Link
              to="/blog"
              className="
                mt-7
                inline-flex

                rounded-full

                bg-[#E75480]

                px-6
                py-3

                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]

                text-white

                transition

                hover:bg-[#D84570]
              "
            >
              View All Blogs
            </Link>
          </div>
        </main>
      </>
    );
  }

  /* =======================================================
     SEO
  ======================================================= */

  const seoTitle =
    blog.seoTitle ||
    `${blog.title} | Nirjara Beauty`;

  const seoDescription =
    blog.seoDescription ||
    blog.description;

  const seoKeywords =
    blog.seoKeywords?.length
      ? blog.seoKeywords.join(
          ", ",
        )
      : `${blog.category}, beauty tips Nepal, Nirjara Beauty`;

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`/blog/${blog.slug}`}
        image={
          blog.image ||
          "/images/nirjara-og.jpg"
        }
        type="article"
      />

      <main
        className="
          min-h-screen

          bg-[#FFF8FA]

          px-4
          pb-24
          pt-24

          sm:px-6
          sm:pt-24

          lg:px-10
          lg:pt-24
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          {/* ===============================================
              BREADCRUMBS
          =============================================== */}

          <Breadcrumbs
            items={[
              {
                label: "Home",
                to: "/",
              },

              {
                label: "Blog",
                to: "/blog",
              },

              {
                label: blog.category,
                to: "/blog",
              },

              {
                label: blog.title,
              },
            ]}
          />

          {/* ===============================================
              ARTICLE + SIDEBAR
          =============================================== */}

          <div
            className="
              mt-4

              grid
              items-start
              gap-8

              lg:grid-cols-[minmax(0,1fr)_330px]

              xl:grid-cols-[minmax(0,1fr)_350px]
              xl:gap-10
            "
          >
            {/* =============================================
                ARTICLE
            ============================================= */}

            <article
              className="
                min-w-0

                overflow-hidden

                rounded-[24px]

                border
                border-[#E75480]/10

                bg-white

                shadow-[0_10px_30px_rgba(58,42,47,0.04)]
              "
            >
              {/* HEADER */}

              <header
                className="
                  px-5
                  pb-8
                  pt-8

                  sm:px-8
                  sm:pt-10

                  lg:px-12
                  lg:pt-12
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]

                    text-[#E75480]
                  "
                >
                  {blog.category}
                </p>

                {/* TITLE */}

                <h1
                  className="
                    mt-3

                    max-w-4xl

                    font-serif

                    text-[32px]
                    font-light
                    leading-[1.12]
                    tracking-[-0.025em]

                    text-[#3A2A2F]

                    sm:text-[32px]

                    lg:text-[38px]

                    xl:text-[42px]

                    2xl:text-[48px]
                  "
                >
                  {blog.title}
                </h1>

                {/* META */}

                <div
                  className="
                    mt-5

                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-2

                    text-[11px]

                    text-[#9A828B]
                  "
                >
                  <span>
                    By{" "}
                    {blog.author ||
                      "Nirjara Beauty"}
                  </span>

                  {blog.publishedAt && (
                    <>
                      <span
                        aria-hidden="true"
                        className="
                          text-[#D5C2C8]
                        "
                      >
                        •
                      </span>

                      <time
                        dateTime={
                          blog.publishedAt
                        }
                      >
                        {formatDate(
                          blog.publishedAt,
                        )}
                      </time>
                    </>
                  )}

                  <span
                    aria-hidden="true"
                    className="
                      text-[#D5C2C8]
                    "
                  >
                    •
                  </span>

                  <span>
                    {blog.readTime}
                  </span>
                </div>

                {/* DESCRIPTION */}

                {blog.description && (
                  <p
                    className="
                      mt-6

                      max-w-3xl

                      text-[16px]
                      leading-8

                      text-[#806B73]

                      sm:text-[17px]
                    "
                  >
                    {blog.description}
                  </p>
                )}
              </header>

              {/* ===========================================
                  FEATURED IMAGE
              =========================================== */}

              {blog.image && (
                <div
                  className="
                    mx-5

                    overflow-hidden

                    rounded-[18px]

                    bg-[#FCE7EF]

                    sm:mx-8

                    lg:mx-12
                  "
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="
                      aspect-[16/8]

                      h-auto
                      w-full

                      object-cover
                    "
                  />
                </div>
              )}

              {/* ===========================================
                  ARTICLE BODY
              =========================================== */}

              <div
                className="
                  px-5
                  pb-10
                  pt-8

                  sm:px-8

                  lg:px-12
                  lg:pb-14
                  lg:pt-10
                "
              >
                <div
                  className="
                    blog-content

                    text-[15px]
                    leading-[1.8]

                    text-[#3A2A2F]

                    [&_p]:my-4
                    [&_p]:leading-7

                    [&_h2]:mb-3
                    [&_h2]:mt-9
                    [&_h2]:font-serif
                    [&_h2]:text-[27px]
                    [&_h2]:font-semibold
                    [&_h2]:leading-[1.25]
                    [&_h2]:text-[#3A2A2F]

                    [&_h3]:mb-2
                    [&_h3]:mt-7
                    [&_h3]:font-serif
                    [&_h3]:text-[21px]
                    [&_h3]:font-semibold
                    [&_h3]:leading-[1.3]

                    [&_h4]:mb-2
                    [&_h4]:mt-6
                    [&_h4]:font-serif
                    [&_h4]:text-[18px]
                    [&_h4]:font-semibold

                    [&_strong]:font-bold
                    [&_strong]:text-[#3A2A2F]

                    [&_em]:italic

                    [&_ul]:my-4
                    [&_ul]:list-disc
                    [&_ul]:pl-7

                    [&_ol]:my-4
                    [&_ol]:list-decimal
                    [&_ol]:pl-7

                    [&_li]:my-1.5

                    [&_a]:text-[#E75480]
                    [&_a]:underline
                    [&_a]:underline-offset-2

                    [&_blockquote]:my-6
                    [&_blockquote]:border-l-[3px]
                    [&_blockquote]:border-[#E75480]
                    [&_blockquote]:pl-5
                    [&_blockquote]:italic
                    [&_blockquote]:text-[#806B73]

                    [&_hr]:my-8
                    [&_hr]:border-0
                    [&_hr]:border-t
                    [&_hr]:border-[#E8D9DE]

                    [&_img]:my-7
                    [&_img]:h-auto
                    [&_img]:max-w-full
                    [&_img]:rounded-xl

                    [&_mark]:rounded
                    [&_mark]:px-1

                    sm:text-[16px]

                    sm:[&_h2]:text-[29px]

                    sm:[&_h3]:text-[22px]
                  "
                  dangerouslySetInnerHTML={{
                    __html:
                      blog.content ||
                      "",
                  }}
                />

                {/* =========================================
                    ARTICLE FOOTER
                ========================================= */}

                <div
                  className="
                    mt-12

                    border-t
                    border-[#3A2A2F]/10

                    pt-7
                  "
                >
                  <Link
                    to="/blog"
                    className="
                      inline-flex
                      items-center
                      gap-2

                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]

                      text-[#E75480]

                      transition-all

                      hover:gap-3
                    "
                  >
                    ← Back to all blogs
                  </Link>
                </div>
              </div>
            </article>

            {/* =============================================
                SIDEBAR
            ============================================= */}

            <BlogSidebar
              posts={recentPosts}
              currentSlug={blog.slug}
            />
          </div>
        </div>
      </main>
    </>
  );
}