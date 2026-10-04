import {
  useEffect,
  useState,
} from "react";

import SEO from "../../components/SEO";

/* =========================================================
   TYPES
========================================================= */

type Blog = {
  _id: string;

  title: string;

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

/* =========================================================
   PAGE SEO
========================================================= */

const BLOG_SEO = {
  title:
    "Beauty Tips & Insights | Nirjara Beauty Blog",

  description:
    "Explore beauty tips, hair care, skincare, makeup ideas, salon advice and professional insights from Nirjara Beauty.",

  keywords:
    "beauty blog Nepal, beauty tips Kathmandu, hair care tips, skincare tips, makeup tips Nepal, Nirjara Beauty blog",

  canonical:
    "/blog",

  image:
    "/images/nirjara-og.jpg",

  type:
    "website",
} as const;
/* =========================================================
   DATE FORMAT
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

export default function Blog() {
  const [
    blogs,
    setBlogs,
  ] =
    useState<Blog[]>(
      [],
    );

  const [
    selectedBlog,
    setSelectedBlog,
  ] =
    useState<Blog | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  /* =======================================================
     FETCH BLOGS
  ======================================================= */

  useEffect(() => {
    const fetchBlogs =
      async () => {
        try {
          setLoading(
            true,
          );

          const res =
            await fetch(
              `${
                import.meta.env
                  .VITE_API_URL
              }/api/blogs`,
            );

          if (!res.ok) {
            throw new Error(
              "Failed to fetch blogs",
            );
          }

          const data =
            await res.json();

          setBlogs(
            Array.isArray(
              data,
            )
              ? data
              : [],
          );
        } catch (error) {
          console.error(
            "BLOG FETCH ERROR:",
            error,
          );

          setBlogs([]);
        } finally {
          setLoading(
            false,
          );
        }
      };

    fetchBlogs();
  }, []);

  /* =======================================================
     OPEN BLOG
  ======================================================= */

  const openBlog = (
    blog: Blog,
  ) => {
    setSelectedBlog(
      blog,
    );

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  };

  /* =======================================================
     CLOSE BLOG
  ======================================================= */

  const closeBlog =
    () => {
      setSelectedBlog(
        null,
      );

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });
    };

  /* =======================================================
     SELECTED ARTICLE
  ======================================================= */

