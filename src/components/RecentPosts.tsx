import { Link } from "react-router-dom";

type RecentPost = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  image?: string;
  readTime: string;
  publishedAt?: string | null;
};

type RecentPostsProps = {
  posts: RecentPost[];
  currentSlug?: string;
};

const formatDate = (
  value?: string | null,
) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
};

export default function RecentPosts({
  posts,
  currentSlug,
}: RecentPostsProps) {
  const filteredPosts = posts
    .filter(
      (post) =>
        post.slug !== currentSlug,
    )
    .slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section
      className="
        rounded-[18px]
        border
        border-[#E75480]/10
        bg-white
        p-4
        shadow-[0_6px_20px_rgba(58,42,47,0.035)]
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <h2
          className="
            font-serif
            text-[20px]
            leading-tight
            text-[#3A2A2F]
          "
        >
          Recent Posts
        </h2>

        <Link
          to="/blog"
          className="
            shrink-0
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[#E75480]
            transition
            hover:opacity-70
          "
        >
          View All →
        </Link>
      </div>

      {/* POSTS */}

      <div
        className="
          mt-3
          divide-y
          divide-[#3A2A2F]/10
        "
      >
        {filteredPosts.map(
          (post) => (
            <article
              key={post._id}
              className="
                flex
                gap-3
                py-3
                first:pt-0
                last:pb-0
              "
            >
              {/* IMAGE */}

              <Link
                to={`/blog/${post.slug}`}
                className="
                  h-[66px]
                  w-[78px]
                  shrink-0
                  overflow-hidden
                  rounded-[10px]
                  bg-[#FCE7EF]
                "
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-300
                      hover:scale-105
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      font-serif
                      text-xl
                      text-[#E75480]/30
                    "
                  >
                    N
                  </div>
                )}
              </Link>

              {/* CONTENT */}

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[#E75480]
                  "
                >
                  {post.category}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                >
                  <h3
                    className="
                      mt-1
                      line-clamp-2
                      font-serif
                      text-[14px]
                      leading-[1.25]
                      text-[#3A2A2F]
                      transition
                      hover:text-[#E75480]
                    "
                  >
                    {post.title}
                  </h3>
                </Link>

                <div
                  className="
                    mt-1.5
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                    text-[8px]
                    text-[#A58C95]
                  "
                >
                  {post.publishedAt && (
                    <>
                      <span>
                        {formatDate(
                          post.publishedAt,
                        )}
                      </span>

                      <span>•</span>
                    </>
                  )}

                  <span>
                    {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}