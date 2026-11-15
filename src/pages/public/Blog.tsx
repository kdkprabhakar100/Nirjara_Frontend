import { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import BlogCard from "../../components/BlogCard";

export type Blog = {
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
};

export type BlogInitialData = {
  blogs: Blog[];
};

type BlogProps = {
  initialData?: BlogInitialData;
};

const BLOG_SEO = {
  title: "Beauty Tips & Insights | Nirjara Beauty Blog",
  description:
    "Explore beauty tips, hair care, skincare, makeup ideas, salon advice and professional insights from Nirjara Beauty.",
  keywords:
    "beauty blog Nepal, beauty tips Kathmandu, hair care tips, skincare tips, makeup tips Nepal, Nirjara Beauty blog",
  canonical: "/blog",
  image: "/images/nirjara-og.jpg",
  type: "website",
} as const;

function extractBlogs(response: unknown): Blog[] {
  if (Array.isArray(response)) return response as Blog[];
  if (!response || typeof response !== "object") return [];
  const data = response as { blogs?: unknown; data?: unknown };
  const list = data.blogs ?? data.data;
  return Array.isArray(list) ? (list as Blog[]) : [];
}

export default function Blog({ initialData }: BlogProps) {
  const [blogs, setBlogs] = useState<Blog[]>(
    () => initialData?.blogs ?? [],
  );
  const [loading, setLoading] = useState(
    () => initialData === undefined,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData !== undefined) {
      setBlogs(initialData.blogs);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/blogs`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data: unknown = await response.json();
        if (controller.signal.aborted) return;

        // Keep unpublished drafts out of the public listing.
        setBlogs(extractBlogs(data).filter(blog => blog.status !== "draft"));
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("BLOG FETCH ERROR:", err);
        setBlogs([]);
        setError("We couldn't load the blog articles right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchBlogs();
    return () => controller.abort();
  }, [initialData]);

  return (
    <>
      <SEO
        title={BLOG_SEO.title}
        description={BLOG_SEO.description}
        keywords={BLOG_SEO.keywords}
        canonical={BLOG_SEO.canonical}
        image={BLOG_SEO.image}
        type={BLOG_SEO.type}
      />

      {/* PublicLayout already provides the page's main landmark. */}
      <div className="min-h-screen bg-[#FFF8FA] px-4 pb-24 pt-24 text-[#3A2A2F] sm:px-6 sm:pt-24 lg:px-10 lg:pt-24">
        <section className="mx-auto max-w-6xl">
          <header className="mb-10 text-center sm:mb-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E75480] sm:text-[10px]">
              Our Blog
            </p>
            <h1 className="mt-3 font-serif text-[38px] font-light leading-tight sm:text-[52px] lg:text-[58px]">
              Beauty <span className="italic text-[#E75480]">Insights</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-7 text-[#8A6F78] sm:text-[15px]">
              Explore beauty tips, trends and guides from Nirjara Beauty.
            </p>
            <div className="mx-auto mt-6 h-px w-16 bg-[#E75480]/40" />
          </header>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[20px] border border-[#E75480]/10 bg-white"
                >
                  <div className="aspect-[16/10] animate-pulse bg-[#F6E8ED]" />
                  <div className="p-5">
                    <div className="h-2 w-20 animate-pulse rounded-full bg-[#F3DDE5]" />
                    <div className="mt-4 h-6 w-4/5 animate-pulse rounded bg-[#F3DDE5]" />
                    <div className="mt-4 h-16 animate-pulse rounded bg-[#FAF1F4]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[24px] border border-[#E75480]/10 bg-white px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-[#3A2A2F]">
                Unable to load articles
              </h2>
              <p className="mt-2 text-sm text-[#8A6F78]">{error}</p>
            </div>
          )}

          {!loading && !error && blogs.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  title={blog.title}
                  slug={blog.slug}
                  category={blog.category}
                  description={blog.description}
                  image={blog.image}
                  publishedAt={blog.publishedAt}
                  readTime={blog.readTime}
                />
              ))}
            </div>
          )}

          {!loading && !error && blogs.length === 0 && (
            <div className="rounded-[24px] border border-[#E75480]/10 bg-white px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-[#3A2A2F]">
                No blogs available yet.
              </h2>
              <p className="mt-2 text-sm text-[#8A6F78]">
                New beauty insights will appear here soon.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