if (selectedBlog) {
  const articleTitle =
    selectedBlog.seoTitle ||
    `${selectedBlog.title} | Nirjara Beauty`;

  const articleDescription =
    selectedBlog.seoDescription ||
    selectedBlog.description;

  const keywords =
    selectedBlog.seoKeywords?.length
      ? selectedBlog.seoKeywords.join(", ")
      : BLOG_SEO.keywords;

  return (
    <>
      <SEO
        title={articleTitle}
        description={articleDescription}
        keywords={keywords}
        canonical={`/blog#${selectedBlog._id}`}
        image={
          selectedBlog.image ||
          BLOG_SEO.image
        }
        type="article"
      />

      <main
        className="
          min-h-screen
          bg-[#FFF8FA]
          px-4
          pb-20
          pt-28

          sm:px-6
          sm:pt-32

          lg:px-10
          lg:pt-36
        "
      >
        <article className="mx-auto max-w-5xl">
          {/* =============================================
              BACK BUTTON
          ============================================= */}

          <button
            type="button"
            onClick={closeBlog}
            className="
              mb-6
              inline-flex
              items-center
              gap-2

              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]

              text-[#A88993]

              transition
              hover:text-[#E75480]
            "
          >
            ← Back to all blogs
          </button>

          {/* =============================================
              ARTICLE CARD
          ============================================= */}

          <div
            className="
              overflow-hidden

              rounded-[24px]

              border
              border-[#E75480]/10

              bg-white

              shadow-[0_12px_35px_rgba(58,42,47,0.05)]

              sm:rounded-[28px]
            "
          >
            {/* ===========================================
                FEATURED IMAGE
            =========================================== */}

            {selectedBlog.image && (
              <div
                className="
                  aspect-[16/8]
                  overflow-hidden
                  bg-[#FCE7EF]

                  sm:aspect-[16/7]
                "
              >
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              </div>
            )}

            {/* ===========================================
                ARTICLE CONTENT WRAPPER
            =========================================== */}

            <div
              className="
                px-5
                py-8

                sm:px-8
                sm:py-10

                lg:px-14
                lg:py-12
              "
            >
              {/* CATEGORY */}

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]

                  text-[#E75480]
                "
              >
                {selectedBlog.category}
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
                  tracking-[-0.02em]

                  text-[#3A2A2F]

                  sm:text-[42px]

                  lg:text-[52px]
                "
              >
                {selectedBlog.title}
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
                {selectedBlog.author && (
                  <>
                    <span>
                      By {selectedBlog.author}
                    </span>

                    <span>•</span>
                  </>
                )}

                {selectedBlog.publishedAt && (
                  <>
                    <span>
                      {formatDate(
                        selectedBlog.publishedAt,
                      )}
                    </span>

                    <span>•</span>
                  </>
                )}

                <span>
                  {selectedBlog.readTime}
                </span>
              </div>

              {/* DESCRIPTION */}

              {selectedBlog.description && (
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
                  {selectedBlog.description}
                </p>
              )}

              {/* DIVIDER */}

              <div
                className="
                  my-8
                  h-px
                  bg-[#3A2A2F]/10
                "
              />

              {/* ===========================================
                  TIPTAP HTML
              =========================================== */}

              <div
                className="
                  blog-content

                  text-[15px]
                  leading-[1.75]
                  text-[#3A2A2F]

                  [&_p]:my-3
                  [&_p]:leading-7

                  [&_h2]:mt-8
                  [&_h2]:mb-3
                  [&_h2]:font-serif
                  [&_h2]:text-[26px]
                  [&_h2]:font-semibold
                  [&_h2]:leading-[1.3]
                  [&_h2]:text-[#3A2A2F]

                  [&_h3]:mt-6
                  [&_h3]:mb-2
                  [&_h3]:font-serif
                  [&_h3]:text-[21px]
                  [&_h3]:font-semibold
                  [&_h3]:leading-[1.35]
                  [&_h3]:text-[#3A2A2F]

                  [&_h4]:mt-5
                  [&_h4]:mb-2
                  [&_h4]:font-serif
                  [&_h4]:text-[18px]
                  [&_h4]:font-semibold
                  [&_h4]:text-[#3A2A2F]

                  [&_strong]:font-bold
                  [&_strong]:text-[#3A2A2F]

                  [&_em]:italic

                  [&_ul]:my-4
                  [&_ul]:list-disc
                  [&_ul]:pl-7

                  [&_ol]:my-4
                  [&_ol]:list-decimal
                  [&_ol]:pl-7

                  [&_li]:my-1

                  [&_a]:text-[#E75480]
                  [&_a]:underline
                  [&_a]:underline-offset-2

                  [&_blockquote]:my-5
                  [&_blockquote]:border-l-[3px]
                  [&_blockquote]:border-[#E75480]
                  [&_blockquote]:pl-4
                  [&_blockquote]:italic
                  [&_blockquote]:text-[#806B73]

                  [&_hr]:my-6
                  [&_hr]:border-0
                  [&_hr]:border-t
                  [&_hr]:border-[#E8D9DE]

                  [&_img]:my-5
                  [&_img]:h-auto
                  [&_img]:max-w-full
                  [&_img]:rounded-xl

                  [&_mark]:rounded
                  [&_mark]:px-1

                  sm:text-[16px]

                  sm:[&_h2]:text-[28px]
                  sm:[&_h3]:text-[22px]
                "
                dangerouslySetInnerHTML={{
                  __html:
                    selectedBlog.content ||
                    "",
                }}
              />
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

  /* =======================================================
     BLOG LIST
  ======================================================= */

  return (
    <>
      <SEO
        title={
          BLOG_SEO.title
        }
        description={
          BLOG_SEO.description
        }
        keywords={
          BLOG_SEO.keywords
        }
        canonical={
          BLOG_SEO.canonical
        }
        image={
          BLOG_SEO.image
        }
        type={
          BLOG_SEO.type
        }
      />

      <main
        className="
          min-h-screen

          bg-[#FFF8FA]

          px-4
          pb-24
          pt-28

          text-[#3A2A2F]

          sm:px-6
          sm:pt-32

          lg:px-10
          lg:pt-36
        "
      >
        <section
          className="
            mx-auto

            max-w-6xl
          "
        >
          {/* ===============================================
              HEADER
          =============================================== */}

          <div
            className="
              mb-10

              text-center

              sm:mb-14
            "
          >
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.28em]

                text-[#E75480]

                sm:text-[10px]
              "
            >
              Our Blog
            </p>

            <h1
              className="
                mt-3

                font-serif

                text-[38px]
                font-light
                leading-tight

                sm:text-[52px]

                lg:text-[58px]
              "
            >
              Beauty{" "}
              <span
                className="
                  italic
                  text-[#E75480]
                "
              >
                Insights
              </span>
            </h1>

            <p
              className="
                mx-auto
                mt-4

                max-w-xl

                text-[14px]
                leading-7

                text-[#8A6F78]

                sm:text-[15px]
              "
            >
              Explore beauty tips, trends and guides from Nirjara Beauty.
            </p>

            <div
              className="
                mx-auto
                mt-6

                h-px
                w-16

                bg-[#E75480]/40
              "
            />
          </div>

          {/* ===============================================
              LOADING
          =============================================== */}

          {loading && (
            <div
              className="
                grid
                gap-6

                sm:grid-cols-2

                lg:grid-cols-3
              "
            >
              {Array.from({
                length: 6,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      overflow-hidden

                      rounded-[20px]

                      border
                      border-[#E75480]/10

                      bg-white
                    "
                  >
                    <div
                      className="
                        h-48

                        animate-pulse

                        bg-[#F6E8ED]
                      "
                    />

                    <div
                      className="
                        p-5
                      "
                    >
                      <div
                        className="
                          h-2
                          w-20

                          animate-pulse

                          rounded-full

                          bg-[#F3DDE5]
                        "
                      />

                      <div
                        className="
                          mt-4
                          h-6
                          w-4/5

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
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {/* ===============================================
              GRID
          =============================================== */}

          {!loading && (
            <div
              className="
                grid
                gap-6

                sm:grid-cols-2

                lg:grid-cols-3
              "
            >
              {blogs.map(
                (
                  blog,
                ) => (
                  <article
                    key={
                      blog._id
                    }
                    className="
                      group

                      flex
                      h-full
                      flex-col

                      overflow-hidden

                      rounded-[20px]

                      border
                      border-[#E75480]/10

                      bg-white

                      shadow-[0_6px_18px_rgba(58,42,47,0.035)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-[#E75480]/25
                      hover:shadow-[0_15px_35px_rgba(58,42,47,0.08)]
                    "
                  >
                    {/* IMAGE */}

                    {blog.image ? (
                      <div
                        className="
                          aspect-[16/10]

                          overflow-hidden

                          bg-[#FCE7EF]
                        "
                      >
                        <img
                          src={
                            blog.image
                          }
                          alt={
                            blog.title
                          }
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-cover

                            transition-transform
                            duration-500

                            group-hover:scale-[1.03]
                          "
                        />
                      </div>
                    ) : (
                      <div
                        className="
                          flex
                          aspect-[16/10]
                          items-center
                          justify-center

                          bg-[#FCE7EF]

                          font-serif

                          text-5xl

                          text-[#E75480]/30
                        "
                      >
                        N
                      </div>
                    )}

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
                      {/* CATEGORY */}

                      <p
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.2em]

                          text-[#E75480]
                        "
                      >
                        {
                          blog.category
                        }
                      </p>

                      {/* TITLE */}

                      <h2
                        className="
                          mt-2

                          line-clamp-2

                          font-serif

                          text-[22px]
                          leading-[1.2]

                          text-[#3A2A2F]

                          transition-colors

                          group-hover:text-[#E75480]
                        "
                      >
                        {
                          blog.title
                        }
                      </h2>

                      {/* DESCRIPTION */}

                      <p
                        className="
                          mt-3

                          line-clamp-3

                          text-[13px]
                          leading-6

                          text-[#806B73]
                        "
                      >
                        {
                          blog.description
                        }
                      </p>

                      {/* META */}

                      <div
                        className="
                          mt-auto
                          pt-5

                          flex
                          flex-wrap
                          items-center
                          gap-2

                          text-[10px]

                          text-[#A58C95]
                        "
                      >
                        {blog.publishedAt && (
                          <>
                            <span>
                              {formatDate(
                                blog.publishedAt,
                              )}
                            </span>

                            <span>
                              •
                            </span>
                          </>
                        )}

                        <span>
                          {
                            blog.readTime
                          }
                        </span>
                      </div>

                      {/* READ MORE */}

                      <button
                        type="button"
                        onClick={() =>
                          openBlog(
                            blog,
                          )
                        }
                        className="
                          mt-5

                          inline-flex
                          w-fit
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
                        Read Article

                        <span>
                          →
                        </span>
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}

          {/* ===============================================
              EMPTY
          =============================================== */}

          {!loading &&
            blogs.length ===
              0 && (
              <div
                className="
                  rounded-[24px]

                  border
                  border-[#E75480]/10

                  bg-white

                  px-6
                  py-16

                  text-center
                "
              >
                <p
                  className="
                    font-serif

                    text-2xl

                    text-[#3A2A2F]
                  "
                >
                  No blogs available yet.
                </p>

                <p
                  className="
                    mt-2

                    text-sm

                    text-[#8A6F78]
                  "
                >
                  New beauty insights will appear here soon.
                </p>
              </div>
            )}
        </section>
      </main>
    </>
  );
}