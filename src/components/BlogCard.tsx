import { Link } from "react-router-dom";

type BlogCardProps = {
  title: string;
  slug: string;
  category: string;
  description: string;
  image?: string;
  publishedAt?: string | null;
  readTime: string;
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
      month: "short",
      day: "numeric",
    },
  );
};

export default function BlogCard({
  title,
  slug,
  category,
  description,
  image,
  publishedAt,
  readTime,
}: BlogCardProps) {
  return (
    <article
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
      <Link
        to={`/blog/${slug}`}
        aria-label={`Read ${title}`}
        className="block overflow-hidden"
      >
        {image ? (
          <div
            className="
              aspect-[16/10]
              overflow-hidden
              bg-[#FCE7EF]
            "
          >
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="
                h-full
                w-full
                object-cover

                transition-transform
                duration-500

                group-hover:scale-[1.035]
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
      </Link>

      <div
        className="
          flex
          flex-1
          flex-col

          p-5

          sm:p-6
        "
      >
        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.2em]

            text-[#E75480]
          "
        >
          {category}
        </p>

        <Link
          to={`/blog/${slug}`}
        >
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
            {title}
          </h2>
        </Link>

        <p
          className="
            mt-3
            line-clamp-3

            text-[13px]
            leading-6

            text-[#806B73]
          "
        >
          {description}
        </p>

        <div
          className="
            mt-auto
            flex
            flex-wrap
            items-center
            gap-2

            pt-5

            text-[10px]

            text-[#A58C95]
          "
        >
          {publishedAt && (
            <>
              <span>
                {formatDate(
                  publishedAt,
                )}
              </span>

              <span>•</span>
            </>
          )}

          <span>
            {readTime}
          </span>
        </div>

        <Link
          to={`/blog/${slug}`}
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
        </Link>
      </div>
    </article>
  );
}