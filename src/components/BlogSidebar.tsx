import { Link } from "react-router-dom";
import RecentPosts from "./RecentPosts";

type RecentPost = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  image?: string;
  readTime: string;
  publishedAt?: string | null;
};

type BlogSidebarProps = {
  posts: RecentPost[];
  currentSlug?: string;
};

const categories = [
  "Skincare",
  "Hair Care",
  "Beauty Tips",
  "Makeup",
  "Wellness",
];

export default function BlogSidebar({
  posts,
  currentSlug,
}: BlogSidebarProps) {
  return (
    <aside
      className="
        min-w-0
        self-start

        lg:sticky
        lg:top-[90px]
        lg:h-fit
      "
    >
      <div className="space-y-4">
        {/* RECENT POSTS */}

        <RecentPosts
          posts={posts}
          currentSlug={currentSlug}
        />

        {/* BOOK A SERVICE */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[18px]
            border
            border-[#E75480]/10
            bg-[#FCE7EF]
            p-5
            shadow-[0_6px_20px_rgba(58,42,47,0.035)]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-12
              h-32
              w-32
              rounded-full
              bg-white/50
              blur-2xl
            "
          />

          <div className="relative">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#E75480]
              "
            >
              Nirjara Beauty
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-[22px]
                leading-[1.15]
                text-[#3A2A2F]
              "
            >
              Ready for a little self-care?
            </h2>

            <p
              className="
                mt-2
                text-[12px]
                leading-5
                text-[#806B73]
              "
            >
              Explore our beauty, hair,
              skincare and salon services.
            </p>

            <div
              className="
                mt-4
                flex
                gap-2
              "
            >
              <Link
                to="/services"
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E75480]
                  px-3
                  py-2.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  transition
                  hover:bg-[#D84570]
                "
              >
                Services →
              </Link>

              <Link
                to="/contact"
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E75480]/20
                  bg-white
                  px-3
                  py-2.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#E75480]
                  transition
                  hover:border-[#E75480]/40
                "
              >
                Book
              </Link>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}

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
          <h2
            className="
              font-serif
              text-[19px]
              text-[#3A2A2F]
            "
          >
            Popular Categories
          </h2>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            {categories.map((category) => (
              <Link
                key={category}
                to="/blog"
                className="
                  rounded-full
                  border
                  border-[#E75480]/10
                  bg-[#FFF8FA]
                  px-3
                  py-1.5
                  text-[8px]
                  text-[#806B73]
                  transition
                  hover:border-[#E75480]/30
                  hover:bg-[#FCE7EF]
                  hover:text-[#E75480]
                "
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}